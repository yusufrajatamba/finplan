import React, { useState, useEffect } from "react";
import {
  FinancialPlanResult,
  UserProfile,
  CashflowData,
  TargetGoalsData,
  CareerProfile,
  RiskProfileData,
} from "../types";
import {
  Sparkles,
  Sliders,
  Download,
  Save,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Award,
  Wallet,
  Home,
  GraduationCap,
  PieChart,
  Clock,
  ListChecks,
  Compass,
  UserPlus,
  Table,
  Info,
  Coins,
  Activity,
  X,
  CheckSquare,
  Square,
  Settings2,
  FileText,
  Check,
  Copy,
  ExternalLink,
} from "lucide-react";
import { generateFinancialPlanPDF, PDFExportOptions } from "../utils/pdfExport";
import { generateTailoredGranularBudget } from "../utils/dynamicBudgetPosts";
import { generateMasterFinancialPrompt, openInChatGPT, openInGemini, openInClaude } from "../utils/aiPromptExporter";
import { PosKeuanganTable } from "./PosKeuanganTable";
import { RoadmapPertahunDetail } from "./RoadmapPertahunDetail";
import { TimingDecisionMatrix } from "./TimingDecisionMatrix";
import { ManualSimulationSuite } from "./manual/ManualSimulationSuite";

interface StepRencanaKeuanganProps {
  plan: FinancialPlanResult | null;
  profile: UserProfile;
  cashflow: CashflowData;
  goals: TargetGoalsData;
  career: CareerProfile;
  risk: RiskProfileData;
  isLoadingAI: boolean;
  onGenerateAIPlan: () => void;
  onSaveToHistory: () => void;
  onAddNewProfile?: () => void;
  onOpenAIChat: () => void;
  onPrev: () => void;
}

