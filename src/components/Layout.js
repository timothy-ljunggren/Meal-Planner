import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
      
      {/* Main content with optimized spacing */}
      <main className="relative pb-24 md:pb-8 md:pt-4">
        <div className="transition-all duration-300 ease-in-out animate-fade-in">
          {children}
        </div>
      </main>
      
      {/* Floating background elements for depth */}
      <div className="fixed top-20 right-10 w-72 h-72 bg-gradient-to-br from-primary-100/30 to-secondary-100/30 rounded-full blur-3xl -z-10 animate-pulse-soft"></div>
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-secondary-50/40 to-primary-50/40 rounded-full blur-3xl -z-10 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default Layout;
