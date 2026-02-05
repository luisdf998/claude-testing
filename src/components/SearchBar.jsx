import { Search, X } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

export default function SearchBar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
}) {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar material, ubicación..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button
            className="btn-icon search-clear"
            onClick={() => onSearchChange('')}
            aria-label="Limpiar búsqueda"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <select
        className="category-select"
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">Todas las categorías</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
