import React, { useState } from "react";
import { formatRupiah, calculateCompoundInterest, calculateIdealEmergencyFundTarget } from "../utils/formatters";
import { Calculator, X, Shield, TrendingUp, Home, ArrowRight, CheckCircle2, Zap } from "lucide-react";

interface CalculatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorsModal: React.FC<CalculatorsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"dana_darurat" | "compound" | "kpr" | "utang">("compound");

  // 1. Dana Darurat State
  const [efMonthlyExpense, setEfMonthlyExpense] = useState(5000000);
  const [efDependents, setEfDependents] = useState(1);
  const [efEmployment, setEfEmployment] = useState<string>("karyawan_swasta");
  const [efCurrentSavings, setEfCurrentSavings] = useState(10000000);
  const [efMonthlySave, setEfMonthlySave] = useState(1500000);

  // 2. Compound Interest State
  const [compInitial, setCompInitial] = useState(10000000);
  const [compMonthly, setCompMonthly] = useState(2000000);
  const [compRate, setCompRate] = useState(8); // % p.a.
  const [compYears, setCompYears] = useState(10);

  // 3. KPR Simulator State
  const [housePrice, setHousePrice] = useState(600000000);
  const [dpPercent, setDpPercent] = useState(20);
  const [kprTenorYears, setKprTenorYears] = useState(15);
  const [kprInterestRate, setKprInterestRate] = useState(7.5);
  const [userMonthlyIncome, setUserMonthlyIncome] = useState(15000000);

  // 4. Debt Payoff State
  const [debtAAmount, setDebtAAmount] = useState(5000000); // Paylater/Pinjol (Small, High Interest)
  const [debtAInterest, setDebtAInterest] = useState(24);
  const [debtAPayment, setDebtAPayment] = useState(500000);

  const [debtBAmount, setDebtBAmount] = useState(30000000); // KTA/Motor (Medium)
  const [debtBInterest, setDebtBInterest] = useState(12);
  const [debtBPayment, setDebtBPayment] = useState(1200000);

  if (!isOpen) return null;

  // Calculators logic
  const efResult = calculateIdealEmergencyFundTarget(efMonthlyExpense, efDependents, efEmployment);
  const efGap = Math.max(0, efResult.amount - efCurrentSavings);
  const efMonthsNeeded = efMonthlySave > 0 ? Math.ceil(efGap / efMonthlySave) : 0;

  const compResult = calculateCompoundInterest(compInitial, compMonthly, compRate, compYears);

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

  const kprDti = userMonthlyIncome > 0 ? (monthlyKprInstallment / userMonthlyIncome) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full h-[90vh] max-h-[750px] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Laboratorium Simulasi & Kalkulator Cerdas
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hitung proyeksi investasi, dana darurat, cicilan KPR, dan strategi bebas hutang
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-2 bg-slate-50/30 dark:bg-slate-850/30 overflow-x-auto scrollbar-none">
          {[
            { id: "compound", label: "📈 Bunga Majemuk (Investasi)", icon: TrendingUp },
            { id: "dana_darurat", label: "🛡️ Target Dana Darurat", icon: Shield },
            { id: "kpr", label: "🏡 Simulasi KPR & DP", icon: Home },
            { id: "utang", label: "⚡ Snowball vs Avalanche", icon: Zap },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                activeTab === t.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200/80 dark:border-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* TAB 1: COMPOUND INTEREST */}
          {activeTab === "compound" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Modal Awal Investasi (Rp)
                    </label>
                    <input
                      type="number"
                      value={compInitial}
                      onChange={(e) => setCompInitial(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Setoran Rutin Bulanan (Rp)
                    </label>
                    <input
                      type="number"
                      value={compMonthly}
                      onChange={(e) => setCompMonthly(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Estimasi Return Tahunan (% p.a.)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step={0.5}
                        value={compRate}
                        onChange={(e) => setCompRate(parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <span className="text-xs text-slate-400 font-semibold">%</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[
                        { label: "RDPU 5%", val: 5 },
                        { label: "SBN 6.5%", val: 6.5 },
                        { label: "RDPT 7.5%", val: 7.5 },
                        { label: "Saham 11%", val: 11 },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setCompRate(item.val)}
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 border border-slate-200/60 dark:border-slate-700"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Durasi Waktu ({compYears} Tahun)
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={30}
                      value={compYears}
                      onChange={(e) => setCompYears(parseInt(e.target.value, 10))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                </div>

                {/* Result Card */}
                <div className="bg-slate-50 dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                      Estimasi Nilai Masa Depan (Future Value)
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white block mt-2">
                      {formatRupiah(compResult.futureValue)}
                    </span>
                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Total Uang Modal Disetor:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {formatRupiah(compResult.totalDeposited)}
                        </span>
                      </div>
                      <div className="flex justify-between text-blue-600 dark:text-blue-400">
                        <span>Total Keuntungan Bunga Majemuk:</span>
                        <span className="font-bold">
                          + {formatRupiah(compResult.totalInterest)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 leading-relaxed italic">
                    💡 Keajaiban compound interest bekerja maksimal saat Anda berinvestasi konsisten sejak usia muda dan tidak menarik imbal hasil di tengah jalan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMERGENCY FUND */}
          {activeTab === "dana_darurat" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Pengeluaran Wajib Bulanan (Rp)
                    </label>
                    <input
                      type="number"
                      value={efMonthlyExpense}
                      onChange={(e) => setEfMonthlyExpense(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Jumlah Tanggungan
                    </label>
                    <select
                      value={efDependents}
                      onChange={(e) => setEfDependents(parseInt(e.target.value, 10))}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value={0}>Lajang (0 Tanggungan)</option>
                      <option value={1}>Menikah / 1 Tanggungan</option>
                      <option value={2}>2 Tanggungan</option>
                      <option value={3}>3+ Tanggungan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Stabilitas Pekerjaan
                    </label>
                    <select
                      value={efEmployment}
                      onChange={(e) => setEfEmployment(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="karyawan_swasta">Karyawan Tetap (Gaji Bulanan)</option>
                      <option value="freelancer">Freelancer / Wiraswasta (Penghasilan Tidak Tetap)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kemampuan Menabung / Bulan (Rp)
                    </label>
                    <input
                      type="number"
                      value={efMonthlySave}
                      onChange={(e) => setEfMonthlySave(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Rekomendasi Target Dana Darurat Ideal
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 block mt-2">
                      {formatRupiah(efResult.amount)}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mt-1">
                      ({efResult.months}x Pengeluaran Bulanan)
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      {efResult.reason}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-700 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span>Kekurangan Saat Ini:</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400">{formatRupiah(efGap)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimasi Waktu Capaian:</span>
                        <span className="font-bold text-slate-900 dark:text-white">~ {efMonthsNeeded} Bulan</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KPR SIMULATOR */}
          {activeTab === "kpr" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Harga Properti / Rumah (Rp)
                    </label>
                    <input
                      type="number"
                      value={housePrice}
                      onChange={(e) => setHousePrice(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Uang Muka / DP ({dpPercent}% = {formatRupiah(dpAmount)})
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      value={dpPercent}
                      onChange={(e) => setDpPercent(parseInt(e.target.value, 10))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tenor Pinjaman ({kprTenorYears} Tahun)
                    </label>
                    <div className="flex items-center space-x-2">
                      {[10, 15, 20, 25].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setKprTenorYears(yr)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                            kprTenorYears === yr
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          {yr} Thn
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Bunga KPR Efektif (% p.a.)
                    </label>
                    <input
                      type="number"
                      step={0.25}
                      value={kprInterestRate}
                      onChange={(e) => setKprInterestRate(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Estimasi Cicilan KPR Bulanan
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 block mt-2">
                      {formatRupiah(monthlyKprInstallment)} / bln
                    </span>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Pokok Plafon Pinjaman:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{formatRupiah(loanPrincipal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Kesiapan DP Tunai Wajib:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{formatRupiah(dpAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-700 text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Kelayakan KPR Bank (Safe DTI Rule):
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Pastikan cicilan {formatRupiah(monthlyKprInstallment)} tidak melebihi 30-35% dari gaji bulanan Anda agar pengajuan KPR disetujui bank tanpa membebani biaya makan & hidup keluarga.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEBT SNOWBALL VS AVALANCHE */}
          {activeTab === "utang" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-3 shadow-sm">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    Metode Bola Salju (Debt Snowball)
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Fokus: Selesaikan Nominal Terkecil Dahulu
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Urutkan seluruh utang dari saldo paling kecil ke terbesar. Lunasi utang terkecil secepat mungkin untuk membangun motivasi psikologis (kemenangan cepat).
                  </p>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                    ✓ Cocok untuk Anda yang butuh dorongan semangat dan kepuasan melihat daftar utang berkurang satu per satu.
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 space-y-3 shadow-sm">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                    Metode Longsoran (Debt Avalanche)
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Fokus: Selesaikan Bunga Tertinggi Dahulu
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Urutkan utang berdasarkan persentase bunga tahunan (misal Pinjol 24-36% p.a. vs Kartu Kredit 21% p.a.). Lunasi yang paling 'mencekik' bunga lebih dulu.
                  </p>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs text-blue-600 dark:text-blue-400 font-semibold">
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
