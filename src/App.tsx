import React, { useState, useEffect } from "react";
import {
  UserProfile,
  CashflowData,
  CareerProfile,
  TargetGoalsData,
  RiskProfileData,
  FinancialPlanResult,
  ProfilingHistoryRecord,
  WizardStep,
} from "./types";
import { sampleProfiles, createEmptyProfileData, SampleProfileData } from "./data/sampleProfiles";
import { Header } from "./components/Header";
import { MarketInsightsBanner } from "./components/MarketInsightsBanner";
import { LandingPage } from "./components/LandingPage";
import { StepDataDiri } from "./components/StepDataDiri";
import { StepProfileKeuangan } from "./components/StepProfileKeuangan";
import { StepProfileKarier } from "./components/StepProfileKarier";
import { StepGoals } from "./components/StepGoals";
import { StepProfilRisiko } from "./components/StepProfilRisiko";
import { StepTeoriKeuangan } from "./components/StepTeoriKeuangan";
import { StepRencanaKeuangan } from "./components/StepRencanaKeuangan";

import { HistoryModal } from "./components/HistoryModal";
import { AIChatModal } from "./components/AIChatModal";
import { CalculatorsModal } from "./components/CalculatorsModal";
import { EducationModal } from "./components/EducationModal";
import { NewProfileModal } from "./components/NewProfileModal";
import { PostSaveModal } from "./components/PostSaveModal";
import { AuthGateModal } from "./components/AuthGateModal";
import { LockSessionModal } from "./components/LockSessionModal";
import { LoadingPlanScreen } from "./components/LoadingPlanScreen";
import { generateFinancialPlanPDF } from "./utils/pdfExport";
import { generateDeterministicFinancialPlan } from "./utils/financialCalculations";
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function App() {
  // Security lock state (Requires password on first visit or when locked)
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return localStorage.getItem("finplan_access_granted") !== "true";
  });
  const [isLockPromptOpen, setIsLockPromptOpen] = useState<boolean>(false);

  // Theme state: Default strictly to light theme (clean white background)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme_mode") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme_mode", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme_mode", "light");
    }
  }, [isDarkMode]);

  // Landing page vs Wizard view state
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);

  // Active wizard step
  const [currentStep, setCurrentStep] = useState<WizardStep>("data_diri");

  // Modal open states
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState<boolean>(false);
  const [isEducationOpen, setIsEducationOpen] = useState<boolean>(false);
  const [isNewProfileModalOpen, setIsNewProfileModalOpen] = useState<boolean>(false);
  const [isPostSaveModalOpen, setIsPostSaveModalOpen] = useState<boolean>(false);

  // User input states with localStorage persistence
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("user_profile_data_v3");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return createEmptyProfileData().profile;
  });

  const [cashflow, setCashflow] = useState<CashflowData>(() => {
    const saved = localStorage.getItem("user_cashflow_data_v3");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return createEmptyProfileData().cashflow;
  });

  const [career, setCareer] = useState<CareerProfile>(() => {
    const saved = localStorage.getItem("user_career_data_v3");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return createEmptyProfileData().career;
  });

  const [goals, setGoals] = useState<TargetGoalsData>(() => {
    const saved = localStorage.getItem("user_goals_data_v3");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return createEmptyProfileData().goals;
  });

  const [risk, setRisk] = useState<RiskProfileData>(() => {
    const saved = localStorage.getItem("user_risk_data_v3");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return createEmptyProfileData().risk;
  });

  // Generated Plan & History states
  const [planResult, setPlanResult] = useState<FinancialPlanResult | null>(() => {
    const saved = localStorage.getItem("user_plan_result_v3");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return null;
  });

  const [history, setHistory] = useState<ProfilingHistoryRecord[]>(() => {
    const saved = localStorage.getItem("user_profiling_history_v3");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return [];
  });

  // UI state
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync states to LocalStorage
  useEffect(() => {
    localStorage.setItem("user_profile_data_v3", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("user_cashflow_data_v3", JSON.stringify(cashflow));
  }, [cashflow]);

  useEffect(() => {
    localStorage.setItem("user_career_data_v3", JSON.stringify(career));
  }, [career]);

  useEffect(() => {
    localStorage.setItem("user_goals_data_v3", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("user_risk_data_v3", JSON.stringify(risk));
  }, [risk]);

  useEffect(() => {
    if (planResult) {
      localStorage.setItem("user_plan_result_v3", JSON.stringify(planResult));
    }
  }, [planResult]);

  useEffect(() => {
    localStorage.setItem("user_profiling_history_v3", JSON.stringify(history));
  }, [history]);

  // Toast auto-hide
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Reset to brand new profile or load chosen starter template
  const handleConfirmCreateNew = (params: {
    name: string;
    starterType: "empty" | "sample";
    sampleData?: SampleProfileData;
  }) => {
    if (params.starterType === "sample" && params.sampleData) {
      handleLoadSample(params.sampleData);
    } else {
      const emptyData = createEmptyProfileData();
      emptyData.profile.fullName = params.name;

      setProfile(emptyData.profile);
      setCashflow(emptyData.cashflow);
      setCareer(emptyData.career);
      setGoals(emptyData.goals);
      setRisk(emptyData.risk);

      const instantPlan = generateDeterministicFinancialPlan({
        profile: emptyData.profile,
        cashflow: emptyData.cashflow,
        career: emptyData.career,
        goals: emptyData.goals,
        risk: emptyData.risk,
      });
      setPlanResult(instantPlan);

      setIsLandingPage(false);
      setCurrentStep("data_diri");
      setIsNewProfileModalOpen(false);
      showToast(`Profil baru "${params.name}" berhasil dibuat.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Load sample profile
  const handleLoadSample = (sample: SampleProfileData) => {
    setProfile(sample.profile);
    setCashflow(sample.cashflow);
    setCareer(sample.career);
    setGoals(sample.goals);
    setRisk(sample.risk);

    const instantPlan = generateDeterministicFinancialPlan({
      profile: sample.profile,
      cashflow: sample.cashflow,
      career: sample.career,
      goals: sample.goals,
      risk: sample.risk,
    });
    setPlanResult(instantPlan);

    setIsLandingPage(false);
    setCurrentStep("rencana");
    showToast(`Contoh profil "${sample.name}" berhasil dimuat.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle plan generation (Calling backend or local deterministic fallback)
  const handleGenerateAIPlan = async () => {
    setIsGeneratingPlan(true);
    setCurrentStep("loading_plan");
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Artificial tiny delay for smooth UX loading animation
    await new Promise((r) => setTimeout(r, 1200));

    try {
      const response = await fetch("/api/financial-plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          cashflow,
          career,
          goals,
          risk,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.plan) {
          setPlanResult(data.plan);
          setCurrentStep("rencana");
          showToast("Rencana keuangan CFP berhasil dibuat!");
          window.scrollTo({ top: 0, behavior: "smooth" });
          setIsGeneratingPlan(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Server API not available (static hosting/offline). Using client deterministic CFP engine.");
    }

    // Client-side instant deterministic calculation fallback (Works 100% on Vercel & Offline)
    try {
      const localPlan = generateDeterministicFinancialPlan({
        profile,
        cashflow,
        career,
        goals,
        risk,
      });
      setPlanResult(localPlan);
      setCurrentStep("rencana");
      showToast("Rencana keuangan CFP berstandar OJK berhasil dibuat!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Local generate plan error:", err);
      setErrorMessage(err.message || "Gagal memproses data. Silakan coba lagi.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Handle direct PDF export
  const handleDownloadPDF = () => {
    if (planResult) {
      generateFinancialPlanPDF({
        plan: planResult,
        profile,
        cashflow,
        goals,
        career,
        risk,
      });
      showToast("Mengunduh Laporan PDF Profiling Keuangan...");
    } else {
      showToast("Silakan lengkapi data dan buat rencana keuangan terlebih dahulu.");
    }
  };

  // Save current session to history
  const handleSaveToHistory = () => {
    if (!planResult) {
      showToast("Harap buat rencana keuangan terlebih dahulu sebelum menyimpan.");
      return;
    }

    const newRecord: ProfilingHistoryRecord = {
      id: `hist_${Date.now()}`,
      date: new Date().toISOString(),
      title: `${profile.fullName || "User"} (${risk.profileType})`,
      profile,
      cashflow,
      career,
      goals,
      risk,
      planResult,
    };

    setHistory((prev) => [newRecord, ...prev]);
    showToast(`Profil ${profile.fullName || "klien"} berhasil disimpan!`);
    setIsPostSaveModalOpen(true);
  };

  // Load record from history
  const handleLoadHistoryRecord = (record: ProfilingHistoryRecord) => {
    setProfile(record.profile);
    setCashflow(record.cashflow);
    setCareer(record.career);
    setGoals(record.goals);
    setRisk(record.risk);
    setPlanResult(record.planResult);
    setIsLandingPage(false);
    setCurrentStep("rencana");
    showToast("Snapshot riwayat berhasil dimuat!");
  };

  const handleDeleteHistoryRecord = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    showToast("Snapshot riwayat telah dihapus.");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Real-time Ticker Banner */}
      <MarketInsightsBanner />

      {/* Main Header with Step Nav & Tool Buttons */}
      <Header
        currentStep={currentStep}
        isLandingPage={isLandingPage}
        onGoHome={() => {
          setIsLandingPage(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onSelectStep={(step) => {
          setIsLandingPage(false);
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onStepClick={(step) => {
          setIsLandingPage(false);
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenNewProfile={() => setIsNewProfileModalOpen(true)}
        onOpenTeori={() => {
          setIsLandingPage(false);
          setCurrentStep("teori");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenTeoriModal={() => setIsEducationOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onOpenAdvisorChat={() => setIsAIChatOpen(true)}
        onOpenCalculators={() => setIsCalculatorsOpen(true)}
        onExportPDF={handleDownloadPDF}
        onLoadSample={handleLoadSample}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onLockApp={() => setIsLockPromptOpen(true)}
        hasPlan={!!planResult}
        hasGeneratedPlan={!!planResult}
      />

      {/* Main App Container */}
      <main className="flex-1 w-full">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 sm:top-20 right-3 left-3 sm:left-auto sm:right-6 max-w-md z-50 p-3 sm:p-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl border border-slate-700/50 text-xs font-semibold flex items-center space-x-2 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
              <div className="flex-1 text-xs">
                <span className="font-bold block">Pemberitahuan Sistem:</span>
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => handleGenerateAIPlan()}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Coba Lagi</span>
              </button>
            </div>
          </div>
        )}

        {/* ─── CONDITIONAL SCREEN: LANDING GATEWAY vs WIZARD ─── */}
        {isLandingPage ? (
          <LandingPage
            onStartPlanning={() => {
              setIsLandingPage(false);
              setCurrentStep("data_diri");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onOpenEducation={() => setIsEducationOpen(true)}
            onOpenCalculators={() => setIsCalculatorsOpen(true)}
            onOpenAIChat={() => setIsAIChatOpen(true)}
          />
        ) : (
          <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-6">
            {/* STEP 1: Data Diri */}
            {currentStep === "data_diri" && (
              <StepDataDiri
                profile={profile}
                onChange={setProfile}
                onAddNewProfile={() => setIsNewProfileModalOpen(true)}
                onNext={() => {
                  setCurrentStep("arus_kas");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {/* STEP 2: Profile Keuangan (Arus Kas, Pengeluaran & Aset) */}
            {currentStep === "arus_kas" && (
              <StepProfileKeuangan
                cashflow={cashflow}
                onChange={setCashflow}
                onNext={() => {
                  setCurrentStep("karier");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onPrev={() => {
                  setCurrentStep("data_diri");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {/* STEP 3: Profile Karier & Pekerjaan */}
            {currentStep === "karier" && (
              <StepProfileKarier
                career={career}
                onChange={setCareer}
                hasPartner={profile.maritalStatus === "Menikah"}
                onNext={() => {
                  setCurrentStep("goals");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onPrev={() => {
                  setCurrentStep("arus_kas");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {/* STEP 4: Target & Goals Impian */}
            {currentStep === "goals" && (
              <StepGoals
                goals={goals}
                cashflow={cashflow}
                profile={profile}
                onChange={setGoals}
                onNext={() => {
                  setCurrentStep("profil_risiko");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onPrev={() => {
                  setCurrentStep("karier");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {/* STEP 5: Profil Risiko (Sekarang Step 5) */}
            {currentStep === "profil_risiko" && (
              <StepProfilRisiko
                riskData={risk}
                onChange={setRisk}
                onNext={() => {
                  setCurrentStep("teori");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onPrev={() => {
                  setCurrentStep("goals");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {/* STEP 6: Evaluasi Rasio Keuangan & Standar OJK (Sekarang Step 6) */}
            {currentStep === "teori" && (
              <StepTeoriKeuangan
                cashflow={cashflow}
                profile={profile}
                onNext={() => {
                  handleGenerateAIPlan();
                }}
                onPrev={() => {
                  setCurrentStep("profil_risiko");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {/* LOADING: Generating Plan */}
            {currentStep === "loading_plan" && (
              <LoadingPlanScreen profileName={profile.fullName} />
            )}

            {/* STEP 7: Rencana Keuangan Komprehensif */}
            {currentStep === "rencana" && (
              <StepRencanaKeuangan
                plan={planResult}
                profile={profile}
                cashflow={cashflow}
                goals={goals}
                career={career}
                risk={risk}
                isLoadingAI={isGeneratingPlan}
                onGenerateAIPlan={handleGenerateAIPlan}
                onSaveToHistory={handleSaveToHistory}
                onAddNewProfile={() => setIsNewProfileModalOpen(true)}
                onOpenAIChat={() => setIsAIChatOpen(true)}
                onPrev={() => {
                  setCurrentStep("teori");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* Corporate Banking Footer */}
      <footer className="mt-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => {
              setIsLandingPage(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="w-7 h-7 rounded-lg bg-[#0055B8] group-hover:bg-[#0047BA] flex items-center justify-center font-black text-white text-xs shadow-inner transition-colors">
              FP
            </div>
            <div>
              <span className="font-extrabold text-slate-800 dark:text-white block text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                FinPlan Indonesia
              </span>
              <span className="text-[11px] text-slate-400">
                Solusi Perencanaan Finansial Mandiri Berstandar Certified Financial Planner (CFP®) & OJK
              </span>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-400 space-y-1">
            <p>🔒 Data tersimpan aman di peramban lokal Anda tanpa login server pihak ketiga.</p>
            <p>© 2026 FinPlan Advisory Indonesia. Seluruh hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>

      {/* Modals for Profiling & Education */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadRecord={handleLoadHistoryRecord}
        onDeleteRecord={handleDeleteHistoryRecord}
        onAddNewProfile={() => setIsNewProfileModalOpen(true)}
      />

      <PostSaveModal
        isOpen={isPostSaveModalOpen}
        onClose={() => setIsPostSaveModalOpen(false)}
        profile={profile}
        risk={risk}
        plan={planResult}
        onAddNewProfile={() => setIsNewProfileModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onExportPDF={handleDownloadPDF}
      />

      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        profile={profile}
        cashflow={cashflow}
        goals={goals}
        risk={risk}
        plan={planResult}
      />

      <CalculatorsModal
        isOpen={isCalculatorsOpen}
        onClose={() => setIsCalculatorsOpen(false)}
      />

      <EducationModal
        isOpen={isEducationOpen}
        onClose={() => setIsEducationOpen(false)}
        onAskAI={() => setIsAIChatOpen(true)}
      />

      {/* New Profile Creation Modal */}
      <NewProfileModal
        isOpen={isNewProfileModalOpen}
        onClose={() => setIsNewProfileModalOpen(false)}
        currentProfileName={profile.fullName}
        onConfirmCreateNew={handleConfirmCreateNew}
      />

      {/* Lock Session Prompt Modal */}
      <LockSessionModal
        isOpen={isLockPromptOpen}
        onClose={() => setIsLockPromptOpen(false)}
        onConfirmLock={(customPin) => {
          if (customPin) {
            sessionStorage.setItem("finplan_session_lock_key", customPin);
          } else {
            sessionStorage.removeItem("finplan_session_lock_key");
          }
          localStorage.removeItem("finplan_access_granted");
          setIsLocked(true);
          showToast("Layar FinPlan berhasil dikunci.");
        }}
      />

      {/* Security Gate Password Modal */}
      {isLocked && (
        <AuthGateModal
          onUnlock={() => {
            setIsLocked(false);
            showToast("Akses FinPlan berhasil dibuka!");
          }}
          onResetSession={() => {
            localStorage.removeItem("user_profile_data_v3");
            localStorage.removeItem("user_cashflow_data_v3");
            localStorage.removeItem("user_career_data_v3");
            localStorage.removeItem("user_goals_data_v3");
            localStorage.removeItem("user_risk_data_v3");
            localStorage.removeItem("user_plan_result_v3");
            localStorage.removeItem("user_profiling_history_v3");
            localStorage.removeItem("finplan_saved_profiles_history");
            sessionStorage.clear();

            const fresh = createEmptyProfileData();
            setProfile(fresh.profile);
            setCashflow(fresh.cashflow);
            setCareer(fresh.career);
            setGoals(fresh.goals);
            setRisk(fresh.risk);
            setPlanResult(null);
            setHistory([]);
            setIsLandingPage(true);
            setCurrentStep("data_diri");
            showToast("Seluruh data input dan riwayat profiling berhasil direset bersih seperti baru.");
          }}
        />
      )}
    </div>
  );
}
