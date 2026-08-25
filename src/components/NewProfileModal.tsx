import React, { useState } from "react";
import {
  UserPlus,
  X,
  Sparkles,
  FileText,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Home,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { sampleProfiles, SampleProfileData, createEmptyProfileData } from "../data/sampleProfiles";

interface NewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfileName: string;
  onConfirmCreateNew: (params: {
    name: string;
    starterType: "empty" | "sample";
    sampleData?: SampleProfileData;
  }) => void;
}

export const NewProfileModal: React.FC<NewProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfileName,
  onConfirmCreateNew,
}) => {
  const [newName, setNewName] = useState("");
  const [starterType, setStarterType] = useState<"empty" | "sample">("empty");
  const [selectedSampleId, setSelectedSampleId] = useState<string>(sampleProfiles[0].id);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = newName.trim() || "Klien Baru";

    if (starterType === "empty") {
      onConfirmCreateNew({
        name: finalName,
        starterType: "empty",
      });
    } else {
      const selectedSample = sampleProfiles.find((s) => s.id === selectedSampleId) || sampleProfiles[0];
      onConfirmCreateNew({
        name: finalName,
        starterType: "sample",
        sampleData: {
          ...selectedSample,
          profile: {
            ...selectedSample.profile,
            fullName: finalName,
          },
        },
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Tambah Profil Baru (Orang Berbeda)
              </h2>
              <p className="text-xs text-slate-500">
                Buat sesi perencanaan keuangan mandiri untuk klien, pasangan, atau keluarga baru
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Info Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">Profil aktif saat ini: </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {currentProfileName || "Klien Sebelumnya"}
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Data profil sebelumnya tetap aman dan tersimpan di Riwayat Profiling yang bisa dibuka kembali kapan saja.
              </p>
            </div>
          </div>

          {/* Input Nama Orang Baru */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Nama Lengkap Klien / Anggota Keluarga Baru <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Rina Wijaya / Budi Santoso / Adik - Fahri"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
              autoFocus
            />
          </div>

          {/* Opsi Mode Awal Profil */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Pilihan Format Awal Form:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Form Kosong */}
              <div
                onClick={() => setStarterType("empty")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  starterType === "empty"
                    ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20"
                    : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Form Kosong (Bersih)</h4>
                    <p className="text-[11px] text-slate-500">Mulai input data dari nol untuk orang baru</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold inline-flex items-center space-x-1">
                  <span>Direkomendasikan untuk data riil</span>
                </span>
              </div>

              {/* Option 2: Dari Template */}
              <div
                onClick={() => setStarterType("sample")}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  starterType === "sample"
                    ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20"
                    : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Gunakan Preset Contoh</h4>
                    <p className="text-[11px] text-slate-500">Isi otomatis dengan simulasi yang relevan</p>
                  </div>
                </div>
                <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-semibold">
                  Tersedia 3 preset skenario
                </span>
              </div>
            </div>
          </div>

          {/* Sub-pilihan jika memilih Preset */}
          {starterType === "sample" && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
              <label className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 block">
                Pilih Persona Dasar (Bisa Diedit):
              </label>
              <div className="space-y-1.5">
                {sampleProfiles.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => setSelectedSampleId(sample.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      selectedSampleId === sample.id
                        ? "bg-white dark:bg-slate-900 border-indigo-500 shadow-xs"
                        : "bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-white"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{sample.name}</span>
                      <span className="text-[10px] text-slate-500">{sample.badge} • {sample.tagline.slice(0, 48)}...</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedSampleId === sample.id ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300"}`}>
                      {selectedSampleId === sample.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              <span>Mulai Profiling Orang Baru</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
