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
        <div className="px-6 py-4 border-b border-blue-900/60 flex items-center justify-between bg-[#002266] text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#0055B8] text-white border border-blue-400/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">
                Tambah Profil Baru (Nasabah Berbeda)
              </h2>
              <p className="text-xs text-blue-200">
                Buat sesi perencanaan keuangan mandiri untuk nasabah, pasangan, atau keluarga baru
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-blue-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Info Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#0055B8] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">Profil aktif saat ini: </span>
              <span className="text-[#003399] dark:text-blue-400 font-bold">
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
              Nama Lengkap Nasabah / Anggota Keluarga Baru <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Rina Wijaya / Budi Santoso / Adik - Fahri"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#0055B8] focus:border-[#0055B8] outline-none transition-all placeholder:text-slate-400"
              autoFocus
            />
          </div>

          {/* Pilih Titik Awal (Starter Type) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Pilihan Formulir Awal
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStarterType("empty")}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  starterType === "empty"
                    ? "border-[#003399] bg-blue-50/70 dark:bg-blue-950/40 text-[#003399] dark:text-blue-300 ring-2 ring-[#003399]/20"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900 text-[#003399] dark:text-blue-300">
                    <FileText className="w-4 h-4" />
                  </div>
                  {starterType === "empty" && (
                    <CheckCircle2 className="w-4 h-4 text-[#003399]" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-0.5">
                    Form Kosong
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Mulai dari nol untuk diisi sendiri
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStarterType("sample")}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  starterType === "sample"
                    ? "border-[#003399] bg-blue-50/70 dark:bg-blue-950/40 text-[#003399] dark:text-blue-300 ring-2 ring-[#003399]/20"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900 text-[#003399] dark:text-blue-300">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  {starterType === "sample" && (
                    <CheckCircle2 className="w-4 h-4 text-[#003399]" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-0.5">
                    Gunakan Template
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Pilih profil simulasi siap pakai
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Sub-pilihan jika memilih "sample" */}
          {starterType === "sample" && (
            <div className="space-y-2 pt-1 animate-in fade-in duration-200">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Pilih Persona Template Finansial:
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {sampleProfiles.map((sample) => (
                  <button
                    type="button"
                    key={sample.id}
                    onClick={() => setSelectedSampleId(sample.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedSampleId === sample.id
                        ? "border-[#003399] bg-blue-50/60 dark:bg-blue-950/30 ring-1 ring-[#003399]"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#003399] dark:text-blue-300">
                        {sample.id === "keluarga_muda" ? (
                          <Home className="w-4 h-4" />
                        ) : sample.id === "sandwich_generation" ? (
                          <Briefcase className="w-4 h-4" />
                        ) : (
                          <TrendingUp className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {sample.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {sample.badge} • {sample.profile.housingStatus === "kos" ? "Kos" : "Sewa / KPR"}
                        </div>
                      </div>
                    </div>
                    {selectedSampleId === sample.id && (
                      <CheckCircle2 className="w-4 h-4 text-[#003399] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#003399] hover:bg-[#002266] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <span>Mulai Sesi Profil Baru</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
