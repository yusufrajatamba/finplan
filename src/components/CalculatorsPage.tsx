import React, { useState } from "react";
import { formatRupiah, calculateCompoundInterest, calculateIdealEmergencyFundTarget } from "../utils/formatters";
import {
  calculateLifeEnergy,
  calculateMarginOfSafety,
  calculateExpectedNetWorth,
  calculateRuleOf25x,
} from "../utils/financialCalculations";
import {
  Calculator,
  Shield,
  TrendingUp,
  Home,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Zap,
  Clock,
  Award,
  Target,
  Scale,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface CalculatorsPageProps {
  onStartPlanning: () => void;
  onBack?: () => void;
  onOpenEducation?: () => void;
}

export const CalculatorsPage: React.FC<CalculatorsPageProps> = ({
  onStartPlanning,
  onBack,
  onOpenEducation,
}) => {
  const [activeTab, setActiveTab] = useState<
    "compound" | "dana_darurat" | "life_energy" | "net_worth_paw" | "rule_25x" | "kpr" | "utang"
  >("compound");

  // 1. Dana Darurat & Margin of Safety State
  const [efMonthlyExpense, setEfMonthlyExpense] = useState(6000000);
  const [efMonthlyIncome, setEfMonthlyIncome] = useState(15000000);
  const [efDependents, setEfDependents] = useState(1);
  const [efEmployment, setEfEmployment] = useState<string>("karyawan_swasta");
  const [efCurrentSavings, setEfCurrentSavings] = useState(15000000);
  const [efMonthlySave, setEfMonthlySave] = useState(2000000);

  // 2. Compound Interest & Rule of 72 State
  const [compInitial, setCompInitial] = useState(10000000);
  const [compMonthly, setCompMonthly] = useState(2000000);
  const [compRate, setCompRate] = useState(8); // % p.a.
  const [compYears, setCompYears] = useState(10);

  // 3. Life Energy Calculator State (Vicki Robin)
  const [leIncome, setLeIncome] = useState(15000000);
  const [leHours, setLeHours] = useState(200);
  const [leExpense, setLeExpense] = useState(1500000);

  // 4. Expected Net Worth Calculator State (Stanley & Danko)
  const [enwAge, setEnwAge] = useState(30);
  const [enwAnnualIncome, setEnwAnnualIncome] = useState(180000000);
  const [enwActualNetWorth, setEnwActualNetWorth] = useState(150000000);

  // 5. Rule of 25x FIRE Calculator State (JL Collins)
  const [fiMonthlyCost, setFiMonthlyCost] = useState(12000000);
  const [fiCurrentPortfolio, setFiCurrentPortfolio] = useState(50000000);
  const [fiMonthlyInvestment, setFiMonthlyInvestment] = useState(4000000);
  const [fiExpectedReturn, setFiExpectedReturn] = useState(7.5);

  // 6. KPR Simulator State
  const [housePrice, setHousePrice] = useState(600000000);
  const [dpPercent, setDpPercent] = useState(20);
  const [kprTenorYears, setKprTenorYears] = useState(15);
  const [kprInterestRate, setKprInterestRate] = useState(7.5);

  // Calculators logic executions
  const efResult = calculateIdealEmergencyFundTarget(efMonthlyExpense, efDependents, efEmployment);
  const efGap = Math.max(0, efResult.amount - efCurrentSavings);
  const efMonthsNeeded = efMonthlySave > 0 ? Math.ceil(efGap / efMonthlySave) : 0;
  const marginResult = calculateMarginOfSafety(efMonthlyIncome, efMonthlyExpense);

  const compResult = calculateCompoundInterest(compInitial, compMonthly, compRate, compYears);
  const yearsToDouble = compRate > 0 ? (72 / compRate).toFixed(1) : "0";

  const lifeEnergyResult = calculateLifeEnergy(leIncome, leHours, leExpense);
  const enwResult = calculateExpectedNetWorth(enwAge, enwAnnualIncome, enwActualNetWorth);
  const fiResult = calculateRuleOf25x(fiMonthlyCost * 12, fiCurrentPortfolio, fiMonthlyInvestment, fiExpectedReturn / 100);

  // KPR calculations
  const dpAmount = (housePrice * dpPercent) / 100;
  const loanPrincipal = housePrice - dpAmount;
  const monthlyKprRate = kprInterestRate / 100 / 12;
  const totalKprMonths = kprTenorYears * 12;
  const monthlyKprInstallment =
    monthlyKprRate > 0
      ? (loanPrincipal * (monthlyKprRate * Math.pow(1 + monthlyKprRate, totalKprMonths))) /
        (Math.pow(1 + monthlyKprRate, totalKprMonths) - 1)
      : loanPrincipal / totalKprMonths;

  const calculatorTabs = [
    { id: "compound", label: "Bunga Majemuk & 72", icon: TrendingUp, badge: "Investasi" },
    { id: "dana_darurat", label: "Dana Darurat & Margin", icon: Shield, badge: "Proteksi" },
    { id: "life_energy", label: "Energi Hidup (Life Energy)", icon: Clock, badge: "Mindset" },
    { id: "net_worth_paw", label: "Net Worth PAW (Stanley)", icon: Award, badge: "Aset" },
    { id: "rule_25x", label: "FIRE & 25× Rule (Collins)", icon: Target, badge: "Pensiun" },
    { id: "kpr", label: "Simulasi KPR & DP", icon: Home, badge: "Properti" },
    { id: "utang", label: "Strategi Pelunasan Utang", icon: Zap, badge: "Bebas Utang" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* ─── Hero Section: Calculators Master ─── */}
      <div className="bg-gradient-to-r from-[#0B5DA7] via-[#0047BA] to-[#003399] rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-12 w-48 h-48 rounded-full bg-[#E8701A]/25 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100">
              <Calculator className="w-4 h-4 text-amber-300" />
              <span>Kalkulator & Simulator Finansial Terakreditasi OJK & Pakar Dunia</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-heading">
              Simulasi & Kalkulator Finansial Master
            </h1>

            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
              Uji skenario keuangan masa depan Anda secara instan: formula Bunga Majemuk & Rule of 72, Margin of Safety Graham, Dana Darurat OJK, Nilai Energi Hidup Vicki Robin, Indeks PAW Stanley & Danko, FIRE 25× Rule JL Collins, dan Simulasi KPR.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-semibold">
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-white flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-300" /> Compounding DCA
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-white flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-300" /> Rasio OJK Kas Darurat
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-white flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-purple-300" /> FIRE Freedom Target
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-white flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-cyan-300" /> KPR & DTI Safe Limit
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={onStartPlanning}
              className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-[#E8701A] hover:bg-[#D6610E] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Mulai Rencana Finansial</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenEducation && (
              <button
                onClick={onOpenEducation}
                className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-bold border border-white/25 transition-all cursor-pointer"
              >
                <span>Buka Edukatips Finansial</span>
                <BookOpen className="w-4 h-4" />
              </button>
            )}

            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-blue-100 text-xs font-semibold transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Navigation Tabs Bar ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 sm:p-2.5 shadow-sm border border-slate-200 dark:border-slate-800 sticky top-16 sm:top-20 z-30">
        <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto scrollbar-none py-1 px-1">
          {calculatorTabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center space-x-2 cursor-pointer ${
                  isActive
                    ? "bg-[#0B5DA7] text-white shadow-md shadow-blue-900/20"
                    : "bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{t.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold hidden md:inline ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {t.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── CALCULATOR CONTENT ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 md:p-10 shadow-sm space-y-6">
        {/* TAB 1: COMPOUND INTEREST & RULE OF 72 */}
        {activeTab === "compound" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-[#0B5DA7] dark:text-blue-400 uppercase tracking-wider block">
                Warren Buffett & Albert Einstein Theory
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">
                Kalkulator Bunga Majemuk (Compounding) & Rule of 72
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Hitung bagaimana investasi rutin bulanan (DCA) bertumbuh secara eksponensial seiring waktu berkat kekuatan bunga majemuk.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Form Inputs (6 cols) */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Modal Awal Investasi (Rp)
                  </label>
                  <input
                    type="number"
                    value={compInitial || ""}
                    placeholder="10000000"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setCompInitial(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="text-[11px] text-slate-400">Modal awal yang disiapkan hari ini.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Investasi Rutin Bulanan (DCA) (Rp/bulan)
                  </label>
                  <input
                    type="number"
                    value={compMonthly || ""}
                    placeholder="2000000"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setCompMonthly(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="text-[11px] text-slate-400">Jumlah dana yang disisihkan secara konsisten setiap bulan.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Return Imbal Hasil (% per tahun)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={compRate || ""}
                      placeholder="8"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setCompRate(e.target.value === "" ? 0 : parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="text-[11px] text-slate-400">Contoh: SBN 6-7%, Reksadana 7-10%, Saham 10-12%.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Jangka Waktu Investasi (Tahun)
                    </label>
                    <input
                      type="number"
                      value={compYears || ""}
                      placeholder="10"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setCompYears(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="text-[11px] text-slate-400">Lama horizon waktu investasi Anda.</span>
                  </div>
                </div>
              </div>

              {/* Right Results Panel (6 cols) */}
              <div className="lg:col-span-6 bg-slate-50/80 dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Total Estimasi Akumulasi Nilai Akhir
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-[#0B5DA7] dark:text-blue-400 block mt-2 font-heading">
                    {formatRupiah(compResult.futureValue)}
                  </span>
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] text-slate-400 block">Total Modal Disetor:</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {formatRupiah(compResult.totalDeposited)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] text-slate-400 block">Total Bunga/Imbal Hasil:</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        +{formatRupiah(compResult.totalInterest)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-950 dark:text-blue-200 leading-relaxed space-y-1">
                    <span className="font-bold block text-sm">💡 Kaidah Rule of 72:</span>
                    <p>
                      Dengan return sebesar <strong>{compRate}% per tahun</strong>, modal investasi Anda akan berlipat ganda menjadi <strong>2× lipat</strong> dalam kurun waktu <strong>{yearsToDouble} tahun</strong> secara murni tanpa perlu menambah modal sepeserpun!
                    </p>
                  </div>

                  <button
                    onClick={onStartPlanning}
                    className="w-full py-3 rounded-2xl bg-[#0B5DA7] hover:bg-[#0047BA] text-white text-xs sm:text-sm font-bold transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Terapkan Target Ini ke Perencanaan Finansial</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DANA DARURAT & MARGIN OF SAFETY */}
        {activeTab === "dana_darurat" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-[#0B5DA7] dark:text-blue-400 uppercase tracking-wider block">
                Pedoman OJK & Benjamin Graham
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">
                Kalkulator Dana Darurat OJK & Margin of Safety
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Hitung kecukupan dana cadangan darurat keluarga sesuai standar OJK serta batas aman Margin of Safety pengeluaran.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Penghasilan Bulanan Keluarga (Rp)
                  </label>
                  <input
                    type="number"
                    value={efMonthlyIncome || ""}
                    placeholder="15000000"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setEfMonthlyIncome(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Pengeluaran Pokok Bulanan (Rp)
                  </label>
                  <input
                    type="number"
                    value={efMonthlyExpense || ""}
                    placeholder="6000000"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setEfMonthlyExpense(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Jumlah Tanggungan (Orang)
                    </label>
                    <input
                      type="number"
                      value={efDependents || ""}
                      placeholder="1"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setEfDependents(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Status Pekerjaan
                    </label>
                    <select
                      value={efEmployment}
                      onChange={(e) => setEfEmployment(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                    >
                      <option value="karyawan_swasta">Karyawan Swasta (Tetap)</option>
                      <option value="pns_bumn">PNS / Pegawai BUMN</option>
                      <option value="wiraswasta">Pengusaha / Wiraswasta</option>
                      <option value="freelancer">Freelancer / Kontrak</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Dana Darurat yang Dimiliki Saat Ini (Rp)
                    </label>
                    <input
                      type="number"
                      value={efCurrentSavings || ""}
                      placeholder="15000000"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setEfCurrentSavings(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Alokasi Tabung per Bulan (Rp)
                    </label>
                    <input
                      type="number"
                      value={efMonthlySave || ""}
                      placeholder="2000000"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setEfMonthlySave(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Right Results Panel */}
              <div className="lg:col-span-6 bg-slate-50/80 dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Target Dana Darurat Ideal Standar OJK ({efResult.months}× Pengeluaran)
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-[#0B5DA7] dark:text-blue-400 block mt-2 font-heading">
                    {formatRupiah(efResult.amount)}
                  </span>
                  <p className="text-xs text-slate-500 mt-2">
                    Kekurangan dana darurat saat ini: <strong>{formatRupiah(efGap)}</strong>.
                    {efGap > 0 && (
                      <span> Estimasi tercapai dalam <strong>{efMonthsNeeded} bulan</strong> dengan alokasi tabungan Rp {efMonthlySave.toLocaleString("id-ID")}/bln.</span>
                    )}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block">
                      🛡️ Margin of Safety Graham: {marginResult.marginPercent}% ({marginResult.status})
                    </span>
                    <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
                      {marginResult.recommendation}
                    </p>
                  </div>

                  <button
                    onClick={onStartPlanning}
                    className="w-full py-3 rounded-2xl bg-[#0B5DA7] hover:bg-[#0047BA] text-white text-xs sm:text-sm font-bold transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Sinkronkan ke Profil Keuangan Anda</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIFE ENERGY CALCULATOR (VICKI ROBIN) */}
        {activeTab === "life_energy" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-[#0B5DA7] dark:text-blue-400 uppercase tracking-wider block">
                Filosofi Vicki Robin & Joe Dominguez ("Your Money or Your Life")
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">
                Kalkulator Nilai Energi Hidup (Life Energy Calculator)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Ubah cara Anda memandang pengeluaran dengan menghitung berapa jam waktu kehidupan nyata yang harus Anda korbankan untuk membeli suatu barang.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Penghasilan Bersih Bulanan (Take-Home Pay) (Rp)
                  </label>
                  <input
                    type="number"
                    value={leIncome || ""}
                    placeholder="15000000"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setLeIncome(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Total Jam Kerja + Komuter per Bulan (Jam)
                  </label>
                  <input
                    type="number"
                    value={leHours || ""}
                    placeholder="200"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setLeHours(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="text-[11px] text-slate-400">Rekomendasi standar: 160 jam kantor + 40 jam perjalanan komuter = 200 jam.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Harga Barang / Pengeluaran yang Ingin Dievaluasi (Rp)
                  </label>
                  <input
                    type="number"
                    value={leExpense || ""}
                    placeholder="1500000"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setLeExpense(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="text-[11px] text-slate-400">Misal: Gadget baru, makan mewah, atau langganan bulanan.</span>
                </div>
              </div>

              {/* Right Results Panel */}
              <div className="lg:col-span-6 bg-slate-50/80 dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Nilai Upah Riil per Jam Kehidupan Anda
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-[#0B5DA7] dark:text-blue-400 block mt-2 font-heading">
                    Rp {lifeEnergyResult.realHourlyWage.toLocaleString("id-ID")} / jam
                  </span>
                  <p className="text-xs text-slate-500 mt-2">
                    Setiap 1 jam waktu kehidupan Anda bekerja ditukar dengan uang senilai Rp {lifeEnergyResult.realHourlyWage.toLocaleString("id-ID")}.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block uppercase tracking-wider">
                    ⏳ Pengorbanan Waktu Hidup untuk Barang Ini:
                  </span>
                  <div className="text-2xl font-black text-amber-900 dark:text-amber-200">
                    {lifeEnergyResult.hoursRequired} Jam ({lifeEnergyResult.daysRequired} Hari Kerja)
                  </div>
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed pt-1">
                    {lifeEnergyResult.reflectionMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EXPECTED NET WORTH & PAW STATUS (STANLEY & DANKO) */}
        {activeTab === "net_worth_paw" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-[#0B5DA7] dark:text-blue-400 uppercase tracking-wider block">
                Riset Thomas J. Stanley & William D. Danko ("The Millionaire Next Door")
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">
                Kalkulator Akumulator Kekayaan (Expected Net Worth PAW)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Ketahui apakah Anda termasuk Prodigious Accumulator of Wealth (PAW) atau Under Accumulator of Wealth (UAW) berdasarkan usia dan penghasilan.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Usia Anda Saat Ini (Tahun)
                  </label>
                  <input
                    type="number"
                    value={enwAge || ""}
                    placeholder="30"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setEnwAge(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Total Penghasilan Tahunan Keluarga (Rp/tahun)
                  </label>
                  <input
                    type="number"
                    value={enwAnnualIncome || ""}
                    placeholder="180000000"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setEnwAnnualIncome(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Kekayaan Bersih Aktual (Net Worth Saat Ini) (Rp)
                  </label>
                  <input
                    type="number"
                    value={enwActualNetWorth || ""}
                    placeholder="150000000"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setEnwActualNetWorth(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="text-[11px] text-slate-400">Total seluruh aset bersih (Kas + Investasi + Aset riil dikurangi sisa utang).</span>
                </div>
              </div>

              {/* Right Results Panel */}
              <div className="lg:col-span-6 bg-slate-50/80 dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Target Expected Net Worth Berdasarkan Usia
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-[#0B5DA7] dark:text-blue-400 block mt-2 font-heading">
                    {formatRupiah(enwResult.expectedNetWorth)}
                  </span>
                  <p className="text-xs text-slate-500 mt-2">
                    Formula Stanley & Danko: ({enwAge} tahun × Rp {(enwAnnualIncome / 1000000).toFixed(0)} Juta) ÷ 10.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Status Akumulasi Kekayaan:
                    </span>
                    <span className={`text-xs font-black px-3 py-1 rounded-full ${enwResult.categoryBadge}`}>
                      {enwResult.wealthRatio}× ({enwResult.category.split(" ")[0]})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {enwResult.explanation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: RULE OF 25X & FIRE CALCULATOR (JL COLLINS) */}
        {activeTab === "rule_25x" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-[#0B5DA7] dark:text-blue-400 uppercase tracking-wider block">
                Filosofi JL Collins ("The Simple Path to Wealth")
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">
                Kalkulator Kebebasan Finansial (FIRE & Rule of 25×)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Hitung target 'F.U. Money' portofolio investasi yang mampu membiayai 100% gaya hidup Anda selamanya dengan 4% Safe Withdrawal Rate.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Biaya Hidup Bulanan Masa Pensiun / Mandiri (Rp/bulan)
                  </label>
                  <input
                    type="number"
                    value={fiMonthlyCost || ""}
                    placeholder="12000000"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setFiMonthlyCost(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Portofolio Investasi Saat Ini (Rp)
                  </label>
                  <input
                    type="number"
                    value={fiCurrentPortfolio || ""}
                    placeholder="50000000"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setFiCurrentPortfolio(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Investasi Rutin Bulanan (Rp)
                    </label>
                    <input
                      type="number"
                      value={fiMonthlyInvestment || ""}
                      placeholder="4000000"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setFiMonthlyInvestment(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Ekspektasi Return (% per tahun)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={fiExpectedReturn || ""}
                      placeholder="7.5"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setFiExpectedReturn(e.target.value === "" ? 0 : parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Right Results Panel */}
              <div className="lg:col-span-6 bg-slate-50/80 dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Target Angka Kebebasan Finansial (Rule of 25×)
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-[#0B5DA7] dark:text-blue-400 block mt-2 font-heading">
                    {formatRupiah(fiResult.fiTargetNumber)}
                  </span>
                  <p className="text-xs text-slate-500 mt-2">
                    Menghasilkan Passive Income 4% safe withdrawal rate senilai <strong>Rp {fiResult.monthlyPassiveIncomeAtFI.toLocaleString("id-ID")}/bulan</strong> selamanya tanpa menghabiskan modal pokok.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-purple-950 dark:text-purple-200">
                    <span>Progres Portofolio Saat Ini: {fiResult.progressPercent}%</span>
                    <span>Estimasi: {fiResult.estimatedYearsToFI} Tahun Lagi</span>
                  </div>
                  <div className="w-full bg-purple-200 dark:bg-purple-900/60 h-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, fiResult.progressPercent)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: KPR SIMULATOR */}
        {activeTab === "kpr" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-[#0B5DA7] dark:text-blue-400 uppercase tracking-wider block">
                Simulasi Kredit Pemilikan Rumah (KPR)
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">
                Simulator Cicilan KPR & Beban DSR OJK
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Hitung estimasi angsuran KPR bulanan, uang muka (Down Payment), dan pastikan cicilan aman dalam batas Debt Service Ratio (DSR ≤ 30-35%).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Harga Properti / Rumah (Rp)
                  </label>
                  <input
                    type="number"
                    value={housePrice || ""}
                    placeholder="600000000"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setHousePrice(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Uang Muka (DP) (%): {dpPercent}%
                    </label>
                    <input
                      type="number"
                      value={dpPercent || ""}
                      placeholder="20"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setDpPercent(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tenor Pinjaman (Tahun)
                    </label>
                    <input
                      type="number"
                      value={kprTenorYears || ""}
                      placeholder="15"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setKprTenorYears(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Suku Bunga KPR Efektif (% per tahun)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={kprInterestRate || ""}
                    placeholder="7.5"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setKprInterestRate(e.target.value === "" ? 0 : parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Right Results Panel */}
              <div className="lg:col-span-6 bg-slate-50/80 dark:bg-slate-850 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Estimasi Cicilan KPR Bulanan
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-[#0B5DA7] dark:text-blue-400 block mt-2 font-heading">
                    {formatRupiah(monthlyKprInstallment)} / bln
                  </span>
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] text-slate-400 block">Uang Muka (DP):</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {formatRupiah(dpAmount)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] text-slate-400 block">Pokok Pinjaman:</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {formatRupiah(loanPrincipal)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-xs text-blue-950 dark:text-blue-200 leading-relaxed">
                  <strong>💡 Batas Aman DTI OJK:</strong> Pastikan cicilan {formatRupiah(monthlyKprInstallment)} tidak melampaui 30-35% dari penghasilan keluarga Anda agar rasio utang tetap sehat dan pengajuan kredit diterima bank.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: DEBT PAYOFF (SNOWBALL VS AVALANCHE) */}
        {activeTab === "utang" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-xs font-bold text-[#0B5DA7] dark:text-blue-400 uppercase tracking-wider block">
                Strategi Pelunasan Utang Teruji
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">
                Metode Pelunasan Utang: Snowball vs Avalanche
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Pilih strategi terbaik untuk membebaskan keluarga Anda dari jeratan utang konsumtif secepat mungkin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B5DA7] dark:text-blue-300 text-xs font-bold">
                  <span>Metode 1: Bola Salju</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                  Debt Snowball (Dave Ramsey)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Urutkan seluruh utang dari nominal saldo terkecil hingga terbesar tanpa memedulikan suku bunga. Lunasi utang paling kecil secepatnya untuk mendapatkan kemenangan psikologis.
                </p>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-[#0B5DA7] dark:text-blue-300 font-semibold space-y-1">
                  <span className="block font-bold">✓ Kapan Menggunakan:</span>
                  <span>Sangat cocok untuk Anda yang butuh dorongan moral cepat dan semangat awal untuk terus melanjutkan perjuangan bebas utang.</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  <span>Metode 2: Longsoran</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                  Debt Avalanche (Matematika Finansial)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Urutkan utang berdasarkan persentase bunga tertinggi (contoh: pinjaman online atau kartu kredit 24-36% p.a.). Bayar lunas utang paling mahal terlebih dahulu.
                </p>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-emerald-800 dark:text-emerald-300 font-semibold space-y-1">
                  <span className="block font-bold">✓ Kapan Menggunakan:</span>
                  <span>Paling efisien secara matematis karena meminimalkan jumlah total uang bunga yang harus dibayarkan ke pihak kreditur.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Bottom Call to Action Banner ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-lg">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg sm:text-xl font-bold font-heading">
            Ingin Menggabungkan Seluruh Hasil Simulasi ke Rencana Resmi?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Masukkan angka riil Anda ke formulir Perencanaan Finansial 7 Langkah untuk mendapatkan laporan diagnosa CFP® dan rekomendasi alokasi bulanan yang presisi.
          </p>
        </div>

        <button
          onClick={onStartPlanning}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-[#E8701A] hover:bg-[#D6610E] text-white text-xs sm:text-sm font-bold shadow-xl transition-all cursor-pointer shrink-0"
        >
          <span>Buka Perencanaan Finansial</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
