import React, { useEffect, useState } from "react";
import { ShieldCheck, TrendingUp, Shield, Clock, CheckCircle2, BarChart2, Lock } from "lucide-react";

interface LoadingPlanScreenProps {
  profileName?: string;
}

const STEPS = [
  { icon: BarChart2, label: "Menganalisis neraca pemasukan & pos pengeluaran...", color: "text-[#003399]", bg: "bg-blue-50 dark:bg-blue-950/40" },
  { icon: TrendingUp, label: "Menghitung rasio kepatuhan OJK (DSR & Likuiditas)...", color: "text-[#0055B8]", bg: "bg-sky-50 dark:bg-sky-950/40" },
  { icon: Shield, label: "Menyusun matriks proteksi asuransi & alokasi portofolio...", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
  { icon: Clock, label: "Memproyeksikan pertumbuhan kekayaan bersih 1-15 tahun...", color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/40" },
  { icon: CheckCircle2, label: "Membuat Executive Financial Health Statement...", color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-950/40" },
];

const FINANCIAL_TIPS = [
  "💡 Prinsip Investasi: Prioritaskan alokasi aset sebelum memilih instrumen spesifik.",
  "📊 Standar OJK: Total cicilan utang maksimal 30% dari total pendapatan bulanan.",
  "🚨 Fondasi Dana Darurat: Simpan 6-12× pengeluaran rutin di instrumen likuid (RDPU/Tabungan).",
  "📈 Kaidah Rule of 72: Aset berlipat ganda dalam kurun waktu (72 ÷ return tahunan) tahun.",
  "🛡️ Proteksi Jiwa: Utamakan Uang Pertanggungan (UP) keluarga sebelum produk investasi spekulatif.",
  "💰 Prinsip Kekayaan: Kekayaan sejati adalah aset produktif yang terus menghasilkan surplus kas.",
];

export const LoadingPlanScreen: React.FC<LoadingPlanScreenProps> = ({ profileName }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    // Progress through steps
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);

    // Rotate tips
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % FINANCIAL_TIPS.length);
    }, 3500);

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(tipInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 animate-in fade-in duration-300">
      {/* Main Card */}
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#003399] shadow-lg shadow-blue-900/30 mx-auto mb-2 text-white border border-blue-400/40">
            <ShieldCheck className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Menyusun Laporan Perencanaan Finansial{dots}
          </h2>
          {profileName && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Sistem Analitik FinPlan sedang memproses profil{" "}
              <span className="font-bold text-[#003399] dark:text-blue-400">
                {profileName}
              </span>
            </p>
          )}
        </div>

        {/* Progress Steps */}
        <div className="space-y-2.5">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === activeStep;
            const isDone = idx < activeStep;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                  isActive ? step.bg + " scale-[1.01] border border-blue-200 dark:border-blue-800 shadow-xs" : isDone ? "opacity-70" : "opacity-30"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isDone
                      ? "bg-blue-100 dark:bg-blue-950 text-[#003399] dark:text-blue-300"
                      : isActive
                      ? "bg-white dark:bg-slate-800 shadow-xs " + step.color
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#003399] dark:text-blue-400" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <span
                  className={`text-xs font-semibold ${
                    isActive
                      ? "text-slate-900 dark:text-white"
                      : isDone
                      ? "text-slate-600 dark:text-slate-400 line-through"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>

                {isActive && (
                  <div className="ml-auto">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#0055B8] animate-ping" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#003399] to-[#0055B8] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, ((activeStep + 1) / STEPS.length) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 text-right font-medium">
            {Math.min(100, Math.round(((activeStep + 1) / STEPS.length) * 100))}% selesai
          </p>
        </div>

        {/* Rotating Financial Tip */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-center">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            Panduan Literasi Keuangan
          </p>
          <p
            key={tipIndex}
            className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed animate-in fade-in duration-500"
          >
            {FINANCIAL_TIPS[tipIndex]}
          </p>
        </div>

        {/* Trust Footer */}
        <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 pt-1">
          <Lock className="w-3.5 h-3.5 text-[#0055B8]" />
          <span>Data terenkripsi sesuai standar kepatuhan OJK & Certified Financial Planner (CFP®)</span>
        </div>
      </div>
    </div>
  );
};
