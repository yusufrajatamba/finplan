import React from "react";
import {
  Sparkles,
  BookOpen,
  Calculator,
  Compass,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Wallet,
  Coins,
  Bookmark,
} from "lucide-react";
import { tenFamilyFinancialRules } from "../data/financialTheoryData";

interface LandingPageProps {
  onStartPlanning: () => void;
  onOpenEducation: () => void;
  onOpenCalculators: () => void;
  onOpenAIChat?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onOpenEducation,
  onOpenCalculators,
  onOpenAIChat,
}) => {
  return (
    <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-200 max-w-7xl mx-auto py-2">
      {/* ─── Hero Section: Filosofi & Peta Besar (Bright Fresh Modern Blue) ─── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0066CC] via-[#0077EE] to-[#0099FF] text-white p-6 sm:p-8 lg:p-10 shadow-lg border border-blue-300/40 space-y-6">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold border border-white/30 text-white shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Family Financial Operating System • Standar CFP® & OJK</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Membangun Kemerdekaan Finansial Keluarga yang Kokoh & Terukur
          </h1>

          <p className="text-blue-50 text-xs sm:text-sm leading-relaxed max-w-3xl font-normal">
            Kekayaan sejati bukan sekadar besarnya gaji atau konsumsi barang mewah. Kekayaan adalah proses mengubah penghasilan menjadi <strong>surplus kas</strong>, melindunginya dengan <strong>perisai risiko (BPJS & Asuransi)</strong>, dan mengalokasikannya ke dalam <strong>aset produktif</strong> untuk kebebasan waktu keluarga Anda.
          </p>
        </div>

        {/* Pipeline Visual Stack - Responsive: Desktop 6-Col Grid, Mobile Smooth Horizontal Stepper */}
        <div className="pt-2 border-t border-white/25">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-50">
              Peta Alur 6 Tahap Pengelolaan Kekayaan:
            </span>
            <span className="lg:hidden text-[10px] text-blue-100/90 font-medium">
              Geser ➔
            </span>
          </div>

          {/* Desktop View (6 Columns) */}
          <div className="hidden lg:grid grid-cols-6 gap-2.5 text-center">
            <div className="p-3.5 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 shadow-xs">
              <span className="text-[10px] font-bold text-blue-100 block">TAHAP 1</span>
              <span className="text-xs font-bold text-white mt-1 block">Penghasilan</span>
              <span className="text-[11px] text-blue-50">Gaji & Bisnis</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 shadow-xs">
              <span className="text-[10px] font-bold text-blue-100 block">TAHAP 2</span>
              <span className="text-xs font-bold text-white mt-1 block">Surplus Kas</span>
              <span className="text-[11px] text-blue-50">Income − Living</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 shadow-xs">
              <span className="text-[10px] font-bold text-blue-100 block">TAHAP 3</span>
              <span className="text-xs font-bold text-white mt-1 block">Proteksi Risiko</span>
              <span className="text-[11px] text-blue-50">BPJS & Asuransi</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 shadow-xs">
              <span className="text-[10px] font-bold text-blue-100 block">TAHAP 4</span>
              <span className="text-xs font-bold text-white mt-1 block">Aset Produktif</span>
              <span className="text-[11px] text-blue-50">SBN, Emas, Saham</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 shadow-xs">
              <span className="text-[10px] font-bold text-blue-100 block">TAHAP 5</span>
              <span className="text-xs font-bold text-white mt-1 block">Bunga Majemuk</span>
              <span className="text-[11px] text-blue-50">Waktu & Disiplin</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/30 backdrop-blur-xs border border-white/40 shadow-sm">
              <span className="text-[10px] font-bold text-amber-200 block">TAHAP 6</span>
              <span className="text-xs font-bold text-white mt-1 block">Bebas Finansial</span>
              <span className="text-[11px] text-blue-50">Kebebasan Waktu</span>
            </div>
          </div>

          {/* Mobile Horizontal Stepper Carousel */}
          <div className="lg:hidden flex space-x-2.5 overflow-x-auto pb-1 scrollbar-none snap-x -mx-1 px-1">
            <div className="snap-start shrink-0 w-36 p-3 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 text-center">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-blue-100 inline-block">1. Income</span>
              <span className="text-xs font-bold text-white mt-1.5 block">Penghasilan</span>
              <span className="text-[10px] text-blue-100">Gaji & Bisnis</span>
            </div>

            <div className="snap-start shrink-0 w-36 p-3 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 text-center">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-blue-100 inline-block">2. Surplus</span>
              <span className="text-xs font-bold text-white mt-1.5 block">Surplus Kas</span>
              <span className="text-[10px] text-blue-100">Income − Living</span>
            </div>

            <div className="snap-start shrink-0 w-36 p-3 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 text-center">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-blue-100 inline-block">3. Shield</span>
              <span className="text-xs font-bold text-white mt-1.5 block">Proteksi Risiko</span>
              <span className="text-[10px] text-blue-100">BPJS & Asuransi</span>
            </div>

            <div className="snap-start shrink-0 w-36 p-3 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 text-center">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-blue-100 inline-block">4. Asset</span>
              <span className="text-xs font-bold text-white mt-1.5 block">Aset Produktif</span>
              <span className="text-[10px] text-blue-100">SBN, Emas, Saham</span>
            </div>

            <div className="snap-start shrink-0 w-36 p-3 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 text-center">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-blue-100 inline-block">5. Compounding</span>
              <span className="text-xs font-bold text-white mt-1.5 block">Bunga Majemuk</span>
              <span className="text-[10px] text-blue-100">Waktu & Disiplin</span>
            </div>

            <div className="snap-start shrink-0 w-36 p-3 rounded-xl bg-white/30 backdrop-blur-xs border border-white/40 shadow-sm text-center">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-200 inline-block">6. Freedom</span>
              <span className="text-xs font-bold text-white mt-1.5 block">Bebas Finansial</span>
              <span className="text-[10px] text-blue-100">Kebebasan Waktu</span>
            </div>
          </div>
        </div>

        {/* 3 Musuh Utama Callout - High Legibility */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/20 border border-amber-300/40 text-amber-100 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong>3 Jebakan Kekayaan:</strong> Inflasi Gaya Hidup • Utang Konsumtif • Nol Dana Darurat.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-amber-200 shrink-0">Morgan Housel & Benjamin Graham</span>
        </div>
      </div>

      {/* ─── 3 Pilihan Aksi Utama (Navigation Gateway - Prestigious Clean Cards) ─── */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold text-[#0066CC] dark:text-blue-400 uppercase tracking-wider block">
            Pilihan Modul Navigasi
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            Pilih Layanan Perencanaan Finansial Anda
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Gunakan panduan terstruktur 7 langkah atau pelajari modul teori dan simulasi hitung mandiri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Perencanaan Finansial (Primary) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-[#0066CC] shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#0066CC] dark:text-blue-400 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#0066CC] dark:text-blue-300 uppercase tracking-wider inline-block">
                Layanan Utama
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Perencanaan Finansial Komprehensif
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Panduan komprehensif 7 langkah: evaluasi arus kas, batas aman cicilan utang OJK, target dana darurat, profiling risiko, dan roadmap kemerdekaan finansial.
              </p>
            </div>

            <button
              onClick={onStartPlanning}
              className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#0066CC] hover:bg-[#0055B8] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <span>Mulai Perencanaan (7 Langkah)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Belajar Teori & 10 Guru */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 hover:border-blue-400 transition-colors">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#0066CC] dark:text-slate-300 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider inline-block">
                Knowledge Base
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Belajar Teori & 10 Guru Finansial
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Pelajari pemikiran Morgan Housel, Ramit Sethi, Warren Buffett, Benjamin Graham, JL Collins, kurikulum 8 semester Financial University, dan 10 Aturan Keluarga.
              </p>
            </div>

            <button
              onClick={onOpenEducation}
              className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-xl border-2 border-[#0066CC] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[#0066CC] dark:text-blue-400 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buka Knowledge Base</span>
            </button>
          </div>

          {/* Card 3: Simulasi & Kalkulator */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 hover:border-blue-400 transition-colors">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#0066CC] dark:text-slate-300 flex items-center justify-center font-bold">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider inline-block">
                Kalkulator Interaktif
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Simulasi & Kalkulator Finansial
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                7 kalkulator master: Bunga Majemuk, Dana Darurat OJK, Margin of Safety Graham, Energi Hidup Vicki Robin, Net Worth PAW Stanley & Danko, dan Simulasi KPR.
              </p>
            </div>

            <button
              onClick={onOpenCalculators}
              className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-xl border-2 border-[#0066CC] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[#0066CC] dark:text-blue-400 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Buka Kalkulator Finansial</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 10 Aturan Keuangan Keluarga (Manifesto Cards) ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#003399] dark:text-blue-400">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                10 Aturan Keuangan Keluarga (Financial Manifesto)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prinsip perilaku abadi yang menyatukan filosofi Buffett, Housel, Collins, Graham, dan OJK.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenEducation}
            className="text-xs font-bold text-[#003399] dark:text-blue-400 hover:underline flex items-center self-start sm:self-auto cursor-pointer"
          >
            <span>Pelajari Selengkapnya</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {tenFamilyFinancialRules.slice(0, 6).map((rule) => (
            <div
              key={rule.ruleNumber}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#003399] text-white">
                  ATURAN #{rule.ruleNumber}
                </span>
                <span className="text-[10px] font-semibold text-slate-500">{rule.guruInfluence.split("/")[0]}</span>
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{rule.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal font-medium">"{rule.principle}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
