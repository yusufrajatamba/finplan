import React from "react";
import { CashflowData, DebtItem } from "../types";
import { formatRupiah, calculateDTI } from "../utils/formatters";
import {
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  AlertTriangle,
  TrendingDown,
  Building,
  PiggyBank,
  CheckCircle,
} from "lucide-react";

interface StepArusKasProps {
  cashflow: CashflowData;
  onChange: (updated: Partial<CashflowData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepArusKas: React.FC<StepArusKasProps> = ({
  cashflow,
  onChange,
  onNext,
  onBack,
}) => {
  const totalIncome =
    cashflow.monthlyMainIncome +
    cashflow.monthlySideIncome +
    cashflow.monthlyPassiveIncome;

  const totalMonthlyDebts = cashflow.debts.reduce(
    (sum, d) => sum + (d.monthlyPayment || 0),
    0
  );

  const totalExpenses =
    cashflow.monthlyNeeds +
    cashflow.monthlyWants +
    cashflow.monthlyExistingInsurance +
    totalMonthlyDebts;

  const netSurplus = totalIncome - totalExpenses;

  const totalAssets =
    cashflow.cashEmergencyFund +
    cashflow.bankSavings +
    cashflow.deposits +
    cashflow.gold +
    cashflow.mutualFunds +
    cashflow.stocks +
    cashflow.otherAssets;

  const totalDebtBalance = cashflow.debts.reduce(
    (sum, d) => sum + (d.totalRemaining || 0),
    0
  );

  const dtiAnalysis = calculateDTI(totalMonthlyDebts, totalIncome);

  const emergencyMonthsCoverage =
    cashflow.monthlyNeeds > 0
      ? (cashflow.cashEmergencyFund / cashflow.monthlyNeeds).toFixed(1)
      : "0";

  // Helper for quick currency increment chips
  const renderQuickAddChips = (
    currentValue: number,
    onAdd: (newVal: number) => void
  ) => {
    return (
      <div className="flex items-center space-x-1.5 mt-2 overflow-x-auto scrollbar-none pb-1">
        {[500000, 1000000, 5000000, 10000000].map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => onAdd(currentValue + amt)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300 transition-colors border border-slate-200/60 dark:border-slate-700/60 flex-shrink-0"
          >
            +{amt >= 1000000 ? `${amt / 1000000} Jt` : `${amt / 1000} Rb`}
          </button>
        ))}
      </div>
    );
  };

  const handleAddDebt = () => {
    const newDebt: DebtItem = {
      id: "debt_" + Date.now(),
      name: "",
      type: "pinjol_paylater",
      totalRemaining: 0,
      monthlyPayment: 0,
      interestRatePerYear: 0,
    };
    onChange({ debts: [...cashflow.debts, newDebt] });
  };

  const handleUpdateDebt = (id: string, updated: Partial<DebtItem>) => {
    onChange({
      debts: cashflow.debts.map((d) => (d.id === id ? { ...d, ...updated } : d)),
    });
  };

  const handleRemoveDebt = (id: string) => {
    onChange({
      debts: cashflow.debts.filter((d) => d.id !== id),
    });
  };

  const isValid = totalIncome > 0 && cashflow.monthlyNeeds > 0;

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-3 shadow-xs">
          <DollarSign className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Langkah 2: Arus Kas, Cicilan & Posisi Aset
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
          Masukkan perkiraan pemasukan, biaya hidup rutin, cicilan hutang yang berjalan, serta saldo aset Anda saat ini.
        </p>
      </div>

