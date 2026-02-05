import { Wrench } from 'lucide-react';

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <Wrench size={28} />
        <div>
          <h1>FontaStock</h1>
          <span className="header-subtitle">Inventario de fontanería</span>
        </div>
      </div>
      <nav className="header-nav">
        <button
          className={`nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => onTabChange('inventory')}
        >
          Inventario
        </button>
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onTabChange('dashboard')}
        >
          Resumen
        </button>
        <button
          className={`nav-btn ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => onTabChange('tools')}
        >
          Datos
        </button>
      </nav>
    </header>
  );
}
