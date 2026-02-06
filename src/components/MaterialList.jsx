import { useState } from 'react';
import {
  Edit2,
  Trash2,
  Plus,
  Minus,
  AlertTriangle,
  MapPin,
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useInventory } from '../context/InventoryContext';

const categoryMap = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export default function MaterialList({ onEdit, searchQuery, categoryFilter }) {
  const { state, dispatch } = useInventory();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = state.materials.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.notes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !categoryFilter || m.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  function handleDelete(id) {
    if (deleteConfirm === id) {
      dispatch({ type: 'DELETE_MATERIAL', payload: id });
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  }

  function adjustQty(id, delta) {
    dispatch({ type: 'ADJUST_QUANTITY', payload: { id, delta } });
  }

  if (filtered.length === 0) {
    return (
      <div className="empty-state">
        <p>No se encontraron materiales.</p>
        {searchQuery && <p className="text-muted">Prueba con otro término de búsqueda.</p>}
      </div>
    );
  }

  return (
    <div className="material-list">
      <div className="list-header">
        <span className="list-count">{filtered.length} material{filtered.length !== 1 ? 'es' : ''}</span>
      </div>
      {filtered.map((m) => {
        const cat = categoryMap[m.category] || categoryMap['otros'];
        const isLowStock = m.quantity <= m.minStock && m.minStock > 0;

        return (
          <div key={m.id} className={`material-card ${isLowStock ? 'low-stock' : ''}`}>
            <div className="material-card-header">
              <div className="material-info">
                <span
                  className="category-badge"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.name}
                </span>
                <h3 className="material-name">{m.name}</h3>
              </div>
              <div className="material-actions">
                <button
                  className="btn-icon"
                  onClick={() => onEdit(m)}
                  aria-label="Editar"
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className={`btn-icon ${deleteConfirm === m.id ? 'btn-danger' : ''}`}
                  onClick={() => handleDelete(m.id)}
                  aria-label="Eliminar"
                  title={deleteConfirm === m.id ? 'Pulsa de nuevo para confirmar' : 'Eliminar'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="material-card-body">
              <div className="quantity-section">
                <button
                  className="btn-qty"
                  onClick={() => adjustQty(m.id, -1)}
                  disabled={m.quantity <= 0}
                  aria-label="Reducir cantidad"
                >
                  <Minus size={14} />
                </button>
                <span className="quantity-display">
                  <span className="quantity-number">{m.quantity}</span>
                  <span className="quantity-unit">{m.unit}</span>
                </span>
                <button
                  className="btn-qty"
                  onClick={() => adjustQty(m.id, 1)}
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="material-details">
                {m.location && (
                  <span className="detail-item">
                    <MapPin size={13} />
                    {m.location}
                  </span>
                )}
                {m.price > 0 && (
                  <span className="detail-item price">
                    {m.price.toFixed(2)} €
                  </span>
                )}
                {isLowStock && (
                  <span className="detail-item warning">
                    <AlertTriangle size={13} />
                    Stock bajo (mín: {m.minStock})
                  </span>
                )}
              </div>

              {m.notes && <p className="material-notes">{m.notes}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
