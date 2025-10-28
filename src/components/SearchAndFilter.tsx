import React, { useState } from 'react';
import { Search, Filter, X, Star, Tag } from 'lucide-react';
import { useProductStore, ProductFilter } from '../store/productStore';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchAndFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ isOpen, onClose }) => {
  const { searchQuery, filters, setSearchQuery, setFilters } = useProductStore();
  const [localFilters, setLocalFilters] = useState<ProductFilter>(filters);

  const categories = [
    'Visi produktai',
    'Kalėdiniai nameliai',
    'Žaisliukai',
    'Girliandos',
    'Puokštės',
    'Dekoracijos',
    'LED apšvietimas'
  ];

  const tags = [
    'LED',
    'Ekologiškas',
    'Rankų darbo',
    'Premium',
    'Mažos partijos',
    'Tradicinis',
    'Modernus'
  ];

  const applyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

  const clearFilters = () => {
    setLocalFilters({});
    setFilters({});
    setSearchQuery('');
    onClose();
  };

  const updateFilter = (key: keyof ProductFilter, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  const updateTags = (tag: string) => {
    const currentTags = localFilters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    setLocalFilters(prev => ({
      ...prev,
      tags: newTags.length > 0 ? newTags : undefined,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Ieškoti ir filtruoti</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ieškoti produktų
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Įveskite produkto pavadinimą..."
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategorija
                </label>
                <select
                  value={localFilters.category || ''}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category === 'Visi produktai' ? '' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kaina (€)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Min"
                      value={localFilters.minPrice || ''}
                      onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max"
                      value={localFilters.maxPrice || ''}
                      onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimalus įvertinimas
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => updateFilter('rating', rating)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition ${
                        localFilters.rating === rating
                          ? 'border-red-500 bg-red-50 text-red-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                      <span>{rating}+</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Žymės
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => updateTags(tag)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-full border transition ${
                        localFilters.tags?.includes(tag)
                          ? 'border-red-500 bg-red-50 text-red-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Tag className="w-4 h-4" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Filter */}
              <div className="mb-6">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localFilters.inStock || false}
                    onChange={(e) => updateFilter('inStock', e.target.checked || undefined)}
                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Tik turimi sandėlyje
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={clearFilters}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Išvalyti filtrus
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 bg-gradient-to-r from-red-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-green-700 transition"
                >
                  Taikyti filtrus
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


