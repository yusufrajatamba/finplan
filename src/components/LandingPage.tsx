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
    <div className="w-full animate-in fade-in duration-200">
      {/* ─── FULL-WIDTH HERO SECTION (BFI Finance Style Edge-to-Edge #0B5DA7) ─── */}
      <div className="w-full bg-[#0B5DA7] text-white relative overflow-hidden border-b border-blue-800/40">
        {/* Subtle Decorative Background Glow Circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-400/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-950/30 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Column: Clean Headline & Action CTA */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold border border-white/20 text-white shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Family Financial Operating System • Standar CFP® & OJK</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
              Membangun Kemerdekaan Finansial Keluarga yang Kokoh & Terukur
            </h1>

            <p className="text-blue-100 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl font-normal">
              Platform mandiri untuk mendiagnosis arus kas, mengamankan dana darurat & proteksi asuransi, serta menyusun peta jalan akumulasi aset keluarga secara terstruktur.
            </p>

            {/* BFI-Style 2 Key Value Points */}
            <div className="space-y-2 text-xs sm:text-sm text-blue-50 font-medium pt-1">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Evaluasi 6 Rasio Kesehatan Finansial & Standar Kepatuhan OJK</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Roadmap Bebas Utang, Dana Darurat & Akumulasi Aset Terukur</span>
              </div>
            </div>

            {/* Action Buttons: Signature Orange Primary CTA + Ghost Secondary */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartPlanning}
                className="px-6 sm:px-7 py-3.5 rounded-xl bg-[#E8701A] hover:bg-[#D6610E] text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-950/30 hover:scale-[1.02] transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Mulai Perencanaan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCalculators}
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center space-x-2"
              >
                <Calculator className="w-4 h-4 text-blue-200" />
                <span>Hitung Simulasi</span>
              </button>
            </div>

            <p className="text-[11px] text-blue-200/80 pt-1">
              FinPlan berstandar Certified Financial Planner (CFP®) dan mengacu pada regulasi Otoritas Jasa Keuangan (OJK).
            </p>
          </div>

          {/* Right Column: App Illustration & Financial Health Visual Mockup (BFI Circle Style) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            {/* Circular Halo Backdrop */}
            <div className="w-72 h-72 sm:w-84 sm:h-84 lg:w-96 lg:h-96 rounded-full bg-gradient-to-tr from-white/15 via-sky-300/10 to-transparent border-2 border-white/20 p-3 sm:p-5 relative flex items-center justify-center shadow-2xl backdrop-blur-xs">
              {/* Floating Top Mini Badge */}
              <div className="absolute -top-2 right-4 bg-white dark:bg-slate-900 text-slate-800 dark:text-white px-3 py-1.5 rounded-full shadow-lg border border-slate-100 dark:border-slate-800 text-[11px] font-bold flex items-center space-x-1.5 z-20 animate-bounce duration-1000">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>CFP® Standard</span>
              </div>

              {/* Floating Bottom Left Mini Badge */}
              <div className="absolute -bottom-2 -left-2 bg-emerald-600 text-white px-3 py-1.5 rounded-full shadow-lg text-[10px] font-bold flex items-center space-x-1.5 z-20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Kepatuhan OJK Terverifikasi</span>
              </div>

              {/* Core App Simulation Card Mockup */}
              <div className="w-full max-w-[280px] sm:max-w-xs bg-white text-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-100 space-y-3.5 relative z-10">
                {/* Header Card */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-[#0B5DA7] flex items-center justify-center text-white font-black text-xs shadow-xs">
                      FP
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block leading-tight">
                        Status Finansial
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                        Sehat & Terukur
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#0B5DA7] bg-blue-50 px-2 py-0.5 rounded-md">
                    Skor 85/100
                  </span>
                </div>

                {/* 3 Metric Rows */}
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-medium block">Surplus Kas</span>
                      <span className="font-bold text-slate-900">+32% / Bulan</span>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Ideal &gt; 10%
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-medium block">Beban Utang</span>
                      <span className="font-bold text-slate-900">18% Gaji</span>
                    </div>
                    <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                      Aman OJK &lt; 30%
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-medium block">Dana Darurat</span>
                      <span className="font-bold text-slate-900">Rp 45.000.000</span>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      6x Pengeluaran
                    </span>
                  </div>
                </div>

                {/* Mini Summary */}
                <div className="pt-0.5 flex items-center justify-between text-[10px] text-slate-400 font-medium border-t border-slate-100">
                  <span>Peta Jalan 7 Langkah</span>
                  <span className="text-[#0B5DA7] font-bold">Siap Diakses →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PADDED LOWER CONTENT SECTION (Restricted Max Width & Centered) ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        <div>
          <span className="text-xs font-bold text-[#0B5DA7] dark:text-blue-400 uppercase tracking-wider block">
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-[#0B5DA7] shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#0B5DA7] dark:text-blue-400 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-[#0B5DA7] dark:text-blue-300 uppercase tracking-wider inline-block">
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
              className="w-full flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl bg-[#E8701A] hover:bg-[#D6610E] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Mulai Perencanaan (7 Langkah)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Belajar Teori & 10 Guru */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 hover:border-[#0B5DA7] transition-colors">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#0B5DA7] dark:text-slate-300 flex items-center justify-center font-bold">
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
              className="w-full flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl border-2 border-[#0B5DA7] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[#0B5DA7] dark:text-blue-400 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buka Knowledge Base</span>
            </button>
          </div>

          {/* Card 3: Simulasi & Kalkulator */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6 hover:border-[#0B5DA7] transition-colors">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#0B5DA7] dark:text-slate-300 flex items-center justify-center font-bold">
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
              className="w-full flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl border-2 border-[#0B5DA7] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[#0B5DA7] dark:text-blue-400 text-xs sm:text-sm font-bold transition-all cursor-pointer"
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
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#0B5DA7] dark:text-blue-400">
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
            className="text-xs font-bold text-[#0B5DA7] dark:text-blue-400 hover:underline flex items-center self-start sm:self-auto cursor-pointer"
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
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0B5DA7] text-white">
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
