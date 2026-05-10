import { MessageSquare, Phone, MapPin, ShieldCheck, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                RH
              </div>
              <h2 className="text-xl font-bold text-white">Rumah Halal</h2>
            </div>
            <p className="text-sm leading-relaxed mb-8">
              Penyedia hunian islami terpercaya di Indonesia. Kami berkomitmen memberikan solusi properti yang berkah, transparan, dan sesuai syariat Islam.
            </p>
            <div className="flex gap-4">
              {[ 
                { name: 'Instagram', url: 'https://instagram.com/nurholis_property', icon: 'IG' }, 
                { name: 'LinkedIn', url: 'https://linkedin.com/in/nurholis', icon: 'LI' },
                { name: 'Facebook', url: '#', icon: 'FB' }, 
                { name: 'Youtube', url: '#', icon: 'YT' } 
              ].map(s => (
                <a 
                  key={s.name} 
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Kunjungi profil ${s.name} resmi kami`}
                  title={s.name}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <span className="text-[10px] font-black">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
             <h3 className="text-white font-bold mb-6">Layanan</h3>
             <ul className="space-y-4 text-sm">
               <li><Link to="/properties" className="hover:text-white transition-colors focus:outline-none focus:underline">Listing Properti</Link></li>
               <li><Link to="/calculator" className="hover:text-white transition-colors focus:outline-none focus:underline">Kalkulator Murabahah</Link></li>
               <li><Link to="/legality" className="hover:text-white transition-colors focus:outline-none focus:underline">Legalitas & Keamanan</Link></li>
               <li><a href="#tracking" className="hover:text-white transition-colors focus:outline-none focus:underline">Monitoring Proyek</a></li>
             </ul>
          </div>

          <div>
             <h3 className="text-white font-bold mb-6">Kantor Pusat</h3>
             <ul className="space-y-4 text-sm">
               <li className="flex gap-3">
                 <MapPin size={18} className="text-emerald-500 shrink-0" />
                 <span>Jl. Properti Syariah No. 123, Jakarta Selatan, 12345</span>
               </li>
               <li className="flex gap-3">
                 <Phone size={18} className="text-emerald-500 shrink-0" />
                 <span>(021) 1234-5678</span>
               </li>
               <li className="flex gap-3">
                 <Mail size={18} className="text-emerald-500 shrink-0" />
                 <span>halo@rumahhalal.co.id</span>
               </li>
             </ul>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-500" />
              Sertifikat Halal
            </h3>
            <p className="text-xs leading-relaxed mb-6">
              Seluruh akad dan proses bisnis diawasi oleh Dewan Pengawas Syariah (DPS) dengan standar DSN-MUI.
            </p>
            <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-white/5">
              <div className="relative group" role="img" aria-label="Logo Sertifikasi Dewan Pengawas Syariah">
                <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full group-hover:bg-emerald-500/30 transition-all"></div>
                <svg width="48" height="48" viewBox="0 0 100 100" className="relative group-hover:rotate-12 transition-transform duration-500">
                  <title>Sertifikat Resmi DPS-MUI</title>
                  <circle cx="50" cy="50" r="48" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
                  <circle cx="50" cy="50" r="42" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                  <path d="M50 20 L55 35 L75 35 L60 45 L65 60 L50 50 L35 60 L40 45 L25 35 L45 35 Z" fill="#10b981" />
                  <text x="50" y="75" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900" fontFamily="sans-serif">DPS-MUI</text>
                  <text x="50" y="85" textAnchor="middle" fill="#10b981" fontSize="6" fontWeight="bold" fontFamily="sans-serif">CERTIFIED</text>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white uppercase tracking-widest mb-0.5">Official Certification</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">No: 2024/RHI-DPS/VIII</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
          <p>© 2026 Nur Holis x RumahHalal.id. Seluruh hak cipta dilindungi.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white">Kebijakan Privasi</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
