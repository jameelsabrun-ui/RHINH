import { MessageSquare, Phone, MapPin, ShieldCheck, Mail } from 'lucide-react';

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
              {[ 'Facebook', 'Instagram', 'Youtube' ].map(s => (
                <div key={s} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all cursor-pointer">
                  <span className="sr-only">{s}</span>
                  <div className="w-4 h-4 bg-current rounded-sm" />
                </div>
              ))}
            </div>
          </div>

          <div>
             <h3 className="text-white font-bold mb-6">Layanan</h3>
             <ul className="space-y-4 text-sm">
               <li><a href="#properties" className="hover:text-white">Listing Properti</a></li>
               <li><a href="#calculator" className="hover:text-white">Kalkulator Murabahah</a></li>
               <li><a href="#home" className="hover:text-white">Konsultasi Syariah</a></li>
               <li><a href="#tracking" className="hover:text-white">Monitoring Proyek</a></li>
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
            <div className="w-full aspect-[4/1] bg-slate-800 rounded-lg flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Certified Syariah</span>
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

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/6281234567890?text=Halo%20Bapak%20Nur%20Holis%2C%20saya%20ingin%20konsultasi%20mengenai%20properti%20syariah."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-500 transition-all hover:scale-110 flex items-center gap-3 animate-bounce"
      >
        <MessageSquare size={24} />
        <span className="hidden md:inline font-bold">Butuh Bantuan?</span>
      </a>
    </footer>
  );
}
