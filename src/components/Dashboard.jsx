import { Package, AlertTriangle, DollarSign, Layers } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useInventory } from '../context/InventoryContext';

const categoryMap = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export default function Dashboard() {
  const { state } = useInventory();
  const { materials } = state;

  const totalItems = materials.length;
  const totalUnits = materials.reduce((sum, m) => sum + m.quantity, 0);
  const totalValue = materials.reduce((sum, m) => sum + m.quantity * m.price, 0);
  const lowStock = materials.filter(
    (m) => m.quantity <= m.minStock && m.minStock > 0
  );

  const categoryCounts = materials.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
            <Package size={22} color="#3b82f6" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalItems}</span>
            <span className="stat-label">Materiales</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
            <Layers size={22} color="#10b981" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalUnits}</span>
            <span className="stat-label">Unidades totales</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <DollarSign size={22} color="#f59e0b" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalValue.toFixed(2)} €</span>
            <span className="stat-label">Valor inventario</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className={`stat-icon ${lowStock.length > 0 ? 'pulse' : ''}`}
            style={{ backgroundColor: lowStock.length > 0 ? '#fee2e2' : '#f3f4f6' }}
          >
            <AlertTriangle
              size={22}
              color={lowStock.length > 0 ? '#ef4444' : '#9ca3af'}
            />
          </div>
          <div className="stat-info">
            <span className="stat-value">{lowStock.length}</span>
            <span className="stat-label">Stock bajo</span>
          </div>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="low-stock-alert">
          <h3>
            <AlertTriangle size={16} /> Materiales con stock bajo
          </h3>
          <ul>
            {lowStock.map((m) => (
              <li key={m.id}>
                <strong>{m.name}</strong> — {m.quantity} {m.unit} (mínimo:{' '}
                {m.minStock})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="categories-summary">
        <h3>Por categoría</h3>
        <div className="category-bars">
          {CATEGORIES.filter((c) => categoryCounts[c.id]).map((cat) => (
            <div key={cat.id} className="category-bar-row">
              <span className="category-bar-label">{cat.name}</span>
              <div className="category-bar-track">
                <div
                  className="category-bar-fill"
                  style={{
                    width: `${(categoryCounts[cat.id] / totalItems) * 100}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
              <span className="category-bar-count">{categoryCounts[cat.id]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
