import React, { useState } from "react";
import { CashflowData, DebtItem, UpcomingExpenseEvent } from "../types";
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Building,
  DollarSign,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  PiggyBank,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { MoneyInput } from "./ui/MoneyInput";
import { CollapsibleSection } from "./ui/CollapsibleSection";

interface StepProfileKeuanganProps {
  cashflow: CashflowData;
  onChange: (updated: CashflowData) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepProfileKeuangan: React.FC<StepProfileKeuanganProps> = ({
  cashflow,
  onChange,
  onNext,
  onPrev,
}) => {
  const [newDebtName, setNewDebtName] = useState("");
  const [newDebtType, setNewDebtType] = useState<DebtItem["type"]>("kartu_kredit");
  const [newDebtRemaining, setNewDebtRemaining] = useState<number>(0);
  const [newDebtMonthly, setNewDebtMonthly] = useState<number>(0);

  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventAmount, setNewEventAmount] = useState<number>(0);
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventCategory, setNewEventCategory] = useState<UpcomingExpenseEvent["category"]>("Keluarga & Lahiran");

  const handleFieldChange = (field: keyof CashflowData, value: any) => {
    onChange({
      ...cashflow,
      [field]: value,
    });
  };

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebtName.trim() || newDebtMonthly <= 0) return;
    const newDebt: DebtItem = {
      id: `debt_${Date.now()}`,
      name: newDebtName,
      type: newDebtType,
      totalRemaining: newDebtRemaining || newDebtMonthly * 12,
      monthlyPayment: newDebtMonthly,
    };
    handleFieldChange("debts", [...(cashflow.debts || []), newDebt]);
    setNewDebtName("");
    setNewDebtRemaining(0);
    setNewDebtMonthly(0);
  };

  const handleRemoveDebt = (id: string) => {
    handleFieldChange(
      "debts",
      (cashflow.debts || []).filter((d) => d.id !== id)
    );
  };

  const handleAddUpcomingExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || newEventAmount <= 0) return;
    const newEvent: UpcomingExpenseEvent = {
      id: `up_${Date.now()}`,
      title: newEventTitle,
      estimatedAmount: newEventAmount,
      targetTime: newEventTime || "12 bulan ke depan",
      category: newEventCategory,
    };
    handleFieldChange("upcomingExpenses", [...(cashflow.upcomingExpenses || []), newEvent]);
    setNewEventTitle("");
    setNewEventAmount(0);
    setNewEventTime("");
  };

  const handleRemoveUpcomingExpense = (id: string) => {
    handleFieldChange(
      "upcomingExpenses",
      (cashflow.upcomingExpenses || []).filter((item) => item.id !== id)
    );
  };

  // Calculations
  const totalActiveIncome =
    (cashflow.monthlyMainIncome || 0) +
    (cashflow.monthlySideIncome || 0) +
    (cashflow.partnerMainIncome || 0) +
    (cashflow.partnerSideIncome || 0);

  const totalPassiveIncome =
    (cashflow.businessPassiveIncome || 0) +
    (cashflow.investmentPassiveIncome || 0);

  const totalMonthlyIncome = totalActiveIncome + totalPassiveIncome;

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

  const monthlyCashSurplus = totalMonthlyIncome - totalRoutineExpenses;

  const totalLiquidAssets =
    (cashflow.cashEmergencyFund || 0) +
    (cashflow.bankSavings || 0) +
    (cashflow.deposits || 0);

  const totalInvestmentAssets =
    (cashflow.stocks || 0) +
    (cashflow.mutualFunds || 0) +
    (cashflow.gold || 0) +
    (cashflow.cryptoAssets || 0);

  const totalPhysicalAssets =
    (cashflow.propertyValue || 0) +
    (cashflow.vehicleValue || 0) +
    (cashflow.otherAssets || 0);

  const totalAvailableFunds = totalLiquidAssets + totalInvestmentAssets + totalPhysicalAssets;
  const totalDebtsOutstanding = (cashflow.debts || []).reduce((acc, d) => acc + (d.totalRemaining || 0), 0);
  const estimatedNetWorth = totalAvailableFunds - totalDebtsOutstanding;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold mb-3">
            <Wallet className="w-3.5 h-3.5" />
            <span>Langkah 2 dari 8 • Detail Arus Kas & Aset</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Profile Keuangan, Pengeluaran & Dana Tersedia
          </h1>
          <p className="text-teal-100 text-sm sm:text-base mt-2 leading-relaxed">
            Catat sumber pemasukan aktif & pasif, rincian pengeluaran bulanan, potensi pengeluaran mendatang, serta akumulasi dana yang sudah Anda miliki saat ini.
          </p>
        </div>
      </div>

      {/* Quick Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Total Pemasukan</span>
          <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            Rp {totalMonthlyIncome.toLocaleString("id-ID")}/bln
          </span>
          <span className="text-[10px] text-slate-400">Aktif + Pasif</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Total Pengeluaran</span>
          <span className="text-base sm:text-lg font-bold text-rose-600 dark:text-rose-400 mt-1 block">
            Rp {totalRoutineExpenses.toLocaleString("id-ID")}/bln
          </span>
          <span className="text-[10px] text-slate-400">Kebutuhan + Cicilan + Wants</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Surplus Bersih</span>
          <span className={`text-base sm:text-lg font-bold mt-1 block ${monthlyCashSurplus >= 0 ? "text-teal-600 dark:text-teal-400" : "text-rose-600 dark:text-rose-500"}`}>
            Rp {monthlyCashSurplus.toLocaleString("id-ID")}/bln
          </span>
          <span className="text-[10px] text-slate-400">Kapasitas Tabungan</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Total Kekayaan Bersih</span>
          <span className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
            Rp {estimatedNetWorth.toLocaleString("id-ID")}
          </span>
          <span className="text-[10px] text-slate-400">Total Aset − Total Utang</span>
        </div>
      </div>

      {/* ─ Warning Banners ────────────────────────────── */}
      {monthlyCashSurplus < 0 && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-rose-800 dark:text-rose-300">⚠️ Arus Kas Defisit!</p>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
              Pengeluaran melebihi pemasukan sebesar <span className="font-bold">Rp {Math.abs(monthlyCashSurplus).toLocaleString("id-ID")}/bulan</span>. Segera audit pengeluaran atau cari sumber pemasukan tambahan.
            </p>
          </div>
        </div>
      )}
      {totalDebtsMonthly > 0 && totalMonthlyIncome > 0 && (totalDebtsMonthly / totalMonthlyIncome) > 0.3 && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800 dark:text-amber-300">🚨 Cicilan Melebihi Batas Aman OJK!</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              DSR (Debt Service Ratio) Anda <span className="font-bold">{((totalDebtsMonthly / totalMonthlyIncome) * 100).toFixed(1)}%</span> — melebihi batas aman OJK 30%. Pertimbangkan restrukturisasi atau percepatan pelunasan utang.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Section 1: Pemasukan */}
        <CollapsibleSection
          title="1. Pemasukan (Income Streams)"
          subtitle="Pemasukan aktif & pasif pribadi dan pasangan"
          icon={<TrendingUp className="w-4 h-4" />}
          colorScheme="emerald"
          badge={totalMonthlyIncome > 0 ? `Rp ${totalMonthlyIncome.toLocaleString("id-ID")}/bln` : undefined}
          defaultExpanded={true}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MoneyInput
                id="monthlyMainIncome"
                label="Gaji Pokok / Aktif Pribadi (Rp/bln)"
                value={cashflow.monthlyMainIncome || 0}
                onChange={(v) => handleFieldChange("monthlyMainIncome", v)}
                placeholder="Contoh: 10.000.000"
              />
              <MoneyInput
                id="monthlySideIncome"
                label="Pemasukan Sampingan Pribadi (Rp/bln)"
                value={cashflow.monthlySideIncome || 0}
                onChange={(v) => handleFieldChange("monthlySideIncome", v)}
                placeholder="Freelance, lembur, komisi"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MoneyInput
                id="partnerMainIncome"
                label="Gaji Utama Pasangan (Rp/bln)"
                value={cashflow.partnerMainIncome || 0}
                onChange={(v) => handleFieldChange("partnerMainIncome", v)}
                placeholder="0 jika belum/tidak bekerja"
              />
              <MoneyInput
                id="partnerSideIncome"
                label="Pemasukan Tambahan Pasangan (Rp/bln)"
                value={cashflow.partnerSideIncome || 0}
                onChange={(v) => handleFieldChange("partnerSideIncome", v)}
                placeholder="0"
              />
            </div>
            <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/60 space-y-3">
              <span className="text-xs font-semibold text-teal-800 dark:text-teal-300 block">💰 Pendapatan Pasif (Passive Income)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <MoneyInput
                  id="businessPassiveIncome"
                  label="Laba Bisnis / Toko / Usaha (Rp/bln)"
                  value={cashflow.businessPassiveIncome || 0}
                  onChange={(v) => handleFieldChange("businessPassiveIncome", v)}
                  placeholder="0"
                />
                <MoneyInput
                  id="investmentPassiveIncome"
                  label="Dividen Saham / Kupon SBN / Sewa Kos"
                  value={cashflow.investmentPassiveIncome || 0}
                  onChange={(v) => handleFieldChange("investmentPassiveIncome", v)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Section 2: Pengeluaran Rutin */}
        <CollapsibleSection
          title="2. Detail Pengeluaran Rutin"
          subtitle="Pos kebutuhan, utilitas, gaya hidup & keluarga"
          icon={<DollarSign className="w-4 h-4" />}
          colorScheme="blue"
          badge={totalRoutineExpenses > 0 ? `Rp ${totalRoutineExpenses.toLocaleString("id-ID")}/bln` : undefined}
          defaultExpanded={true}
          warningMessage={monthlyCashSurplus < 0 ? `Total pengeluaran Rp ${totalRoutineExpenses.toLocaleString("id-ID")} melebihi pemasukan Rp ${totalMonthlyIncome.toLocaleString("id-ID")}` : undefined}
        >

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MoneyInput
                id="monthlyNeeds"
                label="Makan Pokok & Belanja Dapur (Rp/bln)"
                value={cashflow.monthlyNeeds || 0}
                onChange={(v) => handleFieldChange("monthlyNeeds", v)}
                warnIfOver={totalMonthlyIncome * 0.5}
              />
              <MoneyInput
                id="housingExpense"
                label="Sewa Rumah / Kos / IPL (Rp/bln)"
                value={cashflow.housingExpense || 0}
                onChange={(v) => handleFieldChange("housingExpense", v)}
                placeholder="0 jika rumah lunas"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MoneyInput
                id="utilitiesExpense"
                label="Listrik, Air, Wifi & Pulsa (Rp/bln)"
                value={cashflow.utilitiesExpense || 0}
                onChange={(v) => handleFieldChange("utilitiesExpense", v)}
              />
              <MoneyInput
                id="transportationExpense"
                label="Transportasi (Bensin, Tol, Ojol) (Rp/bln)"
                value={cashflow.transportationExpense || 0}
                onChange={(v) => handleFieldChange("transportationExpense", v)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MoneyInput
                id="monthlyWants"
                label="Gaya Hidup (Hangout, Ngopi, Hobi)"
                value={cashflow.monthlyWants || 0}
                onChange={(v) => handleFieldChange("monthlyWants", v)}
                warnIfOver={totalMonthlyIncome * 0.3}
              />
              <MoneyInput
                id="familySupportExpense"
                label="Uang Bulanan Ortu / Sandwich Gen (Rp)"
                value={cashflow.familySupportExpense || 0}
                onChange={(v) => handleFieldChange("familySupportExpense", v)}
                placeholder="0 jika tidak ada"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MoneyInput
                id="educationCurrentExpense"
                label="SPP / Les Sekolah Anak Saat Ini (Rp)"
                value={cashflow.educationCurrentExpense || 0}
                onChange={(v) => handleFieldChange("educationCurrentExpense", v)}
                placeholder="0 jika belum ada anak sekolah"
              />
              <MoneyInput
                id="monthlyExistingInsurance"
                label="Premi Asuransi / BPJS yang Rutin (Rp)"
                value={cashflow.monthlyExistingInsurance || 0}
                onChange={(v) => handleFieldChange("monthlyExistingInsurance", v)}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Section 3: Cicilan & Utang */}
        <CollapsibleSection
          title="3. Cicilan & Kewajiban Utang"
          subtitle="KPR, kendaraan, kartu kredit, paylater"
          icon={<CreditCard className="w-4 h-4" />}
          colorScheme="rose"
          badge={totalDebtsMonthly > 0 ? `Rp ${totalDebtsMonthly.toLocaleString("id-ID")}/bln` : undefined}
          defaultExpanded={totalDebtsMonthly > 0}
          warningMessage={totalMonthlyIncome > 0 && (totalDebtsMonthly / totalMonthlyIncome) > 0.3 ? `DSR ${((totalDebtsMonthly / totalMonthlyIncome) * 100).toFixed(1)}% melebihi batas aman OJK 30%! Pertimbangkan restrukturisasi utang.` : undefined}
        >

          <div className="space-y-3">
            {(cashflow.debts || []).map((debt) => (
              <div
                key={debt.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{debt.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 uppercase">
                      {debt.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Cicilan: <span className="font-semibold text-rose-600 dark:text-rose-400">Rp {debt.monthlyPayment.toLocaleString("id-ID")}/bln</span> • Sisa Pokok: Rp {debt.totalRemaining.toLocaleString("id-ID")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDebt(debt.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Add Debt Form */}
            <form onSubmit={handleAddDebt} className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 space-y-2.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Tambah Cicilan / Utang Baru</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newDebtName}
                  onChange={(e) => setNewDebtName(e.target.value)}
                  placeholder="Nama (cth: Cicilan Mobil, KPR)"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
                <select
                  value={newDebtType}
                  onChange={(e) => setNewDebtType(e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  <option value="kpr">KPR Rumah / Apartemen</option>
                  <option value="kendaraan">Kredit Mobil / Motor</option>
                  <option value="kartu_kredit">Kartu Kredit</option>
                  <option value="pinjol_paylater">Paylater / Pinjol</option>
                  <option value="kta">KTA / Pinjaman Bank</option>
                  <option value="lainnya">Pinjaman Lainnya</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={newDebtMonthly || ""}
                  onChange={(e) => setNewDebtMonthly(parseInt(e.target.value) || 0)}
                  placeholder="Cicilan / bln (Rp)"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
                <input
                  type="number"
                  value={newDebtRemaining || ""}
                  onChange={(e) => setNewDebtRemaining(parseInt(e.target.value) || 0)}
                  placeholder="Total Sisa Utang (Rp)"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simpan Cicilan ke Daftar</span>
              </button>
            </form>
          </div>
        </CollapsibleSection>

        {/* Section 4: Pengeluaran Mendatang */}
        <CollapsibleSection
          title="4. Potensi Pengeluaran Kedepan"
          subtitle="Biaya lahiran, renovasi rumah, mudik, servis besar"
          icon={<Calendar className="w-4 h-4" />}
          colorScheme="amber"
          badge={(cashflow.upcomingExpenses || []).length > 0 ? `${(cashflow.upcomingExpenses || []).length} item` : undefined}
          defaultExpanded={(cashflow.upcomingExpenses || []).length > 0}
        >
          <div className="space-y-3">
            {(cashflow.upcomingExpenses || []).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Estimasi: <span className="font-semibold text-purple-700 dark:text-purple-300">Rp {item.estimatedAmount.toLocaleString("id-ID")}</span> • Waktu: {item.targetTime}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveUpcomingExpense(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Add Upcoming Event Form */}
            <form onSubmit={handleAddUpcomingExpense} className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 space-y-2.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Tambah Rencana Pengeluaran Khusus</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="Kegiatan (cth: Biaya Lahiran, Renovasi)"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
                <select
                  value={newEventCategory}
                  onChange={(e) => setNewEventCategory(e.target.value as any)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Keluarga & Lahiran">Keluarga & Lahiran</option>
                  <option value="Pendidikan">Pendidikan & Masuk Sekolah</option>
                  <option value="Renovasi Rumah">Renovasi Rumah</option>
                  <option value="Kendaraan">Kendaraan & Servis</option>
                  <option value="Liburan / Ibadah">Liburan / Mudik / Ibadah</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MoneyInput
                  id="newEventAmount"
                  value={newEventAmount}
                  onChange={(v) => setNewEventAmount(v)}
                  placeholder="Estimasi Biaya"
                />
                <input
                  type="text"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  placeholder="Waktu (cth: 12 bln lagi)"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simpan Pengeluaran Mendatang</span>
              </button>
            </form>
          </div>
        </CollapsibleSection>

        {/* Section 5: Total Aset */}
        <CollapsibleSection
          title="5. Dana Yang Sudah Tersedia (Total Aset)"
          subtitle="Kas likuid, saham, reksadana, emas, properti & kendaraan"
          icon={<PiggyBank className="w-4 h-4" />}
          colorScheme="indigo"
          badge={totalAvailableFunds > 0 ? `Rp ${totalAvailableFunds.toLocaleString("id-ID")}` : undefined}
          defaultExpanded={true}
        >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MoneyInput id="cashEmergencyFund" label="Kas Dana Darurat Tersimpan (Rp)" value={cashflow.cashEmergencyFund || 0} onChange={(v) => handleFieldChange("cashEmergencyFund", v)} hint="Tabungan khusus dana darurat" />
          <MoneyInput id="bankSavings" label="Tabungan Operasional Bank (Rp)" value={cashflow.bankSavings || 0} onChange={(v) => handleFieldChange("bankSavings", v)} hint="Rekening harian belanja" />
          <MoneyInput id="deposits" label="Deposito Berjangka (Rp)" value={cashflow.deposits || 0} onChange={(v) => handleFieldChange("deposits", v)} />
          <MoneyInput id="stocks" label="Saham (IHSG / Luar Negeri) (Rp)" value={cashflow.stocks || 0} onChange={(v) => handleFieldChange("stocks", v)} />
          <MoneyInput id="mutualFunds" label="Reksadana / SBN Ritel (Rp)" value={cashflow.mutualFunds || 0} onChange={(v) => handleFieldChange("mutualFunds", v)} />
          <MoneyInput id="gold" label="Emas Batangan / Logam Mulia (Rp)" value={cashflow.gold || 0} onChange={(v) => handleFieldChange("gold", v)} />
          <MoneyInput id="propertyValue" label="Nilai Properti / Rumah (Rp)" value={cashflow.propertyValue || 0} onChange={(v) => handleFieldChange("propertyValue", v)} placeholder="0 jika belum ada" />
          <MoneyInput id="vehicleValue" label="Nilai Kendaraan Mobil/Motor (Rp)" value={cashflow.vehicleValue || 0} onChange={(v) => handleFieldChange("vehicleValue", v)} />
          <MoneyInput id="otherAssets" label="Aset Lainnya (Bisnis / Kripto) (Rp)" value={cashflow.otherAssets || 0} onChange={(v) => handleFieldChange("otherAssets", v)} />
        </div>
        </CollapsibleSection>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onPrev}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Data Diri</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-500/20 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <span>Lanjut ke Langkah 3: Profile Karier</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
