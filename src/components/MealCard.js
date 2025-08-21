import React, { useState, useEffect } from 'react';
import { Heart, Clock, Users } from 'lucide-react';

const MealCard = ({ meal }) => {
  const [isLiked, setIsLiked] = useState(false);

  // Load like state from localStorage on mount
  useEffect(() => {
    const likedMeals = JSON.parse(localStorage.getItem('likedMeals') || '[]');
    setIsLiked(likedMeals.includes(meal.name));
  }, [meal.name]);

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    const likedMeals = JSON.parse(localStorage.getItem('likedMeals') || '[]');
    
    if (isLiked) {
      // Remove from liked meals
      const updatedLikes = likedMeals.filter(name => name !== meal.name);
      localStorage.setItem('likedMeals', JSON.stringify(updatedLikes));
      setIsLiked(false);
    } else {
      // Add to liked meals
      const updatedLikes = [...likedMeals, meal.name];
      localStorage.setItem('likedMeals', JSON.stringify(updatedLikes));
      setIsLiked(true);
    }
    
    // Small haptic feedback simulation
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="group card-interactive bg-white overflow-hidden relative">
      {/* Card Header with gradient overlay */}
      <div className="relative h-32 bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-50 flex items-center justify-center">
        {/* Food emoji or placeholder */}
        <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
          {meal.emoji || '🍽️'}
        </div>
        
        {/* Like button */}
        <button
          onClick={handleLikeToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isLiked 
              ? 'bg-error-500 text-white shadow-lg scale-110' 
              : 'bg-white/80 text-text-400 hover:text-error-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-2 left-2 w-8 h-8 bg-primary-400 rounded-full blur-sm"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-secondary-400 rounded-full blur-sm"></div>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-5">
        <h3 className="text-lg font-display font-semibold text-text-900 text-center mb-3 group-hover:text-primary-600 transition-colors duration-200">
          {meal.name}
        </h3>
        
        {/* Meal meta information */}
        {(meal.cookTime || meal.servings || meal.difficulty) && (
          <div className="flex items-center justify-center space-x-4 text-xs text-text-500 mb-3">
            {meal.cookTime && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{meal.cookTime}</span>
              </div>
            )}
            {meal.servings && (
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{meal.servings}</span>
              </div>
            )}
            {meal.difficulty && (
              <div className="flex items-center space-x-1">
                <div className="flex space-x-0.5">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i < meal.difficulty 
                          ? 'bg-primary-500' 
                          : 'bg-surface-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Tags */}
        {meal.tags && (
          <div className="flex flex-wrap gap-1 justify-center">
            {meal.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-2xs font-medium bg-surface-100 text-text-600 rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default MealCard;
