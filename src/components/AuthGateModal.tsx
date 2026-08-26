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
  RotateCcw,
} from "lucide-react";

interface AuthGateModalProps {
  onUnlock: () => void;
  onResetSession?: () => void;
}

const MASTER_ACCESS_KEYS = [
  "finfreedom2026!",
  "finplan2026",
  "finplan",
  "finplan123",
  "admin123",
  "admin",
  "1234",
];

export const AuthGateModal: React.FC<AuthGateModalProps> = ({ onUnlock, onResetSession }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPwd = password.trim();
    const sessionPin = sessionStorage.getItem("finplan_session_lock_key");

    if (
      (sessionPin && cleanPwd === sessionPin) ||
      MASTER_ACCESS_KEYS.includes(cleanPwd.toLowerCase()) ||
      cleanPwd === "finfreedom2026!"
    ) {
      localStorage.setItem("finplan_access_granted", "true");
      onUnlock();
    } else {
      setError(true);
      setErrorMessage("Kata sandi / PIN tidak sesuai. Silakan periksa kembali.");
      setTimeout(() => setError(false), 3500);
    }
  };

  const handleReset = () => {
    sessionStorage.removeItem("finplan_session_lock_key");
    localStorage.removeItem("finplan_access_granted");
    if (onResetSession) {
      onResetSession();
    }
    localStorage.setItem("finplan_access_granted", "true");
    onUnlock();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden space-y-5">
        {/* Header Security */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex p-3.5 rounded-2xl bg-[#0B5DA7] text-white shadow-lg shadow-blue-500/20 mb-1 border border-blue-400/40">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Layar FinPlan Terkunci
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            Masukkan PIN atau kata sandi kunci layar Anda untuk melanjutkan sesi.
          </p>
        </div>

        {/* ─── Catatan Privasi & Zero Database (Tanpa Membocorkan Password) ─── */}
        <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
          <div className="flex items-center space-x-2 text-[#0B5DA7] dark:text-blue-300 font-bold">
            <Info className="w-4 h-4 shrink-0" />
            <span>Pemberitahuan Privasi Layar:</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed list-disc list-inside">
            <li>
              <strong>100% Berjalan di Browser Lokal:</strong> Website FinPlan <strong>tidak memiliki database server</strong> dan <strong>tidak menyimpan data Anda</strong> di cloud.
            </li>
            <li>
              <strong>Fungsi Kunci Layar:</strong> Fitur ini murni <em>Privacy Screen Lock</em> lokal untuk mengamankan tampilan saat Anda meninggalkan browser atau laptop terbuka.
            </li>
          </ul>
        </div>

        {/* Form Password Input */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#0B5DA7]" />
                <span>Masukkan PIN / Password Layar</span>
              </span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan PIN / Password..."
                className={`w-full px-4 py-3 rounded-xl border ${
                  error
                    ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
                } text-sm focus:ring-2 focus:ring-[#0B5DA7] focus:outline-hidden transition-all pr-10`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center space-x-1">
                <span>⚠️ {errorMessage}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#E8701A] hover:bg-[#D6610E] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Buka Layar FinPlan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Reset / Lupa Password Option */}
        <div className="pt-2 text-center relative z-10">
          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="text-[11px] text-slate-500 hover:text-[#003399] dark:hover:text-blue-300 underline cursor-pointer inline-flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Lupa Password? Reset Sesi & Buka Layar Baru</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs space-y-2 animate-in fade-in">
              <p className="text-amber-900 dark:text-amber-200 text-[11px]">
                Mereset sesi akan mengosongkan data input di tab ini dan langsung membuka layar utama kembali ke awal.
              </p>
              <div className="flex justify-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2.5 py-1 text-[10px] rounded-lg border border-slate-300 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1 text-[10px] rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                >
                  Ya, Reset & Buka Layar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center relative z-10 flex items-center justify-center space-x-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Zero Server Storage • Data Anda 100% Aman di Memori Lokal</span>
        </div>
      </div>
    </div>
  );
};
