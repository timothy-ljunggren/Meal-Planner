import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';

const FloatingAddButton = ({ onClick, text = "Add New Recipe", icon: CustomIcon }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    onClick();
  };

  const IconComponent = CustomIcon || Plus;

  return (
    <div className="fixed bottom-28 left-1/2 transform -translate-x-1/2 z-40 md:bottom-8 md:right-8 md:left-auto md:transform-none">
      <button
        onClick={handleClick}
        className={`group relative inline-flex items-center px-6 py-4 bg-gradient-primary text-white font-semibold rounded-2xl shadow-large hover:shadow-glow transition-all duration-300 border-2 border-white/20 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 backdrop-blur-sm overflow-hidden ${
          isPressed ? 'scale-95' : 'hover:scale-105'
        }`}
        style={{ minWidth: '160px' }}
      >
        {/* Background sparkle effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Sparkles className="absolute top-2 right-3 w-3 h-3 text-white/40 animate-bounce-gentle" style={{ animationDelay: '0.2s' }} />
          <Sparkles className="absolute bottom-3 left-4 w-2 h-2 text-white/60 animate-bounce-gentle" style={{ animationDelay: '0.8s' }} />
          <Sparkles className="absolute top-1/2 right-2 w-2 h-2 text-white/30 animate-bounce-gentle" style={{ animationDelay: '1.2s' }} />
        </div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-400/0 via-white/10 to-primary-400/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-1000"></div>
        
        {/* Button content */}
        <div className="relative flex items-center">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 mr-3 group-hover:bg-white/30 transition-colors duration-200">
            <IconComponent className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </div>
          <span className="font-display font-semibold tracking-wide">{text}</span>
        </div>
        
        {/* Ripple effect on press */}
        {isPressed && (
          <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping"></div>
        )}
      </button>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 -z-10"></div>
    </div>
  );
};

export default FloatingAddButton;
