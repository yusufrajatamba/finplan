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
  X,
  Shield,
  TrendingUp,
  Home,
  ArrowRight,
  CheckCircle2,
  Zap,
  Clock,
  Award,
  Target,
  Scale,
} from "lucide-react";

interface CalculatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorsModal: React.FC<CalculatorsModalProps> = ({
  isOpen,
  onClose,
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
  const [userMonthlyIncome, setUserMonthlyIncome] = useState(15000000);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full h-[92vh] max-h-[780px] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-blue-900/60 flex items-center justify-between bg-[#002266] text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0055B8] text-white flex items-center justify-center border border-blue-400/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Simulasi & Kalkulator Finansial Master
              </h2>
              <p className="text-xs text-blue-200">
                Formula matematis OJK, Benjamin Graham, Vicki Robin, Stanley & Danko, dan JL Collins
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-2 bg-slate-50/50 dark:bg-slate-850/50 overflow-x-auto scrollbar-none">
          {[
            { id: "compound", label: "📈 Bunga Majemuk & 72", icon: TrendingUp },
            { id: "dana_darurat", label: "🛡️ Dana Darurat & Margin", icon: Shield },
            { id: "life_energy", label: "⏳ Energi Hidup (Vicki Robin)", icon: Clock },
            { id: "net_worth_paw", label: "🏆 Net Worth PAW (Stanley)", icon: Award },
            { id: "rule_25x", label: "🎯 FIRE & 25× Rule (Collins)", icon: Target },
            { id: "kpr", label: "🏡 Simulasi KPR & DP", icon: Home },
            { id: "utang", label: "⚡ Pelunasan Utang", icon: Zap },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap shrink-0 flex items-center space-x-1.5 cursor-pointer ${
                activeTab === t.id
                  ? "bg-[#003399] text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200/80 dark:border-slate-700"
              }`}
            >
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {/* TAB 1: COMPOUND INTEREST & RULE OF 72 */}
          {activeTab === "compound" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Modal Awal Investasi (Rp)
                    </label>
                    <input
                      type="number"
                      value={compInitial || ""}
                      placeholder="10000000"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setCompInitial(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Investasi Rutin Bulanan (DCA) (Rp)
                    </label>
                    <input
                      type="number"
                      value={compMonthly || ""}
                      placeholder="2000000"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setCompMonthly(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Return Imbal Hasil (% p.a.)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={compRate || ""}
                        placeholder="8"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setCompRate(e.target.value === "" ? 0 : parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Jangka Waktu (Tahun)
                      </label>
                      <input
                        type="number"
                        value={compYears || ""}
                        placeholder="10"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setCompYears(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Hasil Akumulasi Compounding
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#003399] dark:text-blue-400 block mt-2">
                      {formatRupiah(compResult.futureValue)}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      Total modal disetor: {formatRupiah(compResult.totalDeposited)} • Pertumbuhan Bunga: {formatRupiah(compResult.totalInterest)}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-700 text-xs">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200">
                      <strong>Rule of 72 (Lipat Ganda 2x):</strong> Dengan imbal hasil {compRate}%/tahun, modal awal Anda akan berlipat ganda menjadi 2× lipat dalam waktu <strong>{yearsToDouble} tahun</strong> tanpa menambah setoran!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DANA DARURAT & MARGIN OF SAFETY */}
          {activeTab === "dana_darurat" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Total Penghasilan Bulanan (Rp)
                    </label>
                    <input
                      type="number"
                      value={efMonthlyIncome || ""}
                      placeholder="15000000"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setEfMonthlyIncome(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Pengeluaran Pokok Bulanan (Rp)
                    </label>
                    <input
                      type="number"
                      value={efMonthlyExpense || ""}
                      placeholder="6000000"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setEfMonthlyExpense(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Jumlah Tanggungan
                      </label>
                      <input
                        type="number"
                        value={efDependents || ""}
                        placeholder="1"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setEfDependents(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Dana Darurat Saat Ini (Rp)
                      </label>
                      <input
                        type="number"
                        value={efCurrentSavings || ""}
                        placeholder="15000000"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setEfCurrentSavings(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Target Dana Darurat OJK ({efResult.months}× Pengeluaran)
                    </span>
                    <span className="text-2xl font-extrabold text-[#003399] dark:text-blue-400 block mt-1">
                      {formatRupiah(efResult.amount)}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      Kekurangan: {formatRupiah(efGap)} ({efMonthsNeeded} bulan lagi tercapai dengan cicil Rp {efMonthlySave.toLocaleString("id-ID")}/bln).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 space-y-1">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block">
                      Margin of Safety Graham: {marginResult.marginPercent}% ({marginResult.status})
                    </span>
                    <p className="text-xs text-emerald-800 dark:text-emerald-200">
                      {marginResult.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIFE ENERGY CALCULATOR (VICKI ROBIN) */}
          {activeTab === "life_energy" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Penghasilan Bersih Bulanan (Take-Home Pay) (Rp)
                    </label>
                    <input
                      type="number"
                      value={leIncome || ""}
                      placeholder="15000000"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setLeIncome(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Total Jam Kerja + Komuter per Bulan (Jam)
                    </label>
                    <input
                      type="number"
                      value={leHours || ""}
                      placeholder="200"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setLeHours(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                    <span className="text-[11px] text-slate-400">Standar: 160 jam kantor + 40 jam perjalanan/persiapan = 200 jam.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Harga Barang / Pengeluaran yang Ingin Dibeli (Rp)
                    </label>
                    <input
                      type="number"
                      value={leExpense || ""}
                      placeholder="1500000"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setLeExpense(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Upah Riil per Jam Waktu Hidup Anda
                    </span>
                    <span className="text-2xl font-extrabold text-[#003399] dark:text-blue-400 block mt-1">
                      Rp {lifeEnergyResult.realHourlyWage.toLocaleString("id-ID")} / jam
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      Setiap 1 jam kehidupan yang Anda berikan untuk bekerja dihargai sebesar Rp {lifeEnergyResult.realHourlyWage.toLocaleString("id-ID")}.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1.5">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                      ⏳ Biaya Energi Hidup Barang: {lifeEnergyResult.hoursRequired} Jam ({lifeEnergyResult.daysRequired} Hari Kerja)
                    </span>
                    <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Usia Anda Saat Ini (Tahun)
                    </label>
                    <input
                      type="number"
                      value={enwAge || ""}
                      placeholder="30"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setEnwAge(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Total Penghasilan Tahunan Keluarga (Rp/tahun)
                    </label>
                    <input
                      type="number"
                      value={enwAnnualIncome || ""}
                      placeholder="180000000"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setEnwAnnualIncome(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kekayaan Bersih Aktual (Net Worth) (Rp)
                    </label>
                    <input
                      type="number"
                      value={enwActualNetWorth || ""}
                      placeholder="150000000"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setEnwActualNetWorth(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                    <span className="text-[11px] text-slate-400">Total Aset (Kas + Investasi + Properti) dikurangi Total Utang.</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Target Expected Net Worth Ideal
                    </span>
                    <span className="text-2xl font-extrabold text-[#003399] dark:text-blue-400 block mt-1">
                      {formatRupiah(enwResult.expectedNetWorth)}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      Formula Stanley & Danko: ({enwAge} tahun × Rp {(enwAnnualIncome/1000000).toFixed(0)} Jt) ÷ 10.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Status Akumulasi:</span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${enwResult.categoryBadge}`}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Pengeluaran Rutin Bulanan Masa Pensiun (Rp/bln)
                    </label>
                    <input
                      type="number"
                      value={fiMonthlyCost || ""}
                      placeholder="12000000"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setFiMonthlyCost(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Portofolio Investasi Saat Ini (Rp)
                    </label>
                    <input
                      type="number"
                      value={fiCurrentPortfolio || ""}
                      placeholder="50000000"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setFiCurrentPortfolio(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Investasi Rutin Bulanan (Rp)
                      </label>
                      <input
                        type="number"
                        value={fiMonthlyInvestment || ""}
                        placeholder="4000000"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setFiMonthlyInvestment(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Ekspektasi Return (% p.a.)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={fiExpectedReturn || ""}
                        placeholder="7.5"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setFiExpectedReturn(e.target.value === "" ? 0 : parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Target Portofolio Mandiri (Rule of 25×)
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#003399] dark:text-blue-400 block mt-1">
                      {formatRupiah(fiResult.fiTargetNumber)}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      Menghasilkan Passive Income 4% safe withdrawal = Rp {fiResult.monthlyPassiveIncomeAtFI.toLocaleString("id-ID")}/bulan selamanya.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-purple-950 dark:text-purple-200">
                      <span>Progres Tercapai: {fiResult.progressPercent}%</span>
                      <span>Estimasi: {fiResult.estimatedYearsToFI} Tahun Lagi</span>
                    </div>
                    <div className="w-full bg-purple-200 dark:bg-purple-900 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Harga Properti / Rumah (Rp)
                    </label>
                    <input
                      type="number"
                      value={housePrice || ""}
                      placeholder="600000000"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setHousePrice(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Uang Muka (DP) (%): {dpPercent}%
                      </label>
                      <input
                        type="number"
                        value={dpPercent || ""}
                        placeholder="20"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setDpPercent(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Tenor Pinjaman (Tahun)
                      </label>
                      <input
                        type="number"
                        value={kprTenorYears || ""}
                        placeholder="15"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setKprTenorYears(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Suku Bunga KPR Efektif (% p.a.)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={kprInterestRate || ""}
                      placeholder="7.5"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setKprInterestRate(e.target.value === "" ? 0 : parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Estimasi Cicilan KPR Bulanan
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#003399] dark:text-blue-400 block mt-1">
                      {formatRupiah(monthlyKprInstallment)} / bln
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      Pokok Pinjaman: {formatRupiah(loanPrincipal)} • DP Wajib: {formatRupiah(dpAmount)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-xs text-blue-950 dark:text-blue-200">
                    <strong>Safe DTI Rule OJK:</strong> Pastikan cicilan {formatRupiah(monthlyKprInstallment)} tidak melebihi 30-35% dari gaji bulanan Anda agar pengajuan KPR disetujui bank tanpa membebani biaya makan & hidup keluarga.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: DEBT PAYOFF (SNOWBALL VS AVALANCHE) */}
          {activeTab === "utang" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-3 shadow-xs">
                  <span className="text-xs font-bold text-[#003399] dark:text-blue-400 uppercase tracking-wider block">
                    Metode Bola Salju (Debt Snowball — Dave Ramsey)
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Fokus: Selesaikan Nominal Terkecil Dahulu
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Urutkan seluruh utang dari saldo paling kecil ke terbesar. Lunasi utang terkecil secepat mungkin untuk membangun motivasi psikologis (kemenangan cepat).
                  </p>
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs text-[#003399] dark:text-blue-400 font-semibold">
                    ✓ Cocok untuk Anda yang butuh dorongan semangat dan kepuasan melihat daftar utang berkurang satu per satu.
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-3 shadow-xs">
                  <span className="text-xs font-bold text-[#003399] dark:text-blue-400 uppercase tracking-wider block">
                    Metode Longsoran (Debt Avalanche — Matematika Murni)
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Fokus: Selesaikan Bunga Tertinggi Dahulu
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Urutkan utang berdasarkan persentase bunga tahunan (misal Pinjol 24-36% p.a. vs Kartu Kredit 21% p.a.). Lunasi yang paling 'mencekik' bunga lebih dulu.
                  </p>
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs text-[#003399] dark:text-blue-400 font-semibold">
                    ✓ Secara matematis paling menghemat total uang bunga yang harus dibayar ke bank/fintech.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
