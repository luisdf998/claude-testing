import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES, UNITS } from '../data/categories';
import { useInventory } from '../context/InventoryContext';

const emptyForm = {
  name: '',
  category: 'tuberias',
  quantity: 0,
  unit: 'unidades',
  minStock: 0,
  location: '',
  price: 0,
  notes: '',
  supplierId: '',
};

export default function MaterialForm({ material, onClose }) {
  const { state, dispatch } = useInventory();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (material) {
      setForm(material);
    }
  }, [material]);

  function handleChange(e) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (material) {
      dispatch({ type: 'UPDATE_MATERIAL', payload: form });
    } else {
      dispatch({ type: 'ADD_MATERIAL', payload: form });
    }
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{material ? 'Editar Material' : 'Nuevo Material'}</h2>
          <button className="btn-icon" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Tubería PVC 40mm"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Categoría</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="location">Ubicación</label>
              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                placeholder="Ej: Estante A1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">Cantidad</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="any"
                value={form.quantity}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="unit">Unidad</label>
              <select
                id="unit"
                name="unit"
                value={form.unit}
                onChange={handleChange}
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="minStock">Stock mínimo</label>
              <input
                id="minStock"
                name="minStock"
                type="number"
                min="0"
                step="any"
                value={form.minStock}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Precio (€)</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="supplierId">Proveedor</label>
            <select
              id="supplierId"
              name="supplierId"
              value={form.supplierId}
              onChange={handleChange}
            >
              <option value="">Sin proveedor</option>
              {state.suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notas</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              placeholder="Observaciones adicionales..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {material ? 'Guardar Cambios' : 'Añadir Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
