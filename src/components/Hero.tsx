import { motion, useScroll, useTransform } from 'motion/react';
import { ShieldCheck, Calendar, Handshake, ChevronRight } from 'lucide-react';
import React from 'react';
import { getOptimizedImageUrl } from '../lib/utils';

export default function Hero() {
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const y3 = useTransform(scrollY, [0, 500], [0, 100]);
  const y4 = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-slate-900">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/20 blur-[120px] rounded-full" 
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/40 blur-[100px] rounded-full" 
        />
        <motion.img
          style={{ y: y3 }}
          src={getOptimizedImageUrl("https://images.unsplash.com/photo-1600585154340-be6161a56a0c", 1200)}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          alt="Rumah Halal"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-xs font-bold mb-6">
            <ShieldCheck size={14} />
            Member Terverifikasi RumahHalal.id
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
          >
            Wujudkan Hunian Berkah Bersama <span className="text-emerald-500">Nur Holis</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-slate-300 mb-8 max-w-xl"
          >
            Solusi kepemilikan properti syariah tanpa riba, tanpa denda, dan tanpa sita.
            Bangun masa depan keluarga di lingkungan yang islami dan harmonis.
          </motion.p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#properties"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all group"
            >
              Lihat Properti
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#calculator"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all"
            >
              Cek Cicilan
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, label: 'Legal Aman', detail: 'SHM/SHGB' },
              { icon: Calendar, label: 'Cicilan Flat', detail: 'Sampai Lunas' },
              { icon: Handshake, label: 'Akad Murni', detail: 'Sesuai DSN-MUI' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-2">
                <item.icon className="text-emerald-500" size={24} />
                <div className="text-white font-semibold text-sm">{item.label}</div>
                <div className="text-slate-300 text-xs">{item.detail}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ y: y4 }}
          transition={{ duration: 1 }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 bg-gradient-to-br from-emerald-600 to-emerald-800 p-1 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={getOptimizedImageUrl("https://images.unsplash.com/photo-1560518883-ce09059eeffa", 800)}
                alt="Nur Holis Property"
                className="rounded-[22px] w-full h-[500px] object-cover"
              />
          </div>
          {/* Trusted Badge floating */}
          <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl z-20 flex items-center gap-4 border border-slate-100 dark:border-slate-700">
             <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
               <ShieldCheck size={28} />
             </div>
             <div>
               <div className="text-slate-900 dark:text-white font-bold block">Halal Indonesia</div>
               <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">Developer Syariah Senior</div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
