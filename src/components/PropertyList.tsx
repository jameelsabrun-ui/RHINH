import React from 'react';
import { MapPin, ArrowRight, Home, CheckCircle2, Shield, Users, Landmark, Filter, X, Info, Heart, Search, Image as ImageIcon, ChevronLeft, ChevronRight, MessageCircle, Share2, Copy, Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { formatCurrency, cn, getOptimizedImageUrl } from '../lib/utils';
import { calculateMurabahah } from '../lib/sharia-logic';
import { Property, Review } from '../types';
import { Link } from 'react-router-dom';
import { propertyService } from '../services/propertyService';

const MOCK_REVIEWS: Review[] = [
  { id: 'r1', propertyId: 'p1', userName: 'Ahmad Faisal', rating: 5, comment: 'Lingkungannya sangat islami dan tenang. Masjidnya bagus sekali.', date: '2026-04-20' },
  { id: 'r2', propertyId: 'p1', userName: 'Siti Aminah', rating: 4, comment: 'Unitnya rapi, progress pembangunan cepat. Sangat merekomendasikan.', date: '2026-05-01' },
  { id: 'r3', propertyId: 'p2', userName: 'Budi Santoso', rating: 5, comment: 'Skema syariahnya bener-bener tanpa riba. Tenang banget hati ini.', date: '2026-04-15' },
  { id: 'r4', propertyId: 'p3', userName: 'Hj. Maryam', rating: 5, comment: 'Udara di sini sejuk sekali, cocok untuk pensiun.', date: '2026-03-22' },
  { id: 'r5', propertyId: 'p4', userName: 'Irwan Yusuf', rating: 4, comment: 'View lembahnya luar biasa, anak-anak betah main di taman penahan.', date: '2026-05-05' },
];

const FeatureIcon = ({ feature }: { feature: string }) => {
  const f = feature.toLowerCase();
  if (f.includes('masjid') || f.includes('kajian')) return <Landmark size={14} className="text-emerald-500" />;
  if (f.includes('cctv') || f.includes('keamanan') || f.includes('security')) return <Shield size={14} className="text-emerald-500" />;
  if (f.includes('taman') || f.includes('bermain') || f.includes('panahan')) return <Users size={14} className="text-emerald-500" />;
  return <CheckCircle2 size={14} className="text-emerald-500" />;
};

const PropertySkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse">
    <div className="h-64 bg-slate-200 dark:bg-slate-800" />
    <div className="p-6">
      <div className="flex items-center gap-1 mb-2">
        <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
      <div className="w-48 h-6 bg-slate-200 dark:bg-slate-800 rounded mb-3" />
      <div className="space-y-2 mb-4">
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="w-3/4 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <div className="w-20 h-2 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="w-8 h-2 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full" />
      </div>
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        ))}
      </div>
      <div className="w-full h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4" />
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className="space-y-2">
          <div className="w-12 h-2 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="w-24 h-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg mt-1" />
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="w-24 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export default function PropertyList() {
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<'all' | 'available' | 'reserved' | 'sold' | 'favorites' | 'rating'>('all');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [locationFilter, setLocationFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null);
  const [galleryProperty, setGalleryProperty] = React.useState<Property | null>(null);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>(() => {
    const saved = localStorage.getItem('rh_reviews');
    if (saved) return JSON.parse(saved);
    return MOCK_REVIEWS;
  });
  const [newReview, setNewReview] = React.useState({ rating: 5, comment: '', userName: '' });
  const [reviewSubmitted, setReviewSubmitted] = React.useState(false);
  const [minPrice, setMinPrice] = React.useState<number>(0);
  const [maxPrice, setMaxPrice] = React.useState<number>(2000000000); // 2 Billion default max

  const recommendations = React.useMemo(() => {
    if (!selectedProperty || properties.length === 0) return [];
    return properties
      .filter(p => p.id !== selectedProperty.id)
      .sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;
        
        if (a.location === selectedProperty.location) scoreA += 2;
        if (a.type === selectedProperty.type) scoreA += 1;
        
        if (b.location === selectedProperty.location) scoreB += 2;
        if (b.type === selectedProperty.type) scoreB += 1;
        
        return scoreB - scoreA;
      })
      .slice(0, 3);
  }, [selectedProperty]);

  // Load favorites from local storage
  React.useEffect(() => {
    const savedFavorites = localStorage.getItem('rh_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  // Save favorites to local storage
  React.useEffect(() => {
    localStorage.setItem('rh_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save reviews to local storage
  React.useEffect(() => {
    localStorage.setItem('rh_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Fetch properties from Supabase
  React.useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      const data = await propertyService.getProperties();
      setProperties(data);
      setIsLoading(false);
    };
    fetchProperties();
  }, []);

  const calculateEstimatedInstallment = (price: number) => {
    // Standard Sharia Housing defaults: 20% DP, 8% Annual Margin, 10 Years Tenor
    const result = calculateMurabahah(price, price * 0.2, 8, 10);
    return result.monthlyInstallment;
  };

  const [showCopiedBadge, setShowCopiedBadge] = React.useState(false);

  const handleShare = async (property: Property) => {
    const shareData = {
      title: `Rumah Halal - ${property.name}`,
      text: `Cek hunian syariah ${property.name} di ${property.location}. Harga mulai ${formatCurrency(property.price)}.`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text} \n\nLihat detailnya di: ${shareData.url}`);
        setShowCopiedBadge(true);
        setTimeout(() => setShowCopiedBadge(false), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const getPropertyStats = (propertyId: string) => {
    const propertyReviews = reviews.filter(r => r.propertyId === propertyId);
    if (propertyReviews.length === 0) return { avg: 0, count: 0, label: 'Bintang Terpopuler' };
    const sum = propertyReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / propertyReviews.length).toFixed(1));
    return { 
      avg, 
      count: propertyReviews.length,
      label: avg >= 4.5 ? 'Sangat Direkomendasikan' : 'Unit Favorit'
    };
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty || !newReview.userName || !newReview.comment) return;

    const review: Review = {
      id: `r-${Date.now()}`,
      propertyId: selectedProperty.id,
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews(prev => [review, ...prev]);
    setNewReview({ rating: 5, comment: '', userName: '' });
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const nextImage = () => {
    if (galleryProperty) {
      setActiveImageIndex((prev) => (prev + 1) % galleryProperty.images.length);
    }
  };

  const prevImage = () => {
    if (galleryProperty) {
      setActiveImageIndex((prev) => (prev - 1 + galleryProperty.images.length) % galleryProperty.images.length);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!galleryProperty) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setGalleryProperty(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryProperty]);

  const propertyTypes = React.useMemo(() => {
    const types = Array.from(new Set(properties.map(p => p.type)));
    return ['all', ...types];
  }, [properties]);

  const locations = React.useMemo(() => {
    const uniqueLocations = Array.from(new Set(properties.map(p => p.location)));
    return ['all', ...uniqueLocations];
  }, [properties]);

  const resetFilters = () => {
    setFilter('all');
    setTypeFilter('all');
    setLocationFilter('all');
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(2000000000);
  };

  const filteredProperties = properties.filter(p => {
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'favorites' 
        ? favorites.includes(p.id) 
        : p.status === filter;
    
    const matchesType = typeFilter === 'all' ? true : p.type === typeFilter;
    
    const matchesLocation = locationFilter === 'all' ? true : p.location === locationFilter;
    
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;

    return matchesFilter && matchesType && matchesLocation && matchesSearch && matchesPrice;
  });

  const filterOptions = [
    { label: 'Semua', value: 'all' },
    { label: 'Tersedia', value: 'available' },
    { label: 'Reserved', value: 'reserved' },
    { label: 'Terjual', value: 'sold' },
    { label: 'Favorit', value: 'favorites' },
    { label: 'Rating Tertinggi', value: 'rating' },
  ];

  const sortedProperties = React.useMemo(() => {
    const list = [...filteredProperties];
    if (filter === 'rating') {
      return list.sort((a, b) => getPropertyStats(b.id).avg - getPropertyStats(a.id).avg);
    }
    return list;
  }, [filteredProperties, filter, reviews]);

  return (
    <section id="properties" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Unit Eksklusif RHI</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-xl text-lg">
              Pilihan hunian syariah terbaik di lokasi strategis yang memberikan ketenangan hati bagi keluarga Bapak/Ibu.
            </p>
          </div>
          <button 
            onClick={resetFilters}
            className="text-emerald-600 font-bold flex items-center gap-2 group"
          >
            Lihat Semua Unit
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="relative max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cari hunian impian berdasarkan nama unit atau lokasi (contoh: 'Dago', 'Cluster A')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 rounded-[20px] py-4 pl-14 pr-6 text-base font-medium transition-all outline-none shadow-sm focus:shadow-emerald-100 dark:focus:shadow-emerald-900/20 text-slate-900 dark:text-white"
            />
          </div>
        </motion.div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-6 mb-12">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-slate-400 mr-2">
                <Filter size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">Status:</span>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl" role="tablist" aria-label="Filter Status Properti">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    role="tab"
                    aria-selected={filter === opt.value}
                    onClick={() => setFilter(opt.value as any)}
                    className={cn(
                      "px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500",
                      filter === opt.value 
                        ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-400 mr-2">
                <MapPin size={18} aria-hidden="true" />
                <span className="text-sm font-bold uppercase tracking-wider">Lokasi:</span>
              </div>
              <select
                value={locationFilter}
                aria-label="Pilih Lokasi"
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl py-2 px-4 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none transition-all cursor-pointer focus:ring-2 focus:ring-emerald-500"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc} className="dark:bg-slate-900">
                    {loc === 'all' ? 'Semua Lokasi' : loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-400 mr-2">
                <Home size={18} aria-hidden="true" />
                <span className="text-sm font-bold uppercase tracking-wider">Tipe:</span>
              </div>
              <select
                value={typeFilter}
                aria-label="Pilih Tipe Properti"
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl py-2 px-4 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none transition-all cursor-pointer focus:ring-2 focus:ring-emerald-500"
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type} className="dark:bg-slate-900">
                    {type === 'all' ? 'Semua Tipe' : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="flex items-center gap-4 py-2 border-t md:border-t-0 md:py-0 border-slate-100 dark:border-slate-800 w-full lg:w-auto">
              <div className="flex items-center gap-2 text-slate-400 mr-2">
                <Landmark size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">Harga (Juta):</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">Min</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPrice / 1000000 || ''}
                    onChange={(e) => setMinPrice(Number(e.target.value) * 1000000)}
                    className="w-28 bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-xl py-2 pl-10 pr-3 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none transition-all"
                  />
                </div>
                <span className="text-slate-300 dark:text-slate-500">—</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">Max</span>
                  <input
                    type="number"
                    placeholder="2000"
                    value={maxPrice / 1000000 || ''}
                    onChange={(e) => setMaxPrice(Number(e.target.value) * 1000000)}
                    className="w-28 bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-xl py-2 pl-10 pr-3 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Reset Button */}
            {(filter !== 'all' || typeFilter !== 'all' || locationFilter !== 'all' || searchQuery !== '' || minPrice !== 0 || maxPrice !== 2000000000) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={resetFilters}
                className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-all group"
              >
                <X size={14} className="group-hover:rotate-90 transition-transform" />
                Reset Filter
              </motion.button>
            )}
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <motion.a
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-600/20 group"
          >
            <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
            Konsultasi Hunian Gratis
          </motion.a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading-skeletons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="col-span-full grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <PropertySkeleton key={`skeleton-${i}`} />
                ))}
              </motion.div>
            ) : sortedProperties.length > 0 ? (
              <motion.div
                key="property-results"
                initial="hidden"
                animate="show"
                exit={{ opacity: 0 }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08
                    }
                  }
                }}
                className="col-span-full grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {sortedProperties.map((property) => {
                  const stats = getPropertyStats(property.id);
                  return (
                    <motion.div 
                      key={property.id} 
                      layout
                      variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.98 },
                        show: { opacity: 1, y: 0, scale: 1 }
                      }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={getOptimizedImageUrl(property.image, 600)}
                          alt={property.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Favorite Button */}
                        <button
                          onClick={(e) => toggleFavorite(property.id, e)}
                          className={cn(
                            "absolute top-4 left-4 z-10 w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-all shadow-md group/heart",
                            favorites.includes(property.id) 
                              ? "bg-rose-50 dark:bg-rose-950/30 text-rose-500" 
                              : "bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white hover:text-rose-500"
                          )}
                          title={favorites.includes(property.id) ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                        >
                          <Heart 
                            size={20} 
                            className={cn(
                              "transition-all duration-300",
                              favorites.includes(property.id) ? "fill-rose-500 scale-110" : "group-hover/heart:scale-110"
                            )} 
                          />
                        </button>
        
                        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                          <span className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 backdrop-blur-md",
                            property.status === 'available' && "bg-emerald-500/90 text-white",
                            property.status === 'reserved' && "bg-amber-500/90 text-white",
                            property.status === 'sold' && "bg-rose-500/90 text-white"
                          )}>
                            {property.status === 'available' && <CheckCircle2 size={12} />}
                            {property.status === 'reserved' && <Info size={12} />}
                            {property.status === 'sold' && <X size={12} />}
                            {property.status === 'available' ? 'Tersedia' : property.status === 'reserved' ? 'Reserved' : 'Terjual'}
                          </span>
                          {stats.count > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg border border-slate-100 dark:border-slate-800"
                            >
                              <Star size={12} className="fill-amber-400 text-amber-400" />
                              <span className="text-[10px] font-black text-slate-800 dark:text-slate-100">{stats.avg}</span>
                              <div className="w-px h-3 bg-slate-200 dark:bg-slate-700 mx-0.5" />
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">{stats.count} Ulasan</span>
                            </motion.div>
                          )}
                        </div>
                        <div className="absolute bottom-4 left-4 flex gap-2">
                           <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 shadow-sm">
                             <Home size={14} className="text-emerald-600 dark:text-emerald-400" />
                             {property.type}
                           </div>
                        </div>
                      </div>
        
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-2">
                          <MapPin size={14} />
                          {property.location}
                        </div>
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{property.name}</h3>
                          {stats.count > 0 && (
                            <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg border border-amber-100 dark:border-amber-900/30">
                              <Star size={12} className="fill-amber-500" />
                              <span className="text-xs font-bold">{stats.avg}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-4">
                          {property.description}
                        </p>
      
                      {/* Construction Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progres Konstruksi</span>
                          <span className="text-[10px] font-bold text-emerald-600">{property.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${property.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-emerald-500 rounded-full"
                          />
                        </div>
                      </div>
      
                      {/* Features Section */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {property.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-2.5 py-1 rounded-lg">
                            <FeatureIcon feature={feature} />
                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">{feature}</span>
                          </div>
                        ))}
                      </div>
      
                        <div className="mt-4 flex flex-col gap-3">
                          <a 
                            href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Assalamu'alaikum Bapak Nur Holis, saya tertarik dengan unit *${property.name}* di ${property.location} (Tipe ${property.type}). Mohon info detailnya.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MessageCircle size={18} />
                            Hubungi Agen via WhatsApp
                          </a>
                        </div>
      
                      <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col">
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Mulai Dari</p>
                          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-500 leading-none mb-1.5">{formatCurrency(property.price)}</p>
                          <Link 
                            to={window.location.pathname === '/' ? `/?price=${property.price}#calculator` : `/calculator?price=${property.price}`}
                            title="Hitung simulasi cicilan Bapak/Ibu sendiri di Kalkulator Syariah"
                            className="flex items-center gap-1.5 text-[10px] bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-lg w-fit font-bold shadow-sm hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors group/calc"
                            onClick={(e) => {
                              if (window.location.pathname === '/') {
                                // If on home, it will update URL and we want to scroll
                                // The hash in 'to' might not trigger smooth scroll automatically with Link
                                setTimeout(() => {
                                  const el = document.getElementById('calculator');
                                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                              }
                            }}
                          >
                            <Landmark size={10} className="group-hover/calc:scale-110 transition-transform" />
                            <span className="opacity-80">Cicilan:</span>
                            {formatCurrency(calculateEstimatedInstallment(property.price))}/bln
                            <ArrowRight size={8} className="ml-0.5 group-hover/calc:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                        <div className="flex gap-2">
                          <a 
                            href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Assalamu'alaikum Bapak Nur Holis, saya tertarik dengan unit *${property.name}* di ${property.location} (Tipe ${property.type}). Mohon info detailnya.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all"
                            title="Hubungi Agen (WhatsApp)"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MessageCircle size={18} />
                          </a>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(property);
                            }}
                            className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative"
                            title="Bagikan Properti"
                          >
                            <Share2 size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setGalleryProperty(property);
                              setActiveImageIndex(0);
                            }}
                            className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title="Galeri Foto"
                          >
                            <ImageIcon size={18} />
                          </button>
                          <button 
                            onClick={() => setSelectedProperty(property)}
                            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors"
                          >
                            Lihat Detail
                          </button>
                        </div>
                      </div>
                    </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800"
              >
                <div className="flex flex-col items-center gap-4">
                  <p className="text-slate-400 dark:text-slate-500 font-bold">Tidak ada unit dengan kriteria ini saat ini.</p>
                  <button 
                    onClick={resetFilters}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20"
                  >
                    Lihat Semua Unit
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {filteredProperties.length > 0 && (
          <div className="mt-16 text-center">
             <button 
               onClick={resetFilters}
               className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-800 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl hover:shadow-emerald-600/20 group"
             >
               Lihat Semua Unit
               <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProperty(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row border dark:border-slate-800"
            >
              {/* Top Controls */}
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <AnimatePresence>
                  {showCopiedBadge && (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-2 rounded-xl flex items-center gap-2 shadow-lg"
                    >
                      <Check size={12} />
                      Link Berhasil Disalin!
                    </motion.div>
                  )}
                </AnimatePresence>
                  <button
                    onClick={() => handleShare(selectedProperty!)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all md:bg-white/80 md:dark:bg-slate-800 md:text-slate-900 md:dark:text-white md:hover:bg-white md:dark:hover:bg-slate-700 md:shadow-sm"
                    title="Bagikan Unit"
                  >
                    <Share2 size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all md:bg-slate-100 md:dark:bg-slate-800 md:text-slate-900 md:dark:text-white md:hover:bg-slate-200 md:dark:hover:bg-slate-700"
                    title="Tutup Detil"
                  >
                    <X size={20} />
                  </button>
              </div>

              <div className="md:w-1/2 h-[400px] md:h-auto relative group/carousel">
                {/* Favorite Button in Modal */}
                <button
                  onClick={(e) => toggleFavorite(selectedProperty.id, e)}
                  className={cn(
                    "absolute top-4 left-4 z-20 w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center transition-all shadow-xl border border-white/20 group/modalheart",
                    favorites.includes(selectedProperty.id)
                      ? "bg-rose-500 text-white"
                      : "bg-white/20 text-white hover:bg-white/40"
                  )}
                  title={favorites.includes(selectedProperty.id) ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                >
                  <Heart 
                    size={24} 
                    className={cn(
                      "transition-all duration-300",
                      favorites.includes(selectedProperty.id) ? "fill-white scale-110" : "group-hover/modalheart:scale-110"
                    )} 
                  />
                </button>

                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation={{
                    nextEl: '.swiper-button-next-modal',
                    prevEl: '.swiper-button-prev-modal',
                  }}
                  pagination={{ clickable: true }}
                  className="w-full h-full"
                >
                  {selectedProperty.images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={getOptimizedImageUrl(img, 1000)}
                        alt={`${selectedProperty.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Navigation Buttons for Modal */}
                <button className="swiper-button-prev-modal absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-lg">
                  <ChevronLeft size={20} />
                </button>
                <button className="swiper-button-next-modal absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-lg">
                  <ChevronRight size={20} />
                </button>

                <div className="absolute bottom-4 left-4 z-10">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 backdrop-blur-md",
                    selectedProperty.status === 'available' && "bg-emerald-500/90 text-white",
                    selectedProperty.status === 'reserved' && "bg-amber-500/90 text-white",
                    selectedProperty.status === 'sold' && "bg-rose-500/90 text-white"
                  )}>
                    {selectedProperty.status === 'available' && <CheckCircle2 size={12} />}
                    {selectedProperty.status === 'reserved' && <Info size={12} />}
                    {selectedProperty.status === 'sold' && <X size={12} />}
                    {selectedProperty.status === 'available' ? 'Tersedia' : selectedProperty.status === 'reserved' ? 'Reserved' : 'Terjual'}
                  </span>
                </div>
              </div>

              <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto modal-content-scroll">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
                      <MapPin size={14} />
                      {selectedProperty.location}
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{selectedProperty.name}</h3>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 mb-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          size={16} 
                          className={cn(
                            s <= getPropertyStats(selectedProperty.id).avg 
                              ? "fill-amber-400 text-amber-400" 
                              : "fill-slate-100 dark:fill-slate-800 text-slate-200 dark:text-slate-700"
                          )} 
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {getPropertyStats(selectedProperty.id).count} Ulasan Pengguna
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-6">
                   <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                     <Home size={14} />
                     {selectedProperty.type}
                   </div>
                   <div className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
                     Progress: {selectedProperty.progress}%
                   </div>
                </div>                 <div className="space-y-6">
                   <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wide">Deskripsi Unit</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {selectedProperty.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wide">Galeri Properti</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedProperty.images.map((img, i) => (
                        <div 
                          key={i} 
                          className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer group/thumb"
                          onClick={() => {
                            setGalleryProperty(selectedProperty);
                            setActiveImageIndex(i);
                          }}
                        >
                          <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wide">Fasilitas & Keunggulan</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedProperty.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                          <FeatureIcon feature={feature} />
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-end justify-between mb-6">
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mb-1 uppercase">Harga Mulai Dari</p>
                        <p className="text-3xl font-black text-emerald-600 dark:text-emerald-500 leading-none mb-2">{formatCurrency(selectedProperty.price)}</p>
                        <Link 
                          to={window.location.pathname === '/' ? `/?price=${selectedProperty.price}#calculator` : `/calculator?price=${selectedProperty.price}`}
                          title="Klik untuk menghitung simulasi cicilan Bapak/Ibu sendiri"
                          className="flex flex-col gap-1 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-2xl w-fit font-bold border border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-all group/modal-calc shadow-sm hover:shadow-md"
                          onClick={(e) => {
                            if (window.location.pathname === '/') {
                              setSelectedProperty(null);
                              setTimeout(() => {
                                const el = document.getElementById('calculator');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }, 100);
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                             <Landmark size={16} className="group-hover/modal-calc:scale-110 transition-transform" />
                             <span>Estimasi Cicilan Syariah</span>
                             <ArrowRight size={12} className="ml-1 opacity-0 group-hover/modal-calc:opacity-100 group-hover/modal-calc:translate-x-0.5 transition-all" />
                          </div>
                          <p className="text-2xl font-black">{formatCurrency(calculateEstimatedInstallment(selectedProperty.price))}<span className="text-xs font-bold opacity-60 ml-1">/ bulan*</span></p>
                          <p className="text-[10px] opacity-60 font-medium">* Simulasi DP 20% & Tenor 10 Tahun (Akad Murabahah)</p>
                        </Link>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">Cicilan Syariah Flat</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Assalamu'alaikum Bapak Nur Holis, saya tertarik untuk bertanya lebih detail mengenai:\n\nUnit: *${selectedProperty.name}*\nLokasi: ${selectedProperty.location}\nTipe: ${selectedProperty.type}\nHarga: ${formatCurrency(selectedProperty.price)}\n\nMohon bantuannya untuk informasi unit ini.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-grow bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                      >
                        <MessageCircle size={20} />
                        Hubungi Agen via WhatsApp
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(selectedProperty);
                        }}
                        className="flex-shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center relative group/share"
                        title="Bagikan Properti"
                      >
                        {showCopiedBadge ? (
                          <Check size={20} className="text-emerald-600 animate-in zoom-in" />
                        ) : (
                          <Share2 size={20} className="group-hover/share:scale-110 transition-transform" />
                        )}
                        {showCopiedBadge && (
                          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-bold whitespace-nowrap">
                            Link Disalin!
                          </span>
                        )}
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2 text-slate-400">
                      <Info size={14} />
                      <span className="text-[10px] font-medium">Bebas Riba, Bebas Denda, Bebas Sita</span>
                    </div>
                  </div>
                  {recommendations.length > 0 && (
                    <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Lihat Unit Lain</h4>
                        </div>
                        <div className="flex gap-2">
                          <button className="swiper-button-prev-rec w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                            <ChevronLeft size={16} />
                          </button>
                          <button className="swiper-button-next-rec w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                      <Swiper
                        modules={[Navigation]}
                        navigation={{
                          nextEl: '.swiper-button-next-rec',
                          prevEl: '.swiper-button-prev-rec',
                        }}
                        spaceBetween={12}
                        slidesPerView={1.2}
                        breakpoints={{
                          640: {
                            slidesPerView: 2.2,
                          },
                        }}
                        className="w-full recommendations-carousel"
                      >
                        {recommendations.map((rec) => (
                          <SwiperSlide key={rec.id} className="h-auto">
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="group/rec flex flex-col h-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm hover:shadow-md h-full"
                              onClick={() => {
                                setSelectedProperty(rec);
                                // Scroll modal content to top
                                const container = document.querySelector('.modal-content-scroll');
                                if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                            >
                              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 relative">
                                <img src={rec.image} alt={rec.name} className="w-full h-full object-cover group-hover/rec:scale-110 transition-transform duration-500" />
                                {rec.location === selectedProperty.location && (
                                  <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">Lokasi Sama</div>
                                )}
                              </div>
                              <div className="flex flex-col flex-grow">
                                <div className="flex items-center justify-between mb-1">
                                  <h5 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-1">{rec.name}</h5>
                                  <div className="flex items-center gap-1 text-[9px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-md">
                                    <Star size={8} className="fill-amber-500" />
                                    {getPropertyStats(rec.id).avg > 0 ? getPropertyStats(rec.id).avg : 'Baru'}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-[9px] text-slate-400 dark:text-slate-500 mb-2">
                                  <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-bold uppercase">{rec.type}</span>
                                  <div className="flex items-center gap-0.5">
                                    <MapPin size={8} />
                                    <span className="line-clamp-1">{rec.location}</span>
                                  </div>
                                </div>
                                <div className="mt-auto flex flex-col gap-1">
                                  <div className="flex items-baseline gap-1.5">
                                    <p className="text-emerald-600 dark:text-emerald-400 font-black text-xs">{formatCurrency(rec.price)}</p>
                                  </div>
                                  <div className="flex items-center gap-1 text-[8px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-md font-bold w-fit">
                                    <Landmark size={8} />
                                    {formatCurrency(calculateEstimatedInstallment(rec.price))}/bln
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  )}
                  {/* Reviews Section */}
                  <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Ulasan & Rating</h4>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg">
                        <Star size={12} className="fill-emerald-600 dark:fill-emerald-400" />
                        {getPropertyStats(selectedProperty.id).avg} / 5.0
                      </div>
                    </div>

                    {/* Review Form */}
                    <div className="relative overflow-hidden">
                      <AnimatePresence mode="wait">
                        {reviewSubmitted ? (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-emerald-50 p-10 rounded-[24px] border border-emerald-100 mb-8 text-center"
                          >
                            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                              <Check size={32} />
                            </div>
                            <h5 className="text-emerald-900 dark:text-emerald-300 font-bold mb-2">Jazakumullah Khairan!</h5>
                            <p className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">Ulasan Bapak/Ibu telah kami terima dan akan sangat membantu bagi calon penghuni lainnya.</p>
                          </motion.div>
                        ) : (
                          <motion.form 
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={handleAddReview} 
                            className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 mb-8"
                          >
                            <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">Sudah Survey atau Bertanya?</p>
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Berikan ulasan Bapak/Ibu mengenai unit ini</p>
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <button
                                    key={s}
                                    type="button"
                                    onClick={() => setNewReview(prev => ({ ...prev, rating: s }))}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                  >
                                    <Star 
                                      size={24} 
                                      className={cn(
                                        s <= newReview.rating 
                                          ? "fill-amber-400 text-amber-400" 
                                          : "text-slate-300 dark:text-slate-700"
                                      )} 
                                    />
                                  </button>
                                ))}
                              </div>
                              <input 
                                type="text" 
                                placeholder="Nama Bapak/Ibu"
                                value={newReview.userName}
                                onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition-all font-medium dark:text-slate-100"
                                required
                              />
                              <textarea 
                                placeholder="Ceritakan pengalaman Bapak/Ibu mengenai unit ini..."
                                value={newReview.comment}
                                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                rows={3}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition-all font-medium resize-none dark:text-slate-100"
                                required
                              />
                              <button 
                                type="submit"
                                className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-all"
                              >
                                Kirim Ulasan
                              </button>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Review List */}
                    <div className="space-y-6">
                      {reviews.filter(r => r.propertyId === selectedProperty.id).length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                          <p className="text-slate-400 dark:text-slate-500 text-xs font-bold">Belum ada ulasan untuk unit ini.</p>
                        </div>
                      ) : (
                        reviews.filter(r => r.propertyId === selectedProperty.id).map((review) => (
                          <div key={review.id} className="group/review">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{review.userName}</span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-0.5 mb-2">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star 
                                  key={s} 
                                  size={10} 
                                  className={cn(s <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700")} 
                                />
                              ))}
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed italic">"{review.comment}"</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Gallery Modal */}
      <AnimatePresence>
        {galleryProperty && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setGalleryProperty(null)}
            />
            
            <button
              onClick={() => setGalleryProperty(null)}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"
            >
              <X size={24} />
            </button>

            <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-20">
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.5}
                    onDragEnd={(_, info) => {
                      // Minimum displacement to trigger swipe
                      const threshold = 50;
                      if (info.offset.x < -threshold) {
                        nextImage();
                      } else if (info.offset.x > threshold) {
                        prevImage();
                      }
                    }}
                    className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
                  >
                    <img
                      src={galleryProperty.images[activeImageIndex]}
                      alt={`${galleryProperty.name} view ${activeImageIndex + 1}`}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none pointer-events-none"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md"
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md"
                >
                  <ChevronRight size={32} />
                </button>
              </div>

              {/* Pagination Dots */}
              <div className="mt-8 flex justify-center gap-2">
                {galleryProperty.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      i === activeImageIndex ? "bg-white w-6" : "bg-white/30 hover:bg-white/50"
                    )}
                  />
                ))}
              </div>
              
              <div className="mt-4 text-white/50 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full backdrop-blur-sm">
                {activeImageIndex + 1} / {galleryProperty.images.length} — {galleryProperty.name}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

