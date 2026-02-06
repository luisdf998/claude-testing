import { useState } from 'react';
import { Plus } from 'lucide-react';
import { InventoryProvider } from './context/InventoryContext';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import MaterialList from './components/MaterialList';
import MaterialForm from './components/MaterialForm';
import Dashboard from './components/Dashboard';
import DataTools from './components/DataTools';
import SupplierList from './components/SupplierList';
import OrderPanel from './components/OrderPanel';
import ExpenseList from './components/ExpenseList';
import './App.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  function handleEdit(material) {
    setEditingMaterial(material);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingMaterial(null);
  }

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-main">
        {activeTab === 'inventory' && (
          <>
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
            />
            <MaterialList
              onEdit={handleEdit}
              searchQuery={searchQuery}
              categoryFilter={categoryFilter}
            />
            <button
              className="fab"
              onClick={() => setShowForm(true)}
              aria-label="Añadir material"
              title="Añadir material"
            >
              <Plus size={24} />
            </button>
          </>
        )}

        {activeTab === 'orders' && <OrderPanel />}

        {activeTab === 'expenses' && <ExpenseList />}

        {activeTab === 'suppliers' && <SupplierList />}

        {activeTab === 'dashboard' && (
          <>
            <Dashboard />
            <DataTools />
          </>
        )}
      </main>

      {showForm && (
        <MaterialForm material={editingMaterial} onClose={handleCloseForm} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  );
}
