import React, { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Shield, Clock, CheckCircle2, Brain } from "lucide-react";

interface LoadingPlanScreenProps {
  profileName?: string;
}

const STEPS = [
  { icon: Brain, label: "Menganalisis profil keuangan...", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40" },
  { icon: TrendingUp, label: "Menghitung rasio OJK & DSR...", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
  { icon: Shield, label: "Menyusun alokasi anggaran optimal...", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40" },
  { icon: Clock, label: "Memproyeksikan rencana 1-15 tahun...", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/40" },
  { icon: CheckCircle2, label: "Finalisasi rencana keuangan CFP...", color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/40" },
];

const FINANCIAL_TIPS = [
  "💡 Aturan Warren Buffett: Sisihkan tabungan dulu di awal bulan, bukan dari sisa.",
  "📊 Standar OJK: Cicilan utang idealnya ≤30% total penghasilan bulanan.",
  "🚨 Dana darurat ideal: 3-12× pengeluaran tergantung status pekerjaan Anda.",
  "📈 Rule of 72: Uang Anda berlipat ganda dalam 72 ÷ return tahunan (tahun).",
  "🏆 Investor terbaik bukan yang paling pintar, tapi yang paling konsisten.",
  "💰 Perbedaan kaya vs terlihat kaya: kekayaan adalah aset yang tidak terlihat.",
];

export const LoadingPlanScreen: React.FC<LoadingPlanScreenProps> = ({ profileName }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    // Progress through steps
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);

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
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 mx-auto mb-2">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Menyusun Rencana Keuangan{dots}
          </h2>
          {profileName && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              CFP AI Engine sedang menganalisis data{" "}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {profileName}
              </span>
            </p>
          )}
        </div>

        {/* Progress Steps */}
        <div className="space-y-3">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === activeStep;
            const isDone = idx < activeStep;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                  isActive ? step.bg + " scale-[1.01]" : isDone ? "opacity-60" : "opacity-30"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isDone
                      ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-600"
                      : isActive
                      ? "bg-white dark:bg-slate-800 shadow-sm " + step.color
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Icon className={`w-4 h-4 ${isActive ? step.color : "text-slate-400"} ${isActive ? "animate-pulse" : ""}`} />
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isDone
                      ? "text-emerald-700 dark:text-emerald-400 line-through"
                      : isActive
                      ? "text-slate-900 dark:text-white font-semibold"
                      : "text-slate-400 dark:text-slate-600"
                  }`}
                >
                  {step.label}
                </span>
                {isActive && (
                  <div className="ml-auto flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, ((activeStep + 1) / STEPS.length) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 text-right">
            {Math.min(100, Math.round(((activeStep + 1) / STEPS.length) * 100))}% selesai
          </p>
        </div>

        {/* Rotating Financial Tip */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/60 dark:to-blue-950/30 border border-slate-200 dark:border-slate-700">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Tahukah Anda?
          </p>
          <p
            key={tipIndex}
            className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed animate-in fade-in duration-500"
          >
            {FINANCIAL_TIPS[tipIndex]}
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-400 text-center mt-4 max-w-sm">
        Proses ini menggunakan Gemini AI + CFP Engine. Estimasi waktu: 5-15 detik.
      </p>
    </div>
  );
};
