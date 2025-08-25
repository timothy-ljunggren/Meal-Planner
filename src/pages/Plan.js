import React, { useState, useEffect } from 'react';
import { Shuffle, X, Plus, Calendar, Sparkles } from 'lucide-react';
import FloatingAddButton from '../components/FloatingAddButton';
import MealCard from '../components/MealCard';
import mealsData from '../data/meals.json';

const Plan = () => {
  const daysOfWeek = [
    { name: 'Monday', short: 'Mon', emoji: '💪' },
    { name: 'Tuesday', short: 'Tue', emoji: '🔥' },
    { name: 'Wednesday', short: 'Wed', emoji: '⚡' },
    { name: 'Thursday', short: 'Thu', emoji: '🌟' },
    { name: 'Friday', short: 'Fri', emoji: '🎉' },
    { name: 'Saturday', short: 'Sat', emoji: '🌈' },
    { name: 'Sunday', short: 'Sun', emoji: '😌' },
  ];
  const [weeklyPlan, setWeeklyPlan] = useState({});
  const [availableMeals, setAvailableMeals] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load meals from localStorage and file on component mount
  useEffect(() => {
    const savedMeals = localStorage.getItem('userMeals');
    const userMeals = savedMeals ? JSON.parse(savedMeals) : [];
    setAvailableMeals([...mealsData, ...userMeals]);

    // Load saved weekly plan
    const savedPlan = localStorage.getItem('weeklyPlan');
    if (savedPlan) {
      setWeeklyPlan(JSON.parse(savedPlan));
    }
  }, []);

  // Save weekly plan to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(weeklyPlan).length > 0) {
      localStorage.setItem('weeklyPlan', JSON.stringify(weeklyPlan));
    }
  }, [weeklyPlan]);

  // Get random meal that's not already used in the current plan (prioritize liked meals with variety)
  const getRandomUnusedMeal = (excludeDay = null) => {
    const usedMeals = Object.entries(weeklyPlan)
      .filter(([day, meal]) => meal !== null && day !== excludeDay)
      .map(([, meal]) => meal.name);
    
    // Get liked meals first
    const likedMeals = JSON.parse(localStorage.getItem('likedMeals') || '[]');
    const likedMealObjects = availableMeals.filter(meal => likedMeals.includes(meal.name));
    
    // Filter out used meals
    const unusedLikedMeals = likedMealObjects.filter(meal => !usedMeals.includes(meal.name));
    const unusedAllMeals = availableMeals.filter(meal => !usedMeals.includes(meal.name));
    
    // 70% chance to use liked meals (if available), 30% chance for variety when changing individual meals
    const shouldUseLikedMeal = Math.random() < 0.7;
    
    if (unusedLikedMeals.length > 0 && shouldUseLikedMeal) {
      return unusedLikedMeals[Math.floor(Math.random() * unusedLikedMeals.length)];
    } else if (unusedAllMeals.length > 0) {
      return unusedAllMeals[Math.floor(Math.random() * unusedAllMeals.length)];
    } else if (unusedLikedMeals.length > 0) {
      // Fallback to liked meals if no other options
      return unusedLikedMeals[Math.floor(Math.random() * unusedLikedMeals.length)];
    }
    
    return null; // No more unused meals available
  };

  // Create a full weekly plan with random meals (prioritize liked meals)
  const createWeeklyPlan = async () => {
    if (availableMeals.length === 0) return;
    
    setIsGenerating(true);
    
    // Add some delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPlan = {};
    const usedMeals = [];
    
    // Get liked meals first
    const likedMeals = JSON.parse(localStorage.getItem('likedMeals') || '[]');
    const likedMealObjects = availableMeals.filter(meal => likedMeals.includes(meal.name));
    
    for (const { name } of daysOfWeek) {
      const unusedLikedMeals = likedMealObjects.filter(meal => !usedMeals.includes(meal.name));
      const unusedAllMeals = availableMeals.filter(meal => !usedMeals.includes(meal.name));
      
      // 75% chance to use liked meals (if available), 25% chance for variety
      // This ensures we still prioritize liked meals but add some freshness
      const shouldUseLikedMeal = Math.random() < 0.75;
      
      if (unusedLikedMeals.length > 0 && shouldUseLikedMeal) {
        // Use a liked meal
        const randomMeal = unusedLikedMeals[Math.floor(Math.random() * unusedLikedMeals.length)];
        newPlan[name] = randomMeal;
        usedMeals.push(randomMeal.name);
      } else if (unusedAllMeals.length > 0) {
        // Use any available meal for variety
        const randomMeal = unusedAllMeals[Math.floor(Math.random() * unusedAllMeals.length)];
        newPlan[name] = randomMeal;
        usedMeals.push(randomMeal.name);
      } else if (unusedLikedMeals.length > 0) {
        // Fallback to liked meals if no other options
        const randomMeal = unusedLikedMeals[Math.floor(Math.random() * unusedLikedMeals.length)];
        newPlan[name] = randomMeal;
        usedMeals.push(randomMeal.name);
      }
    }
    
    setWeeklyPlan(newPlan);
    setIsGenerating(false);
  };

  // Change meal for a specific day
  const changeMealForDay = (day) => {
    const newMeal = getRandomUnusedMeal(day);
    if (newMeal) {
      setWeeklyPlan(prev => ({
        ...prev,
        [day]: newMeal
      }));
    }
  };

  // Delete meal for a specific day
  const deleteMealForDay = (day) => {
    setWeeklyPlan(prev => {
      const newPlan = { ...prev };
      delete newPlan[day];
      return newPlan;
    });
  };

  // Add random meal for a specific day
  const addRandomMealForDay = (day) => {
    const newMeal = getRandomUnusedMeal();
    if (newMeal) {
      setWeeklyPlan(prev => ({
        ...prev,
        [day]: newMeal
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gradient-primary">
            Weekly Meal Plan
          </h1>
        </div>
        
        <p className="text-text-600 text-lg mb-8 max-w-2xl mx-auto">
          Plan your week ahead with delicious, organized meals that fit your lifestyle
        </p>
      </div>
      
      {/* Weekly plan grid - Responsive layout that gives proper space on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {daysOfWeek.map(({ name, short, emoji }, index) => (
          <div 
            key={name} 
            className="card bg-white overflow-hidden animate-fade-in"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'forwards'
            }}
          >
            {/* Day header */}
            <div className="bg-gradient-surface p-4 border-b border-surface-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-text-900 text-lg lg:text-xl">
                    {name}
                  </h3>
                  <p className="text-text-500 text-sm font-medium lg:block hidden">
                    {short}
                  </p>
                </div>
                <div className="text-2xl lg:text-3xl opacity-70">{emoji}</div>
              </div>
            </div>

            <div className="p-4">
              {weeklyPlan[name] ? (
                <div className="space-y-4">
                  <MealCard meal={weeklyPlan[name]} />
                  <div className="grid grid-cols-5 gap-2">
                    <button
                      onClick={() => changeMealForDay(name)}
                      className="btn-secondary col-span-4 text-sm py-2.5 px-3"
                      title="Change meal"
                    >
                      <Shuffle className="w-4 h-4 mr-1.5" />
                      Change
                    </button>
                    <button
                      onClick={() => deleteMealForDay(name)}
                      className="btn-secondary text-error-600 hover:text-error-700 hover:bg-error-50 p-2.5 flex items-center justify-center"
                      title="Remove meal"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-surface-300 rounded-xl p-6 text-center text-text-500 min-h-[160px] flex flex-col items-center justify-center bg-surface-50/50 hover:bg-surface-100/50 transition-colors duration-200">
                    <div className="text-3xl mb-2 opacity-40">🍽️</div>
                    <p className="text-sm font-medium">No meal planned</p>
                  </div>
                  <button
                    onClick={() => addRandomMealForDay(name)}
                    className="btn-secondary w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Random Meal
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Floating Add Button */}
      <FloatingAddButton 
        onClick={createWeeklyPlan}
        text={isGenerating ? "Generating..." : "Create Plan"}
        icon={isGenerating ? Sparkles : Plus}
      />

      {/* Loading overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-large max-w-sm mx-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center animate-bounce-gentle">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-display font-semibold text-text-900 mb-2">
              Creating Your Plan
            </h3>
            <p className="text-text-600">
              Selecting the perfect meals for your week...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plan;
