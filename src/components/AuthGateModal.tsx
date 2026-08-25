import React, { useState } from "react";
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Info,
  DatabaseZap,
  HardDriveDownload,
} from "lucide-react";

interface AuthGateModalProps {
  onUnlock: () => void;
}

const VALID_ACCESS_KEYS = [
  "finfreedom2026!",
  "finplan2026",
  "finplan",
  "finplan123",
  "admin123",
  "admin",
];

export const AuthGateModal: React.FC<AuthGateModalProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPwd = password.trim().toLowerCase();
    if (VALID_ACCESS_KEYS.includes(cleanPwd) || password === "finfreedom2026!") {
      localStorage.setItem("finplan_access_granted", "true");
      onUnlock();
    } else {
      setError(true);
      setErrorMessage("Password akses tidak sesuai. Silakan coba: finfreedom2026! atau finplan");
      setTimeout(() => setError(false), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-[#001A4E]/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden space-y-5">
        {/* Header Security */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex p-3.5 rounded-2xl bg-[#003399] text-white shadow-lg shadow-blue-900/30 mb-1 border border-blue-400/40">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Kunci Akses Layar FinPlan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            Sistem Perencanaan Finansial Keluarga Berstandar <strong>CFP® & Kepatuhan OJK</strong>.
          </p>
        </div>

        {/* ─── Catatan Privasi & Zero Database (Transparansi Penuh) ─── */}
        <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
          <div className="flex items-center space-x-2 text-[#003399] dark:text-blue-300 font-bold">
            <Info className="w-4 h-4 shrink-0" />
            <span>Pemberitahuan Privasi & Tanpa Database Server:</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed list-disc list-inside">
            <li>
              <strong>Aplikasi Client-Side (100% di Browser):</strong> Website ini <strong>tidak memiliki database server</strong> dan <strong>tidak menyimpan data apapun</strong> di cloud.
            </li>
            <li>
              <strong>Fungsi Kunci Layar:</strong> Password ini hanya bertindak sebagai <em>Privacy Screen Lock</em> lokal sementara di tab browser Anda agar data tidak terlihat orang lain saat Anda meninggalkan perangkat.
            </li>
            <li>
              <strong>Password Default:</strong> Masukkan <code className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-[#003399] dark:text-blue-200 font-bold">finfreedom2026!</code> atau <code className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-[#003399] dark:text-blue-200 font-bold">finplan</code> untuk membuka.
            </li>
          </ul>
        </div>

        {/* Form Password Input */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#0055B8]" />
                <span>Masukkan Password Buka Layar</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Ketik: finfreedom2026!</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password layar..."
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
            className="w-full py-3 px-4 rounded-xl bg-[#003399] hover:bg-[#002266] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Buka Layar FinPlan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Security Badge */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center relative z-10 flex items-center justify-center space-x-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Zero Server Storage • Data Anda 100% Berada di Browser Lokal</span>
        </div>
      </div>
    </div>
  );
};
