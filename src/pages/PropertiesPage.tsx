import React from 'react';
import PropertyList from '../components/PropertyList';
import { motion } from 'motion/react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function PropertiesPage() {
  return (
    <div className="pt-24 min-h-screen">
      <SEO 
        title="Katalog Properti Syariah"
        description="Jelajahi berbagai pilihan hunian islami yang nyaman dan berkah. Lokasi strategis dengan skema pembayaran murni syariah."
      />
      {/* Breadcrumbs / Header */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            <Link to="/" className="hover:text-emerald-500 flex items-center gap-1 transition-colors">
              <Home size={12} />
              Home
            </Link>
            <ChevronRight size={10} />
            <span className="text-emerald-600 dark:text-emerald-400">Daftar Properti</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Katalog Properti Syariah
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
            Temukan hunian impian dengan konsep islami tanpa riba, denda, dan sita. Semua unit telah diverifikasi untuk kenyamanan Bapak/Ibu.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PropertyList />
      </motion.div>
    </div>
  );
}
