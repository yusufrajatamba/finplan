import React, { useState } from "react";
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";

interface AuthGateModalProps {
  onUnlock: () => void;
}

const STATIC_ACCESS_KEY = "finfreedom2026!";

export const AuthGateModal: React.FC<AuthGateModalProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === STATIC_ACCESS_KEY) {
      localStorage.setItem("finplan_access_granted", "true");
      onUnlock();
    } else {
      setError(true);
      setErrorMessage("Password akses tidak sesuai. Silakan periksa kembali.");
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-[#001A4E]/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex p-4 rounded-2xl bg-[#003399] text-white shadow-lg shadow-blue-900/30 mb-2 border border-blue-400/40">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            FinPlan Security Gate
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            Akses sistem perencanaan keuangan resmi berstandar <strong>Certified Financial Planner (CFP®) & OJK</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#0055B8]" />
                <span>Masukkan Password Akses</span>
              </span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password akses sistem..."
                className={`w-full px-4 py-3 rounded-xl border ${
                  error
                    ? "border-rose-500 ring-2 ring-rose-500/20"
                    : "border-slate-200 dark:border-slate-700 focus:border-[#0055B8] focus:ring-2 focus:ring-[#0055B8]/20"
                } bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm outline-none transition pr-11`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center space-x-1 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#003399] hover:bg-[#002266] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Buka Sistem FinPlan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center relative z-10">
          <div className="inline-flex items-center space-x-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Koneksi Aman & Terenkripsi 256-bit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
