import { createContext, useContext, useReducer, useEffect } from 'react';
import { SAMPLE_MATERIALS, SAMPLE_SUPPLIERS, SAMPLE_EXPENSES } from '../data/categories';

const InventoryContext = createContext();

const STORAGE_KEY = 'plumber-inventory';

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Migrate old data that doesn't have suppliers/expenses/orders
      return {
        materials: parsed.materials || [],
        suppliers: parsed.suppliers || SAMPLE_SUPPLIERS,
        orders: parsed.orders || [],
        expenses: parsed.expenses || SAMPLE_EXPENSES,
        nextId: parsed.nextId || 11,
        nextOrderId: parsed.nextOrderId || 1,
        nextExpenseId: parsed.nextExpenseId || 4,
        nextSupplierId: parsed.nextSupplierId || 4,
      };
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

const initialState = loadFromStorage() || {
  materials: SAMPLE_MATERIALS,
  suppliers: SAMPLE_SUPPLIERS,
  orders: [],
  expenses: SAMPLE_EXPENSES,
  nextId: 11,
  nextOrderId: 1,
  nextExpenseId: 4,
  nextSupplierId: 4,
};

function inventoryReducer(state, action) {
  switch (action.type) {
    // === Materials ===
    case 'ADD_MATERIAL': {
      const newMaterial = {
        ...action.payload,
        id: String(state.nextId),
      };
      return {
        ...state,
        materials: [...state.materials, newMaterial],
        nextId: state.nextId + 1,
      };
    }
    case 'UPDATE_MATERIAL': {
      return {
        ...state,
        materials: state.materials.map((m) =>
          m.id === action.payload.id ? { ...m, ...action.payload } : m
        ),
      };
    }
    case 'DELETE_MATERIAL': {
      return {
        ...state,
        materials: state.materials.filter((m) => m.id !== action.payload),
      };
    }
    case 'ADJUST_QUANTITY': {
      return {
        ...state,
        materials: state.materials.map((m) =>
          m.id === action.payload.id
            ? { ...m, quantity: Math.max(0, m.quantity + action.payload.delta) }
            : m
        ),
      };
    }

    // === Suppliers ===
    case 'ADD_SUPPLIER': {
      const newSupplier = {
        ...action.payload,
        id: String(state.nextSupplierId),
      };
      return {
        ...state,
        suppliers: [...state.suppliers, newSupplier],
        nextSupplierId: state.nextSupplierId + 1,
      };
    }
    case 'UPDATE_SUPPLIER': {
      return {
        ...state,
        suppliers: state.suppliers.map((s) =>
          s.id === action.payload.id ? { ...s, ...action.payload } : s
        ),
      };
    }
    case 'DELETE_SUPPLIER': {
      return {
        ...state,
        suppliers: state.suppliers.filter((s) => s.id !== action.payload),
        materials: state.materials.map((m) =>
          m.supplierId === action.payload ? { ...m, supplierId: '' } : m
        ),
      };
    }

    // === Orders ===
    case 'CREATE_ORDER': {
      const newOrder = {
        ...action.payload,
        id: String(state.nextOrderId),
        date: new Date().toISOString().slice(0, 10),
        status: 'pending',
      };
      return {
        ...state,
        orders: [newOrder, ...state.orders],
        nextOrderId: state.nextOrderId + 1,
      };
    }
    case 'UPDATE_ORDER_STATUS': {
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.payload.id
            ? { ...o, status: action.payload.status }
            : o
        ),
      };
    }
    case 'MARK_ORDER_RECEIVED': {
      const order = state.orders.find((o) => o.id === action.payload);
      if (!order) return state;
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.payload ? { ...o, status: 'received' } : o
        ),
        materials: state.materials.map((m) => {
          const item = order.items.find((i) => i.materialId === m.id);
          if (item) {
            return { ...m, quantity: m.quantity + item.quantity };
          }
          return m;
        }),
      };
    }
    case 'DELETE_ORDER': {
      return {
        ...state,
        orders: state.orders.filter((o) => o.id !== action.payload),
      };
    }

    // === Expenses ===
    case 'ADD_EXPENSE': {
      const newExpense = {
        ...action.payload,
        id: String(state.nextExpenseId),
      };
      return {
        ...state,
        expenses: [newExpense, ...state.expenses],
        nextExpenseId: state.nextExpenseId + 1,
      };
    }
    case 'UPDATE_EXPENSE': {
      return {
        ...state,
        expenses: state.expenses.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      };
    }
    case 'DELETE_EXPENSE': {
      return {
        ...state,
        expenses: state.expenses.filter((e) => e.id !== action.payload),
      };
    }

    // === Import ===
    case 'IMPORT_DATA': {
      return {
        materials: action.payload.materials || [],
        suppliers: action.payload.suppliers || [],
        orders: action.payload.orders || [],
        expenses: action.payload.expenses || [],
        nextId: Math.max(...(action.payload.materials || []).map((m) => Number(m.id) || 0), 0) + 1,
        nextSupplierId: Math.max(...(action.payload.suppliers || []).map((s) => Number(s.id) || 0), 0) + 1,
        nextOrderId: Math.max(...(action.payload.orders || []).map((o) => Number(o.id) || 0), 0) + 1,
        nextExpenseId: Math.max(...(action.payload.expenses || []).map((e) => Number(e.id) || 0), 0) + 1,
      };
    }
    default:
      return state;
  }
}

export function InventoryProvider({ children }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialState);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  return (
    <InventoryContext.Provider value={{ state, dispatch }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
}
