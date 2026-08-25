import React from "react";
import {
  CheckCircle2,
  UserPlus,
  History,
  Download,
  X,
  Sparkles,
  ArrowRight,
  User,
  ShieldCheck,
} from "lucide-react";
import { UserProfile, RiskProfileData, FinancialPlanResult } from "../types";

interface PostSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  risk: RiskProfileData;
  plan: FinancialPlanResult | null;
  onAddNewProfile: () => void;
  onOpenHistory: () => void;
  onExportPDF: () => void;
}

export const PostSaveModal: React.FC<PostSaveModalProps> = ({
  isOpen,
  onClose,
  profile,
  risk,
  plan,
  onAddNewProfile,
  onOpenHistory,
  onExportPDF,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header with Green Accent */}
        <div className="px-6 pt-6 pb-4 text-center border-b border-slate-100 dark:border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Profil Berhasil Disimpan ke History!
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Snapshot rencana keuangan untuk <b>{profile.fullName || "Klien"}</b> telah diarsipkan secara aman.
          </p>
        </div>

        {/* Snapshot Summary Box */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/50 dark:border-slate-700/50">
              <span className="text-slate-500 font-medium">Nama Klien:</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile.fullName || "-"}</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/50 dark:border-slate-700/50">
              <span className="text-slate-500 font-medium">Profil Risiko:</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{risk.profileType}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Skor Kesehatan Finansial:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {plan?.healthScore ?? 85} / 100
              </span>
            </div>
          </div>

          {/* Action Prompt */}
          <div className="space-y-2.5 pt-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Langkah Selanjutnya yang Ingin Dilakukan:
            </label>

            {/* Primary Action: Tambah Profil Baru (Orang Berbeda) */}
            <button
              onClick={() => {
                onClose();
                onAddNewProfile();
              }}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-emerald-600/25 transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-3 text-left">
                <div className="p-2 rounded-xl bg-white/20">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-sm font-bold">Tambah Profil Baru (Orang Berbeda)</span>
                  <span className="text-[11px] text-emerald-100 font-normal">
                    Mulai profiling baru untuk pasangan, keluarga, atau klien lain
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            {/* Secondary Option: Buka Riwayat History */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenHistory();
                }}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <History className="w-3.5 h-3.5 text-purple-500" />
                <span>Lihat Semua Riwayat</span>
              </button>

              <button
                onClick={() => {
                  onExportPDF();
                }}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                <span>Export PDF 4 Hlm</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={onClose}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            Tetap di Halaman Rencana Ini
          </button>
        </div>
      </div>
    </div>
  );
};
