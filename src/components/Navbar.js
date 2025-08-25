import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChefHat, Calendar, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { path: '/recipes', label: 'Recipes', icon: ChefHat },
    { path: '/plan', label: 'Plan', icon: Calendar },
    { path: '/list', label: 'List', icon: ShoppingCart },
  ];

  return (
    <>
      {/* Mobile Header - Shows on mobile only */}
      <div className="md:hidden bg-white/95 backdrop-blur-sm border-b border-surface-200 sticky top-0 z-40 shadow-soft">
        <div className="flex items-center justify-center px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                    <ChefHat className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-display font-bold text-gradient-primary">Food Planner</h1>
                  <p className="text-xs text-text-500 font-medium">Plan • Cook • Enjoy</p>
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Navbar - Top */}
      <nav className="hidden md:block glass backdrop-blur-xl border-b border-surface-200/50 sticky top-0 z-40 shadow-soft">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                    <ChefHat className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-display font-bold text-gradient-primary">Food Planner</h1>
                  <p className="text-xs text-text-500 font-medium">Plan • Cook • Enjoy</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `inline-flex items-center px-4 py-2 mx-1 rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden group ${
                      isActive
                        ? 'text-primary-700 bg-primary-50 shadow-soft border border-primary-200'
                        : 'text-text-600 hover:text-text-800 hover:bg-surface-100 border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary-100 text-primary-600' 
                          : 'bg-surface-100 text-text-500 group-hover:bg-surface-200'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {label}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary rounded-full"></div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass backdrop-blur-xl border-t border-surface-200/50 z-50 shadow-large">
        <div className="flex px-4 py-3">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className="flex-1 flex flex-col items-center justify-center"
            >
              {({ isActive }) => (
                <>
                  <div className={`relative flex items-center justify-center w-12 h-8 rounded-2xl mb-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary-500 text-white shadow-glow transform scale-110' 
                      : 'bg-surface-100 text-text-500 hover:bg-surface-200 hover:scale-105'
                  }`}>
                    <Icon className="w-5 h-5" />
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl bg-primary-400/20 animate-pulse-soft"></div>
                    )}
                  </div>
                  <span className={`text-2xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'text-primary-600' 
                      : 'text-text-500'
                  }`}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
        
        {/* Bottom safe area for newer phones */}
        <div className="h-safe-bottom bg-transparent"></div>
      </nav>
    </>
  );
};

export default Navbar;
