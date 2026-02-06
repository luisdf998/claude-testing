import { useState } from 'react';
import { Plus, Edit2, Trash2, Phone, Mail, StickyNote, X } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

const emptyForm = { name: '', phone: '', email: '', notes: '' };

export default function SupplierList() {
  const { state, dispatch } = useInventory();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  function openNew() {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(supplier) {
    setForm(supplier);
    setEditing(supplier.id);
    setShowForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editing) {
      dispatch({ type: 'UPDATE_SUPPLIER', payload: { ...form, id: editing } });
    } else {
      dispatch({ type: 'ADD_SUPPLIER', payload: form });
    }
    setShowForm(false);
    setEditing(null);
  }

  function handleDelete(id) {
    if (deleteConfirm === id) {
      dispatch({ type: 'DELETE_SUPPLIER', payload: id });
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const materialsPerSupplier = (supplierId) =>
    state.materials.filter((m) => m.supplierId === supplierId).length;

  return (
    <div className="supplier-section">
      <div className="section-header">
        <h2>Proveedores</h2>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Añadir
        </button>
      </div>

      {state.suppliers.length === 0 ? (
        <div className="empty-state">
          <p>No hay proveedores registrados.</p>
        </div>
      ) : (
        <div className="supplier-list">
          {state.suppliers.map((s) => (
            <div key={s.id} className="supplier-card">
              <div className="supplier-card-header">
                <h3>{s.name}</h3>
                <div className="material-actions">
                  <button className="btn-icon" onClick={() => openEdit(s)} title="Editar">
                    <Edit2 size={16} />
                  </button>
                  <button
                    className={`btn-icon ${deleteConfirm === s.id ? 'btn-danger' : ''}`}
                    onClick={() => handleDelete(s.id)}
                    title={deleteConfirm === s.id ? 'Confirmar' : 'Eliminar'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="supplier-details">
                {s.phone && (
                  <a href={`tel:${s.phone}`} className="detail-item">
                    <Phone size={13} /> {s.phone}
                  </a>
                )}
                {s.email && (
                  <a href={`mailto:${s.email}`} className="detail-item">
                    <Mail size={13} /> {s.email}
                  </a>
                )}
                {s.notes && (
                  <span className="detail-item">
                    <StickyNote size={13} /> {s.notes}
                  </span>
                )}
              </div>
              <span className="supplier-material-count">
                {materialsPerSupplier(s.id)} material{materialsPerSupplier(s.id) !== 1 ? 'es' : ''} asignado{materialsPerSupplier(s.id) !== 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
              <button className="btn-icon" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="s-name">Nombre *</label>
                <input id="s-name" name="name" value={form.name} onChange={handleChange} required placeholder="Ej: SumiAgua S.L." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="s-phone">Teléfono</label>
                  <input id="s-phone" name="phone" value={form.phone} onChange={handleChange} placeholder="912 345 678" />
                </div>
                <div className="form-group">
                  <label htmlFor="s-email">Email</label>
                  <input id="s-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="pedidos@proveedor.es" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="s-notes">Notas</label>
                <textarea id="s-notes" name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Condiciones, plazos de entrega..." />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Guardar' : 'Añadir'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