      {/* Live Financial Health Radar Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Total Pemasukan / Bln
          </span>
          <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 block mt-1">
            {formatRupiah(totalIncome)}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Gaji + Sampingan + Pasif
          </span>
        </div>

        <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Total Pengeluaran / Bln
          </span>
          <span className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-400 block mt-1">
            {formatRupiah(totalExpenses)}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Pokok + Lifestyle + Cicilan
          </span>
        </div>

        <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Sisa Kas / Arus Kas Bersih
          </span>
          <span
            className={`text-lg sm:text-xl font-bold block mt-1 ${
              netSurplus >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {formatRupiah(netSurplus)}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {netSurplus >= 0 ? "Surplus siap diinvestasikan" : "Defisit! Butuh penyesuaian"}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Beban Utang (DTI)
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`text-lg sm:text-xl font-bold ${dtiAnalysis.colorClass}`}>
              {dtiAnalysis.dtiPercent}%
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                dtiAnalysis.status === "Sehat"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : dtiAnalysis.status === "Waspada"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                  : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
              }`}
            >
              {dtiAnalysis.status}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block line-clamp-1">
            Maks aman: 30% dari gaji
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Section 1: Incomes */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                1. Pendapatan Rutin Bulanan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pemasukan bersih (take home pay) yang masuk ke rekening Anda tiap bulan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
            <div>
              <label htmlFor="input-main-income" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Gaji Pokok / Usaha Utama (Rp/bln)
              </label>
              <input
                id="input-main-income"
                type="number"
                value={cashflow.monthlyMainIncome || ""}
                onChange={(e) =>
                  onChange({ monthlyMainIncome: parseInt(e.target.value, 10) || 0 })
                }
                placeholder="0"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
              {renderQuickAddChips(cashflow.monthlyMainIncome, (v) =>
                onChange({ monthlyMainIncome: v })
              )}
            </div>

            <div>
              <label htmlFor="input-side-income" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Side Hustle / Freelance / Bonus (Rp/bln)
              </label>
              <input
                id="input-side-income"
                type="number"
                value={cashflow.monthlySideIncome || ""}
                onChange={(e) =>
                  onChange({ monthlySideIncome: parseInt(e.target.value, 10) || 0 })
                }
                placeholder="0"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
              {renderQuickAddChips(cashflow.monthlySideIncome, (v) =>
                onChange({ monthlySideIncome: v })
              )}
            </div>

            <div>
              <label htmlFor="input-passive-income" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Passive Income (Dividen / Sewa / SBN)
              </label>
              <input
                id="input-passive-income"
                type="number"
                value={cashflow.monthlyPassiveIncome || ""}
                onChange={(e) =>
                  onChange({ monthlyPassiveIncome: parseInt(e.target.value, 10) || 0 })
                }
                placeholder="0"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
              {renderQuickAddChips(cashflow.monthlyPassiveIncome, (v) =>
                onChange({ monthlyPassiveIncome: v })
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Expenses */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="w-2 h-6 bg-rose-500 rounded-full inline-block"></span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                2. Pengeluaran Rutin Bulanan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bagi pengeluaran menjadi pos kebutuhan pokok (Needs) dan gaya hidup (Wants).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
            <div>
              <label htmlFor="input-needs" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Kebutuhan Pokok / Needs (Rp/bln)
              </label>
              <span className="text-[11px] text-slate-400 block mb-1.5">
                Makan, kos/kontrakan, listrik, air, internet, transport wajib
              </span>
              <input
                id="input-needs"
                type="number"
                value={cashflow.monthlyNeeds || ""}
                onChange={(e) =>
                  onChange({ monthlyNeeds: parseInt(e.target.value, 10) || 0 })
                }
                placeholder="0"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
              {renderQuickAddChips(cashflow.monthlyNeeds, (v) =>
                onChange({ monthlyNeeds: v })
              )}
            </div>

            <div>
              <label htmlFor="input-wants" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Keinginan & Lifestyle / Wants (Rp/bln)
              </label>
              <span className="text-[11px] text-slate-400 block mb-1.5">
                Kopi/nongkrong, belanja baju/hobi, nonton, kuliner santai
              </span>
              <input
                id="input-wants"
                type="number"
                value={cashflow.monthlyWants || ""}
                onChange={(e) =>
                  onChange({ monthlyWants: parseInt(e.target.value, 10) || 0 })
                }
                placeholder="0"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
              {renderQuickAddChips(cashflow.monthlyWants, (v) =>
                onChange({ monthlyWants: v })
              )}
            </div>

            <div>
              <label htmlFor="input-insurance" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Premi Asuransi / BPJS yang Sudah Ada (Rp/bln)
              </label>
              <span className="text-[11px] text-slate-400 block mb-1.5">
                Total iuran BPJS Kesehatan pribadi atau asuransi swasta mandiri
              </span>
              <input
                id="input-insurance"
                type="number"
                value={cashflow.monthlyExistingInsurance || ""}
                onChange={(e) =>
                  onChange({ monthlyExistingInsurance: parseInt(e.target.value, 10) || 0 })
                }
                placeholder="0"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
              {renderQuickAddChips(cashflow.monthlyExistingInsurance, (v) =>
                onChange({ monthlyExistingInsurance: v })
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Debts and Installments */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-6 bg-amber-500 rounded-full inline-block"></span>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  3. Daftar Cicilan & Hutang Berjalan
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total sisa hutang: <span className="font-semibold text-slate-900 dark:text-white">{formatRupiah(totalDebtBalance)}</span> • Cicilan: <span className="font-semibold text-rose-600 dark:text-rose-400">{formatRupiah(totalMonthlyDebts)}/bln</span>
                </p>
              </div>
            </div>

            <button
              id="btn-add-debt"
              type="button"
              onClick={handleAddDebt}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 hover:bg-blue-100 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Cicilan</span>
            </button>
          </div>

          {cashflow.debts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2 opacity-80" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">Hebat! Anda tidak memiliki catatan cicilan/hutang.</p>
              <p className="mt-0.5">Jika ada cicilan KPR, motor, kartu kredit atau paylater, klik tombol "Tambah Cicilan".</p>
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              {cashflow.debts.map((debt) => (
                <div
                  key={debt.id}
                  className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                      Nama Cicilan / Sumber
                    </label>
                    <input
                      type="text"
                      value={debt.name}
                      onChange={(e) => handleUpdateDebt(debt.id, { name: e.target.value })}
                      placeholder="Cth: Cicilan KPR / Paylater"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                      Kategori
                    </label>
                    <select
                      value={debt.type}
                      onChange={(e) => handleUpdateDebt(debt.id, { type: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="kpr">KPR Rumah</option>
                      <option value="kendaraan">Motor / Mobil</option>
                      <option value="kartu_kredit">Kartu Kredit</option>
                      <option value="pinjol_paylater">Paylater / Pinjol</option>
                      <option value="kta">KTA / Pinjaman Bank</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                      Sisa Pokok Hutang (Rp)
                    </label>
                    <input
                      type="number"
                      value={debt.totalRemaining || ""}
                      onChange={(e) =>
                        handleUpdateDebt(debt.id, {
                          totalRemaining: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                      Cicilan Per Bulan (Rp)
                    </label>
                    <input
                      type="number"
                      value={debt.monthlyPayment || ""}
                      onChange={(e) =>
                        handleUpdateDebt(debt.id, {
                          monthlyPayment: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveDebt(debt.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Hapus Cicilan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 4: Current Assets */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-6 bg-emerald-500 rounded-full inline-block"></span>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  4. Posisi Saldo Aset Saat Ini
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total kekayaan bersih: <span className="font-semibold text-blue-600 dark:text-blue-400">{formatRupiah(totalAssets)}</span> • Dana darurat terkumpul mencakup <span className="font-semibold">{emergencyMonthsCoverage} bulan</span> pengeluaran pokok.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mt-5">
            <div>
              <label htmlFor="input-emergency-fund" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Dana Darurat Tunai / RDPU Likuid (Rp)
              </label>
              <input
                id="input-emergency-fund"
                type="number"
                value={cashflow.cashEmergencyFund || ""}
                onChange={(e) =>
                  onChange({ cashEmergencyFund: parseInt(e.target.value, 10) || 0 })
                }
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {renderQuickAddChips(cashflow.cashEmergencyFund, (v) =>
                onChange({ cashEmergencyFund: v })
              )}
            </div>

            <div>
              <label htmlFor="input-bank-savings" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Tabungan Bank / Deposito (Rp)
              </label>
              <input
                id="input-bank-savings"
                type="number"
                value={cashflow.bankSavings || ""}
                onChange={(e) =>
                  onChange({ bankSavings: parseInt(e.target.value, 10) || 0 })
                }
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {renderQuickAddChips(cashflow.bankSavings, (v) =>
                onChange({ bankSavings: v })
              )}
            </div>

            <div>
              <label htmlFor="input-gold" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Emas Batangan / Logam Mulia (Rp)
              </label>
              <input
                id="input-gold"
                type="number"
                value={cashflow.gold || ""}
                onChange={(e) =>
                  onChange({ gold: parseInt(e.target.value, 10) || 0 })
                }
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {renderQuickAddChips(cashflow.gold, (v) =>
                onChange({ gold: v })
              )}
            </div>

            <div>
              <label htmlFor="input-mutual-funds" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Reksadana / SBN Ritel (Rp)
              </label>
              <input
                id="input-mutual-funds"
                type="number"
                value={cashflow.mutualFunds || ""}
                onChange={(e) =>
                  onChange({ mutualFunds: parseInt(e.target.value, 10) || 0 })
                }
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {renderQuickAddChips(cashflow.mutualFunds, (v) =>
                onChange({ mutualFunds: v })
              )}
            </div>

            <div>
              <label htmlFor="input-stocks" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Saham BEI / Kripto (Rp)
              </label>
              <input
                id="input-stocks"
                type="number"
                value={cashflow.stocks || ""}
                onChange={(e) =>
                  onChange({ stocks: parseInt(e.target.value, 10) || 0 })
                }
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {renderQuickAddChips(cashflow.stocks, (v) =>
                onChange({ stocks: v })
              )}
            </div>

            <div>
              <label htmlFor="input-other-assets" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Aset Lainnya (Properti/Tanah dll)
              </label>
              <input
                id="input-other-assets"
                type="number"
                value={cashflow.otherAssets || ""}
                onChange={(e) =>
                  onChange({ otherAssets: parseInt(e.target.value, 10) || 0 })
                }
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {renderQuickAddChips(cashflow.otherAssets, (v) =>
                onChange({ otherAssets: v })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-semibold text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Data Diri</span>
        </button>

        <button
          id="btn-next-to-goals"
          onClick={onNext}
          disabled={!isValid}
          className={`flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-md ${
            isValid
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
              : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          <span>Lanjut: Target & Impian Finansial (Goals)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