export const StepRencanaKeuangan: React.FC<StepRencanaKeuanganProps> = ({
  plan,
  profile,
  cashflow,
  goals,
  career,
  risk,
  isLoadingAI,
  onGenerateAIPlan,
  onSaveToHistory,
  onAddNewProfile,
  onOpenAIChat,
  onPrev,
}) => {
  const [activeMode, setActiveMode] = useState<"ai_plan" | "manual_calc">("ai_plan");
  const [budgetModelView, setBudgetModelView] = useState<"spreadsheet_9pos" | "macro_5pos">("spreadsheet_9pos");
  
  // PDF Export Customization Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [exportOptions, setExportOptions] = useState<PDFExportOptions>({
    includeSavingsCompoundSim: true,
    includeInsuranceSim: true,
    includeKprSim: !!goals.housingTarget?.hasTarget,
    includeVehicleSim: !!goals.vehicleTarget?.hasTarget,
    includeDetailedBudgetTable: true,
    includeAnnualRoadmap: true,
    includeDecisionMatrix: true,
    includeTheoryAppendix: true,
  });

  const handleCopyPrompt = () => {
    const prompt = generateMasterFinancialPrompt(profile, cashflow, goals, risk, plan);
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  const handleOpenExportModal = () => {
    if (!plan) return;
    setIsExportModalOpen(true);
  };

  const handleExecutePDFExport = () => {
    if (!plan) return;
    generateFinancialPlanPDF({
      plan,
      profile,
      cashflow,
      goals,
      career,
      risk,
      options: exportOptions,
    });
    setIsExportModalOpen(false);
  };

  const handleApplyPreset = (preset: "all" | "targeted" | "essential") => {
    if (preset === "all") {
      setExportOptions({
        includeSavingsCompoundSim: true,
        includeInsuranceSim: true,
        includeKprSim: true,
        includeVehicleSim: true,
        includeDetailedBudgetTable: true,
        includeAnnualRoadmap: true,
        includeDecisionMatrix: true,
        includeTheoryAppendix: true,
      });
    } else if (preset === "targeted") {
      setExportOptions({
        includeSavingsCompoundSim: true,
        includeInsuranceSim: true,
        includeKprSim: !!goals.housingTarget?.hasTarget,
        includeVehicleSim: !!goals.vehicleTarget?.hasTarget,
        includeDetailedBudgetTable: true,
        includeAnnualRoadmap: true,
        includeDecisionMatrix: true,
        includeTheoryAppendix: false,
      });
    } else {
      setExportOptions({
        includeSavingsCompoundSim: true,
        includeInsuranceSim: false,
        includeKprSim: false,
        includeVehicleSim: false,
        includeDetailedBudgetTable: true,
        includeAnnualRoadmap: false,
        includeDecisionMatrix: false,
        includeTheoryAppendix: false,
      });
    }
  };

  // Income calculations
  const totalMonthlyIncome =
    (cashflow.monthlyMainIncome || 0) +
    (cashflow.monthlySideIncome || 0) +
    (cashflow.partnerMainIncome || 0) +
    (cashflow.partnerSideIncome || 0) +
    (cashflow.businessPassiveIncome || 0) +
    (cashflow.investmentPassiveIncome || 0);

  // Expense calculations
  const totalDebtsMonthly = (cashflow.debts || []).reduce((acc, d) => acc + (d.monthlyPayment || 0), 0);
  const totalDebtsRemaining = (cashflow.debts || []).reduce((acc, d) => acc + (d.totalRemaining || 0), 0);

  const livingCost =
    (cashflow.monthlyNeeds || 0) +
    (cashflow.housingExpense || 0) +
    (cashflow.utilitiesExpense || 0) +
    (cashflow.transportationExpense || 0) +
    (cashflow.familySupportExpense || 0) +
    (cashflow.educationCurrentExpense || 0);

  const existingInsurance = cashflow.monthlyExistingInsurance || 0;
  const currentWants = cashflow.monthlyWants || 0;

  const totalMonthlyExpenses = livingCost + totalDebtsMonthly + existingInsurance + currentWants;
  const netMonthlySurplus = Math.max(0, totalMonthlyIncome - totalMonthlyExpenses);

  const liquidCash = (cashflow.cashEmergencyFund || 0) + (cashflow.bankSavings || 0) + (cashflow.deposits || 0);
  const investmentAssets = (cashflow.stocks || 0) + (cashflow.mutualFunds || 0) + (cashflow.gold || 0) + (cashflow.cryptoAssets || 0);
  const physicalAssets = (cashflow.propertyValue || 0) + (cashflow.vehicleValue || 0) + (cashflow.otherAssets || 0);
  const totalAssets = liquidCash + investmentAssets + physicalAssets;
  const currentNetWorth = totalAssets - totalDebtsRemaining;

  // Generate 100% dynamic, tailored granular budget based on this user's profile
  const granularBudgetList = generateTailoredGranularBudget(
    profile,
    cashflow,
    career,
    goals,
    risk,
    plan
  );

  const isMarried = profile.maritalStatus === "Menikah";
  const dependentsCount = profile.dependents || 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-emerald-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Langkah 7 & 8 • Comprehensive Financial Blueprint</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Rencana Keuangan Komprehensif & Simulasi Eksekusi
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Arsitektur perencanaan finansial Anda dirancang menggabungkan AI Certified Financial Planner (CFP) engine dan simulasi kalkulasi manual yang fleksibel.
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onGenerateAIPlan}
              disabled={isLoadingAI}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/40 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingAI ? "animate-spin" : ""}`} />
              <span>{isLoadingAI ? "Menyusun Rencana..." : "Refresh AI Plan"}</span>
            </button>

            <button
              onClick={onSaveToHistory}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-teal-300" />
              <span>Simpan ke History</span>
            </button>

            {onAddNewProfile && (
              <button
                onClick={onAddNewProfile}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-teal-600/80 hover:bg-teal-500 text-white text-xs font-bold border border-teal-400/30 transition-all cursor-pointer shadow-xs"
                title="Tambah profil untuk orang yang berbeda"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Profil Baru</span>
              </button>
            )}

            <button
              onClick={handleOpenExportModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Export PDF</span>
            </button>

            <button
              onClick={onOpenAIChat}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-md cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Tanya AI Advisor</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── CASHFLOW & NET WORTH OVERVIEW DASHBOARD ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Income */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-emerald-200/80 dark:border-emerald-900/50 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Total Pemasukan
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Rp {totalMonthlyIncome.toLocaleString("id-ID")}
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-1">/bulan</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Gaji Utama: Rp {(cashflow.monthlyMainIncome || 0).toLocaleString("id-ID")}
            {isMarried && cashflow.partnerMainIncome ? ` • Pasangan: Rp ${cashflow.partnerMainIncome.toLocaleString("id-ID")}` : ""}
          </p>
        </div>

        {/* 2. Total Expenses */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-rose-200/80 dark:border-rose-900/50 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400">
              Total Pengeluaran
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Rp {totalMonthlyExpenses.toLocaleString("id-ID")}
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-1">/bulan</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Living: Rp {livingCost.toLocaleString("id-ID")} • Cicilan: Rp {totalDebtsMonthly.toLocaleString("id-ID")} • Asuransi: Rp {existingInsurance.toLocaleString("id-ID")}
          </p>
        </div>

        {/* 3. Net Cashflow Surplus */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-blue-200/80 dark:border-blue-900/50 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400">
              Surplus Kas Bersih
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">
            Rp {netMonthlySurplus.toLocaleString("id-ID")}
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-1">/bulan</span>
          </div>
          <p className="text-[11px] text-blue-600/80 dark:text-blue-400 font-semibold leading-tight">
            {totalMonthlyIncome > 0 ? ((netMonthlySurplus / totalMonthlyIncome) * 100).toFixed(1) : 0}% Kapasitas Menabung & Investasi
          </p>
        </div>

        {/* 4. Total Net Worth */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-purple-200/80 dark:border-purple-900/50 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-400">
              Total Kekayaan Bersih
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-700 dark:text-purple-300">
            Rp {currentNetWorth.toLocaleString("id-ID")}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Total Aset: Rp {totalAssets.toLocaleString("id-ID")} • Sisa Utang: Rp {totalDebtsRemaining.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center space-x-3 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveMode("ai_plan")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMode === "ai_plan"
              ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Hasil Rekomendasi AI CFP</span>
        </button>

        <button
          onClick={() => setActiveMode("manual_calc")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMode === "manual_calc"
              ? "bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Simulasi Kalkulasi Manual</span>
        </button>
      </div>

      {/* Mode 1: AI CFP Generated Financial Plan */}
      {activeMode === "ai_plan" && (
        <div className="space-y-6">
          {plan ? (
            <>
              {/* Executive Summary & Score Banner */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          (plan.healthScore ?? 0) >= 80
                            ? "text-emerald-600 dark:text-emerald-400"
                            : (plan.healthScore ?? 0) >= 60
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        Financial Health Index
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          (plan.healthScore ?? 0) >= 80
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                            : (plan.healthScore ?? 0) >= 60
                            ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                            : "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
                        }`}
                      >
                        {(plan.healthScore ?? 0) >= 80
                          ? "Kondisi Sehat"
                          : (plan.healthScore ?? 0) >= 60
                          ? "Perlu Perhatian"
                          : "Perlu Restrukturisasi"}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      Ringkasan Eksekutif Finansial
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                      {plan.executiveSummary}
                    </p>
                  </div>

                  <div className={`flex items-center space-x-4 p-4 rounded-2xl border shrink-0 ${
                    (plan.healthScore ?? 0) >= 80
                      ? "bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
                      : (plan.healthScore ?? 0) >= 60
                      ? "bg-amber-50/50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800"
                      : "bg-rose-50/50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800"
                  }`}>
                    <div className="text-center">
                      <span
                        className={`text-3xl sm:text-4xl font-extrabold block ${
                          (plan.healthScore ?? 0) >= 80
                            ? "text-emerald-600 dark:text-emerald-400"
                            : (plan.healthScore ?? 0) >= 60
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {plan.healthScore}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Skor dari 100</span>
                    </div>
                    <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />
                    <div>
                      <span
                        className={`text-xs font-bold block ${
                          (plan.healthScore ?? 0) >= 80
                            ? "text-emerald-600 dark:text-emerald-400"
                            : (plan.healthScore ?? 0) >= 60
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {plan.healthScore >= 80 ? "Sangat Sehat" : plan.healthScore >= 60 ? "Cukup Sehat" : "Perlu Restrukturisasi"}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Profil: {risk.profileType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* OJK Ratios Status Grid */}
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                    Analisis Rasio Finansial Utama:
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] text-slate-500 block">Rasio Tabungan</span>
                      <span
                        className={`text-base font-bold mt-0.5 block ${
                          plan.ojkRatios.savingsRatio >= 20
                            ? "text-emerald-600 dark:text-emerald-400"
                            : plan.ojkRatios.savingsRatio >= 10
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {plan.ojkRatios.savingsRatio.toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-slate-400">Target OJK: ≥20%</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] text-slate-500 block">Rasio Utang (DSR)</span>
                      <span className={`text-base font-bold mt-0.5 block ${plan.ojkRatios.debtServiceRatio <= 30 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
                        {plan.ojkRatios.debtServiceRatio.toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-slate-400">Batas Aman: ≤30%</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] text-slate-500 block">Ketahanan Kas</span>
                      <span
                        className={`text-base font-bold mt-0.5 block ${
                          plan.ojkRatios.emergencyFundMonths >= (isMarried ? 9 : 6)
                            ? "text-emerald-600 dark:text-emerald-400"
                            : plan.ojkRatios.emergencyFundMonths >= 3
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {plan.ojkRatios.emergencyFundMonths.toFixed(1)} Bulan
                      </span>
                      <span className="text-[10px] text-slate-400">Target: {goals.emergencyFund?.multiplierMonths || (isMarried ? 9 : 6)} Bulan</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] text-slate-500 block">Rasio Solvabilitas</span>
                      <span
                        className={`text-base font-bold mt-0.5 block ${
                          plan.ojkRatios.solvencyRatio >= 50
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {plan.ojkRatios.solvencyRatio.toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-slate-400">Standar: ≥50%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Budget Allocations Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        Rekomendasi Alokasi Anggaran Bulanan
                      </h3>
                      <p className="text-xs text-slate-500">
                        Total Pemasukan: Rp {totalMonthlyIncome.toLocaleString("id-ID")}/bulan • Total Alokasi: 100%
                      </p>
                    </div>
                  </div>

                  {/* Budget Model Switcher */}
                  <div className="flex items-center space-x-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                    <button
                      type="button"
                      onClick={() => setBudgetModelView("spreadsheet_9pos")}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        budgetModelView === "spreadsheet_9pos"
                          ? "bg-purple-600 text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                      }`}
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span>📊 Model 9 Pos Spreadsheet Presisi</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBudgetModelView("macro_5pos")}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        budgetModelView === "macro_5pos"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>🏛️ Ringkasan 5 Makro OJK</span>
                    </button>
                  </div>
                </div>

                {budgetModelView === "spreadsheet_9pos" ? (
                  /* Alokasi Anggaran Terperinci Dinamis Sesuai Profil Klien */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {granularBudgetList.map((item) => {
                        const theme = item.colorTheme;
                        let bgClass = "bg-sky-50/70 dark:bg-sky-950/40 border-sky-200/60 dark:border-sky-800/60";
                        let textClass = "text-sky-900 dark:text-sky-200";
                        let numClass = "text-sky-700 dark:text-sky-300";
                        let badgeClass = "bg-sky-200/80 dark:bg-sky-900 text-sky-800 dark:text-sky-200";

                        if (theme === "purple") {
                          bgClass = "bg-purple-50/70 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-800/60";
                          textClass = "text-purple-900 dark:text-purple-200";
                          numClass = "text-purple-700 dark:text-purple-300";
                          badgeClass = "bg-purple-200/80 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
                        } else if (theme === "blue") {
                          bgClass = "bg-blue-50/70 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-800/60";
                          textClass = "text-blue-900 dark:text-blue-200";
                          numClass = "text-blue-700 dark:text-blue-300";
                          badgeClass = "bg-blue-200/80 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
                        } else if (theme === "pink") {
                          bgClass = "bg-pink-50/70 dark:bg-pink-950/40 border-pink-200/60 dark:border-pink-800/60";
                          textClass = "text-pink-900 dark:text-pink-200";
                          numClass = "text-pink-700 dark:text-pink-300";
                          badgeClass = "bg-pink-200/80 dark:bg-pink-900 text-pink-800 dark:text-pink-200";
                        } else if (theme === "rose") {
                          bgClass = "bg-rose-50/70 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-800/60";
                          textClass = "text-rose-900 dark:text-rose-200";
                          numClass = "text-rose-700 dark:text-rose-300";
                          badgeClass = "bg-rose-200/80 dark:bg-rose-900 text-rose-800 dark:text-rose-200";
                        } else if (theme === "teal") {
                          bgClass = "bg-teal-50/70 dark:bg-teal-950/40 border-teal-200/60 dark:border-teal-800/60";
                          textClass = "text-teal-900 dark:text-teal-200";
                          numClass = "text-teal-700 dark:text-teal-300";
                          badgeClass = "bg-teal-200/80 dark:bg-teal-900 text-teal-800 dark:text-teal-200";
                        } else if (theme === "emerald") {
                          bgClass = "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/60";
                          textClass = "text-emerald-900 dark:text-emerald-200";
                          numClass = "text-emerald-700 dark:text-emerald-300";
                          badgeClass = "bg-emerald-200/80 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200";
                        } else if (theme === "indigo") {
                          bgClass = "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-800/60";
                          textClass = "text-indigo-900 dark:text-indigo-200";
                          numClass = "text-indigo-700 dark:text-indigo-300";
                          badgeClass = "bg-indigo-200/80 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200";
                        } else if (theme === "amber") {
                          bgClass = "bg-amber-50/70 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/60";
                          textClass = "text-amber-900 dark:text-amber-200";
                          numClass = "text-amber-700 dark:text-amber-300";
                          badgeClass = "bg-amber-200/80 dark:bg-amber-900 text-amber-800 dark:text-amber-200";
                        } else if (theme === "orange") {
                          bgClass = "bg-orange-50/70 dark:bg-orange-950/40 border-orange-200/60 dark:border-orange-800/60";
                          textClass = "text-orange-900 dark:text-orange-200";
                          numClass = "text-orange-700 dark:text-orange-300";
                          badgeClass = "bg-orange-200/80 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
                        }

                        return (
                          <div key={item.id} className={`p-4 rounded-xl border ${bgClass}`}>
                            <div className="flex justify-between items-center">
                              <span className={`text-xs font-semibold ${textClass}`}>
                                {item.name}
                              </span>
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
                                {item.pct.toFixed(1)}%
                              </span>
                            </div>
                            <span className={`text-lg font-bold ${numClass} block mt-1.5`}>
                              Rp {item.amount.toLocaleString("id-ID")}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-1 block leading-tight">
                              {item.description}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Penjelasan Dinamis CFP Sesuai Profil */}
                    <div className="p-4 rounded-xl bg-purple-50/80 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                      <div className="flex items-center space-x-2 text-purple-950 dark:text-purple-200 font-bold">
                        <Info className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>
                          💡 Alokasi Terdistribusi Otomatis Sesuai Profil: {profile.fullName || "Klien"} ({profile.maritalStatus || "Lajang"}, {dependentsCount} Tanggungan)
                        </span>
                      </div>
                      <p className="leading-relaxed">
                        Pos pengeluaran di atas dihitung secara dinamis dari kombinasi data arus kas, status pernikahan, tanggungan anak, utang aktif, dan target finansial yang Anda isi di langkah 1–6. Total alokasi berjumlah <b>persis 100.0% (Rp {totalMonthlyIncome.toLocaleString("id-ID")}/bln)</b> sehingga perencanaan anggaran rumah tangga menjadi presisi tanpa ada rupiah yang tercecer.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* 5 Kategori Makro Standar OJK */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60">
                      <span className="text-xs font-semibold text-blue-900 dark:text-blue-200 block">
                        Kebutuhan Pokok (Living)
                      </span>
                      <span className="text-lg font-bold text-blue-700 dark:text-blue-300 block mt-1">
                        Rp {plan.monthlyBudgetRecommendation.livingNeeds.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[11px] text-blue-600/80 dark:text-blue-400 mt-1 block font-bold">
                        {((plan.monthlyBudgetRecommendation.livingNeeds / totalMonthlyIncome) * 100).toFixed(1)}% dari income
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60">
                      <span className="text-xs font-semibold text-amber-900 dark:text-amber-200 block">
                        Cicilan Utang
                      </span>
                      <span className="text-lg font-bold text-amber-700 dark:text-amber-300 block mt-1">
                        Rp {plan.monthlyBudgetRecommendation.debtRepayment.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[11px] text-amber-600/80 dark:text-amber-400 mt-1 block">
                        {((plan.monthlyBudgetRecommendation.debtRepayment / totalMonthlyIncome) * 100).toFixed(1)}% dari income
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/60">
                      <span className="text-xs font-semibold text-rose-900 dark:text-rose-200 block">
                        Premi Asuransi & Proteksi
                      </span>
                      <span className="text-lg font-bold text-rose-700 dark:text-rose-300 block mt-1">
                        Rp {plan.monthlyBudgetRecommendation.insurancePremiums.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[11px] text-rose-600/80 dark:text-rose-400 mt-1 block font-bold">
                        {((plan.monthlyBudgetRecommendation.insurancePremiums / totalMonthlyIncome) * 100).toFixed(1)}% dari income
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60">
                      <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 block">
                        Tabungan, Investasi & Goals
                      </span>
                      <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300 block mt-1">
                        Rp {plan.monthlyBudgetRecommendation.savingsAndInvestment.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400 mt-1 block font-bold">
                        {((plan.monthlyBudgetRecommendation.savingsAndInvestment / totalMonthlyIncome) * 100).toFixed(1)}% (Prioritas Target)
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60">
                      <span className="text-xs font-semibold text-purple-900 dark:text-purple-200 block">
                        Gaya Hidup & Sosial (Wants)
                      </span>
                      <span className="text-lg font-bold text-purple-700 dark:text-purple-300 block mt-1">
                        Rp {plan.monthlyBudgetRecommendation.lifestyleWants.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[11px] text-purple-600/80 dark:text-purple-400 mt-1 block font-bold">
                        {((plan.monthlyBudgetRecommendation.lifestyleWants / totalMonthlyIncome) * 100).toFixed(1)}% dari income
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 1. DAFTAR POS KEUANGAN WAJIB VS OPSIONAL & ALASAN */}
              <PosKeuanganTable
                cashflow={cashflow}
                profile={profile}
                career={career}
                goals={goals}
                risk={risk}
                plan={plan}
              />

              {/* 2. DETAIL ROADMAP LANGKAH PERTAHUN */}
              <RoadmapPertahunDetail
                plan={plan}
                profile={profile}
                cashflow={cashflow}
                goals={goals}
                career={career}
                risk={risk}
              />

              {/* 3. MATRIKS WAKTU PENGAMBILAN KEPUTUSAN & REKOMENDASI CASH VS CICILAN */}
              <TimingDecisionMatrix
                plan={plan}
                profile={profile}
                cashflow={cashflow}
                goals={goals}
                career={career}
                risk={risk}
              />

              {/* Multi-Year Projections Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Proyeksi Pertumbuhan Kekayaan Jangka Panjang (1 - 15 Tahun)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Simulasi akumulasi total aset bersih, pertumbuhan pasif income, dan pemenuhan target
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                        <th className="pb-3 font-semibold">Tahun Ke-</th>
                        <th className="pb-3 font-semibold">Estimasi Total Kekayaan Bersih</th>
                        <th className="pb-3 font-semibold">Target Dana Darurat</th>
                        <th className="pb-3 font-semibold">Pasive Income Bulanan</th>
                        <th className="pb-3 font-semibold">Milestone Goals</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {plan.multiYearProjections.map((proj) => (
                        <tr key={proj.year} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="py-3 font-bold text-slate-900 dark:text-white">
                            Tahun ke-{proj.year}
                          </td>
                          <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">
                            Rp {proj.projectedNetWorth.toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 text-slate-600 dark:text-slate-300">
                            Rp {proj.emergencyFundTotal.toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 text-indigo-600 dark:text-indigo-400 font-semibold">
                            Rp {proj.estimatedMonthlyPassiveIncome.toLocaleString("id-ID")}/bln
                          </td>
                          <td className="py-3 text-slate-700 dark:text-slate-300 font-medium">
                            {proj.goalsStatus}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Strategic Milestones */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Tonggak Rencana Aksi (Actionable Roadmap)
                    </h3>
                    <p className="text-xs text-slate-500">Langkah terstruktur prioritas waktu</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.strategicMilestones.map((ms, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          {ms.timeframe}
                        </span>
                        <span className="text-xs text-slate-400">Langkah {idx + 1}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ms.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {ms.description}
                      </p>
                      {ms.targetAllocation && (
                        <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
                          Alokasi: {ms.targetAllocation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <Sparkles className="w-10 h-10 text-emerald-500 mx-auto animate-pulse" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Rencana Finansial Belum Dibuat</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Klik tombol di bawah untuk meminta AI Financial Planner menganalisis data arus kas, karier, dan tujuan Anda.
              </p>
              <button
                onClick={onGenerateAIPlan}
                disabled={isLoadingAI}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                {isLoadingAI ? "Sedang Menghitung..." : "Generate Rencana Keuangan Sekarang"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Manual Calculation Simulator Suite */}
      {activeMode === "manual_calc" && (
        <ManualSimulationSuite
          profile={profile}
          cashflow={cashflow}
          goals={goals}
        />
      )}

      {/* Multi-Profile Banner Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/80 to-slate-900 text-white border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Ingin Merencanakan Keuangan untuk Orang Lain?
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Simpan profil <b>{profile.fullName || "klien saat ini"}</b> ke riwayat, lalu buat sesi baru untuk pasangan, anak, orang tua, atau klien lainnya.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={onSaveToHistory}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-emerald-300" />
            <span>Simpan Profil Ini</span>
          </button>

          {onAddNewProfile && (
            <button
              onClick={onAddNewProfile}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/30 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Buat Profil Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── KONSULTASI MENGGUNAKAN AI SENDIRI (CHATGPT / GEMINI / CLAUDE) ─── */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <span>Konsultasi Bebas dengan Akun AI Anda Sendiri</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  Gratis & Privasi 100%
                </span>
              </h3>
              <p className="text-xs text-indigo-200 mt-0.5">
                Bawa seluruh profil keuangan, rasio OJK, dan target Anda ke ChatGPT, Google Gemini, atau Claude tanpa batas.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => openInChatGPT(generateMasterFinancialPrompt(profile, cashflow, goals, risk, plan))}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/40 cursor-pointer"
            >
              <span>Buka di ChatGPT</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => openInGemini(generateMasterFinancialPrompt(profile, cashflow, goals, risk, plan))}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-900/40 cursor-pointer"
            >
              <span>Buka di Gemini</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => openInClaude(generateMasterFinancialPrompt(profile, cashflow, goals, risk, plan))}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-900/40 cursor-pointer"
            >
              <span>Buka di Claude</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCopyPrompt}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all cursor-pointer"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrompt ? "Prompt Tersalin!" : "Salin Master Prompt"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={onPrev}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Profil Risiko</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenExportModal}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm cursor-pointer shadow-md shadow-emerald-900/30"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={onSaveToHistory}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Sesi Ini</span>
          </button>
        </div>
      </div>

      {/* ─── PDF EXPORT CUSTOMIZATION MODAL ─── */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-8">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Kustomisasi Ekspor Laporan PDF</h3>
                  <p className="text-xs text-slate-300">
                    Pilih modul simulasi dan bab pembahasan yang ingin dimasukkan ke dalam dokumen PDF
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets Bar */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Pilihan Cepat (Preset):</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleApplyPreset("all")}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-all cursor-pointer"
                >
                  🌟 Semua Lengkap
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset("targeted")}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer"
                >
                  🎯 Sesuai Target Saja
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset("essential")}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 transition-all cursor-pointer"
                >
                  ⚡ Esensial Kas Saja
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Group 1: Modul Simulasi Finansial */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Modul Simulasi Finansial & Kalkulator
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Simulasi 1: Tabungan Majemuk */}
                  <label className={`flex items-start space-x-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    exportOptions.includeSavingsCompoundSim
                      ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60"
                  }`}>
                    <input
                      type="checkbox"
                      checked={exportOptions.includeSavingsCompoundSim}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          includeSavingsCompoundSim: e.target.checked,
                        }))
                      }
                      className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        📈 Tabungan & Bunga Majemuk
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight">
                        Proyeksi 10 tahun, return 9% & pasif income SWR 4%
                      </span>
                    </div>
                  </label>

                  {/* Simulasi 2: Asuransi Floating */}
                  <label className={`flex items-start space-x-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    exportOptions.includeInsuranceSim
                      ? "bg-purple-50/50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60"
                  }`}>
                    <input
                      type="checkbox"
                      checked={exportOptions.includeInsuranceSim}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          includeInsuranceSim: e.target.checked,
                        }))
                      }
                      className="mt-0.5 w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        🛡️ Asuransi & Floating Premi
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight">
                        Tabel kenaikan premi usia (+8% inflasi) & target income
                      </span>
                    </div>
                  </label>

                  {/* Simulasi 3: KPR Rumah */}
                  <label className={`flex items-start space-x-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    exportOptions.includeKprSim
                      ? "bg-blue-50/50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60"
                  }`}>
                    <input
                      type="checkbox"
                      checked={exportOptions.includeKprSim}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          includeKprSim: e.target.checked,
                        }))
                      }
                      className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          🏠 KPR Rumah Impian (15 Thn)
                        </span>
                        {goals.housingTarget?.hasTarget && (
                          <span className="px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[9px] font-bold rounded">
                            Target Aktif
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight">
                        DP 20%, angsuran fixed 5.85% & biaya legalitas akad 6%
                      </span>
                    </div>
                  </label>

                  {/* Simulasi 4: KKB Kendaraan */}
                  <label className={`flex items-start space-x-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    exportOptions.includeVehicleSim
                      ? "bg-teal-50/50 dark:bg-teal-950/30 border-teal-300 dark:border-teal-700"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60"
                  }`}>
                    <input
                      type="checkbox"
                      checked={exportOptions.includeVehicleSim}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          includeVehicleSim: e.target.checked,
                        }))
                      }
                      className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          🚗 Kredit Kendaraan (KKB 3 Thn)
                        </span>
                        {goals.vehicleTarget?.hasTarget && (
                          <span className="px-1.5 py-0.2 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-[9px] font-bold rounded">
                            Target Aktif
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-tight">
                        DP 20%, angsuran flat 4.2% & total TDP ADDM
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Group 2: Bab Analisis & Lampiran Teori */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Bab Analisis & Lampiran Teori
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {/* Pos Anggaran */}
                  <label className={`flex items-start space-x-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    exportOptions.includeDetailedBudgetTable
                      ? "bg-slate-50 dark:bg-slate-800/70 border-indigo-200 dark:border-indigo-800"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60"
                  }`}>
                    <input
                      type="checkbox"
                      checked={exportOptions.includeDetailedBudgetTable}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          includeDetailedBudgetTable: e.target.checked,
                        }))
                      }
                      className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        📋 Struktur 11 Pos Anggaran & Alasan Finansial Tiap Pos
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Daftar pos Wajib, Kondisional, Opsional beserta jadwal eksekusi & rekening simpan
                      </span>
                    </div>
                  </label>

                  {/* Roadmap Tahunan */}
                  <label className={`flex items-start space-x-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    exportOptions.includeAnnualRoadmap
                      ? "bg-slate-50 dark:bg-slate-800/70 border-indigo-200 dark:border-indigo-800"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60"
                  }`}>
                    <input
                      type="checkbox"
                      checked={exportOptions.includeAnnualRoadmap}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          includeAnnualRoadmap: e.target.checked,
                        }))
                      }
                      className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        🗺️ Roadmap Aksi Finansial Bertahap (Tahun 1 s.d. 15)
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Panduan langkah bertahap mulai dari fondasi darurat, KPR hingga pensiun mandiri
                      </span>
                    </div>
                  </label>

                  {/* Matriks Keputusan */}
                  <label className={`flex items-start space-x-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    exportOptions.includeDecisionMatrix
                      ? "bg-slate-50 dark:bg-slate-800/70 border-indigo-200 dark:border-indigo-800"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60"
                  }`}>
                    <input
                      type="checkbox"
                      checked={exportOptions.includeDecisionMatrix}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          includeDecisionMatrix: e.target.checked,
                        }))
                      }
                      className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        🧭 Matriks Keputusan Finansial (Cash vs Cicilan)
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Rekomendasi skema bayar aset besar (Rumah, Kendaraan, Nikah, Liburan) & syarat CFP
                      </span>
                    </div>
                  </label>

                  {/* Lampiran Teori */}
                  <label className={`flex items-start space-x-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    exportOptions.includeTheoryAppendix
                      ? "bg-slate-50 dark:bg-slate-800/70 border-indigo-200 dark:border-indigo-800"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60"
                  }`}>
                    <input
                      type="checkbox"
                      checked={exportOptions.includeTheoryAppendix}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          includeTheoryAppendix: e.target.checked,
                        }))
                      }
                      className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        📚 Lampiran Teori & Rumus Perencanaan Keuangan (Knowledge Base)
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        Piramida Keuangan CFP, Rule of 72, Batasan DTI 30% OJK, Trinity Study 4% SWR & Zero-Based Budgeting
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleExecutePDFExport}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Laporan PDF Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
