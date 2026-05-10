import React, { useState } from 'react';
import { Camera, Calendar, CheckCircle, X, ChevronRight, History, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { getOptimizedImageUrl } from '../lib/utils';
import { propertyService } from '../services/propertyService';
import { Property, ConstructionLog } from '../types';

export default function ConstructionTracking() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<Property | null>(null);
  const [projectLogs, setProjectLogs] = useState<ConstructionLog[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // We'll target p1 as the featured tracking project initially
      const featuredProjectId = 'p1';
      const [propertyData, logsData] = await Promise.all([
        propertyService.getPropertyById(featuredProjectId),
        propertyService.getConstructionLogs(featuredProjectId)
      ]);
      
      setProject(propertyData);
      setProjectLogs(logsData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const activeLog = projectLogs[0];
  
  if (isLoading) {
    return (
      <section className="py-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          <p className="text-slate-500 font-bold">Memuat Data Monitoring...</p>
        </div>
      </section>
    );
  }

  if (!activeLog) return null;

  return (
    <section id="tracking" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
           <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Monitoring Konstruksi Real-Time</h2>
           <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
             Transparansi adalah kunci. Pantau progres pembangunan unit Bapak/Ibu secara langsung melalui dashboard ini.
           </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <img
                src={getOptimizedImageUrl(activeLog.imageUrl, 800)}
                alt={activeLog.description}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex flex-col justify-end p-8">
                 <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs mb-4 w-fit">
                    <Camera size={14} />
                    Update Lapangan Terkini
                 </div>
                 <h4 className="text-white font-bold text-xl mb-1">{activeLog.description}</h4>
                 <p className="text-emerald-100 text-sm">
                   {format(new Date(activeLog.date), 'EEEE, d MMMM yyyy', { locale: id })}
                 </p>
              </div>
            </motion.div>

            {/* Float progress bar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="absolute -bottom-6 right-8 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 w-64"
            >
               <div className="flex justify-between items-center mb-2">
                 <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Progres Keseluruhan</span>
                 <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{activeLog.percentage}%</span>
               </div>
               <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div
                   className="h-full bg-emerald-500 rounded-full"
                   style={{ width: `${activeLog.percentage}%` }}
                 />
               </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{project?.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-xs font-bold">{project?.location}</p>
            </div>

            <div className="space-y-6">
               {[
                 { name: 'Pembenahan Lahan (Land Clearing)', status: 'Selesai', date: 'Jan 2026', completed: true },
                 { name: 'Struktur Bawah & Pondasi', status: 'Selesai', date: 'Mar 2026', completed: true },
                 { name: 'Dinding & Rangka Atap', status: '75%', date: 'Mei 2026', completed: false },
                 { name: 'Finishing & Serah Terima', status: 'Belum Dimulai', date: 'Agu 2026', completed: false },
               ].map((milestone, idx) => (
                 <motion.div 
                   key={idx} 
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                   className="flex gap-4 items-start group"
                 >
                    <div className={milestone.completed ? "text-emerald-500" : "text-emerald-200 dark:text-emerald-900/50"}>
                      <CheckCircle size={24} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className={`font-bold text-sm ${milestone.completed ? 'text-slate-900 dark:text-slate-200' : 'text-slate-500 dark:text-slate-500'}`}>
                          {milestone.name}
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          milestone.completed ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500'
                        }`}>
                          {milestone.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                        <Calendar size={12} />
                        <span className="text-[10px] font-medium uppercase tracking-wider">Estimasi: {milestone.date}</span>
                      </div>
                    </div>
                 </motion.div>
               ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => setIsGalleryOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition-colors flex items-center gap-2"
              >
                <History size={16} />
                Lihat Galeri Lengkap
              </button>
              <button className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Hubungi Konsultan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGalleryOpen(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">Linimasa Pembangunan</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{project?.name} — {project?.location}</p>
                </div>
                <button 
                  onClick={() => setIsGalleryOpen(false)}
                  className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-12 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-0 sm:left-1/2 top-4 bottom-4 w-px bg-slate-100 dark:bg-slate-800 hidden sm:block -translate-x-1/2" />

                  {projectLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex flex-col sm:flex-row items-center gap-8 ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                    >
                      {/* Image Card */}
                      <div className="w-full sm:w-1/2">
                        <div className="group relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
                          <img 
                            src={getOptimizedImageUrl(log.imageUrl, 600)} 
                            alt={log.description} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                          <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                             <p className="text-[10px] font-black uppercase tracking-widest bg-emerald-500 w-fit px-2 py-0.5 rounded-md mb-1 shadow-lg">Progress {log.percentage}%</p>
                          </div>
                        </div>
                      </div>

                      {/* Content Point */}
                      <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-900 border-4 border-emerald-500 rounded-full z-10" />

                      {/* Info */}
                      <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? 'sm:text-left' : 'sm:text-right'}`}>
                        <div className={`inline-flex items-center gap-2 mb-2 ${index % 2 === 0 ? '' : 'sm:flex-row-reverse'}`}>
                          <Calendar size={14} className="text-emerald-500" />
                          <span className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            {format(new Date(log.date), 'MMMM yyyy', { locale: id })}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2 leading-tight">
                          {log.description}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                          Update terjadwal untuk memastikan standar kualitas pembangunan tetap terjaga sesuai spesifikasi akad.
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-20 text-center pb-10">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-3xl max-w-xl mx-auto border border-emerald-100 dark:border-emerald-900/30">
                    <CheckCircle className="mx-auto mb-4 text-emerald-500" size={32} />
                    <h5 className="text-lg font-black text-slate-900 dark:text-white mb-2 italic">"Kepercayaan Adalah Amanah Kami"</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Seluruh proses pembangunan diawasi langsung oleh tim ahli konstruksi dan pengawas syariah untuk memastikan ketepatan waktu dan kualitas material.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
