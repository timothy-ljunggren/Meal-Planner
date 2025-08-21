import React, { useState, useEffect } from 'react';
import { Check, ShoppingCart, ChevronRight } from 'lucide-react';

const List = () => {
  const [shoppingList, setShoppingList] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [collapsedSections, setCollapsedSections] = useState({});

  useEffect(() => {
    // Load weekly plan from localStorage
    const savedPlan = localStorage.getItem('weeklyPlan');
    const savedCheckedItems = localStorage.getItem('checkedItems');
    
    if (savedCheckedItems) {
      setCheckedItems(JSON.parse(savedCheckedItems));
    }

    if (savedPlan) {
      const weeklyPlan = JSON.parse(savedPlan);
      const groupedIngredients = processIngredients(weeklyPlan);
      setShoppingList(groupedIngredients);
      
      // Count total items
      const total = Object.values(groupedIngredients).reduce((sum, group) => sum + group.length, 0);
      setTotalItems(total);
    }
  }, []);

  // Save checked items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const processIngredients = (weeklyPlan) => {
    const ingredientMap = {};
    const grouped = {};

    // Collect all ingredients from all meals
    Object.values(weeklyPlan).forEach(meal => {
      if (meal && meal.ingredients) {
        meal.ingredients.forEach(ingredient => {
          const key = `${ingredient.name}_${ingredient.unit}`;
          
          if (ingredientMap[key]) {
            ingredientMap[key].amount += ingredient.amount;
          } else {
            ingredientMap[key] = { ...ingredient };
          }
        });
      }
    });

    // Group by type
    Object.values(ingredientMap).forEach(ingredient => {
      const type = ingredient.type || 'Other';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(ingredient);
    });

    // Sort ingredients within each group
    Object.keys(grouped).forEach(type => {
      grouped[type].sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
  };

  const toggleItem = (type, ingredientName) => {
    const key = `${type}_${ingredientName}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSection = (type) => {
    setCollapsedSections(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const getCheckedCount = () => {
    return Object.values(checkedItems).filter(Boolean).length;
  };

  const formatAmount = (amount, unit) => {
    if (amount % 1 === 0) {
      return `${amount} ${unit}`;
    }
    return `${amount.toFixed(1)} ${unit}`;
  };

  const typeOrder = ['Obst & Gemüse', 'Brot', 'Milchprodukte', 'Trocken', 'Tiefkühl', 'Other'];
  const sortedTypes = Object.keys(shoppingList).sort((a, b) => {
    const indexA = typeOrder.indexOf(a);
    const indexB = typeOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gradient-primary">
              Shopping List
            </h1>
          </div>
          
        <p className="text-text-600 text-lg mb-6 max-w-2xl mx-auto">
          Your organized grocery list based on your weekly meal plan
        </p>
      </div>

      {/* Sticky Progress indicator */}
      {totalItems > 0 && (
        <div className="sticky top-16 z-30 py-4 -mx-4 px-4 rounded-2xl mb-8">
          <div className="max-w-md mx-auto">
            <div className="glass backdrop-blur-md rounded-2xl p-4 shadow-soft border border-white/20">
              <div className="flex items-center justify-between text-sm text-text-600 mb-3">
                <span className="font-medium">Shopping Progress</span>
                <span className="font-bold">{getCheckedCount()}/{totalItems} items</span>
              </div>
              <div className="w-full bg-surface-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-primary rounded-full transition-all duration-500 relative"
                  style={{ width: `${(getCheckedCount() / totalItems) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse-soft"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
        
        {Object.keys(shoppingList).length === 0 ? (
          <div className="card text-center p-16 animate-fade-in-up">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 bg-gradient-surface rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-text-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center animate-bounce-gentle">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
            <h3 className="text-xl font-display font-bold text-text-800 mb-3">
              No ingredients found
            </h3>
            <p className="text-text-600 max-w-md mx-auto">
              Add meals to your weekly plan to automatically generate your organized shopping list!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedTypes.map((type, index) => {
              const isCollapsed = collapsedSections[type];
              const checkedInSection = shoppingList[type].filter(ingredient => {
                const key = `${type}_${ingredient.name}`;
                return checkedItems[key] || false;
              }).length;
              
              return (
                <div 
                  key={type} 
                  className="card overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <button
                    onClick={() => toggleSection(type)}
                    className="w-full bg-gradient-surface p-6 hover:bg-surface-100 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                          <div className="absolute inset-0 w-3 h-3 bg-primary-400 rounded-full animate-ping opacity-30"></div>
                        </div>
                        <h2 className="text-lg font-display font-bold text-text-900">
                          {type}
                        </h2>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 text-sm font-semibold bg-primary-100 text-primary-700 rounded-lg">
                            {checkedInSection}/{shoppingList[type].length} items
                          </span>
                        </div>
                      </div>
                      <div className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-90'}`}>
                        <ChevronRight className="w-5 h-5 text-text-600" />
                      </div>
                    </div>
                  </button>
                  
                  <div className={`transition-all duration-500 overflow-hidden ${
                    isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'
                  }`}>
                    <div className="divide-y divide-surface-200">
                      {shoppingList[type].map((ingredient, ingredientIndex) => {
                        const key = `${type}_${ingredient.name}`;
                        const isChecked = checkedItems[key] || false;
                        
                        return (
                          <div
                            key={`${ingredient.name}_${ingredientIndex}`}
                            className={`p-4 flex items-center hover:bg-surface-50 transition-all duration-200 ${
                              isChecked ? 'bg-success-50/30' : ''
                            }`}
                          >
                            <button
                              onClick={() => toggleItem(type, ingredient.name)}
                              className={`mr-4 p-2 rounded-xl transition-all duration-200 ${
                                isChecked
                                  ? 'bg-success-500 hover:bg-success-600 text-white shadow-soft'
                                  : 'bg-surface-100 hover:bg-surface-200 text-text-500 hover:text-text-700'
                              }`}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            
                            <div className="flex-1">
                              <div className={`font-semibold transition-all duration-200 ${
                                isChecked
                                  ? 'line-through text-text-500 text-sm'
                                  : 'text-text-900'
                              }`}>
                                {ingredient.name}
                              </div>
                              <div className={`text-sm mt-0.5 font-medium transition-all duration-200 ${
                                isChecked ? 'text-text-400' : 'text-text-600'
                              }`}>
                                {formatAmount(ingredient.amount, ingredient.unit)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
