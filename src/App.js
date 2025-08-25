import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import Recipes from './pages/Recipes';
import Plan from './pages/Plan';
import List from './pages/List';
import './App.css';

function App() {

  // Add to your main App component temporarily
useEffect(() => {
  // Check if PWA can be installed
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA install prompt available');
    e.preventDefault();
    // Store the event
    window.deferredPrompt = e;
  });

  // Check service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      console.log('Service Worker ready:', registration);
    });
  }

  // Check manifest
  console.log('Manifest loaded:', document.querySelector('link[rel="manifest"]'));
}, []);

  return (
    <Router>
      <div className="App pb-20 md:pb-8">
        <Navbar />
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/recipes" replace />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/list" element={<List />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
