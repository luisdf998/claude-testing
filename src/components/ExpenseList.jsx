import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Calendar, Tag } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { EXPENSE_CATEGORIES } from '../data/categories';

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  description: '',
  amount: 0,
  category: 'Material',
  notes: '',
};

export default function ExpenseList() {
  const { state, dispatch } = useInventory();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [monthFilter, setMonthFilter] = useState('');

  function openNew() {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(expense) {
    setForm(expense);
    setEditing(expense.id);
    setShowForm(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.description.trim() || form.amount <= 0) return;
    if (editing) {
      dispatch({ type: 'UPDATE_EXPENSE', payload: { ...form, id: editing } });
    } else {
      dispatch({ type: 'ADD_EXPENSE', payload: form });
    }
    setShowForm(false);
    setEditing(null);
  }

  function handleDelete(id) {
    if (deleteConfirm === id) {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  }

  function handleChange(e) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  }

  const expenses = state.expenses || [];

  const filtered = monthFilter
    ? expenses.filter((e) => e.date?.startsWith(monthFilter))
    : expenses;

  const totalFiltered = filtered.reduce((sum, e) => sum + (e.amount || 0), 0);

  // Summary by category
  const byCategory = filtered.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + (e.amount || 0);
    return acc;
  }, {});

  // Available months for filter
  const months = [...new Set(expenses.map((e) => e.date?.slice(0, 7)).filter(Boolean))].sort().reverse();

  return (
    <div className="expense-section">
      <div className="section-header">
        <h2>Tickets de Gasto</h2>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Nuevo gasto
        </button>
      </div>

      {/* Filters and summary */}
      <div className="expense-summary-bar">
        <select
          className="category-select"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        >
          <option value="">Todos los meses</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {new Date(m + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </option>
          ))}
        </select>
        <div className="expense-total">
          Total: <strong>{totalFiltered.toFixed(2)} €</strong>
        </div>
      </div>

      {/* Category breakdown */}
      {Object.keys(byCategory).length > 0 && (
        <div className="expense-categories-summary">
          {Object.entries(byCategory)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amount]) => (
              <div key={cat} className="expense-cat-chip">
                <span>{cat}</span>
                <strong>{amount.toFixed(2)} €</strong>
              </div>
            ))}
        </div>
      )}

      {/* Expense list */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No hay gastos registrados.</p>
        </div>
      ) : (
        <div className="expense-list">
          {filtered.map((exp) => (
            <div key={exp.id} className="expense-card">
              <div className="expense-card-left">
                <span className="expense-date">
                  <Calendar size={13} />
                  {exp.date}
                </span>
                <span className="expense-cat-badge">
                  <Tag size={12} />
                  {exp.category}
                </span>
              </div>
              <div className="expense-card-center">
                <strong>{exp.description}</strong>
                {exp.notes && <span className="material-notes">{exp.notes}</span>}
              </div>
              <div className="expense-card-right">
                <span className="expense-amount">{exp.amount.toFixed(2)} €</span>
                <div className="material-actions">
                  <button className="btn-icon" onClick={() => openEdit(exp)} title="Editar">
                    <Edit2 size={15} />
                  </button>
                  <button
                    className={`btn-icon ${deleteConfirm === exp.id ? 'btn-danger' : ''}`}
                    onClick={() => handleDelete(exp.id)}
                    title={deleteConfirm === exp.id ? 'Confirmar' : 'Eliminar'}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar Gasto' : 'Nuevo Gasto'}</h2>
              <button className="btn-icon" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="e-date">Fecha</label>
                  <input id="e-date" name="date" type="date" value={form.date} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="e-amount">Importe (€) *</label>
                  <input id="e-amount" name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="e-description">Descripción *</label>
                <input id="e-description" name="description" value={form.description} onChange={handleChange} required placeholder="Ej: Compra tubería obra C/ Mayor" />
              </div>
              <div className="form-group">
                <label htmlFor="e-category">Categoría</label>
                <select id="e-category" name="category" value={form.category} onChange={handleChange}>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="e-notes">Notas</label>
                <textarea id="e-notes" name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Nº factura, proveedor..." />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Guardar' : 'Añadir gasto'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
