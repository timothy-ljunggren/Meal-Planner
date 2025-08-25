import React, { useState } from 'react';
import { X, Plus, Trash2, ChefHat, BookOpen } from 'lucide-react';

const AddMealModal = ({ isOpen, onClose, onSave }) => {
  const [mealName, setMealName] = useState('');
  const [emoji, setEmoji] = useState('🍽️');
  const [cookTime, setCookTime] = useState('30 min');
  const [servings, setServings] = useState('2-3');
  const [difficulty, setDifficulty] = useState(2);
  const [tags, setTags] = useState(['Custom']);
  const [ingredients, setIngredients] = useState([
    { name: '', amount: '', unit: 'g', type: 'Obst & Gemüse' }
  ]);

  const ingredientTypes = [
    'Obst & Gemüse',
    'Kühlung',
    'Trocken',
    'Tiefkühl',
    'Brot'
  ];

  const units = ['g', 'ml', 'Stück', 'Scheiben', 'Blätter'];
  
  const emojiOptions = ['🍽️', '🍳', '🥘', '🍲', '🥗', '🍝', '🍜', '🥙', '🌮', '🍛', '🍣', '🥩', '🐟', '🥕', '🍞'];
  
  const tagOptions = ['Custom', 'Quick', 'Healthy', 'Vegetarian', 'Vegan', 'Comfort Food', 'Italian', 'Asian', 'Mexican', 'Spicy', 'Easy'];

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: 'g', type: 'Obst & Gemüse' }]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = field === 'amount' ? (value === '' ? '' : Number(value)) : value;
    setIngredients(updatedIngredients);
  };

  const handleSave = () => {
    if (!mealName.trim()) return;
    
    const validIngredients = ingredients.filter(ing => 
      ing.name.trim() && ing.amount && ing.unit && ing.type
    );
    
    if (validIngredients.length === 0) return;

    const newMeal = {
      name: mealName.trim(),
      ingredients: validIngredients,
      emoji: emoji,
      tags: tags,
      cookTime: cookTime,
      servings: servings,
      difficulty: difficulty
    };

    if (onSave) {
      onSave(newMeal);
    }
    
    // Reset form
    setMealName('');
    setEmoji('🍽️');
    setCookTime('30 min');
    setServings('2-3');
    setDifficulty(2);
    setTags(['Custom']);
    setIngredients([{ name: '', amount: '', unit: 'g', type: 'Obst & Gemüse' }]);
    onClose();
  };

  const handleClose = () => {
    // Reset form on close
    setMealName('');
    setEmoji('🍽️');
    setCookTime('30 min');
    setServings('2-3');
    setDifficulty(2);
    setTags(['Custom']);
    setIngredients([{ name: '', amount: '', unit: 'g', type: 'Obst & Gemüse' }]);
    onClose();
  };

  const validIngredients = ingredients.filter(ing => ing.name.trim() && ing.amount);
  const isFormValid = mealName.trim() && validIngredients.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Enhanced background overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300" 
        onClick={handleClose}
      />

      {/* Modal container - improved mobile sizing */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-3xl shadow-large max-w-4xl w-full max-h-[95vh] overflow-hidden animate-scale-in">
          
          {/* Enhanced Header */}
          <div className="bg-gradient-secondary p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">
                    Create New Recipe
                  </h2>
                  <p className="text-secondary-100 text-sm font-medium">
                    Add your favorite dish to the collection
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Enhanced Content with better spacing */}
          <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(95vh-250px)] scrollbar-thin">
            
            {/* Recipe Name and Emoji */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="md:col-span-3">
                <label className="block text-sm font-display font-semibold text-text-800 mb-3">
                  Recipe Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    className="input-primary text-lg py-4 pr-12"
                    placeholder="What delicious dish are you creating?"
                    autoFocus
                  />
                  <BookOpen className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-display font-semibold text-text-800 mb-3">
                  Emoji
                </label>
                <select
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="input-primary text-2xl text-center bg-white"
                >
                  {emojiOptions.map(emojiOption => (
                    <option key={emojiOption} value={emojiOption}>{emojiOption}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Recipe Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-display font-semibold text-text-800 mb-3">
                  Cook Time
                </label>
                <input
                  type="text"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  className="input-primary"
                  placeholder="30 min"
                />
              </div>
              
              <div>
                <label className="block text-sm font-display font-semibold text-text-800 mb-3">
                  Servings
                </label>
                <input
                  type="text"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className="input-primary"
                  placeholder="2-3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-display font-semibold text-text-800 mb-3">
                  Difficulty
                </label>
                <div className="flex items-center space-x-3 justify-center">
                  {[1, 2, 3].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={`w-10 h-10 rounded-full transition-all duration-200 ${
                        difficulty >= level 
                          ? 'bg-primary-500 text-white shadow-soft' 
                          : 'bg-surface-100 text-text-400 hover:bg-surface-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <label className="block text-sm font-display font-semibold text-text-800 mb-3">
                Tags
              </label>
              <div className="flex flex-wrap justify-evenly gap-2">
                {tagOptions.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (tags.includes(tag)) {
                        setTags(tags.filter(t => t !== tag));
                      } else {
                        setTags([...tags, tag]);
                      }
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      tags.includes(tag)
                        ? 'bg-primary-500 text-white shadow-soft'
                        : 'bg-surface-100 text-text-600 hover:bg-surface-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-display font-semibold text-text-800 mb-1">
                    Ingredients
                  </h3>
                  <p className="text-text-500 text-sm ml-4">
                    {validIngredients.length} ingredients
                  </p>
                </div>
                <button
                  onClick={addIngredient}
                  className="btn-primary px-4 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ingredient
                </button>
              </div>

              <div className="space-y-4">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="card p-5 hover:shadow-medium transition-all duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      
                      {/* Ingredient Name */}
                      <div className="md:col-span-5">
                        <input
                          type="text"
                          value={ingredient.name}
                          onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                          className="input-primary"
                          placeholder="Ingredient name"
                        />
                      </div>

                      {/* Amount */}
                      <div className="md:col-span-2">
                        <input
                          type="number"
                          value={ingredient.amount}
                          onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                          className="input-primary"
                          placeholder="Amount"
                          min="0"
                          step="0.1"
                        />
                      </div>

                      {/* Unit */}
                      <div className="md:col-span-2">
                        <select
                          value={ingredient.unit}
                          onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                          className="input-primary bg-white"
                        >
                          {units.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>

                      {/* Type */}
                      <div className="md:col-span-2">
                        <select
                          value={ingredient.type}
                          onChange={(e) => updateIngredient(index, 'type', e.target.value)}
                          className="input-primary bg-white text-sm"
                        >
                          {ingredientTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      {/* Delete Button */}
                      <div className="md:col-span-1 flex justify-end">
                        <button
                          onClick={() => removeIngredient(index)}
                          disabled={ingredients.length === 1}
                          className={`p-2 rounded-xl transition-all duration-200 ${
                            ingredients.length === 1 
                              ? 'text-text-300 cursor-not-allowed' 
                              : 'text-error-500 hover:bg-error-50 hover:text-error-600 hover:scale-110'
                          }`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Summary */}
            {mealName && validIngredients.length > 0 && (
              <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 p-6 border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{emoji}</div>
                  <div className="flex-1">
                    <h4 className="font-display font-bold text-text-800 mb-2">Recipe Preview</h4>
                    <p className="text-text-700 mb-3">
                      <strong className="text-primary-700">{mealName}</strong>
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-text-600">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                        {validIngredients.length} ingredient{validIngredients.length !== 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
                        {cookTime}
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                        {servings} servings
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
                        {tags.length} tag{tags.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Footer - better mobile spacing */}
          <div className="px-6 md:px-8 py-4 md:py-6 bg-surface-50 border-t border-surface-200">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <div className="text-sm text-text-500 text-center md:text-left">
                {isFormValid ? '✨ Recipe ready to save!' : 'Please fill in recipe name and at least one ingredient'}
              </div>
              <div className="flex space-x-3 w-full md:w-auto">
                <button
                  onClick={handleClose}
                  className="btn-ghost px-6 py-3 flex-1 md:flex-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isFormValid}
                  className={`btn-primary px-8 py-3 flex-1 md:flex-none ${
                    isFormValid 
                      ? 'shadow-glow-orange hover:shadow-large' 
                      : 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-soft'
                  }`}
                >
                  <ChefHat className="w-4 h-4 mr-2" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMealModal;
