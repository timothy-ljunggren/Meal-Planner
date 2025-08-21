import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import MealCard from './MealCard';

const MealGrid = ({ meals }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const filtered = meals.filter(meal =>
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (meal.tags && meal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
    setFilteredMeals(filtered);
  }, [meals, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Sticky Enhanced Search Bar */}
      <div className="sticky top-16 z-30 py-4 -mx-4 px-4 rounded-2xl">
        <div className="max-w-lg mx-auto">
          <div className={`relative transition-all duration-300 ${
            isSearchFocused ? 'transform scale-[1.02]' : ''
          }`}>
            {/* Search input with improved styling */}
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                isSearchFocused ? 'text-primary-500' : 'text-text-400'
              }`} />
              <input
                type="text"
                placeholder="Search recipes or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`input-primary pl-12 pr-12 py-4 text-base rounded-2xl shadow-soft transition-all duration-300 ${
                  isSearchFocused 
                    ? 'shadow-medium ring-2 ring-primary-200 border-primary-300' 
                    : 'hover:shadow-medium'
                }`}
              />
              
              {/* Clear button */}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-surface-100 hover:bg-surface-200 text-text-500 hover:text-text-700 transition-all duration-200 flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
            
            {/* Search suggestions with proper z-index */}
            {isSearchFocused && !searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-xl shadow-large border border-surface-200 animate-fade-in z-50">
                <p className="text-sm text-text-500 text-center">
                  Try searching for "chicken", "vegetarian", or "quick"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results header */}
      {searchTerm && (
        <div className="text-center animate-fade-in">
          <p className="text-text-600">
            {filteredMeals.length > 0 
              ? `Found ${filteredMeals.length} recipe${filteredMeals.length === 1 ? '' : 's'} matching "${searchTerm}"`
              : `No recipes found for "${searchTerm}"`
            }
          </p>
        </div>
      )}

      {/* Enhanced Meal Grid */}
      {filteredMeals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredMeals.map((meal, index) => (
            <div
              key={`${meal.name}-${index}`}
              className="opacity-0 animate-fade-in"
              style={{
                animationDelay: `${Math.min(index * 100, 1000)}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <MealCard meal={meal} />
            </div>
          ))}
        </div>
      ) : searchTerm ? (
        // Enhanced empty search state
        <div className="text-center py-16 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-surface-100 to-surface-200 rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 text-text-400" />
          </div>
          <h3 className="text-lg font-display font-semibold text-text-700 mb-2">
            No recipes found
          </h3>
          <p className="text-text-500 mb-6 max-w-md mx-auto">
            We couldn't find any recipes matching "{searchTerm}". Try adjusting your search terms or browse all recipes.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="btn-secondary"
          >
            Clear Search
          </button>
        </div>
      ) : (
        // Enhanced empty state
        <div className="text-center py-16 animate-fade-in-up">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-full flex items-center justify-center relative overflow-hidden">
            <div className="text-6xl animate-bounce-gentle">🍽️</div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-secondary-100/20 rounded-full"></div>
          </div>
          <h3 className="text-xl font-display font-bold text-text-800 mb-3">
            Your recipe collection awaits
          </h3>
          <p className="text-text-500 mb-8 max-w-md mx-auto leading-relaxed">
            Start building your personalized recipe collection by adding your favorite dishes and discovering new ones.
          </p>
        </div>
      )}
    </div>
  );
};

export default MealGrid;
