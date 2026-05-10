import React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Apa perbedaan properti syariah di Rumah Halal dengan KPR Bank?",
    answer: "Properti syariah kami menggunakan skema langsung ke developer atau lembaga keuangan syariah tanpa bunga majemuk. Tidak ada denda keterlambatan, tidak ada sita paksa jika nasabah kesulitan, dan tidak ada akad bathil yang merugikan salah satu pihak."
  },
  {
    question: "Bagaimana jika saya terlambat membayar cicilan?",
    answer: "Kami tidak memberlakukan denda bunga. Jika keterlambatan terjadi karena kesulitan ekonomi nyata, kami akan memberikan kelonggaran waktu (rescheduling) atau solusi lain yang disepakati bersama secara kekeluargaan sesuai prinsip syariah."
  },
  {
    question: "Apakah legalitas surat-surat (SHM/SHGB) terjamin?",
    answer: "Ya, setiap proyek kami hanya dipasarkan jika legalitas lahan sudah aman. Konsumen dapat melakukan pengecekan langsung terhadap sertifikat induk maupun izin-izin pembangunan (PBG/IMB) sebelum melakukan tanda tangan akad."
  },
  {
    question: "Berapa lama masa inden pembangunan rumah?",
    answer: "Masa pembangunan bervariasi antara 6 hingga 12 bulan tergantung pada tipe unit dan lokasi proyek. Progress pembangunan dapat dipantau setiap saat melalui dashboard monitoring online di website ini."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-1 rounded-full text-xs font-bold mb-4">
            <HelpCircle size={14} />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Hal yang Sering Ditanyakan</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Dapatkan jawaban cepat untuk pertanyaan umum seputar kepemilikan hunian syariah.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(prev => prev === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                id={`faq-toggle-${idx}`}
              >
                <span className="font-bold text-slate-800 dark:text-slate-100 pr-8">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  className="text-emerald-600 dark:text-emerald-400"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
