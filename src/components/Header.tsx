import React, { useState } from "react";
import {
  BookOpen,
  Calculator,
  MessageSquareText,
  ShieldCheck,
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
  onGoHome?: () => void;
  isLandingPage?: boolean;
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
  onLockApp,
  onGoHome,
  isLandingPage,
}) => {
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);
  const [lang, setLang] = useState<"ID" | "EN">("ID");

  const handleStepClick = (step: WizardStep) => {
    if (onSelectStep) {
      onSelectStep(step);
    } else if (onStepClick) {
      onStepClick(step);
    }
  };

  const handleOpenEducation = () => {
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

  // Fixed labels with updated Step 5 Profil Risiko and Step 6 Evaluasi Rasio & Standar OJK
  const steps: { id: WizardStep; num: number; label: string; shortLabel: string }[] = [
    { id: "data_diri", num: 1, label: "Data Diri", shortLabel: "Data Diri" },
    { id: "arus_kas", num: 2, label: "Arus Kas & Aset", shortLabel: "Arus Kas" },
    { id: "karier", num: 3, label: "Profil Karier", shortLabel: "Karier" },
    { id: "goals", num: 4, label: "Target Finansial", shortLabel: "Target" },
    { id: "profil_risiko", num: 5, label: "Profil Risiko", shortLabel: "Risiko" },
    { id: "teori", num: 6, label: "Evaluasi Rasio & OJK", shortLabel: "Evaluasi OJK" },
    { id: "rencana", num: 7, label: "Rencana Keuangan", shortLabel: "Rencana" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <header className="sticky top-0 z-40 shadow-xs">
      {/* ── Top Corporate Utility Bar (Bright Executive Blue #0055B8) ── */}
      <div className="bg-[#0055B8] dark:bg-slate-950 text-white text-xs border-b border-blue-400/30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11">
          {/* Left: Corporate Logo & Identity */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div
              className="flex items-center space-x-2.5 cursor-pointer py-1 group"
              onClick={() => {
                if (onGoHome) {
                  onGoHome();
                } else {
                  handleStepClick("data_diri");
                }
              }}
              title="Kembali ke Halaman Utama"
            >
              {/* Modern Crisp Crest Logo */}
              <div className="w-7 h-7 rounded-lg bg-white group-hover:bg-blue-50 flex items-center justify-center font-black text-[#0055B8] text-xs shadow-md transition-colors">
                FP
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-sm text-white leading-tight font-heading group-hover:text-blue-100 transition-colors">
                  FinPlan
                </span>
                <span className="text-[9px] text-blue-100 tracking-wider font-light hidden sm:inline">
                  Senantiasa di Sisi Anda
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center text-[11px] text-blue-100 pl-3 border-l border-blue-400/40">
              <span>Portal Perencanaan Finansial Mandiri Terpercaya</span>
            </div>
          </div>

          {/* Right Utility: Language Switcher, CFP/OJK Badge, Theme Toggle, Security Lock */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* OJK & CFP Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 text-[11px] text-white bg-white/15 px-2.5 py-1 rounded-full border border-white/25">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Standar CFP® & Kepatuhan OJK</span>
            </div>

            {/* Language Switcher Pill */}
            <div className="inline-flex rounded-md bg-blue-900/50 dark:bg-slate-900 p-0.5 border border-white/20 text-[10px] font-bold">
              <button
                onClick={() => setLang("ID")}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  lang === "ID"
                    ? "bg-white text-[#0055B8] shadow-xs"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLang("EN")}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  lang === "EN"
                    ? "bg-white text-[#0055B8] shadow-xs"
                    : "text-blue-100 hover:text-white"
                }`}
              >
                EN
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-1 rounded-md text-blue-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              title={isDarkMode ? "Mode Terang" : "Mode Gelap"}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Lock App Security Button */}
            {onLockApp && (
              <button
                onClick={onLockApp}
                className="p-1 rounded-md text-blue-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                title="Kunci Akses FinPlan (Logout)"
              >
                <Lock className="w-3.5 h-3.5 text-blue-100" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Banking Tab Bar (White / Dark Slate) ── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-2">
            {/* Left Nav Tabs (with Blue Active Underline) */}
            <nav className="flex items-center space-x-2 sm:space-x-6 overflow-x-auto scrollbar-none py-1 h-full shrink min-w-0">
              <button
                onClick={() => handleStepClick("data_diri")}
                className="bca-nav-tab h-full flex items-center px-2 sm:px-3 text-xs sm:text-sm cursor-pointer whitespace-nowrap active text-[#0066CC] font-bold shrink-0"
              >
                Perencanaan Finansial
              </button>

              <button
                onClick={handleOpenEducation}
                className="bca-nav-tab h-full flex items-center px-2 sm:px-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:text-[#0066CC] cursor-pointer whitespace-nowrap shrink-0"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-600 mr-1.5 hidden sm:inline" />
                <span>Edukatips Finansial</span>
              </button>

              <button
                onClick={onOpenCalculators}
                className="bca-nav-tab h-full flex items-center px-2 sm:px-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:text-[#0066CC] cursor-pointer whitespace-nowrap shrink-0"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-600 mr-1.5 hidden sm:inline" />
                <span>Simulasi & Kalkulator</span>
              </button>

              <button
                onClick={onOpenHistory}
                className="bca-nav-tab h-full flex items-center px-2 sm:px-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:text-[#0066CC] cursor-pointer whitespace-nowrap shrink-0"
              >
                <History className="w-3.5 h-3.5 text-amber-600 mr-1.5 hidden sm:inline" />
                <span>Riwayat Profiling</span>
              </button>
            </nav>

            {/* Right Action Tools */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              {/* Preset Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSampleDropdown(!showSampleDropdown)}
                  className={`inline-flex items-center justify-center p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    showSampleDropdown
                      ? "bg-blue-100 dark:bg-blue-900/60 text-[#003399] dark:text-blue-300 border-blue-400"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300/80 dark:border-slate-700"
                  }`}
                  title="Pilih Template Profil"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#0055B8]" />
                  <span className="hidden md:inline ml-1.5">Template Profil</span>
                </button>

                {showSampleDropdown && (
                  <>
                    {/* Mobile Backdrop to prevent clipping and enable outside tap */}
                    <div
                      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:hidden animate-in fade-in duration-150"
                      onClick={() => setShowSampleDropdown(false)}
                    />

                    {/* Responsive Modal/Dropdown Container */}
                    <div className="fixed inset-x-3 top-24 z-50 max-h-[80vh] overflow-y-auto max-w-sm mx-auto sm:max-h-none sm:overflow-visible sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 sm:mx-0 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2.5 sm:p-2 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-1">
                        <span>Pilih Template Simulasi</span>
                        {onOpenNewProfile && (
                          <button
                            onClick={() => {
                              setShowSampleDropdown(false);
                              onOpenNewProfile();
                            }}
                            className="text-[#0055B8] dark:text-blue-400 hover:underline font-bold text-[11px] cursor-pointer"
                          >
                            + Form Kosong
                          </button>
                        )}
                      </div>
                      <div className="space-y-1">
                        {sampleProfiles.map((sample) => (
                          <button
                            key={sample.id}
                            onClick={() => {
                              onLoadSample(sample);
                              setShowSampleDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2.5 sm:py-2 rounded-xl sm:rounded-lg text-xs hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-colors flex flex-col space-y-0.5 cursor-pointer"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-slate-900 dark:text-white truncate">
                                {sample.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#003399] dark:text-blue-300 font-bold shrink-0">
                                {sample.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {sample.tagline}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Direct PDF Export */}
              {(hasPlan || hasGeneratedPlan) && onExportPDF && (
                <button
                  onClick={onExportPDF}
                  className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-1.5 text-xs font-bold rounded-lg bg-[#0055B8] hover:bg-[#003399] text-white shadow-xs transition-all cursor-pointer"
                  title="Unduh Laporan PDF Resmi FinPlan"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline ml-1.5">Laporan PDF</span>
                </button>
              )}

              {/* Tambah Profil Baru */}
              {onOpenNewProfile && (
                <button
                  onClick={onOpenNewProfile}
                  className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-1.5 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all cursor-pointer"
                  title="Tambah Profil Baru (Orang Berbeda)"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline ml-1.5">+ Profil Baru</span>
                </button>
              )}

              {/* Halo FinPlan Advisory Chat */}
              <button
                onClick={handleOpenChat}
                className="inline-flex items-center justify-center p-2 sm:px-3.5 sm:py-1.5 text-xs font-bold rounded-lg bg-[#003399] hover:bg-[#002266] text-white shadow-xs transition-all cursor-pointer"
                title="Konsultasi Halo FinPlan CFP® Advisor"
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                <span className="hidden md:inline ml-1.5">Halo FinPlan CFP®</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stepper Navigation (1-7 Perbankan, No Duplicate Numbering) ── */}
      {currentStep !== "loading_plan" && !isLandingPage && (
        <div className="bg-[#F4F6F9] dark:bg-slate-950/80 border-b border-slate-200/90 dark:border-slate-800 py-2 sm:py-2.5">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 overflow-x-auto scrollbar-none py-0.5">
              {steps.map((s, idx) => {
                const isActive = s.id === currentStep;
                const isPast = idx < currentStepIndex;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleStepClick(s.id)}
                    className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? "bg-[#003399] text-white shadow-xs"
                        : isPast
                        ? "bg-blue-100/70 text-[#003399] dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-200/60"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive
                          ? "bg-white text-[#003399]"
                          : isPast
                          ? "bg-[#003399] text-white"
                          : "bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {isPast ? "✓" : s.num}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{s.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
