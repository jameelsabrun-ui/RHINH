import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, FileText, CheckCircle2, Lock, ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { getOptimizedImageUrl } from '../lib/utils';

const DOCUMENTS = [
  {
    id: 'imb-001',
    title: 'PBG (Persetujuan Bangunan Gedung)',
    number: 'No: 503/442/PBG/DPMPTSP/2023',
    description: 'Izin mendirikan bangunan resmi yang diterbitkan oleh pemerintah kota untuk proyek Grand Al-Ihsan Residence.',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop', // Placeholder for actual scan
    category: 'Izin Bangunan'
  },
  {
    id: 'shm-001',
    title: 'Sertifikat Hak Milik (SHM) - Split',
    number: 'No: 12.03.05.01.1.04321',
    description: 'Sertifikat lahan yang sudah dipecah per kavling, menjamin kepemilikan mutlak dan aman bagi setiap konsumen.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop', // Placeholder
    category: 'Kepemilikan Lahan'
  },
  {
    id: 'dps-001',
    title: 'Rekomendasi DPS-MUI',
    number: 'No: 005/R-DSN-MUI/VIII/2023',
    description: 'Sertifikasi kesesuaian syariah untuk seluruh akad transaksi yang diawasi langsung oleh Dewan Pengawas Syariah.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop', // Placeholder
    category: 'Syariah'
  }
];

export default function LegalityPage() {
  const [selectedDoc, setSelectedDoc] = React.useState<typeof DOCUMENTS[0] | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
      <SEO 
        title="Legalitas & Keamanan"
        description="Transparansi legalitas proyek Nur Holis Property. Cek sertifikat SHM, PBG/IMB, dan perizinan resmi lainnya di sini."
      />

      {/* Header Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-600/5 dark:bg-emerald-600/10 -skew-y-3 origin-left translate-y-12"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mb-6"
            >
              <ShieldCheck size={14} />
              100% Aman & Terverifikasi
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
            >
              Transparansi <span className="text-emerald-600">Legalitas</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-400"
            >
              Komitmen kami adalah memberikan ketenangan pikiran. Setiap unit yang kami pasarkan telah memiliki legalitas yang lengkap, bersih, dan sesuai dengan hukum yang berlaku di Indonesia.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* List of Documents */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="text-emerald-600" />
              Daftar Dokumen Resmi
            </h2>
            {DOCUMENTS.map((doc) => (
              <motion.button
                key={doc.id}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full group text-left p-6 rounded-3xl border transition-all ${
                  selectedDoc?.id === doc.id 
                    ? 'bg-emerald-600 border-emerald-500 shadow-xl shadow-emerald-600/20 text-white' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest mb-2 block ${
                  selectedDoc?.id === doc.id ? 'text-emerald-100' : 'text-emerald-600'
                }`}>
                  {doc.category}
                </span>
                <h3 className="font-bold leading-tight mb-1">{doc.title}</h3>
                <p className={`text-xs ${
                  selectedDoc?.id === doc.id ? 'text-emerald-50' : 'text-slate-500'
                }`}>
                  {doc.number}
                </p>
              </motion.button>
            ))}

            <div className="mt-12 p-8 rounded-[40px] bg-slate-900 dark:bg-slate-800 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Lock size={80} />
              </div>
              <h4 className="text-lg font-bold mb-2">Perlindungan Privasi</h4>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Demi keamanan data, dokumen yang ditampilkan di sini telah diberikan watermark dan sensor pada bagian sensitif. Hubungi kantor pemasaran untuk melihat dokumen asli secara langsung.
              </p>
              <a 
                href="https://wa.me/6281234567890?text=Halo%20Bapak%20Nur%20Holis%2C%20saya%20ingin%20menanyakan%20lebih%20lanjut%20mengenai%20legalitas%20proyek."
                className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
              >
                Tanya Konsultan <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Document Viewer */}
          <div className="lg:col-span-8">
            {selectedDoc ? (
              <motion.div
                key={selectedDoc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-[48px] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xl"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{selectedDoc.title}</h2>
                    <p className="text-emerald-600 font-bold">{selectedDoc.number}</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center gap-2">
                       <CheckCircle2 size={14} className="text-emerald-600" />
                       Valid Asli
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    "{selectedDoc.description}"
                  </p>
                </div>

                <div className="relative aspect-[1.414/1] bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-inner group">
                  <img 
                    src={getOptimizedImageUrl(selectedDoc.image, 1200)}
                    alt={`Scan ${selectedDoc.title}`}
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  />
                  {/* Security Watermark Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 select-none overflow-hidden">
                    <div className="uppercase font-black text-slate-900/10 text-4xl rotate-12 flex flex-wrap justify-center gap-12 scale-150">
                      {[...Array(20)].map((_, i) => (
                        <span key={i} className="whitespace-nowrap">NUR HOLIS PROPERTI - OFFICIAL COPY</span>
                      ))}
                    </div>
                  </div>
                  {/* Document Badge */}
                  <div className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Lock size={12} className="text-emerald-400" />
                    Preview Only
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <p className="text-xs text-slate-400 italic text-center max-w-md">
                    Scan di atas adalah representasi digital. Sertifikat asli dapat diverifikasi melalui Badan Pertanahan Nasional (BPN) menggunakan aplikasi Sentuh Tanahku.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-900/30 rounded-[48px] border-4 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-6">
                  <FileText size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Pilih Dokumen Untuk Dilihat</h3>
                <p className="text-slate-500 max-w-sm">
                  Silakan pilih salah satu dokumen di panel sebelah kiri untuk melihat detail validitas dan pratinjau scan resminya.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
           <div className="flex flex-col items-center gap-2">
              <span className="font-black text-2xl tracking-tighter">BPN RI</span>
              <span className="text-[10px] uppercase font-bold tracking-widest">Terdaftar Resmi</span>
           </div>
           <div className="flex flex-col items-center gap-2">
              <span className="font-black text-2xl tracking-tighter">DPMPTSP</span>
              <span className="text-[10px] uppercase font-bold tracking-widest">Izin PBG Valid</span>
           </div>
           <div className="flex flex-col items-center gap-2">
              <span className="font-black text-2xl tracking-tighter">DSN MUI</span>
              <span className="text-[10px] uppercase font-bold tracking-widest">Sertifikasi Syariah</span>
           </div>
           <div className="flex flex-col items-center gap-2">
              <span className="font-black text-2xl tracking-tighter">HIMPERRA</span>
              <span className="text-[10px] uppercase font-bold tracking-widest">Anggota Resmi</span>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="p-12 md:p-20 rounded-[60px] bg-emerald-600 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">Masih Ragu dengan Legalitas Kami?</h2>
              <p className="text-emerald-50 text-lg mb-8 leading-relaxed">
                Kami siap mengajak Anda berkunjung ke kantor kami untuk melakukan pengecekan data secara langsung dan terbuka di hadapan notaris jika diperlukan.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://wa.me/6281234567890"
                  className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-xl shadow-emerald-950/20"
                >
                  Jadwalkan Pertemuan
                </a>
                <Link 
                  to="/properties"
                  className="bg-emerald-700/50 text-white border border-white/20 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700/70 transition-all"
                >
                  Lihat Unit Aman
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
               <div className="w-80 h-80 bg-white/10 rounded-[60px] flex items-center justify-center border border-white/20 backdrop-blur-sm -rotate-6">
                  <ShieldCheck size={160} className="text-white opacity-40" />
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
