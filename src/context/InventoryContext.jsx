import { createContext, useContext, useReducer, useEffect } from 'react';
import { SAMPLE_MATERIALS } from '../data/categories';

const InventoryContext = createContext();

const STORAGE_KEY = 'plumber-inventory';

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
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
  nextId: 11,
};

function inventoryReducer(state, action) {
  switch (action.type) {
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
    case 'IMPORT_DATA': {
      return {
        ...action.payload,
        nextId: Math.max(
          ...action.payload.materials.map((m) => Number(m.id) || 0),
          0
        ) + 1,
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
