import React, { useState, useEffect } from 'react';
import { ChefHat } from 'lucide-react';
import AddMealModal from '../modals/AddMealModal';
import MealGrid from '../components/MealGrid';
import FloatingAddButton from '../components/FloatingAddButton';
import mealsData from '../data/meals.json';

const Recipes = () => {
  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);
  const [meals, setMeals] = useState([]);

  // Load meals from localStorage and file on component mount
  useEffect(() => {
    const savedMeals = localStorage.getItem('userMeals');
    const userMeals = savedMeals ? JSON.parse(savedMeals) : [];
    setMeals([...mealsData, ...userMeals]);
  }, []);

  const handleSaveMeal = (newMeal) => {
    // Get existing user meals from localStorage
    const savedMeals = localStorage.getItem('userMeals');
    const userMeals = savedMeals ? JSON.parse(savedMeals) : [];
    
    // Add new meal to user meals
    const updatedUserMeals = [...userMeals, newMeal];
    
    // Save to localStorage
    localStorage.setItem('userMeals', JSON.stringify(updatedUserMeals));
    
    // Update state with all meals (file + localStorage)
    setMeals([...mealsData, ...updatedUserMeals]);
  };

  const totalRecipes = meals.length;
  const userRecipes = JSON.parse(localStorage.getItem('userMeals') || '[]').length;

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-secondary rounded-2xl flex items-center justify-center shadow-glow-orange">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gradient-secondary">
              Recipe Collection
            </h1>
          </div>
          
          <p className="text-text-600 text-lg mb-6 max-w-2xl mx-auto">
            Discover, organize, and enjoy your favorite recipes all in one place
          </p>

          {/* Recipe stats */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-text-800 mb-1">
                {totalRecipes}
              </div>
              <div className="text-sm text-text-500 font-medium">Total Recipes</div>
            </div>
            <div className="w-px h-12 bg-surface-300"></div>
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-primary-600 mb-1">
                {userRecipes}
              </div>
              <div className="text-sm text-text-500 font-medium">Your Creations</div>
            </div>
            <div className="w-px h-12 bg-surface-300"></div>
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-secondary-600 mb-1">
                {mealsData.length}
              </div>
              <div className="text-sm text-text-500 font-medium">Curated Picks</div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Meal Grid */}
        <div className="animate-fade-in-up">
          <MealGrid meals={meals} />
        </div>

        {/* Add Meal Modal */}
        <AddMealModal 
          isOpen={isAddMealModalOpen} 
          onClose={() => setIsAddMealModalOpen(false)}
          onSave={handleSaveMeal}
        />
      </div>
      
      {/* Enhanced Floating Add Button - Hidden when modal is open */}
      {!isAddMealModalOpen && (
        <FloatingAddButton 
          onClick={() => setIsAddMealModalOpen(true)}
          text="Add New"
        />
      )}
    </div>
  );
};

export default Recipes;
