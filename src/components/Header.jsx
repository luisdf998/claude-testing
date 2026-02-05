import TsoLogo from './TsoLogo';

export default function Header({ activeTab, onTabChange }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <TsoLogo size={38} />
        <div>
          <h1>TSOck Control</h1>
          <span className="header-subtitle">Inventario TSO</span>
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
