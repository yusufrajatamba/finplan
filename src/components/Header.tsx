import React, { useState } from "react";
import {
  BookOpen,
  Calculator,
  MessageSquareText,
  Sparkles,
  ChevronRight,
  UserCheck,
  UserPlus,
  Moon,
  Sun,
  History,
  Download,
  Lock,
} from "lucide-react";
import { SampleProfileData, sampleProfiles } from "../data/sampleProfiles";
import { WizardStep } from "../types";

interface HeaderProps {
  currentStep: WizardStep;
  onSelectStep?: (step: WizardStep) => void;
  onStepClick?: (step: WizardStep) => void;
  onOpenTeoriModal?: () => void;
  onOpenTeori?: () => void;
  onOpenCalculators?: () => void;
  onOpenAdvisorChat?: () => void;
  onOpenAIChat?: () => void;
  onOpenHistory?: () => void;
  onOpenNewProfile?: () => void;
  onExportPDF?: () => void;
  onLoadSample: (sample: SampleProfileData) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  hasPlan?: boolean;
  hasGeneratedPlan?: boolean;
  onLockApp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onSelectStep,
  onStepClick,
  onOpenTeoriModal,
  onOpenTeori,
  onOpenCalculators,
  onOpenAdvisorChat,
  onOpenAIChat,
  onOpenHistory,
  onOpenNewProfile,
  onExportPDF,
  onLoadSample,
  isDarkMode,
  onToggleTheme,
  hasPlan,
  hasGeneratedPlan,
}) => {
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);

  const handleStepClick = (step: WizardStep) => {
    if (onSelectStep) {
      onSelectStep(step);
    } else if (onStepClick) {
      onStepClick(step);
    }
  };

  const handleOpenTeori = () => {
    if (onOpenTeoriModal) {
      onOpenTeoriModal();
    } else if (onOpenTeori) {
      onOpenTeori();
    }
  };

  const handleOpenChat = () => {
    if (onOpenAdvisorChat) {
      onOpenAdvisorChat();
    } else if (onOpenAIChat) {
      onOpenAIChat();
    }
  };

  const steps: { id: WizardStep; num: number; label: string; shortLabel: string }[] = [
    { id: "data_diri", num: 1, label: "Data Diri", shortLabel: "Diri" },
    { id: "arus_kas", num: 2, label: "Arus Kas & Aset", shortLabel: "Kas & Aset" },
    { id: "karier", num: 3, label: "Profile Karier", shortLabel: "Karier" },
    { id: "goals", num: 4, label: "Target Goals", shortLabel: "Goals" },
    { id: "teori", num: 5, label: "Teori OJK", shortLabel: "Teori" },
    { id: "profil_risiko", num: 6, label: "Profil Risiko", shortLabel: "Risiko" },
    { id: "rencana", num: 7, label: "Rencana Keuangan", shortLabel: "Rencana" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Branding */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleStepClick("data_diri")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  FinPlan Mandiri
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  CFP AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Profiling Keuangan & Download Laporan PDF Tanpa Login
              </p>
            </div>
          </div>

          {/* Action Tools & Menu Bar */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Direct PDF Download Button (Visible when plan exists) */}
            {(hasPlan || hasGeneratedPlan) && onExportPDF && (
              <button
                onClick={onExportPDF}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-600/30 transition-all cursor-pointer animate-in fade-in"
                title="Download PDF Laporan Profiling Keuangan Lengkap"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download PDF</span>
              </button>
            )}

            {/* Quick Tool: History Profiling */}
            <button
              onClick={onOpenHistory}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
              title="Riwayat Profiling Tersimpan di Browser"
            >
              <History className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Riwayat Profiling</span>
            </button>

            {/* Quick Tool: Teori Keuangan OJK */}
            <button
              onClick={handleOpenTeori}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
              title="Teori Keuangan & Standar OJK"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden lg:inline">Teori Keuangan</span>
            </button>

            {/* Quick Tool: Kalkulator */}
            <button
              onClick={onOpenCalculators}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
              title="Kalkulator KPR, Dana Darurat & Pensiun"
            >
              <Calculator className="w-3.5 h-3.5 text-purple-500" />
              <span className="hidden lg:inline">Kalkulator</span>
            </button>

            {/* Preset Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSampleDropdown(!showSampleDropdown)}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span className="hidden sm:inline">Contoh Profil</span>
              </button>

              {showSampleDropdown && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Pilih Preset Simulasi</span>
                    {onOpenNewProfile && (
                      <button
                        onClick={() => {
                          setShowSampleDropdown(false);
                          onOpenNewProfile();
                        }}
                        className="text-emerald-600 hover:text-emerald-500 font-bold lowercase text-[11px] cursor-pointer"
                      >
                        + form kosong
                      </button>
                    )}
                  </div>
                  {sampleProfiles.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => {
                        onLoadSample(sample);
                        setShowSampleDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex flex-col space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {sample.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                          {sample.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {sample.tagline}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Tool: Tambah Profil Baru (Orang Berbeda) */}
            {onOpenNewProfile && (
              <button
                onClick={onOpenNewProfile}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 transition-colors cursor-pointer"
                title="Tambah Profil Baru untuk Orang yang Berbeda"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">+ Profil Baru</span>
              </button>
            )}

            {/* Chatbot Button (AI CFP Advisor) */}
            <button
              onClick={handleOpenChat}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs shadow-teal-500/20 transition-colors cursor-pointer"
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chat AI CFP</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isDarkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Lock App */}
            {onLockApp && (
              <button
                onClick={onLockApp}
                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                title="Kunci Akses FinPlan"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Wizard Step Progress Bar */}
        <div className="py-2 border-t border-slate-100 dark:border-slate-800/60 overflow-x-auto scrollbar-none">
          <nav className="flex items-center justify-between min-w-[700px] sm:min-w-0 space-x-1 sm:space-x-2">
            {steps.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isPast = currentStepIndex > idx;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => handleStepClick(step.id)}
                    className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all w-full justify-center sm:justify-start cursor-pointer ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-xs"
                        : isPast
                        ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100/80"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive
                          ? "bg-white text-emerald-700"
                          : isPast
                          ? "bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {step.num}
                    </span>
                    <span className="whitespace-nowrap font-medium">
                      <span className="hidden md:inline">{step.label}</span>
                      <span className="md:hidden">{step.shortLabel}</span>
                    </span>
                  </button>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 mx-1 shrink-0 hidden sm:block" />
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
