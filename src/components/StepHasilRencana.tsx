import React, { useState } from "react";
import { GeneratedFinancialPlan, UserProfile, CashflowData } from "../types";
import { formatRupiah } from "../utils/formatters";
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  PieChart,
  Target,
  Lightbulb,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  MessageSquareText,
  Briefcase,
  ExternalLink,
} from "lucide-react";

interface StepHasilRencanaProps {
  plan: GeneratedFinancialPlan;
  profile: UserProfile;
  cashflow: CashflowData;
  onOpenChatWithTopic: (topic: string) => void;
  onModifyInputs: () => void;
}

export const StepHasilRencana: React.FC<StepHasilRencanaProps> = ({
  plan,
  profile,
  cashflow,
  onOpenChatWithTopic,
  onModifyInputs,
}) => {
  const [activeTab, setActiveTab] = useState<"ringkasan" | "anggaran" | "asuransi" | "investasi" | "goals" | "tips">("ringkasan");
  const [showThinkingDetails, setShowThinkingDetails] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800";
    if (score >= 60) return "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800";
    if (score >= 40) return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800";
    return "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800";
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-850 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-900">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rencana Keuangan Terpersonalisasi (Gemini AI Financial Engine)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Cetak Biru Finansial untuk {profile.fullName || "Anda"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Disusun berdasarkan profil risiko <span className="font-semibold text-blue-600 dark:text-blue-400">{profile.financialKnowledge}</span>, tanggungan {profile.dependents} orang, dan kondisi instrumen pasar di Indonesia.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 flex-shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
              title="Cetak atau Simpan PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onModifyInputs}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-md shadow-blue-600/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Sesuaikan Data</span>
            </button>
          </div>
        </div>

        {/* AI Thinking Notes Expander */}
        {plan.aiThinkingNotes && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setShowThinkingDetails(!showThinkingDetails)}
              className="flex items-center justify-between w-full text-left text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition"
            >
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lihat Catatan & Penalaran Analisis AI (Thinking Reasoning)</span>
              </span>
              {showThinkingDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showThinkingDetails && (
              <div className="mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                {plan.aiThinkingNotes}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "ringkasan", label: "🌟 Skor & Ringkasan", icon: ShieldCheck },
          { id: "anggaran", label: "📊 Alokasi Anggaran", icon: PieChart },
          { id: "asuransi", label: "🛡️ Proteksi & Asuransi", icon: ShieldCheck },
          { id: "investasi", label: "📈 Portofolio Investasi", icon: TrendingUp },
          { id: "goals", label: "🎯 Roadmap Goals", icon: Target },
          { id: "tips", label: "💡 Tips & Smart Hacks", icon: Lightbulb },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                  : "bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: RINGKASAN & SKOR KESEHATAN KEUANGAN */}
      {activeTab === "ringkasan" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Health Gauge */}
          <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Left Score Gauge */}
              <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Financial Health Score
                </span>
                <div className="relative flex items-center justify-center my-2">
                  <div className={`w-28 h-28 rounded-full border-8 flex items-center justify-center ${getScoreColor(plan.healthScore.overall)}`}>
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {plan.healthScore.overall}
                    </span>
                  </div>
                </div>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                  {plan.healthScore.summaryStatus}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  Skor dihitung dari 4 pilar: Likuiditas, Utang, Tabungan, & Asuransi.
                </p>
              </div>

              {/* Middle Breakdown Bars */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>1. Ketahanan Likuiditas & Dana Darurat</span>
                    <span className="font-bold text-slate-900 dark:text-white">{plan.healthScore.liquidityScore}/100</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-750 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${plan.healthScore.liquidityScore}%` }}
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>2. Kesehatan Rasio Beban Utang (DTI)</span>
                    <span className="font-bold text-slate-900 dark:text-white">{plan.healthScore.debtScore}/100</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-750 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${plan.healthScore.debtScore}%` }}
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>3. Rasio Tabungan & Investasi Rutin</span>
                    <span className="font-bold text-slate-900 dark:text-white">{plan.healthScore.savingsScore}/100</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-750 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${plan.healthScore.savingsScore}%` }}
                      className="bg-teal-500 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>4. Kesiapan Proteksi Risiko & Asuransi</span>
                    <span className="font-bold text-slate-900 dark:text-white">{plan.healthScore.protectionScore}/100</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-750 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${plan.healthScore.protectionScore}%` }}
                      className="bg-purple-500 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 leading-relaxed">
                  {plan.healthScore.statusDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Strengths and Critical Issues */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-2 h-5 bg-emerald-500 rounded-full inline-block"></span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" />
                  Kekuatan Finansial Anda
                </h3>
              </div>
              <ul className="space-y-2">
                {plan.healthScore.keyStrengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start">
                    <span className="mr-2 text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-2 h-5 bg-amber-500 rounded-full inline-block"></span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-500" />
                  Area yang Butuh Perhatian Segera
                </h3>
              </div>
              <ul className="space-y-2">
                {plan.healthScore.criticalIssues.map((iss, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start">
                    <span className="mr-2 text-amber-500 font-bold">•</span>
                    <span>{iss}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Dana Darurat Focus Box */}
          <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Target Dana Darurat Ideal
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatRupiah(plan.emergencyFundRecommendation.targetAmount)}
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <span className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold">
                  Terkumpul: {formatRupiah(plan.emergencyFundRecommendation.currentAmount)}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold">
                  Gap: {formatRupiah(plan.emergencyFundRecommendation.gap)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 font-medium block">Rekomendasi Setoran Rutin:</span>
                <span className="text-base font-bold text-blue-600 dark:text-blue-400 block mt-1">
                  {formatRupiah(plan.emergencyFundRecommendation.monthlyAllocation)} / bulan
                </span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Estimasi target tercapai dalam ~{plan.emergencyFundRecommendation.durationMonths} bulan
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 font-medium block">Tempat Penyimpanan Likuid:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {plan.emergencyFundRecommendation.instruments.map((inst, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] border border-slate-200 dark:border-slate-600 font-semibold">
                      {inst}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 italic">
              💡 {plan.emergencyFundRecommendation.advice}
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: ALOKASI ANGGARAN (BUDGET BLUEPRINT) */}
      {activeTab === "anggaran" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Formula Anggaran Bulanan yang Dipersonalisasi
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-2xl">
              Alokasi di bawah ini telah disesuaikan dengan biaya hidup di {profile.city}, tanggungan, dan beban cicilan berjalan Anda.
            </p>

            {/* Visual Budget Progress Bar */}
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex mb-6 shadow-inner">
              <div
                style={{ width: `${plan.budgetPlan.recommendedNeedsPercent}%` }}
                className="bg-blue-600 h-full transition-all"
                title={`Kebutuhan Pokok: ${plan.budgetPlan.recommendedNeedsPercent}%`}
              />
              <div
                style={{ width: `${plan.budgetPlan.recommendedSavingsPercent}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Tabungan & Investasi: ${plan.budgetPlan.recommendedSavingsPercent}%`}
              />
              <div
                style={{ width: `${plan.budgetPlan.recommendedWantsPercent}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`Keinginan & Lifestyle: ${plan.budgetPlan.recommendedWantsPercent}%`}
              />
              <div
                style={{ width: `${plan.budgetPlan.recommendedProtectionPercent}%` }}
                className="bg-purple-500 h-full transition-all"
                title={`Proteksi Asuransi: ${plan.budgetPlan.recommendedProtectionPercent}%`}
              />
            </div>

            {/* 4 Cards Alokasi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200">Kebutuhan Pokok</span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
                    {plan.budgetPlan.recommendedNeedsPercent}%
                  </span>
                </div>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white block mt-1">
                  {formatRupiah(plan.budgetPlan.recommendedNeeds)}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Makan, tempat tinggal, utilitas, transportasi wajib
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Tabungan & Investasi</span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">
                    {plan.budgetPlan.recommendedSavingsPercent}%
                  </span>
                </div>
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 block mt-1">
                  {formatRupiah(plan.budgetPlan.recommendedSavings)}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Disetor di hari gajian untuk dana darurat & goals
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200">Keinginan & Lifestyle</span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
                    {plan.budgetPlan.recommendedWantsPercent}%
                  </span>
                </div>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white block mt-1">
                  {formatRupiah(plan.budgetPlan.recommendedWants)}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Kopi, hobi, belanja santai, langganan hiburan
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-200">Proteksi & Asuransi</span>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-100">
                    {plan.budgetPlan.recommendedProtectionPercent}%
                  </span>
                </div>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white block mt-1">
                  {formatRupiah(plan.budgetPlan.recommendedProtection)}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Iuran BPJS Kesehatan & Asuransi Jiwa Murni
                </span>
              </div>
            </div>

            {/* Reasoning */}
            <div className="mt-6 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                📌 Alasan Penetapan Alokasi Ini:
              </span>
              {plan.budgetPlan.reasoning}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ASURANSI & PROTEKSI RASIONAL */}
      {activeTab === "asuransi" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Rekomendasi Proteksi & Asuransi Rasional
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Prinsip kami: Lindungi risiko besar yang dapat membangkrutkan keluarga, tanpa membayar premi berlebihan.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenChatWithTopic("Bagaimana cara memilih asuransi jiwa murni term life dan menghitung UP yang tepat?")}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 hover:bg-blue-100"
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                <span>Konsultasi Polis ke AI</span>
              </button>
            </div>

            <div className="space-y-4">
              {plan.insuranceRecommendations.map((ins, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {ins.type}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          ins.priority === "Wajib"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                            : ins.priority === "Sangat Dianjurkan"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                        }`}
                      >
                        {ins.priority}
                      </span>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        ~ {formatRupiah(ins.estimatedBudgetMonthly)} / bln
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-2 space-y-1.5">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {ins.explanation}
                      </p>
                      <div className="pt-1">
                        <span className="font-bold text-slate-900 dark:text-white block text-[11px] mb-1">
                          Tips Memilih Polis:
                        </span>
                        <ul className="space-y-1">
                          {ins.tips.map((t, ti) => (
                            <li key={ti} className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start">
                              <span className="text-blue-600 mr-1.5 font-bold">✓</span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-700 h-fit shadow-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Rekomendasi Manfaat / UP:
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {ins.recommendedCoverage}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PORTOFOLIO INVESTASI */}
      {activeTab === "investasi" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Rekomendasi Portofolio Investasi Personal
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-2xl">
              {plan.investmentPortfolio.summaryRationale}
            </p>

            {/* Visual Allocation Meter */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 mb-6">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Distribusi Kelas Aset Portofolio:
              </span>
              <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex mb-2">
                <div
                  style={{ width: `${plan.investmentPortfolio.conservativePercent}%` }}
                  className="bg-blue-600 h-full"
                  title={`Konservatif: ${plan.investmentPortfolio.conservativePercent}%`}
                />
                <div
                  style={{ width: `${plan.investmentPortfolio.moderatePercent}%` }}
                  className="bg-teal-500 h-full"
                  title={`Moderat: ${plan.investmentPortfolio.moderatePercent}%`}
                />
                <div
                  style={{ width: `${plan.investmentPortfolio.aggressivePercent}%` }}
                  className="bg-amber-500 h-full"
                  title={`Agresif: ${plan.investmentPortfolio.aggressivePercent}%`}
                />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                <span className="text-blue-600 dark:text-blue-400">Konservatif: {plan.investmentPortfolio.conservativePercent}%</span>
                <span className="text-teal-600 dark:text-teal-400">Moderat: {plan.investmentPortfolio.moderatePercent}%</span>
                <span className="text-amber-600 dark:text-amber-400">Agresif: {plan.investmentPortfolio.aggressivePercent}%</span>
              </div>
            </div>

            {/* List Instruments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.investmentPortfolio.recommendedInstruments.map((inst, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {inst.riskLevel} Risk
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {inst.name}
                        </h3>
                      </div>
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                        {inst.allocationPercent}% Alokasi
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {inst.reasoning}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-750 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Ekspektasi Return:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{inst.expectedReturn}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Horizon Minimal:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{inst.minHorizon}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2">
                    <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                      Contoh Platform Berizin OJK:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {inst.platformExamples.map((p, pi) => (
                        <span key={pi} className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ROADMAP TARGET FINANSIAL (GOALS) */}
      {activeTab === "goals" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Roadmap Capaian Tiap Target Finansial
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-2xl">
              Berikut estimasi nominal tabungan per bulan dan instrumen yang tepat agar target Anda tercapai tepat waktu.
            </p>

            <div className="space-y-6">
              {plan.goalRoadmaps.map((gr, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {gr.goalTitle}
                        </h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Target Nominal: <span className="font-bold text-slate-900 dark:text-white">{formatRupiah(gr.targetAmount)}</span> • Waktu: ~{gr.projectedCompletionMonths} Bulan
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Tabungan Wajib per Bulan:</span>
                      <span className="text-base sm:text-lg font-extrabold text-blue-600 dark:text-blue-400">
                        {formatRupiah(gr.monthlyTarget)} / bln
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 font-bold block mb-1">Strategi AI:</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {gr.strategy}
                      </p>
                      <div className="mt-2 text-slate-500">
                        Instrumen yang disarankan: <span className="font-bold text-slate-800 dark:text-slate-200">{gr.recommendedInstrument}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-700">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-2">
                        Milestone Tahapan Capaian:
                      </span>
                      <div className="space-y-2">
                        {gr.milestones.map((m, mi) => (
                          <div key={mi} className="flex items-center text-[11px] text-slate-600 dark:text-slate-300">
                            <span className="w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-[9px] flex items-center justify-center mr-2 flex-shrink-0">
                              {mi + 1}
                            </span>
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: TIPS & SMART HACKS MENABUNG */}
      {activeTab === "tips" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Kiat Penghematan & Smart Hacks Keuangan
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-2xl">
              Langkah taktis dan realistis untuk menghentikan kebocoran halus dan menambah ruang tabungan tanpa merasa tersiksa.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plan.smartSavingHacks.map((hack, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {hack.category}
                      </span>
                      {hack.potentialMonthlySavings > 0 && (
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          + {formatRupiah(hack.potentialMonthlySavings)} / bln
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {hack.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {hack.actionPlan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating CTA Banner */}
      <div className="bg-white dark:bg-slate-850 rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Ada pertanyaan atau butuh klarifikasi rekomendasi?</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tanya langsung ke Coach AI Certified Financial Planner kami untuk simulasi lebih lanjut.
          </p>
        </div>

        <button
          onClick={() => onOpenChatWithTopic("Tolong jelaskan langkah paling mendesak yang harus saya mulai bulan ini dari rencana keuangan saya.")}
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 whitespace-nowrap flex items-center space-x-1.5"
        >
          <MessageSquareText className="w-4 h-4" />
          <span>Tanya Coach AI Sekarang</span>
        </button>
      </div>
    </div>
  );
};
