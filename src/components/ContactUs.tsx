import React from 'react';
import { Send, User, Mail, MessageSquare, Tag, Phone, Award, ShieldCheck, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.name) newErrors.name = 'Nama wajib diisi';
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.phone) newErrors.phone = 'Nomor WhatsApp wajib diisi';
    if (!formData.subject) newErrors.subject = 'Subjek wajib diisi';
    if (!formData.message) newErrors.message = 'Pesan wajib diisi';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Use Formspree for handling form submissions
      // Instructions: Create a form at https://formspree.io/ and put the Form ID in .env
      const formspreeId = import.meta.env.VITE_FORMSPREE_ID || 'xpznayye'; // Fallback to a demo ID if not set
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _subject: `Pesan Baru dari ${formData.name}: ${formData.subject}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim pesan');
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      // Reset success after 5 seconds
      setTimeout(() => setIsSuccess(false), 8000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsSubmitting(false);
      // You could add a toast here for error
    }
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-1 rounded-full text-xs font-bold mb-4">
                <Mail size={14} />
                Hubungi Kami
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">Punya Pertanyaan Spesifik?</h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                Tim Rumah Halal Indonesia siap membantu Bapak/Ibu memberikan konsultasi terbaik mengenai properti syariah. Silakan isi formulir di samping, kami akan merespons dalam waktu 1x24 jam.
              </p>
            </div>

            <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Konsultan Senior</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Bertemu langsung dengan Bapak Nur Holis untuk konsultasi mendalam.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Respon Cepat</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Layanan chat WhatsApp aktif setiap hari pukul 08.00 - 20.00 WIB.</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-8 md:p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <User size={14} className="text-emerald-500" />
                         Nama Lengkap
                       </label>
                       <input
                         required
                         name="name"
                         type="text"
                         value={formData.name}
                         onChange={handleChange}
                         placeholder="Contoh: Ahmad"
                         className={cn(
                           "w-full bg-white dark:bg-slate-800 border-2 rounded-2xl py-4 px-6 text-sm font-medium transition-all outline-none text-slate-900 dark:text-white",
                           errors.name ? "border-rose-500 focus:border-rose-500" : "border-transparent focus:border-emerald-500"
                         )}
                       />
                       {errors.name && <p className="text-rose-500 text-[10px] font-bold px-2">{errors.name}</p>}
                     </div>

                     <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <Mail size={14} className="text-emerald-500" />
                         Email Aktif
                       </label>
                       <input
                         required
                         name="email"
                         type="email"
                         value={formData.email}
                         onChange={handleChange}
                         placeholder="ahmad@email.com"
                         className={cn(
                           "w-full bg-white dark:bg-slate-800 border-2 rounded-2xl py-4 px-6 text-sm font-medium transition-all outline-none text-slate-900 dark:text-white",
                           errors.email 
                             ? "border-rose-500 focus:border-rose-500" 
                             : "border-transparent focus:border-emerald-500"
                         )}
                       />
                       <AnimatePresence>
                         {errors.email && (
                           <motion.p 
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             exit={{ opacity: 0, height: 0 }}
                             className="text-rose-500 text-[10px] font-bold px-2"
                           >
                             {errors.email}
                           </motion.p>
                         )}
                       </AnimatePresence>
                     </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <Phone size={14} className="text-emerald-500" />
                         Nomor WhatsApp
                       </label>
                       <input
                         required
                         name="phone"
                         type="tel"
                         value={formData.phone}
                         onChange={handleChange}
                         placeholder="0812..."
                         className={cn(
                           "w-full bg-white dark:bg-slate-800 border-2 rounded-2xl py-4 px-6 text-sm font-medium transition-all outline-none text-slate-900 dark:text-white",
                           errors.phone ? "border-rose-500 focus:border-rose-500" : "border-transparent focus:border-emerald-500"
                         )}
                       />
                       {errors.phone && <p className="text-rose-500 text-[10px] font-bold px-2">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <Tag size={14} className="text-emerald-500" />
                         Subjek
                       </label>
                       <input
                         required
                         name="subject"
                         type="text"
                         value={formData.subject}
                         onChange={handleChange}
                         placeholder="Pertanyaan unit, akad, dll."
                         className={cn(
                           "w-full bg-white dark:bg-slate-800 border-2 rounded-2xl py-4 px-6 text-sm font-medium transition-all outline-none text-slate-900 dark:text-white",
                           errors.subject ? "border-rose-500 focus:border-rose-500" : "border-transparent focus:border-emerald-500"
                         )}
                       />
                       {errors.subject && <p className="text-rose-500 text-[10px] font-bold px-2">{errors.subject}</p>}
                    </div>

                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <MessageSquare size={14} className="text-emerald-500" />
                       Pesan
                     </label>
                     <textarea
                       required
                       name="message"
                       rows={4}
                       value={formData.message}
                       onChange={handleChange}
                       placeholder="Tuliskan detail pertanyaan Bapak/Ibu di sini..."
                       className={cn(
                         "w-full bg-white dark:bg-slate-800 border-2 rounded-2xl py-4 px-6 text-sm font-medium transition-all outline-none resize-none text-slate-900 dark:text-white",
                         errors.message ? "border-rose-500 focus:border-rose-500" : "border-transparent focus:border-emerald-500"
                       )}
                     />
                     {errors.message && <p className="text-rose-500 text-[10px] font-bold px-2">{errors.message}</p>}
                   </div>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        Kirim Pesan
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pesan Terkirim!</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Terima kasih telah menghubungi kami. Tim konsultan Nur Holis akan segera menghubungi Bapak/Ibu melalui email atau WhatsApp.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-8 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:underline"
                  >
                    Kirim pesan lain
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nur Holis Profile Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-slate-900 rounded-[50px] p-8 md:p-16 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-32 -mb-32" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4 flex justify-center lg:justify-start">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-[40px] overflow-hidden border-4 border-emerald-500/30">
                  <img 
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" 
                    alt="Bapak Nur Holis" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-emerald-500 p-4 rounded-3xl shadow-xl">
                  <Award size={32} className="text-white" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold mb-6">
                <ShieldCheck size={16} />
                Founder & Principal Consultant
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6 font-display italic">
                Nur Holis, <span className="text-emerald-500">M.E.I.</span>
              </h3>
              <p className="text-slate-400 dark:text-slate-300 text-lg leading-relaxed mb-8 max-w-3xl">
                Sebagai praktisi properti syariah selama lebih dari 10 tahun, saya berkomitmen membantu ummat memiliki hunian impian tanpa melalui jalur ribawi. Fokus kami bukan sekadar menjual rumah, melainkan membangun peradaban islami melalui kepemilikan aset yang berkah dan halal.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <p className="text-emerald-500 font-black text-2xl">10+</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Tahun Pengalaman</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <p className="text-emerald-500 font-black text-2xl">500+</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Keluarga Terbantu</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <p className="text-emerald-500 font-black text-2xl">12</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Proyek Sukses</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <p className="text-emerald-500 font-black text-2xl">100%</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Murni Syariah</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 border border-white/10">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Konsultasi WhatsApp</p>
                    <p className="text-white font-bold">+62 812 3456 7890</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 border border-white/10">
                    <Instagram size={20} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Instagram Profil</p>
                    <p className="text-white font-bold">@nurholis.official</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://wa.me/6281234567890" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all"
                >
                  <MessageSquare size={18} />
                  Live Chat Konsultasi
                </a>
                <a 
                  href="mailto:nur.holis@rumahhalal.id"
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all border border-white/10"
                >
                  <Mail size={18} />
                  Email Langsung
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
