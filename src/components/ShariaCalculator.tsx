import React from 'react';
import { Calculator, Info, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { calculateMurabahah, calculateMMq } from '../lib/sharia-logic';
import { formatCurrency } from '../lib/utils';
import { ShariaAkad } from '../types';
import { useSearchParams } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function ShariaCalculator() {
  const [searchParams] = useSearchParams();
  const initialPrice = Number(searchParams.get('price')) || 500000000;
  const initialDp = Math.floor(initialPrice * 0.2); // Default 20% DP

  const [price, setPrice] = React.useState<number>(initialPrice);
  const [dp, setDp] = React.useState<number>(initialDp);

  // Sync state with search params changes (e.g. when user clicks "Cek Cicilan" on different units)
  React.useEffect(() => {
    const priceParam = searchParams.get('price');
    if (priceParam) {
      const newPrice = Number(priceParam);
      setPrice(newPrice);
      setDp(Math.floor(newPrice * 0.2));
    }
  }, [searchParams]);

  // Requirement: min allowed DP is 1 unit more than calculated minimum required DP
  const minRequiredDp = 0;
  const absoluteMinDp = minRequiredDp + 1;

  const [tenor, setTenor] = React.useState<number>(10);
  const [marginRate, setMarginRate] = React.useState<number>(8);
  const [akad, setAkad] = React.useState<ShariaAkad>('Murabahah');
  const [notaryFee, setNotaryFee] = React.useState<number>(0);
  const [bbnFee, setBbnFee] = React.useState<number>(0);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [activeTip, setActiveTip] = React.useState(0);

  const EDU_TIPS = [
    "Akad Murabahah: Transparansi modal & margin yang disepakati di awal.",
    "Tanpa Denda: Keterlambatan diselesaikan dengan diskusi (tabayyun), bukan profit riba.",
    "Tanpa Sita: Jika kesulitan, kami bantu jualkan aset secara adil & amanah.",
    "Akad MMq: Skema kepemilikan bertahap yang fleksibel & adil bagi kedua belah pihak.",
    "Bebas Riba: Seluruh proses diawasi DPS untuk memastikan keberkahan transaksi Anda."
  ];

  // Simulation of processing to show educational tips
  React.useEffect(() => {
    if (price > 0 && dp > 0) {
      setIsProcessing(true);
      setActiveTip(Math.floor(Math.random() * EDU_TIPS.length));
      const timer = setTimeout(() => setIsProcessing(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [price, dp, tenor, marginRate, akad]);

  const validate = React.useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!price || price <= 0) {
      newErrors.price = 'Harga properti wajib diisi dan harus lebih dari 0';
    }
    
    if (dp === undefined || dp === null) {
      newErrors.dp = 'Uang muka (DP) wajib diisi';
    } else if (dp < absoluteMinDp) {
      newErrors.dp = `Uang muka minimal adalah ${formatCurrency(absoluteMinDp)}`;
    } else if (price > 0 && dp >= price) {
      newErrors.dp = `Uang muka tidak boleh melebihi atau sama dengan harga properti. Maksimal DP yang diizinkan adalah ${formatCurrency(price - 1000000)}.`;
    }
    
    if (!marginRate || marginRate <= 0) {
      newErrors.marginRate = 'Rate margin/nisbah harus lebih dari 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [price, dp, marginRate]);

  const isValid = Object.keys(errors).length === 0;

  const result = React.useMemo(() => {
    if (!isValid || price <= 0 || dp >= price) {
      return { monthlyInstallment: 0, totalPayment: 0, totalMargin: 0, tenorMonths: tenor * 12 };
    }
    if (akad === 'Murabahah') {
      return calculateMurabahah(price, dp, marginRate, tenor);
    } else {
      return calculateMMq(price, dp, marginRate, tenor);
    }
  }, [price, dp, tenor, marginRate, akad, isValid]);

  const chartData = React.useMemo(() => {
    const financingAmount = price - dp;
    return [
      { name: 'Harga Pokok', value: financingAmount > 0 ? financingAmount : 0 },
      { name: 'Total Margin', value: result.totalMargin > 0 ? result.totalMargin : 0 },
    ];
  }, [price, dp, result.totalMargin]);

  const COLORS = ['#10b981', '#f59e0b']; // emerald-500, amber-500

  React.useEffect(() => {
    validate();
  }, [validate]);

  return (
    <section id="calculator" className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Simulasi Cicilan Syariah</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Gunakan kalkulator ini untuk mendapatkan gambaran cicilan bulanan yang tetap (fixed) tanpa bunga majemuk.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex gap-4 mb-8">
              {(['Murabahah', 'MMq'] as ShariaAkad[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setAkad(t)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                    akad === t ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                  }`}
                >
                  {t === 'Murabahah' ? 'Jual Beli (Murabahah)' : 'Sewa Beli (MMq)'}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Harga Properti</label>
                <div className="relative">
                  <input
                    type="number"
                    value={price || ''}
                    placeholder="Masukkan Harga Properti"
                    onChange={(e) => setPrice(e.target.value === '' ? 0 : Number(e.target.value))}
                    className={`w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-xl p-4 text-emerald-700 dark:text-emerald-400 font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all ${
                      errors.price ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/30' : 'border-transparent focus:border-emerald-500'
                    }`}
                  />
                  {errors.price && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500">
                      <Info size={20} />
                    </div>
                  )}
                </div>
                {errors.price ? (
                  <p className="text-xs text-rose-500 font-bold flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-top-1">
                    {errors.price}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-400 font-medium px-1">{formatCurrency(price || 0)}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Uang Muka (DP)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={absoluteMinDp}
                    value={dp || ''}
                    placeholder="Masukkan Uang Muka"
                    onChange={(e) => setDp(e.target.value === '' ? 0 : Number(e.target.value))}
                    className={`w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-xl p-4 text-emerald-700 dark:text-emerald-400 font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all ${
                      errors.dp ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/30' : 'border-transparent focus:border-emerald-500'
                    }`}
                  />
                  {errors.dp && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500">
                      <Info size={20} />
                    </div>
                  )}
                </div>
                {errors.dp ? (
                  <p className="text-xs text-rose-500 font-bold flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-top-1">
                    {errors.dp}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-400 font-medium px-1">{formatCurrency(dp || 0)}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tenor (Tahun)</label>
                  <span className="text-emerald-700 dark:text-emerald-400 font-black text-lg">{tenor} Tahun</span>
                </div>
                <div className="px-2 pt-2">
                  <input
                    type="range"
                    min="1"
                    max="25"
                    step="1"
                    value={tenor}
                    onChange={(e) => setTenor(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-400 font-bold mt-2 uppercase tracking-tighter">
                    <span>1 Thn</span>
                    <span>10 Thn</span>
                    <span>20 Thn</span>
                    <span>25 Thn</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {akad === 'Murabahah' ? 'Margin Flat / Tahun (%)' : 'Nisbah Sewa / Tahun (%)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={marginRate || ''}
                    placeholder="Masukkan Rate"
                    onChange={(e) => setMarginRate(e.target.value === '' ? 0 : Number(e.target.value))}
                    className={`w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-xl p-4 text-emerald-700 dark:text-emerald-400 font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all ${
                      errors.marginRate ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/30' : 'border-transparent focus:border-emerald-500'
                    }`}
                  />
                  {errors.marginRate && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500">
                      <Info size={20} />
                    </div>
                  )}
                </div>
                {errors.marginRate && (
                  <p className="text-xs text-rose-500 font-bold flex items-center gap-1.5 px-1 animate-in fade-in slide-in-from-top-1">
                    {errors.marginRate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Biaya Notaris & Admin (Opsional)</label>
                <input
                  type="number"
                  value={notaryFee || ''}
                  placeholder="Masukkan Biaya Notaris"
                  onChange={(e) => setNotaryFee(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-xl p-4 text-emerald-700 dark:text-emerald-400 font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                />
                <p className="text-[10px] text-slate-400 font-medium px-1 uppercase tracking-wider">Dibayar saat Akad</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Biaya Balik Nama / Sertifikat (Opsional)</label>
                <input
                  type="number"
                  value={bbnFee || ''}
                  placeholder="Masukkan Biaya BBN"
                  onChange={(e) => setBbnFee(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-xl p-4 text-emerald-700 dark:text-emerald-400 font-bold focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                />
                <p className="text-[10px] text-slate-400 font-medium px-1 uppercase tracking-wider">Estimasi legalitas lahan pecah</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl flex gap-3">
              <Info className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" size={20} />
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                <strong>Catatan:</strong> Perhitungan ini bersifat simulasi awal. Cicilan murni flat dari awal hingga akhir masa tenor. Tidak ada denda keterlambatan (biaya admin dialokasikan untuk sedekah sesuai ketentuan DPS).
              </p>
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-emerald-900 rounded-3xl p-8 text-white shadow-xl flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <Calculator size={20} />
              </div>
              <h3 className="font-bold">Hasil Simulasi</h3>
            </div>

            <div className="space-y-6 flex-grow relative">
              {isProcessing && isValid && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-emerald-900 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-emerald-800 rounded-full flex items-center justify-center mb-6 relative">
                    <Loader2 size={32} className="text-emerald-400 animate-spin" />
                    <Sparkles size={16} className="absolute -top-1 -right-1 text-amber-400 animate-pulse" />
                  </div>
                  <h4 className="text-emerald-200 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Edukasi Syariah</h4>
                  <p className="text-white text-sm font-bold leading-relaxed max-w-[200px]">
                    "{EDU_TIPS[activeTip]}"
                  </p>
                </div>
              )}
              {!isValid && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-emerald-900/40 backdrop-blur-[2px] rounded-2xl p-6 text-center border border-white/10">
                  <p className="text-emerald-100 text-sm font-medium">Mohon perbaiki data input di sebelah kiri untuk melihat hasil kalkulasi.</p>
                </div>
              )}
              <div>
                <p className="text-emerald-300 text-sm mb-1">Angsuran Per Bulan</p>
                <p className="text-3xl font-bold">{formatCurrency(result.monthlyInstallment)}</p>
                <p className="text-emerald-400 text-xs mt-1 italic">Murni Flat & Tetap</p>
              </div>

              {isValid && (
                <div className="h-48 w-full bg-emerald-950/30 rounded-2xl p-2 border border-white/5">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#064e3b', 
                          border: 'none', 
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => <span className="text-[10px] font-bold text-emerald-100">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="h-px bg-white/10" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-emerald-300 text-xs mb-1">Total Margin</p>
                  <p className="font-bold text-sm">{formatCurrency(result.totalMargin)}</p>
                </div>
                <div>
                  <p className="text-emerald-300 text-xs mb-1">Piutang Pembiayaan</p>
                  <p className="font-bold text-sm">{formatCurrency(price - dp)}</p>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-1">Upfront ALL-IN</p>
                  <p className="font-black text-sm text-emerald-400">{formatCurrency(dp + notaryFee + bbnFee)}</p>
                  <p className="text-[10px] text-white/40 leading-tight mt-1">DP + Notaris + BBN</p>
                </div>
                <div>
                  <p className="text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-1">Total Kewajiban</p>
                  <p className="font-black text-sm text-amber-400">{formatCurrency(result.totalPayment - dp)}</p>
                  <p className="text-[10px] text-white/40 leading-tight mt-1">Sisa Pokok + Margin</p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Tanpa Riba (Bunga)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Tanpa Denda & Sita</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Asuransi Syariah Terpadu</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-white text-emerald-900 font-bold py-4 rounded-xl mt-8 hover:bg-emerald-100 transition-all">
              Hubungi Nur Holis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
