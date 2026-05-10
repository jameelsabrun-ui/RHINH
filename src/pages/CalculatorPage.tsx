import React from 'react';
import ShariaCalculator from '../components/ShariaCalculator';
import { motion } from 'motion/react';
import { ChevronRight, Home, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CalculatorPage() {
  return (
    <div className="pt-24 min-h-screen">
      {/* Breadcrumbs / Header */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
            <Link to="/" className="hover:text-emerald-500 flex items-center gap-1 transition-colors">
              <Home size={12} />
              Home
            </Link>
            <ChevronRight size={10} />
            <span className="text-emerald-600 dark:text-emerald-400">Kalkulator Syariah</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Simulasi Cicilan Syariah
            </h1>
            <div className="hidden sm:flex bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              Tanpa Riba
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
            Hitung perkiraan cicilan bulanan Bapak/Ibu dengan skema syariah murni. Transparan, adil, dan tanpa biaya tersembunyi.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pb-24"
      >
        <ShariaCalculator />
      </motion.div>
      
      {/* Informational Section */}
      <section className="bg-white dark:bg-slate-950 py-16 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Mengapa Skema Kami Berbeda?</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Kami tidak menggunakan sistem bunga bank. Harga yang disepakati di awal adalah harga mutlak yang akan Bapak/Ibu bayar hingga lunas. Tidak ada fluktuasi cicilan atau denda keterlambatan yang memberatkan.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Akad Yang Digunakan</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Utamanya kami menggunakan akad <strong>Istishna</strong> (pesan bangun) atau <strong>Murabahah</strong> (jual beli) yang telah disesuaikan dengan fatwa DSN-MUI untuk menjamin kehalalan transaksi Bapak/Ibu.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
