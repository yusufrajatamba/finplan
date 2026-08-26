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
  currentView?: "landing" | "wizard" | "education" | "calculators";
  onSelectView?: (view: "landing" | "wizard" | "education" | "calculators") => void;
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
  currentView,
  onSelectView,
}) => {
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);
  const [lang, setLang] = useState<"ID" | "EN">("ID");

  const handleStepClick = (step: WizardStep) => {
    if (onSelectView) {
      onSelectView("wizard");
    }
    if (onSelectStep) {
      onSelectStep(step);
    } else if (onStepClick) {
      onStepClick(step);
    }
  };

  const handleOpenEducation = () => {
    if (onSelectView) {
      onSelectView("education");
    } else if (onOpenTeoriModal) {
      onOpenTeoriModal();
    } else if (onOpenTeori) {
      onOpenTeori();
    }
  };

  const handleOpenCalculators = () => {
    if (onSelectView) {
      onSelectView("calculators");
    } else if (onOpenCalculators) {
      onOpenCalculators();
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
    <header className="sticky top-0 z-40 shadow-sm">
      {/* ── Top Clean Sub-Bar (White / Slate-900) ── */}
      <div className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          {/* Left: OJK & CFP Trust Badge */}
          <div className="flex items-center space-x-3 text-[11px]">
            <div className="flex items-center space-x-1.5 font-medium text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Standar CFP® & Kepatuhan OJK</span>
            </div>
            <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="hidden md:inline text-slate-500 dark:text-slate-400">
              Platform Perencanaan Finansial Keluarga Terpercaya
            </span>
          </div>

          {/* Right Utility: Language Switcher, Theme Toggle, Security Lock */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Language Switcher Pill */}
            <div className="inline-flex rounded-md bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700 text-[10px] font-bold">
              <button
                onClick={() => setLang("ID")}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  lang === "ID"
                    ? "bg-[#0B5DA7] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLang("EN")}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  lang === "EN"
                    ? "bg-[#0B5DA7] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                EN
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isDarkMode ? "Mode Terang" : "Mode Gelap"}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Lock App Security Button */}
            {onLockApp && (
              <button
                onClick={onLockApp}
                className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Kunci Akses FinPlan (Logout)"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main BFI Corporate Blue Bar (#0B5DA7) ── */}
      <div className="bg-[#0B5DA7] text-white transition-colors shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
            {/* Left: Brand Identity & Logo */}
            <div className="flex items-center space-x-4 sm:space-x-6 shrink-0">
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
                {/* BFI-Style Crisp White Logo Square */}
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-[#0B5DA7] text-sm shadow-md transition-transform group-hover:scale-105">
                  FP
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold tracking-tight text-base sm:text-lg text-white leading-tight font-heading">
                    FinPlan
                  </span>
                  <span className="text-[9px] text-blue-100 tracking-wider font-medium hidden sm:inline">
                    Financial Planning System
                  </span>
                </div>
              </div>

              {/* Navigation Links in Main Blue Bar */}
              <nav className="hidden lg:flex items-center space-x-1 sm:space-x-2 pl-2">
                <button
                  onClick={() => handleStepClick("data_diri")}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    currentView === "wizard" || (!isLandingPage && currentView !== "education" && currentView !== "calculators")
                      ? "bg-white/20 text-white font-bold shadow-xs"
                      : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Perencanaan Finansial
                </button>

                <button
                  onClick={handleOpenEducation}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    currentView === "education"
                      ? "bg-white/20 text-white font-bold shadow-xs"
                      : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Edukatips Finansial
                </button>

                <button
                  onClick={handleOpenCalculators}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    currentView === "calculators"
                      ? "bg-white/20 text-white font-bold shadow-xs"
                      : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Simulasi & Kalkulator
                </button>

                <button
                  onClick={onOpenHistory}
                  className="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-blue-100 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  Riwayat Profiling
                </button>
              </nav>
            </div>

            {/* Right Action Tools: Template Dropdown & BFI Vibrant Orange CTA */}
            <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
              {/* Preset Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSampleDropdown(!showSampleDropdown)}
                  className={`inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer border ${
                    showSampleDropdown
                      ? "bg-white text-[#0B5DA7] border-white shadow-xs font-bold"
                      : "bg-white/15 hover:bg-white/25 text-white border-white/20"
                  }`}
                  title="Pilih Template Profil"
                >
                  <UserCheck className="w-3.5 h-3.5 mr-1 sm:mr-1.5" />
                  <span>Template</span>
                </button>

                {showSampleDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:hidden animate-in fade-in duration-150"
                      onClick={() => setShowSampleDropdown(false)}
                    />

                    <div className="fixed inset-x-3 top-24 z-50 max-h-[80vh] overflow-y-auto max-w-sm mx-auto sm:max-h-none sm:overflow-visible sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 sm:mx-0 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2.5 sm:p-2 animate-in fade-in zoom-in-95 duration-100 text-slate-800 dark:text-slate-200">
                      <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-1">
                        <span>Pilih Template Simulasi</span>
                        {onOpenNewProfile && (
                          <button
                            onClick={() => {
                              setShowSampleDropdown(false);
                              onOpenNewProfile();
                            }}
                            className="text-[#0B5DA7] dark:text-blue-400 hover:underline font-bold text-[11px] cursor-pointer"
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
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#0B5DA7] dark:text-blue-300 font-bold shrink-0">
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
                  className="hidden sm:inline-flex items-center justify-center px-3 py-2 text-xs font-bold rounded-xl bg-white/20 hover:bg-white/30 text-white shadow-xs transition-all cursor-pointer border border-white/20"
                  title="Unduh Laporan PDF Resmi FinPlan"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>PDF</span>
                </button>
              )}

              {/* BFI Signature Vibrant Orange CTA Button */}
              <button
                onClick={handleOpenChat}
                className="inline-flex items-center justify-center px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl bg-[#E8701A] hover:bg-[#D6610E] text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
                title="Konsultasi Halo FinPlan CFP® Advisor"
              >
                <MessageSquareText className="w-3.5 h-3.5 mr-1.5" />
                <span>Konsultasi AI</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Secondary Row */}
          <div className="lg:hidden flex items-center space-x-2 overflow-x-auto scrollbar-none py-2 border-t border-white/15 text-xs">
            <button
              onClick={() => handleStepClick("data_diri")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold cursor-pointer ${
                currentView === "wizard" || (!isLandingPage && currentView !== "education" && currentView !== "calculators")
                  ? "bg-white text-[#0B5DA7] font-bold"
                  : "text-blue-100 hover:text-white"
              }`}
            >
              Perencanaan
            </button>
            <button
              onClick={handleOpenEducation}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer font-semibold ${
                currentView === "education"
                  ? "bg-white text-[#0B5DA7] font-bold"
                  : "text-blue-100 hover:text-white"
              }`}
            >
              Edukatips
            </button>
            <button
              onClick={handleOpenCalculators}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer font-semibold ${
                currentView === "calculators"
                  ? "bg-white text-[#0B5DA7] font-bold"
                  : "text-blue-100 hover:text-white"
              }`}
            >
              Kalkulator
            </button>
            <button
              onClick={onOpenHistory}
              className="px-3 py-1.5 rounded-lg whitespace-nowrap text-blue-100 hover:text-white cursor-pointer font-medium"
            >
              Riwayat
            </button>
          </div>
        </div>
      </div>

      {/* ── Stepper Navigation (1-7 Perbankan, Only in Wizard Mode) ── */}
      {currentStep !== "loading_plan" && !isLandingPage && (currentView === "wizard" || (!currentView && !isLandingPage)) && (
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
