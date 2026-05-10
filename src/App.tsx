/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PropertiesPage from './pages/PropertiesPage';
import CalculatorPage from './pages/CalculatorPage';
import LegalityPage from './pages/LegalityPage';
import React from 'react';
import { supabase } from './lib/supabase';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  // Supabase Connection Verification
  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('🔄 Checking Supabase connection...');
        const { data, error } = await supabase.from('properties').select('id', { count: 'exact', head: true });
        
        if (error) {
          if (error.message.includes('FetchError') || error.message.includes('Failed to fetch')) {
            console.error('❌ Supabase Connection Error: Connection failed. Please check your VITE_SUPABASE_URL and Internet connection.');
          } else {
            // Error could be because table doesn't exist yet, which means connection is OK but DB is empty
            console.log('✅ Supabase connected, but "properties" table might need initialization:', error.message);
          }
        } else {
          console.log('✅ Supabase connected successfully! Ready to fetch properties.');
        }
      } catch (err) {
        console.error('❌ Supabase verification unexpectedly failed:', err);
      }
    };
    
    checkConnection();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/legality" element={<LegalityPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
