import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Linkedin, ExternalLink, Camera, Users, MapPin } from 'lucide-react';
import { getOptimizedImageUrl } from '../lib/utils';

const FIELD_VISITS = [
  {
    id: 1,
    title: 'Survey Lahan Bersama Konsumen',
    location: 'Bogor, Jawa Barat',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop',
    date: '12 Okt 2023'
  },
  {
    id: 2,
    title: 'Update Progress Pembangunan Unit',
    location: 'Cianjur, Jawa Barat',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800&auto=format&fit=crop',
    date: '05 Nov 2023'
  },
  {
    id: 3,
    title: 'Serah Terima Kunci Syariah',
    location: 'Tangsel, Banten',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    date: '20 Nov 2023'
  }
];

export default function FieldDocumentation() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
                <Camera size={12} />
                Dokumentasi Lapangan
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                Melihat Langsung <span className="text-emerald-600">Aktivitas</span> Kami
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Kami percaya transparansi adalah kunci kepercayaan. Ikuti perjalanan kami dalam membangun hunian impian Anda melalui dokumentasi kunjungan lapangan, progres konstruksi, dan momen kebahagiaan serah terima kunci.
              </p>

              <div className="space-y-6 mb-10">
                <div className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Konsultasi Tatap Muka</h4>
                    <p className="text-sm text-slate-500">Kunjungi lokasi dan diskusikan akad syariah langsung di lapangan.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Transparansi Lokasi</h4>
                    <p className="text-sm text-slate-500">Setiap proyek memiliki status lahan yang jelas dan dapat diverifikasi.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://instagram.com/nurholis_property" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gradient-to-tr from-purple-600 to-pink-500 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg"
                >
                  <Instagram size={20} />
                  Follow Instagram
                  <ExternalLink size={14} className="opacity-50" />
                </a>
                <a 
                  href="https://linkedin.com/in/nurholis" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg"
                >
                  <Linkedin size={20} />
                  Connect LinkedIn
                </a>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
             {FIELD_VISITS.map((visit, idx) => (
               <motion.div
                 key={visit.id}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className={idx === 0 ? "col-span-2 aspect-[16/9] md:aspect-[21/9]" : "aspect-square md:aspect-video"}
               >
                 <div className="group relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl">
                    <img 
                      src={getOptimizedImageUrl(visit.image, 800)} 
                      alt={visit.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 block">
                          {visit.date} • {visit.location}
                       </span>
                       <h4 className="text-white font-bold text-lg md:text-xl leading-tight">
                         {visit.title}
                       </h4>
                    </div>
                 </div>
               </motion.div>
             ))}
          </div>

        </div>
      </div>
    </section>
  );
}
