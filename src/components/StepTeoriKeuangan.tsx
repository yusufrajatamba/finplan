import React, { useState } from "react";
import { financialGurusTheories, ojkStandards, financialFormulas, localFinancialTheories } from "../data/financialTheoryData";
import { CashflowData, UserProfile } from "../types";
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
  const [activeTab, setActiveTab] = useState<"ojk_ratios" | "gurus" | "calculator" | "local_indonesia">("ojk_ratios");
  const [selectedGuruId, setSelectedGuruId] = useState<string>("warren_buffett");

  // User financial calculations for comparison
  const totalIncome =
    (cashflow.monthlyMainIncome || 0) +
    (cashflow.monthlySideIncome || 0) +
    (cashflow.partnerMainIncome || 0) +
    (cashflow.partnerSideIncome || 0) +
    (cashflow.businessPassiveIncome || 0) +
    (cashflow.investmentPassiveIncome || 0);

  const totalDebtsMonthly = (cashflow.debts || []).reduce((acc, d) => acc + (d.monthlyPayment || 0), 0);
  const totalRoutineExpenses =
    (cashflow.monthlyNeeds || 0) +
    (cashflow.housingExpense || 0) +
    (cashflow.utilitiesExpense || 0) +
    (cashflow.transportationExpense || 0) +
    (cashflow.monthlyWants || 0) +
    (cashflow.familySupportExpense || 0) +
    (cashflow.educationCurrentExpense || 0) +
    (cashflow.monthlyExistingInsurance || 0) +
    totalDebtsMonthly;

  const monthlySurplus = totalIncome - totalRoutineExpenses;
  const savingsRate = totalIncome > 0 ? (Math.max(0, monthlySurplus) / totalIncome) * 100 : 0;
  const dsrRate = totalIncome > 0 ? (totalDebtsMonthly / totalIncome) * 100 : 0;
  const needsRate =
    totalIncome > 0
      ? ((cashflow.monthlyNeeds +
          cashflow.housingExpense +
          cashflow.utilitiesExpense +
          cashflow.transportationExpense) /
          totalIncome) *
        100
      : 0;

  // Rule of 72 simulator
  const [rule72Return, setRule72Return] = useState<number>(10);
  const yearsToDouble = rule72Return > 0 ? (72 / rule72Return).toFixed(1) : "0";

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Langkah 5 dari 8 • Literasi & Edukasi Finansial</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Teori Keuangan, Standar OJK & CFP Framework
          </h1>
          <p className="text-blue-100 text-sm sm:text-base mt-2 leading-relaxed">
            Pahami benchmark rasio kesehatan keuangan berstandar Otoritas Jasa Keuangan (OJK), Certified Financial Planner (CFP), dan prinsip-prinsip pakar keuangan terkemuka sebelum mengeksekusi rencana.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab("ojk_ratios")}
          className={`px-4 py-2.5 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "ojk_ratios"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Rasio Kesehatan OJK & Skor Anda
        </button>

        <button
          onClick={() => setActiveTab("gurus")}
          className={`px-4 py-2.5 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "gurus"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Teori & Framework Pakar Dunia
        </button>

        <button
          onClick={() => setActiveTab("calculator")}
          className={`px-4 py-2.5 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "calculator"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Kalkulator & Formula Interaktif
        </button>

        <button
          onClick={() => setActiveTab("local_indonesia")}
          className={`px-4 py-2.5 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "local_indonesia"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          🇮🇩 Kerangka Lokal Indonesia
        </button>
      </div>

      {/* Tab 1: OJK Ratios with Live User Benchmark */}
      {activeTab === "ojk_ratios" && (
        <div className="space-y-6 animate-in fade-in">
          {/* User Score Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h2 className="font-semibold text-slate-900 dark:text-white text-base mb-1">
              Perbandingan Arus Kas Anda vs Standar Sehat OJK
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Dihitung otomatis dari data pemasukan dan pengeluaran yang telah Anda masukkan pada langkah 2.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Savings Rate Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Rasio Tabungan / Investasi
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      savingsRate >= 20
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {savingsRate >= 20 ? "SEHAT (≥20%)" : "PERLU DITINGKATKAN"}
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {savingsRate.toFixed(1)}%
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${savingsRate >= 20 ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${Math.min(100, savingsRate)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Standar OJK: Minimal 20% dari total pendapatan dialokasikan untuk tabungan & investasi.
                </p>
              </div>

              {/* Debt Service Ratio Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Rasio Cicilan Utang (DSR)
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      dsrRate <= 30
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                    }`}
                  >
                    {dsrRate <= 30 ? "AMAN (≤30%)" : "RISIKO TINGGI (>30%)"}
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {dsrRate.toFixed(1)}%
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${dsrRate <= 30 ? "bg-emerald-500" : "bg-rose-500"}`}
                    style={{ width: `${Math.min(100, dsrRate)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Standar OJK: Maksimal cicilan utang bulanan 30-35% agar cashflow tidak tertekan.
                </p>
              </div>

              {/* Needs Ratio Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Rasio Kebutuhan Pokok
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      needsRate <= 55
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {needsRate <= 55 ? "IDEAL (≤50%)" : "TINGGI (>50%)"}
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {needsRate.toFixed(1)}%
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${needsRate <= 55 ? "bg-blue-500" : "bg-amber-500"}`}
                    style={{ width: `${Math.min(100, needsRate)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Standar 50/30/20: Kebutuhan hidup pokok sebaiknya dijaga di kisaran 50% pendapatan.
                </p>
              </div>
            </div>
          </div>

          {/* OJK Standards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ojkStandards.map((std) => (
              <div
                key={std.ratioName}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                      {std.category}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{std.ratioName}</h3>
                    <p className="text-xs font-mono text-slate-600 dark:text-slate-300 mt-1">{std.formula}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
                    {std.healthyBenchmark}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {std.whyItMatters}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Financial Gurus Framework */}
      {activeTab === "gurus" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Guru Selector List */}
          <div className="space-y-2 lg:col-span-1">
            {financialGurusTheories.map((guru) => (
              <button
                key={guru.id}
                onClick={() => setSelectedGuruId(guru.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  selectedGuruId === guru.id
                    ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 text-blue-950 dark:text-blue-100 shadow-xs"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold">{guru.author}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{guru.coreRule}</p>
                </div>
                <ArrowRight className={`w-4 h-4 ${selectedGuruId === guru.id ? "text-blue-600" : "text-slate-400"}`} />
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
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {guru.role}
                      </span>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{guru.author}</h2>
                    </div>
                  </div>

                  <blockquote className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-l-4 border-blue-500 text-xs italic text-slate-700 dark:text-slate-300">
                    "{guru.quote}"
                  </blockquote>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {guru.explanation}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Prinsip Kunci:
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

                  <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200">
                    <strong>Penerapan di Indonesia:</strong> {guru.applicabilityIndonesia}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Calculators */}
      {activeTab === "calculator" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
          {/* Calculator 1: Rule of 72 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Simulator Rule of 72 (Compound Interest)
                </h3>
                <p className="text-xs text-slate-500">Hitung berapa lama uang Anda berlipat ganda 2x lipat</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Imbal Hasil Investasi Tahunan (% per tahun): {rule72Return}%
              </label>
              <input
                type="range"
                min="4"
                max="25"
                step="0.5"
                value={rule72Return}
                onChange={(e) => setRule72Return(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Deposito (4-5%)</span>
                <span>SBN / Obligasi (6-7%)</span>
                <span>Reksadana Saham (10-12%)</span>
                <span>Saham Agresif (15%+)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-center space-y-1">
              <span className="text-xs font-medium text-indigo-900 dark:text-indigo-200">
                Waktu untuk Lipat Ganda 2x:
              </span>
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {yearsToDouble} Tahun
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Formula: 72 ÷ {rule72Return}% = {yearsToDouble} tahun uang Rp 100 Juta Anda menjadi Rp 200 Juta.
              </p>
            </div>
          </div>

          {/* Calculator 2: 50/30/20 Breakdown Simulator */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Alokasi Ideal 50/30/20 dari Income Anda
                </h3>
                <p className="text-xs text-slate-500">
                  Berdasarkan Total Income: Rp {totalIncome.toLocaleString("id-ID")}/bln
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
                <div className="flex justify-between text-xs font-bold text-blue-900 dark:text-blue-200">
                  <span>50% Kebutuhan Pokok (Needs)</span>
                  <span>Rp {(totalIncome * 0.5).toLocaleString("id-ID")}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Makan, sewa/kpr, utilitas, transportasi wajib.</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900">
                <div className="flex justify-between text-xs font-bold text-purple-900 dark:text-purple-200">
                  <span>30% Keinginan (Wants & Lifestyle)</span>
                  <span>Rp {(totalIncome * 0.3).toLocaleString("id-ID")}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Hangout, langganan streaming, liburan, hobi.</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
                <div className="flex justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  <span>20% Tabungan & Investasi (Savings)</span>
                  <span>Rp {(totalIncome * 0.2).toLocaleString("id-ID")}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Dana darurat, saham, reksadana, dana pensiun.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Tab 4: Teori Lokal Indonesia */}
      {activeTab === "local_indonesia" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-gradient-to-r from-red-700 to-red-800 dark:from-red-900 dark:to-red-950 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🇮🇩</span>
              <div>
                <h2 className="text-lg font-bold">Kerangka Keuangan Lokal Indonesia</h2>
                <p className="text-red-200 text-xs">OJK · Bank Indonesia · FPSB · BPJS · CFP Indonesia</p>
              </div>
            </div>
            <p className="text-red-100 text-sm leading-relaxed">
              Standar, regulasi, dan framework perencanaan keuangan yang berlaku di Indonesia — bukan hanya teori internasional.
            </p>
          </div>

          <div className="space-y-4">
            {localFinancialTheories.map((theory) => (
              <div key={theory.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{theory.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold">{theory.institution}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{theory.description}</p>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2 mb-4">
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Poin Kunci:</p>
                      <ul className="space-y-1.5">
                        {theory.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 mb-3">
                      <p className="text-[11px] font-bold text-blue-700 dark:text-blue-300 mb-1">💡 Cara Menerapkan:</p>
                      <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">{theory.applicability}</p>
                    </div>
                    <a href={theory.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      <ExternalLink className="w-3 h-3" />
                      {theory.source}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
              <span className="font-bold">⚠️ Penting:</span> Informasi ini bersifat edukatif. Untuk kasus keuangan kompleks, konsultasikan dengan CFP berlisensi di{" "}
              <a href="https://fpaindonesia.or.id" target="_blank" rel="noopener noreferrer" className="underline font-semibold">fpaindonesia.or.id</a>.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onPrev}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Target & Goals</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-500/20 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <span>Lanjut ke Langkah 6: Profil Risiko</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
