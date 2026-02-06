import { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export default function DataTools() {
  const { state, dispatch } = useInventory();
  const [importError, setImportError] = useState('');

  function handleExportJSON() {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    downloadBlob(blob, 'inventario-fontaneria.json');
  }

  function handleExportCSV() {
    const headers = [
      'Nombre',
      'Categoría',
      'Cantidad',
      'Unidad',
      'Stock Mínimo',
      'Ubicación',
      'Precio',
      'Notas',
    ];
    const rows = state.materials.map((m) => [
      m.name,
      m.category,
      m.quantity,
      m.unit,
      m.minStock,
      m.location,
      m.price,
      m.notes,
    ]);

    const csv =
      headers.join(';') +
      '\n' +
      rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';')).join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, 'inventario-fontaneria.csv');
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data.materials || !Array.isArray(data.materials)) {
          setImportError('Formato de archivo no válido. Debe contener un array de materiales.');
          return;
        }
        dispatch({ type: 'IMPORT_DATA', payload: data });
      } catch {
        setImportError('Error al leer el archivo. Asegúrate de que es un JSON válido.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="data-tools">
      <h3>Herramientas de datos</h3>
      <div className="data-tools-buttons">
        <button className="btn btn-secondary" onClick={handleExportJSON}>
          <Download size={16} />
          Exportar JSON
        </button>
        <button className="btn btn-secondary" onClick={handleExportCSV}>
          <Download size={16} />
          Exportar CSV
        </button>
        <label className="btn btn-secondary import-btn">
          <Upload size={16} />
          Importar JSON
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            hidden
          />
        </label>
      </div>
      {importError && <p className="error-text">{importError}</p>}
    </div>
  );
}
