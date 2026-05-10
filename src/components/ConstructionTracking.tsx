import { Camera, Calendar, CheckCircle } from 'lucide-react';
import { CONSTRUCTION_LOGS, PROPERTIES } from '../data';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function ConstructionTracking() {
  const activeLog = CONSTRUCTION_LOGS[0];
  const project = PROPERTIES.find(p => p.id === activeLog.projectId);

  return (
    <section id="tracking" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
           <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Monitoring Konstruksi Real-Time</h2>
           <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
             Transparansi adalah kunci. Pantau progres pembangunan unit Bapak/Ibu secara langsung melalui dashboard ini.
           </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
              <img
                src={activeLog.imageUrl}
                alt={activeLog.description}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex flex-col justify-end p-8">
                 <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs mb-4">
                    <Camera size={14} />
                    Update Lapangan Terkini
                 </div>
                 <h4 className="text-white font-bold text-xl mb-1">{activeLog.description}</h4>
                 <p className="text-emerald-100 text-sm">
                   {format(new Date(activeLog.date), 'EEEE, d MMMM yyyy', { locale: id })}
                 </p>
              </div>
            </div>

            {/* Float progress bar */}
            <div className="absolute -bottom-6 right-8 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 w-64">
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
            </div>
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
                 <div key={idx} className="flex gap-4 items-start group">
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
                 </div>
               ))}
            </div>

            <div className="flex gap-4 pt-4">
              <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20">
                Lihat Galeri Lengkap
              </button>
              <button className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700">
                Hubungi Konsultan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
