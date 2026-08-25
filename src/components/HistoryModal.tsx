import React from "react";
import { ProfilingHistoryRecord } from "../types";
import {
  X,
  History,
  Trash2,
  Download,
  UploadCloud,
  CheckCircle2,
  Calendar,
  User,
  UserPlus,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { generateFinancialPlanPDF } from "../utils/pdfExport";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ProfilingHistoryRecord[];
  onLoadRecord: (record: ProfilingHistoryRecord) => void;
  onDeleteRecord: (id: string) => void;
  onAddNewProfile?: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onLoadRecord,
  onDeleteRecord,
  onAddNewProfile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-blue-900/60 flex items-center justify-between bg-[#002266] text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#0055B8] text-white border border-blue-400/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">
                Arsip & Riwayat Profiling Nasabah
              </h2>
              <p className="text-xs text-blue-200">
                Daftar {history.length} snapshot sesi perencanaan finansial yang tersimpan lokal
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onAddNewProfile && (
              <button
                onClick={() => {
                  onClose();
                  onAddNewProfile();
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Profil Baru</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-blue-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {history.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 space-y-3">
              <History className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Belum Ada History Profiling</h4>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Setelah Anda mengisi form dan membuat rencana keuangan, klik tombol "Simpan ke History" untuk menyimpan snapshot profil Anda.
              </p>
              {onAddNewProfile && (
                <button
                  onClick={() => {
                    onClose();
                    onAddNewProfile();
                  }}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Buat Profil Baru Sekarang</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/50 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {record.title || `Profiling - ${record.profile.fullName || "User"}`}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                          Skor: {record.planResult.healthScore}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Dibuat pada:{" "}
                        {(() => {
                          try {
                            const d = new Date(record.date);
                            return isNaN(d.getTime())
                              ? record.date
                              : d.toLocaleString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                });
                          } catch {
                            return record.date;
                          }
                        })()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          onLoadRecord(record);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Buka Profiling</span>
                      </button>

                      <button
                        onClick={() =>
                          generateFinancialPlanPDF({
                            plan: record.planResult,
                            profile: record.profile,
                            cashflow: record.cashflow,
                            goals: record.goals,
                            career: record.career,
                            risk: record.risk,
                          })
                        }
                        className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteRecord(record.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Hapus History"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Kekayaan Bersih:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        Rp {record.planResult.multiYearProjections[0]?.projectedNetWorth.toLocaleString("id-ID") || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Rasio Tabungan:</span>
                      <span className="font-bold text-emerald-600">
                        {record.planResult.ojkRatios.savingsRatio.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Rasio Utang (DSR):</span>
                      <span className="font-bold text-amber-600">
                        {record.planResult.ojkRatios.debtServiceRatio.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Profil Risiko:</span>
                      <span className="font-bold text-indigo-600">
                        {record.risk.profileType}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
