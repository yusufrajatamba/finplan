import React, { useState } from "react";
import {
  financialGurusTheories,
  ojkStandards,
  financialFormulas,
  localFinancialTheories,
  financialUniversityCurriculum,
  tenFamilyFinancialRules,
  fiveLayerHierarchyFramework,
} from "../data/financialTheoryData";
import { CashflowData, UserProfile } from "../types";
import {
  calculateLifeEnergy,
  calculateMarginOfSafety,
  calculateExpectedNetWorth,
  calculateRuleOf25x,
} from "../utils/financialCalculations";
import {
  BookOpen,
  Calculator,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Percent,
  TrendingUp,
  Scale,
  Sparkles,
  ExternalLink,
  Globe,
  Building2,
  ShieldCheck,
  Shield,
  Layers,
  GraduationCap,
  Clock,
  Wallet,
  Coins,
  Compass,
  Check,
  Bookmark,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

interface StepTeoriKeuanganProps {
  cashflow: CashflowData;
  profile: UserProfile;
  onNext: () => void;
  onPrev: () => void;
}

export const StepTeoriKeuangan: React.FC<StepTeoriKeuanganProps> = ({
  cashflow,
  profile,
  onNext,
  onPrev,
}) => {
  const [activeTab, setActiveTab] = useState<"ojk_ratios" | "gurus" | "hierarchy_5layer" | "curriculum_manifesto">("ojk_ratios");
  const [selectedGuruId, setSelectedGuruId] = useState<string>("morgan_housel");

  // User financial calculations for live comparison
  const totalIncome =
    (cashflow.monthlyMainIncome || 0) +
    (cashflow.monthlySideIncome || 0) +
    (cashflow.partnerMainIncome || 0) +
    (cashflow.partnerSideIncome || 0) +
    (cashflow.businessPassiveIncome || 0) +
    (cashflow.investmentPassiveIncome || 0);

  const totalDebtsMonthly = (cashflow.debts || []).reduce((acc, d) => acc + (d.monthlyPayment || 0), 0);
  const totalDebtsOutstanding = (cashflow.debts || []).reduce((acc, d) => acc + (d.totalRemaining || 0), 0);

  const baselineLivingCost =
    (cashflow.monthlyNeeds || 0) +
    (cashflow.housingExpense || 0) +
    (cashflow.utilitiesExpense || 0) +
    (cashflow.transportationExpense || 0) +
    (cashflow.familySupportExpense || 0) +
    (cashflow.educationCurrentExpense || 0);

  const totalRoutineExpenses =
    baselineLivingCost +
    (cashflow.monthlyWants || 0) +
    (cashflow.monthlyExistingInsurance || 0) +
    totalDebtsMonthly;

  const monthlySurplus = Math.max(0, totalIncome - totalRoutineExpenses);
  const savingsRate = totalIncome > 0 ? (monthlySurplus / totalIncome) * 100 : 0;
  const dsrRate = totalIncome > 0 ? (totalDebtsMonthly / totalIncome) * 100 : 0;
  const needsRate = totalIncome > 0 ? (baselineLivingCost / totalIncome) * 100 : 0;
  const insuranceRate = totalIncome > 0 ? ((cashflow.monthlyExistingInsurance || 0) / totalIncome) * 100 : 0;

  const liquidAssets = (cashflow.cashEmergencyFund || 0) + (cashflow.bankSavings || 0) + (cashflow.deposits || 0);
  const investmentAssets = (cashflow.stocks || 0) + (cashflow.mutualFunds || 0) + (cashflow.gold || 0) + (cashflow.cryptoAssets || 0);
  const physicalAssets = (cashflow.propertyValue || 0) + (cashflow.vehicleValue || 0) + (cashflow.otherAssets || 0);
  const totalNetWorth = (liquidAssets + investmentAssets + physicalAssets) - totalDebtsOutstanding;

  // Calculators State
  const [lifeEnergyPrice, setLifeEnergyPrice] = useState<number>(750000);
  const [workHoursPerMonth, setWorkHoursPerMonth] = useState<number>(200);
  const [rule72Return, setRule72Return] = useState<number>(7.5);

  const lifeEnergyResult = calculateLifeEnergy(totalIncome || 15000000, workHoursPerMonth, lifeEnergyPrice);
  const marginOfSafetyResult = calculateMarginOfSafety(totalIncome, baselineLivingCost);
  const expectedNetWorthResult = calculateExpectedNetWorth(profile.age || 30, totalIncome * 12, totalNetWorth);
  const ruleOf25xResult = calculateRuleOf25x(totalRoutineExpenses * 12, investmentAssets + liquidAssets, monthlySurplus, 0.07);

  const yearsToDouble = rule72Return > 0 ? (72 / rule72Return).toFixed(1) : "0";

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#003399] via-[#0047BA] to-[#0055B8] rounded-2xl p-5 sm:p-6 text-white shadow-md border border-blue-800/40 space-y-1.5">
        <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-xs font-bold border border-white/20">
          <BookOpen className="w-3.5 h-3.5 text-blue-200" />
          <span>Langkah 6 dari 7 • Evaluasi Rasio & Standar OJK</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Evaluasi Rasio Keuangan & Standar OJK
        </h1>
        <p className="text-blue-100/90 text-xs sm:text-sm leading-relaxed max-w-4xl">
          Diagnosis kepatuhan rasio finansial keluarga Anda terhadap standar OJK dan filosofi 10 guru finansial dunia sebelum menghasilkan rencana keuangan komprehensif.
        </p>
      </div>

      {/* Visual Roadmap Blueprint: "Peta Besar: Financially Healthy Itu Apa?" */}
      <div className="rounded-2xl bg-[#002B66] text-white p-6 sm:p-7 shadow-lg border border-blue-900/60 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
              Family Financial Operating System
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              Peta Besar: Sebenarnya "Financially Healthy" Itu Apa?
            </h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/15 text-blue-100 border border-white/20 self-start sm:self-auto">
            Filosofi 10 Guru & Standar OJK
          </span>
        </div>

        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-4xl">
          Kekayaan sejati bukanlah sekadar gaji besar atau memamerkan barang mewah. Kekayaan adalah proses mengubah penghasilan menjadi <strong>surplus kas</strong>, melindunginya dari risiko bencana, dan mengakumulasikannya ke dalam <strong>aset produktif</strong> yang melahirkan kebebasan waktu untuk keluarga Anda:
        </p>

        {/* Visual Pipeline Stack */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center pt-1">
          <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
            <span className="text-[10px] font-bold text-blue-200 block">TAHAP 1</span>
            <span className="text-xs font-bold text-white mt-1 block">Penghasilan</span>
            <span className="text-[11px] text-blue-100">Gaji & Bisnis</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
            <span className="text-[10px] font-bold text-blue-200 block">TAHAP 2</span>
            <span className="text-xs font-bold text-white mt-1 block">Surplus Kas</span>
            <span className="text-[11px] text-blue-100">Income − Living</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
            <span className="text-[10px] font-bold text-blue-200 block">TAHAP 3</span>
            <span className="text-xs font-bold text-white mt-1 block">Proteksi Risiko</span>
            <span className="text-[11px] text-blue-100">BPJS & Asuransi</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
            <span className="text-[10px] font-bold text-blue-200 block">TAHAP 4</span>
            <span className="text-xs font-bold text-white mt-1 block">Aset Produktif</span>
            <span className="text-[11px] text-blue-100">SBN, Emas, Saham</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
            <span className="text-[10px] font-bold text-blue-200 block">TAHAP 5</span>
            <span className="text-xs font-bold text-white mt-1 block">Bunga Majemuk</span>
            <span className="text-[11px] text-blue-100">Waktu & Disiplin</span>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-500/30 border border-blue-300/40">
            <span className="text-[10px] font-bold text-blue-200 block">TAHAP 6</span>
            <span className="text-xs font-bold text-white mt-1 block">Bebas Finansial</span>
            <span className="text-[11px] text-blue-100">Kebebasan Waktu</span>
          </div>
        </div>

        {/* 3 Musuh Utama */}
        <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-300/40 text-amber-100 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              <strong>3 Jebakan Utama Kekayaan:</strong> Inflasi Gaya Hidup • Utang Konsumtif • Nol Dana Darurat (Zero Margin of Safety).
            </span>
          </div>
          <span className="text-[11px] font-semibold text-amber-200 shrink-0">Morgan Housel & Benjamin Graham</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-1 sm:space-x-3 overflow-x-auto scrollbar-none pb-0.5">
        <button
          onClick={() => setActiveTab("ojk_ratios")}
          className={`px-3.5 py-2.5 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center space-x-1.5 ${
            activeTab === "ojk_ratios"
              ? "border-[#003399] text-[#003399] dark:text-blue-400 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>🏛️ Standar Rasio OJK & Skor Anda</span>
        </button>

        <button
          onClick={() => setActiveTab("gurus")}
          className={`px-3.5 py-2.5 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center space-x-1.5 ${
            activeTab === "gurus"
              ? "border-[#003399] text-[#003399] dark:text-blue-400 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>🧠 10 Guru Finansial Dunia</span>
        </button>

        <button
          onClick={() => setActiveTab("hierarchy_5layer")}
          className={`px-3.5 py-2.5 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center space-x-1.5 ${
            activeTab === "hierarchy_5layer"
              ? "border-[#003399] text-[#003399] dark:text-blue-400 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>📊 Hirarki 5-Layer & Sinergi OJK</span>
        </button>

        <button
          onClick={() => setActiveTab("curriculum_manifesto")}
          className={`px-3.5 py-2.5 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center space-x-1.5 ${
            activeTab === "curriculum_manifesto"
              ? "border-[#003399] text-[#003399] dark:text-blue-400 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>🎓 Kurikulum 8 Semester & 10 Aturan</span>
        </button>
      </div>

      {/* ─── TAB 1: Standar Rasio OJK & Skor Klien ─────────────────────────── */}
      {activeTab === "ojk_ratios" && (
        <div className="space-y-6 animate-in fade-in">
          {/* User Score Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-base">
                  Evaluasi Kesehatan Keuangan Anda vs Standar OJK & CFP®
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dihitung otomatis dari data pemasukan Rp {totalIncome.toLocaleString("id-ID")}/bln yang telah Anda masukkan.
                </p>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-[#003399] dark:text-blue-300 shrink-0 self-start sm:self-auto">
                Kepatuhan OJK Terpantau
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Savings Rate Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Saving & Investment
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      savingsRate >= 20
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : savingsRate >= 10
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {savingsRate >= 20 ? "SANGAT BAIK" : savingsRate >= 10 ? "LULUS OJK" : "PERLU NAIK"}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {savingsRate.toFixed(1)}%
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${savingsRate >= 20 ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${Math.min(100, savingsRate * 2.5)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Standar OJK: Min. 10–20%. JL Collins: 25–35% untuk akselerasi FI.
                </p>
              </div>

              {/* Debt Service Ratio Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Beban Cicilan (DSR)
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      dsrRate <= 30
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                    }`}
                  >
                    {dsrRate <= 30 ? "AMAN OJK (≤30%)" : "RISIKO TINGGI"}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {dsrRate.toFixed(1)}%
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${dsrRate <= 30 ? "bg-emerald-500" : "bg-rose-500"}`}
                    style={{ width: `${Math.min(100, (dsrRate / 35) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Plafon OJK: Maksimal 30–35% income. Buffett: Jauhi utang konsumtif.
                </p>
              </div>

              {/* Needs Ratio Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Kebutuhan Pokok
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      needsRate <= 50
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : needsRate <= 65
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                    }`}
                  >
                    {needsRate <= 50 ? "IDEAL (≤50%)" : "MODERAT"}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {needsRate.toFixed(1)}%
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${needsRate <= 50 ? "bg-blue-500" : "bg-amber-500"}`}
                    style={{ width: `${Math.min(100, needsRate)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Standar 50/30/20 & Graham: Jaga kebutuhan pokok ≤ 50% untuk buffer kas.
                </p>
              </div>

              {/* Margin of Safety Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Margin of Safety
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 ${marginOfSafetyResult.statusColor}`}>
                    {marginOfSafetyResult.status.split(" ")[0]}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {marginOfSafetyResult.marginPercent}%
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-teal-500"
                    style={{ width: `${Math.min(100, marginOfSafetyResult.marginPercent)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Benjamin Graham: Sisa surplus Rp {(marginOfSafetyResult.marginAmount / 1_000_000).toFixed(1)} Jt/bln penyerap krisis.
                </p>
              </div>
            </div>
          </div>

          {/* OJK Standards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ojkStandards.map((std) => (
              <div
                key={std.ratioName}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top: Category & Target Benchmark Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#003399] dark:text-blue-400">
                      {std.category}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#003399] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      Target: {std.healthyBenchmark}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {std.ratioName}
                  </h3>

                  {/* Formula Box - Full Width */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                      Rumus Rasio:
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white block leading-relaxed">
                      {std.formula}
                    </span>
                  </div>

                  {/* Why it matters description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {std.whyItMatters}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Local Regulatory Authorities (OJK, BI, BPJS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {localFinancialTheories.map((theory) => (
              <div key={theory.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-[#003399] dark:text-blue-400" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{theory.institution}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{theory.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{theory.description}</p>
                <div className="pt-1">
                  <a href={theory.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[11px] text-[#003399] dark:text-blue-400 hover:underline font-semibold">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {theory.source}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 2: 10 Guru Finansial Dunia (Master Framework) ─────────────── */}
      {activeTab === "gurus" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Guru Selector List */}
          <div className="space-y-2 lg:col-span-1">
            <div className="px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Peringkat Relevansi Finansial Keluarga
            </div>
            {financialGurusTheories.map((guru) => (
              <button
                key={guru.id}
                onClick={() => setSelectedGuruId(guru.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  selectedGuruId === guru.id
                    ? "bg-blue-50/90 dark:bg-blue-950/50 border-[#003399] text-[#003399] dark:text-blue-100 shadow-xs font-semibold"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-1.5 mb-0.5">
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                      guru.rank === 1 ? "bg-amber-100 text-amber-900" : guru.rank === 2 ? "bg-slate-200 text-slate-800" : guru.rank === 3 ? "bg-orange-100 text-orange-900" : "bg-blue-100 text-blue-900"
                    }`}>
                      #{guru.rank}
                    </span>
                    <h4 className="text-xs font-bold truncate text-slate-900 dark:text-white">{guru.author}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{guru.title.split(":")[0]}</p>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 ${selectedGuruId === guru.id ? "text-[#003399] dark:text-blue-400" : "text-slate-400"}`} />
              </button>
            ))}
          </div>

          {/* Guru Detailed View */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
            {(() => {
              const guru =
                financialGurusTheories.find((g) => g.id === selectedGuruId) || financialGurusTheories[0];
              return (
                <div className="space-y-4">
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#003399] dark:text-blue-400 font-black text-sm shadow-inner">
                        #{guru.rank}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-[#003399] dark:text-blue-400 uppercase tracking-wider">
                          {guru.role}
                        </span>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{guru.author}</h2>
                      </div>
                    </div>
                    {guru.categoryTag && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {guru.categoryTag}
                      </span>
                    )}
                  </div>

                  <blockquote className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-l-4 border-[#003399] text-xs italic text-slate-700 dark:text-slate-300 leading-relaxed">
                    "{guru.quote}"
                  </blockquote>

                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Esensi Filosofi & Landasan:
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {guru.explanation}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Poin Kunci & Tindakan Nyata:
                    </h4>
                    {guru.keyTakeaways.map((pt, i) => (
                      <div
                        key={i}
                        className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200 space-y-1">
                    <span className="font-bold block">🇮🇩 Konteks & Penerapan di Indonesia:</span>
                    <p className="leading-relaxed">{guru.applicabilityIndonesia}</p>
                  </div>

                  {guru.sources && guru.sources.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-3">
                      {guru.sources.map((s, i) => (
                        <a
                          key={i}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-[11px] text-[#003399] dark:text-blue-400 hover:underline font-semibold"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {s.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ─── TAB 3: Hirarki 5-Layer & Sinergi OJK ──────────────────────────── */}
      {activeTab === "hierarchy_5layer" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Framework Overview Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="max-w-3xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#003399] dark:text-blue-400">
                Sistem Alokasi Kas Berjenjang (Ramit Sethi & OJK Framework)
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                Family Financial Operating System 5-Layer
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Uang Anda bukan sekadar dibagi secara kaku 50/30/20. Setiap Rp 1 memiliki pekerjaan yang disusun berdasarkan hirarki keamanan hidup: dari bertahan hidup (*Survival*), membangun perisai (*Protection*), mengejar impian keluarga (*Goals*), penggandaan kekayaan (*Wealth*), hingga menikmati hidup & berbagi (*Enjoyment*).
              </p>
            </div>

            {/* Visual 5-Layer Stack */}
            <div className="space-y-3 pt-2">
              {fiveLayerHierarchyFramework.map((layer) => (
                <div
                  key={layer.layer}
                  className="rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 space-y-3 transition-all hover:shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${layer.color} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                        L{layer.layer}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">{layer.name}</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{layer.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shrink-0 self-start sm:self-auto">
                      Alokasi Target: {layer.targetPercentRange}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-bold block text-slate-900 dark:text-white mb-1">Pos yang Termasuk:</span>
                      <ul className="space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                        {layer.itemsIncluded.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200 space-y-1">
                      <span className="font-bold block">🏛️ Standar OJK & Filosofi:</span>
                      <p className="text-[11px] leading-relaxed">{layer.ojkGuideline}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1">💡 {layer.guruPhilosophy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: Kurikulum 8 Semester & 10 Aturan Manifesto ────────────── */}
      {activeTab === "curriculum_manifesto" && (
        <div className="space-y-8 animate-in fade-in">
          {/* Section 1: 10 Aturan Keuangan Keluarga (Financial Manifesto) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#003399] dark:text-blue-400">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-base">
                  10 Aturan Keuangan Keluarga (Financial Manifesto)
                </h2>
                <p className="text-xs text-slate-500">
                  Pedoman perilaku jangka panjang yang menyatukan prinsip Buffett, Housel, Collins, Graham, dan OJK.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {tenFamilyFinancialRules.map((rule) => (
                <div
                  key={rule.ruleNumber}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#003399] text-white">
                      RULE #{rule.ruleNumber}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">{rule.guruInfluence}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{rule.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{rule.principle}"</p>
                  <div className="pt-1 text-[11px] text-[#003399] dark:text-blue-300 font-medium">
                    ✓ Tindakan: {rule.practicalAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Financial University Curriculum (8 Semesters) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-base">
                  Financial University — Roadmap Belajar Mandiri (8 Semester)
                </h2>
                <p className="text-xs text-slate-500">
                  Urutan membaca buku & membangun sistem finansial bertahap tanpa over-engineering.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {financialUniversityCurriculum.map((sem) => (
                <div
                  key={sem.semester}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 uppercase">
                      Semester {sem.semester}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">{sem.category}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{sem.bookTitle}</h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Karya: {sem.author}</span>
                  </div>

                  <p className="text-xs text-purple-950 dark:text-purple-200 font-semibold">
                    ❓ Pertanyaan Kunci: "{sem.keyQuestion}"
                  </p>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                    <strong>Fokus Belajar:</strong> {sem.readingAdvice}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onPrev}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Profil Risiko</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-[#003399] hover:bg-[#002266] text-white font-bold text-sm shadow-md hover:scale-[1.01] transition-all cursor-pointer"
        >
          <span>Lanjut ke Langkah 7: Hasil Rencana Keuangan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
