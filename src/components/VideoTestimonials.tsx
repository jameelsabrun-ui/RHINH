import React from 'react';
import { Play, Quote, User, Sparkles, Loader2, Video, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

interface Testimonial {
  id: string;
  name: string;
  quote: string;
  videoUrl: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Bapak Hendra & Ibu Maya',
    quote: 'Alhamdulillah, prosesnya sangat transparan dan sesuai syariah. Kami merasa tenang mencicil rumah tanpa takut riba.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 't2',
    name: 'Ustadz Ahmad Fauzi',
    quote: 'Membangun hunian yang berkah dimulai dari akad yang bersih. Saya sangat merekomendasikan layanan Nur Holis.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 't3',
    name: 'Ibu Siti Khadijah',
    quote: 'Rumah Halal benar-benar memberikan kemudahan bagi keluarga kami. Kualitas bangunan juga sangat memuaskan.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  }
];

export default function VideoTestimonials() {
  const [generatedVideos, setGeneratedVideos] = React.useState<Record<string, string>>({});
  const [generatingStatus, setGeneratingStatus] = React.useState<Record<string, string>>({});
  const [generatedImages, setGeneratedImages] = React.useState<Record<string, string>>({});
  const [imageGeneratingStatus, setImageGeneratingStatus] = React.useState<Record<string, string>>({});

  const handleGenerateImage = async (testimonial: Testimonial) => {
    try {
      // 1. Check/Select API Key
      // @ts-ignore - window.aistudio is injected environment
      if (!(await window.aistudio.hasSelectedApiKey())) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }

      setImageGeneratingStatus(prev => ({ ...prev, [testimonial.id]: 'Initializing...' }));

      // 2. Initialize Gemini API
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY; 
      if (!apiKey) {
        throw new Error('API Key is required for image generation.');
      }
      
      const ai = new GoogleGenAI({ apiKey });

      setImageGeneratingStatus(prev => ({ ...prev, [testimonial.id]: 'Generating Image...' }));

      // 3. Generate Image using Imagen
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A beautiful, high-quality cinematic architectural photograph capturing the essence of this testimonial: "${testimonial.quote}". 
                The scene should show a peaceful, modern sharia-compliant residential home area in Indonesia with warm, golden hour sunlight, lush greenery, and a sense of family happiness and spiritual peace. 
                Professional photography, 8k, highly detailed.`,
        config: {
          numberOfImages: 1,
          aspectRatio: '16:9'
        }
      });

      const base64Data = response.generatedImages?.[0]?.image?.imageBytes;
      if (!base64Data) throw new Error('No image data returned');

      const imageUrl = `data:image/png;base64,${base64Data}`;

      setGeneratedImages(prev => ({ ...prev, [testimonial.id]: imageUrl }));
      setImageGeneratingStatus(prev => ({ ...prev, [testimonial.id]: '' }));

    } catch (error: any) {
      console.error('Image Generation Error:', error);
      setImageGeneratingStatus(prev => ({ ...prev, [testimonial.id]: '' }));
      alert(`Gagal membuat gambar: ${error.message || 'Terjadi kesalahan sistem'}`);
    }
  };

  const handleGenerateVideo = async (testimonial: Testimonial) => {
    try {
      // 1. Check/Select API Key
      // @ts-ignore - window.aistudio is injected environment
      if (!(await window.aistudio.hasSelectedApiKey())) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }

      setGeneratingStatus(prev => ({ ...prev, [testimonial.id]: 'Initializing...' }));

      // 2. Initialize Gemini API (Always new instance per core requirement)
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY; 
      if (!apiKey) {
        throw new Error('API Key is required for video generation. Please select a paid key.');
      }
      
      const ai = new GoogleGenAI({ apiKey });

      setGeneratingStatus(prev => ({ ...prev, [testimonial.id]: 'Generating Video...' }));

      // 3. Generate Video
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: `High-quality cinematic testimonial video for a sharia housing project. 
                Visual theme: Professional stock-footage style showing a happy family in a bright, modern, peaceful home. 
                Text overlay: "${testimonial.name}"
                Icon overlay: A house with a heart.
                Mood: Peaceful, blessed, and prosperous. 
                Represent this quote visually: "${testimonial.quote}"`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      // 4. Poll for completion
      while (!operation.done) {
        setGeneratingStatus(prev => ({ ...prev, [testimonial.id]: 'Processing (may take 2-3 mins)...' }));
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
        
        // Handle potential failure in status
        if (operation.error) {
           throw new Error((operation.error.message as string) || 'Video generation failed');
        }
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error('No video URI returned');

      setGeneratingStatus(prev => ({ ...prev, [testimonial.id]: 'Finalizing...' }));

      // 5. Fetch the video using the API key
      const response = await fetch(downloadLink, {
        method: 'GET',
        headers: {
          'x-goog-api-key': apiKey,
        },
      });

      if (!response.ok) throw new Error('Failed to download generated video');

      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);

      setGeneratedVideos(prev => ({ ...prev, [testimonial.id]: videoUrl }));
      setGeneratingStatus(prev => ({ ...prev, [testimonial.id]: '' }));

    } catch (error: any) {
      console.error('Video Generation Error:', error);
      setGeneratingStatus(prev => ({ ...prev, [testimonial.id]: '' }));
      alert(`Gagal membuat video: ${error.message || 'Terjadi kesalahan sistem'}`);
      
      // Handle the "Requested entity was not found" error by prompting for key again
      if (error.message?.includes('Requested entity was not found')) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
    }
  };

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-widest"
          >
            <Play size={14} className="fill-emerald-700 dark:fill-emerald-400" />
            Testimoni Video AI
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 italic font-serif"
          >
            Kisah Berkah Penghuni
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium"
          >
            Dengarkan langsung pengalaman para penghuni. Anda juga dapat menggunakan teknologi AI Veo untuk memvisualisasikan testimoni mereka.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => {
            const isGenerating = !!generatingStatus[t.id];
            const isImageGenerating = !!imageGeneratingStatus[t.id];
            const currentVideoUrl = generatedVideos[t.id] || t.videoUrl;
            const isGenerated = !!generatedVideos[t.id];
            const currentImageUrl = generatedImages[t.id];

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="group flex flex-col h-full bg-slate-50 dark:bg-slate-900 rounded-[40px] overflow-hidden border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:shadow-2xl hover:-translate-y-2 relative"
                id={`testimonial-${t.id}`}
              >
                {/* Video Player Container */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden shadow-inner group/video">
                  {isGenerating ? (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90 gap-4 p-6 text-center">
                      <Loader2 className="animate-spin text-emerald-500" size={40} />
                      <div className="space-y-2">
                        <p className="text-white font-bold animate-pulse text-sm">Sedang Menghasilkan Video AI...</p>
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest">{generatingStatus[t.id]}</p>
                      </div>
                    </div>
                  ) : isGenerated ? (
                    <video 
                      src={currentVideoUrl}
                      controls
                      className="w-full h-full object-cover"
                      poster={t.videoUrl.includes('youtube') ? `https://img.youtube.com/vi/${t.videoUrl.split('/').pop()?.split('?')[0]}/maxresdefault.jpg` : undefined}
                    />
                  ) : (
                    <iframe
                      className="w-full h-full"
                      src={currentVideoUrl}
                      title={`Testimonial from ${t.name}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}

                  {!isGenerating && (
                    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2 items-end opacity-0 group-hover/video:opacity-100 translate-y-2 group-hover/video:translate-y-0 transition-all">
                      <button 
                        onClick={() => handleGenerateVideo(t)}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg transition-all"
                      >
                        <Video size={12} />
                        {isGenerated ? 'Regenerate Video AI' : 'Generate Video AI'}
                      </button>
                      <button 
                        onClick={() => handleGenerateImage(t)}
                        disabled={isImageGenerating}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg transition-all",
                          isImageGenerating ? "bg-slate-700 text-slate-400" : "bg-blue-600 hover:bg-blue-500 text-white"
                        )}
                      >
                        {isImageGenerating ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <ImageIcon size={12} />
                        )}
                        {currentImageUrl ? 'Regenerate Essence' : 'Generate Essence'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-10 flex-grow flex flex-col relative overflow-hidden">
                  {/* AI Generated Background Essence */}
                  <AnimatePresence>
                    {currentImageUrl && (
                      <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.15, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="absolute inset-0 z-0 pointer-events-none"
                      >
                        <img 
                          src={currentImageUrl} 
                          alt="AI Essence" 
                          className="w-full h-full object-cover grayscale"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-slate-50/40 to-slate-50 dark:from-slate-900/80 dark:via-slate-900/40 dark:to-slate-900" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative z-10">
                    <div className="mb-8 opacity-10 dark:opacity-20 text-emerald-600 dark:text-emerald-400">
                      <Quote size={48} className="fill-emerald-600 dark:fill-emerald-400" />
                    </div>
                  
                  <p className="text-slate-700 dark:text-slate-300 font-medium italic mb-8 leading-relaxed flex-grow text-lg">
                    "{t.quote}"
                  </p>

                  <div className="flex items-center gap-4 mt-auto pt-8 border-t border-slate-200 dark:border-slate-800">
                     <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-700 dark:text-emerald-400 shadow-inner group-hover:scale-110 transition-transform">
                       <User size={28} />
                     </div>
                     <div>
                       <h4 className="font-bold text-slate-900 dark:text-white text-lg">{t.name}</h4>
                       <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">Penghuni Rumah Halal</p>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
