import React from 'react';
import Hero from '../components/Hero';
import PropertyList from '../components/PropertyList';
import ShariaCalculator from '../components/ShariaCalculator';
import ConstructionTracking from '../components/ConstructionTracking';
import FAQ from '../components/FAQ';
import VideoTestimonials from '../components/VideoTestimonials';
import ContactUs from '../components/ContactUs';
import SEO from '../components/SEO';
import FieldDocumentation from '../components/FieldDocumentation';

export default function Home() {
  return (
    <>
      <SEO 
        title="Hunian Berkah Tanpa Riba"
        description="Temukan properti syariah impian Anda bersama Nur Holis. Tanpa riba, tanpa denda, tanpa sita, dan akad yang diawasi Dewan Pengawas Syariah."
      />
      <Hero />

      {/* Feature Highlights Grid */}
      <div className="py-12 bg-emerald-50/50 dark:bg-slate-900/50 border-y border-emerald-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-xs md:text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">
          <div>Tanpa Riba</div>
          <div>Tanpa Denda</div>
          <div>Tanpa Sita</div>
          <div>Tanpa Akad Bermasalah</div>
        </div>
      </div>

      <FieldDocumentation />

      <PropertyList />
      <ShariaCalculator />
      <ConstructionTracking />
      <FAQ />
      <VideoTestimonials />
      <ContactUs />

      {/* Call to Action Section */}
      <section className="py-24 bg-emerald-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[150%] border-[40px] border-white rounded-full rotate-45" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
            Siap Memulai Langkah Berkah Anda Hari Ini?
          </h2>
          <p className="text-emerald-50 text-lg mb-12 max-w-2xl mx-auto">
            Konsultasikan kebutuhan hunian Bapak/Ibu secara gratis bersama Nur Holis. Dapatkan penawaran unit terbaik sebelum kehabisan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/6281234567890"
              className="bg-white text-emerald-600 px-10 py-5 rounded-2xl font-black text-lg transition-transform hover:scale-105 shadow-2xl"
            >
              Chat via WhatsApp
            </a>
            <a
              href="#calculator"
              className="bg-emerald-700 text-white border border-emerald-500/50 px-10 py-5 rounded-2xl font-black text-lg transition-colors hover:bg-emerald-800"
            >
              Simulasi Cicilan
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
