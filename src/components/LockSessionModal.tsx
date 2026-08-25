import React, { useState } from "react";
import { Lock, KeyRound, ShieldCheck, X, ArrowRight, Eye, EyeOff } from "lucide-react";

interface LockSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLock: (customPin?: string) => void;
}

export const LockSessionModal: React.FC<LockSessionModalProps> = ({
  isOpen,
  onClose,
  onConfirmLock,
}) => {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmLock(pin.trim() ? pin.trim() : undefined);
    setPin("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-[#003399] text-white shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Kunci Layar Sementara
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kunci tampilan saat Anda meninggalkan browser
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Buat <strong>PIN / Kata Sandi sementara</strong> untuk membuka layar ini nanti, atau kosongkan untuk menggunakan kata sandi master.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#0055B8]" />
              <span>PIN / Password Kunci Layar (Opsional)</span>
            </label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Contoh: 1234 atau kata sandi Anda..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#0055B8] focus:ring-2 focus:ring-[#0055B8]/20 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm outline-none transition pr-10"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#003399] hover:bg-[#002266] text-white text-xs font-bold shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Kunci Layar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
