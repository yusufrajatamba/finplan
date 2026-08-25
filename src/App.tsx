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
import { StepDataDiri } from "./components/StepDataDiri";
import { StepProfileKeuangan } from "./components/StepProfileKeuangan";
import { StepProfileKarier } from "./components/StepProfileKarier";
import { StepGoals } from "./components/StepGoals";
import { StepTeoriKeuangan } from "./components/StepTeoriKeuangan";
import { StepProfilRisiko } from "./components/StepProfilRisiko";
import { StepRencanaKeuangan } from "./components/StepRencanaKeuangan";

import { HistoryModal } from "./components/HistoryModal";
import { AIChatModal } from "./components/AIChatModal";
import { CalculatorsModal } from "./components/CalculatorsModal";
import { EducationModal } from "./components/EducationModal";
import { NewProfileModal } from "./components/NewProfileModal";
import { PostSaveModal } from "./components/PostSaveModal";
import { generateFinancialPlanPDF } from "./utils/pdfExport";
import { LoadingPlanScreen } from "./components/LoadingPlanScreen";
import { AuthGateModal } from "./components/AuthGateModal";

import { Bot, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";

export default function App() {
  // Authentication gatekeeper state (Password: finfreedom2026!)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("finplan_access_granted") === "true";
  });

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem("theme_mode") === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
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

  // Active step
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
    const saved = localStorage.getItem("user_profile_data_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return sampleProfiles[0].profile;
  });

  const [cashflow, setCashflow] = useState<CashflowData>(() => {
    const saved = localStorage.getItem("user_cashflow_data_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return sampleProfiles[0].cashflow;
  });

  const [career, setCareer] = useState<CareerProfile>(() => {
    const saved = localStorage.getItem("user_career_data_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return sampleProfiles[0].career;
  });

  const [goals, setGoals] = useState<TargetGoalsData>(() => {
    const saved = localStorage.getItem("user_goals_data_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return sampleProfiles[0].goals;
  });

  const [risk, setRisk] = useState<RiskProfileData>(() => {
    const saved = localStorage.getItem("user_risk_data_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return sampleProfiles[0].risk;
  });

  const [planResult, setPlanResult] = useState<FinancialPlanResult | null>(() => {
    const saved = localStorage.getItem("user_plan_result_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  // History records state
  const [history, setHistory] = useState<ProfilingHistoryRecord[]>(() => {
    const saved = localStorage.getItem("user_profiling_history_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Status & Notification state
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("user_profile_data_v2", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("user_cashflow_data_v2", JSON.stringify(cashflow));
  }, [cashflow]);

  useEffect(() => {
    localStorage.setItem("user_career_data_v2", JSON.stringify(career));
  }, [career]);

  useEffect(() => {
    localStorage.setItem("user_goals_data_v2", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("user_risk_data_v2", JSON.stringify(risk));
  }, [risk]);

  useEffect(() => {
    if (planResult) {
      localStorage.setItem("user_plan_result_v2", JSON.stringify(planResult));
    }
  }, [planResult]);

  useEffect(() => {
    localStorage.setItem("user_profiling_history_v2", JSON.stringify(history));
  }, [history]);

  // Load sample profile
  const handleLoadSample = (sample: (typeof sampleProfiles)[0]) => {
    setProfile(sample.profile);
    setCashflow(sample.cashflow);
    setCareer(sample.career);
    setGoals(sample.goals);
    setRisk(sample.risk);
    setPlanResult(null);
    setCurrentStep("data_diri");
    showToast(`Memuat template profil: ${sample.title}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Create new profile for another person
  const handleCreateNewProfile = ({
    name,
    starterType,
    sampleData,
  }: {
    name: string;
    starterType: "empty" | "sample";
    sampleData?: SampleProfileData;
  }) => {
    // If there is an existing plan and not yet in history, auto-archive it so no previous work is lost
    if (planResult) {
      const alreadySaved = history.some(
        (h) =>
          h.profile.fullName === profile.fullName &&
          h.date.slice(0, 10) === new Date().toISOString().slice(0, 10)
      );
      if (!alreadySaved) {
        const autoArchive: ProfilingHistoryRecord = {
          id: `hist_${Date.now()}`,
          date: new Date().toISOString(),
          title: `${profile.fullName || "User Sebelumnya"} (${risk.profileType})`,
          profile,
          cashflow,
          career,
          goals,
          risk,
          planResult,
        };
        setHistory((prev) => [autoArchive, ...prev]);
      }
    }

    if (starterType === "sample" && sampleData) {
      setProfile({
        ...sampleData.profile,
        fullName: name || sampleData.profile.fullName,
      });
      setCareer(sampleData.career);
      setCashflow(sampleData.cashflow);
      setGoals(sampleData.goals);
      setRisk(sampleData.risk);
    } else {
      const empty = createEmptyProfileData(name);
      setProfile(empty.profile);
      setCareer(empty.career);
      setCashflow(empty.cashflow);
      setGoals(empty.goals);
      setRisk(empty.risk);
    }

    setPlanResult(null);
    setCurrentStep("data_diri");
    showToast(`Memulai sesi profiling untuk ${name || "orang baru"}!`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate Plan via Server Endpoint (Gemini + CFP Fallback)
  const handleGenerateAIPlan = async () => {
    setIsGeneratingPlan(true);
    setCurrentStep("loading_plan");
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

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

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Gagal menghasilkan rencana (Status ${response.status})`);
      }

      const data = await response.json();
      if (!data.plan) {
        throw new Error("Format data respons AI tidak lengkap.");
      }

      setPlanResult(data.plan);
      setCurrentStep("rencana");
      showToast("Rencana keuangan CFP berhasil dibuat!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Generate plan error:", err);
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
        onSelectStep={(step) => {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onStepClick={(step) => {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenNewProfile={() => setIsNewProfileModalOpen(true)}
        onOpenTeori={() => {
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
        hasPlan={!!planResult}
        hasGeneratedPlan={!!planResult}
        onLockApp={() => {
          localStorage.removeItem("finplan_access_granted");
          setIsAuthenticated(false);
        }}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl border border-slate-700/50 text-xs font-semibold flex items-center space-x-2 animate-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1 text-xs">
              <span className="font-bold block">Pemberitahuan Sistem:</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => handleGenerateAIPlan()}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

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
              setCurrentStep("teori");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onPrev={() => {
              setCurrentStep("karier");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* STEP 5: Teori Keuangan & Standar OJK */}
        {currentStep === "teori" && (
          <StepTeoriKeuangan
            cashflow={cashflow}
            profile={profile}
            onNext={() => {
              setCurrentStep("profil_risiko");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onPrev={() => {
              setCurrentStep("goals");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* LOADING: Generating Plan */}
        {currentStep === "loading_plan" && (
          <LoadingPlanScreen profileName={profile.fullName} />
        )}

        {/* STEP 6: Profil Risiko */}
        {currentStep === "profil_risiko" && (
          <StepProfilRisiko
            riskData={risk}
            onChange={setRisk}
            onNext={() => {
              handleGenerateAIPlan();
            }}
            onPrev={() => {
              setCurrentStep("teori");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* STEP 7 & 8: Rencana Keuangan Komprehensif */}
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
              setCurrentStep("profil_risiko");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>

      {/* Floating Action Button for AI Advisor Chat */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="btn-floating-advisor"
          onClick={() => setIsAIChatOpen(true)}
          className="flex items-center space-x-2.5 px-5 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all font-bold cursor-pointer"
        >
          <Bot className="w-5 h-5" />
          <span className="text-xs hidden sm:inline">Tanya AI CFP Advisor</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        </button>
      </div>

      {/* Modals for Profiling & Education */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadRecord={handleLoadHistoryRecord}
        onDeleteRecord={handleDeleteHistoryRecord}
        onAddNewProfile={() => setIsNewProfileModalOpen(true)}
      />

      <NewProfileModal
        isOpen={isNewProfileModalOpen}
        onClose={() => setIsNewProfileModalOpen(false)}
        currentProfileName={profile.fullName}
        onConfirmCreateNew={handleCreateNewProfile}
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

      {/* Static Password Protection Gate (finfreedom2026!) */}
      {!isAuthenticated && (
        <AuthGateModal onUnlock={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}
