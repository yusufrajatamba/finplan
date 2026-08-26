import React, { useState } from "react";
import { TargetGoalsData, ChildEducationLevel, FinancialGoal, CashflowData, UserProfile } from "../types";
import {
  Target,
  Home,
  GraduationCap,
  Car,
  TrendingUp,
  ShieldCheck,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  Layers,
} from "lucide-react";

interface StepGoalsProps {
  goals: TargetGoalsData;
  cashflow: CashflowData;
  profile: UserProfile;
  onChange: (updated: TargetGoalsData) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepGoals: React.FC<StepGoalsProps> = ({
  goals,
  cashflow,
  profile,
  onChange,
  onNext,
  onPrev,
}) => {
  const [newChildName, setNewChildName] = useState("");
  const [newChildLevel, setNewChildLevel] = useState<ChildEducationLevel["level"]>("SD");
  const [newChildCost, setNewChildCost] = useState<number>(30000000);
  const [newChildYear, setNewChildYear] = useState<number>(new Date().getFullYear() + 3);
  const [newChildSchool, setNewChildSchool] = useState("");

  const [customGoalTitle, setCustomGoalTitle] = useState("");
  const [customGoalCategory, setCustomGoalCategory] = useState<FinancialGoal["category"]>("dana_pensiun");
  const [customGoalAmount, setCustomGoalAmount] = useState<number>(100000000);
  const [customGoalMonths, setCustomGoalMonths] = useState<number>(36);

  // Auto calculate baseline emergency fund
  const livingCost =
    (cashflow.monthlyNeeds || 0) +
    (cashflow.housingExpense || 0) +
    (cashflow.utilitiesExpense || 0) +
    (cashflow.transportationExpense || 0) +
    (cashflow.monthlyWants || 0) +
    (cashflow.familySupportExpense || 0) +
    (cashflow.educationCurrentExpense || 0) +
    (cashflow.monthlyExistingInsurance || 0);

  const defaultMultiplier = profile.maritalStatus === "Menikah" || profile.dependents > 0 ? 9 : 6;
  const calculatedEmergencyFund = Math.max(25000000, livingCost * (goals.emergencyFund?.multiplierMonths || defaultMultiplier));

  const handleUpdate = (field: keyof TargetGoalsData, value: any) => {
    onChange({
      ...goals,
      [field]: value,
    });
  };

  const handleEmergencyChange = (field: string, value: any) => {
    onChange({
      ...goals,
      emergencyFund: {
        ...goals.emergencyFund,
        [field]: value,
      },
    });
  };

  const handleHousingChange = (field: string, value: any) => {
    onChange({
      ...goals,
      housingTarget: {
        ...goals.housingTarget,
        [field]: value,
      },
    });
  };

  const handleIncomeChange = (field: string, value: any) => {
    onChange({
      ...goals,
      incomeTarget: {
        ...goals.incomeTarget,
        [field]: value,
      },
    });
  };

  const handleVehicleChange = (field: string, value: any) => {
    onChange({
      ...goals,
      vehicleTarget: {
        ...goals.vehicleTarget,
        [field]: value,
      },
    });
  };

  const handleAddChildEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim() || newChildCost <= 0) return;
    const newEdu: ChildEducationLevel = {
      id: `edu_${Date.now()}`,
      childName: newChildName,
      level: newChildLevel,
      targetYear: newChildYear,
      estimatedCostToday: newChildCost,
      targetSchoolName: newChildSchool || undefined,
    };
    handleUpdate("childrenEducation", {
      ...goals.childrenEducation,
      educationLevels: [...(goals.childrenEducation?.educationLevels || []), newEdu],
    });
    setNewChildName("");
    setNewChildSchool("");
  };

  const handleRemoveChildEducation = (id: string) => {
    handleUpdate("childrenEducation", {
      ...goals.childrenEducation,
      educationLevels: (goals.childrenEducation?.educationLevels || []).filter((e) => e.id !== id),
    });
  };

  const handleAddCustomGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoalTitle.trim() || customGoalAmount <= 0) return;
    const newGoal: FinancialGoal = {
      id: `goal_${Date.now()}`,
      title: customGoalTitle,
      category: customGoalCategory,
      targetAmount: customGoalAmount,
      currentAmount: 0,
      deadlineMonths: customGoalMonths,
      priority: "Tinggi",
    };
    handleUpdate("customGoals", [...(goals.customGoals || []), newGoal]);
    setCustomGoalTitle("");
    setCustomGoalAmount(100000000);
  };

  const handleRemoveCustomGoal = (id: string) => {
    handleUpdate(
      "customGoals",
      (goals.customGoals || []).filter((g) => g.id !== id)
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0066CC] via-[#0077EE] to-[#0099FF] rounded-2xl p-5 sm:p-6 text-white shadow-md border border-blue-300/40 space-y-1.5">
        <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold border border-white/30 text-white">
          <Target className="w-3.5 h-3.5 text-blue-100" />
          <span>Langkah 4 dari 7 • Target Finansial</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Target Finansial & Sasaran Masa Depan
        </h1>
        <p className="text-blue-50 text-xs sm:text-sm leading-relaxed max-w-4xl">
          Tentukan sasaran dana darurat, pembelian hunian, kendaraan, dana pendidikan anak, hingga rencana pensiun mandiri sesuai standar CFP® & OJK.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Target Dana Darurat (Otomatis & Bisa Disesuaikan) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">1. Target Dana Darurat</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Otomatis dihitung & dapat disesuaikan manual</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {goals.emergencyFund?.autoCalculate ? "Mode Otomatis" : "Mode Custom"}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60">
              <div>
                <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 block">
                  Kebutuhan Dana Darurat Terhitung
                </span>
                <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400 block mt-0.5">
                  Rp {(goals.emergencyFund?.autoCalculate ? calculatedEmergencyFund : (goals.emergencyFund?.customTargetAmount || calculatedEmergencyFund)).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="text-right text-xs text-emerald-800 dark:text-emerald-300">
                <span className="font-bold">{goals.emergencyFund?.multiplierMonths || defaultMultiplier}x</span> Biaya Hidup
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  checked={goals.emergencyFund?.autoCalculate ?? true}
                  onChange={() => handleEmergencyChange("autoCalculate", true)}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>Hitung Otomatis Berdasarkan Pengeluaran</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  checked={!(goals.emergencyFund?.autoCalculate ?? true)}
                  onChange={() => handleEmergencyChange("autoCalculate", false)}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>Kustomisasi Nominal Manual</span>
              </label>
            </div>

            {goals.emergencyFund?.autoCalculate ? (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Pilih Kelipatan Bulan Pengeluaran ({goals.emergencyFund?.multiplierMonths || defaultMultiplier} Bulan)
                </label>
                <input
                  type="range"
                  min="3"
                  max="18"
                  step="1"
                  value={goals.emergencyFund?.multiplierMonths || defaultMultiplier}
                  onChange={(e) => handleEmergencyChange("multiplierMonths", parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>3 Bulan (Lajang)</span>
                  <span>6-9 Bulan (Keluarga)</span>
                  <span>12-18 Bulan (Wirausaha)</span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Nominal Target Dana Darurat Kustom (Rp)
                </label>
                <input
                  type="number"
                  step="5000000"
                  value={goals.emergencyFund?.customTargetAmount || ""}
                  onChange={(e) => handleEmergencyChange("customTargetAmount", parseInt(e.target.value) || 0)}
                  placeholder="Contoh: 150000000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-semibold"
                />
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Target Tempat Tinggal (Lokasi, Harga, Cash atau KPR) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">2. Target Tempat Tinggal / Rumah</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Lokasi, estimasi harga, skema Cash vs KPR</p>
              </div>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={goals.housingTarget?.hasTarget ?? true}
                onChange={(e) => handleHousingChange("hasTarget", e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded-sm"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Ada Target Rumah</span>
            </label>
          </div>

          {goals.housingTarget?.hasTarget ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Lokasi / Area Rumah Impian
                  </label>
                  <input
                    type="text"
                    value={goals.housingTarget?.location || ""}
                    onChange={(e) => handleHousingChange("location", e.target.value)}
                    placeholder="Contoh: BSD City / Gading Serpong"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Estimasi Harga Rumah (Rp)
                  </label>
                  <input
                    type="number"
                    step="50000000"
                    value={goals.housingTarget?.estimatedPrice || ""}
                    onChange={(e) => handleHousingChange("estimatedPrice", parseInt(e.target.value) || 0)}
                    placeholder="Contoh: 850000000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={goals.housingTarget?.paymentMethod || "Cicilan KPR"}
                    onChange={(e) => handleHousingChange("paymentMethod", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Cicilan KPR">Cicilan KPR Bank</option>
                    <option value="Cash Bertahap">Cash Bertahap (Developer)</option>
                    <option value="Cash Keras">Cash Keras (Lunas)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Target Tercapai (Tahun)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={goals.housingTarget?.targetYears || 3}
                    onChange={(e) => handleHousingChange("targetYears", parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium text-center"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    DP Minimal (%)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="50"
                    value={goals.housingTarget?.downPaymentPercent || 20}
                    onChange={(e) => handleHousingChange("downPaymentPercent", parseInt(e.target.value) || 20)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium text-center"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500">Target rumah saat ini tidak aktif (sudah punya rumah sendiri / belum merencanakan).</p>
            </div>
          )}
        </div>

        {/* Card 3: Target Pemasukan Aktif & Pasif (Target Total Income) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">3. Target Pertumbuhan Income</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Target pemasukan aktif & pasif bulanan di masa depan</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Pemasukan Aktif (Rp/bln)
                </label>
                <input
                  type="number"
                  step="2000000"
                  value={goals.incomeTarget?.targetActiveIncomeMonthly || ""}
                  onChange={(e) => handleIncomeChange("targetActiveIncomeMonthly", parseInt(e.target.value) || 0)}
                  placeholder="Contoh: 35000000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Pasive Income (Rp/bln)
                </label>
                <input
                  type="number"
                  step="1000000"
                  value={goals.incomeTarget?.targetPassiveIncomeMonthly || ""}
                  onChange={(e) => handleIncomeChange("targetPassiveIncomeMonthly", parseInt(e.target.value) || 0)}
                  placeholder="Contoh: 15000000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Waktu Pencapaian (Tahun)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={goals.incomeTarget?.targetYearsToAchieve || 5}
                onChange={(e) => handleIncomeChange("targetYearsToAchieve", parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-semibold"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Target total income masa depan: Rp {((goals.incomeTarget?.targetActiveIncomeMonthly || 0) + (goals.incomeTarget?.targetPassiveIncomeMonthly || 0)).toLocaleString("id-ID")}/bulan
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Target Kendaraan (Jenis & Harga) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">4. Target Kendaraan</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Mobil / motor impian & rencana pembelian</p>
              </div>
            </div>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={goals.vehicleTarget?.hasTarget ?? true}
                onChange={(e) => handleVehicleChange("hasTarget", e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded-sm"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Ada Target</span>
            </label>
          </div>

          {goals.vehicleTarget?.hasTarget ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Jenis / Model Kendaraan
                  </label>
                  <input
                    type="text"
                    value={goals.vehicleTarget?.vehicleType || ""}
                    onChange={(e) => handleVehicleChange("vehicleType", e.target.value)}
                    placeholder="Contoh: Mobil Listrik / MPV Keluarga"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Estimasi Harga Kendaraan (Rp)
                  </label>
                  <input
                    type="number"
                    step="10000000"
                    value={goals.vehicleTarget?.estimatedPrice || ""}
                    onChange={(e) => handleVehicleChange("estimatedPrice", parseInt(e.target.value) || 0)}
                    placeholder="Contoh: 350000000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    value={goals.vehicleTarget?.paymentMethod || "Cash"}
                    onChange={(e) => handleVehicleChange("paymentMethod", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Cash">Cash (Menabung 100%)</option>
                    <option value="Kredit DP 30%">Kredit (DP 30%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Target Tercapai (Tahun)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={goals.vehicleTarget?.targetYears || 2}
                    onChange={(e) => handleVehicleChange("targetYears", parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium text-center"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500">Target kendaraan saat ini tidak diaktifkan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Card 5: Target Pendidikan Anak & Target Jumlah Anak */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">5. Target Pendidikan Anak & Jumlah Anak</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Rencana jumlah anak & dana pendidikan berjenjang (SD, SMP, SMA, Kuliah)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Rencana Jumlah Anak:</span>
            <input
              type="number"
              min="0"
              max="6"
              value={goals.childrenEducation?.plannedChildrenCount ?? 2}
              onChange={(e) =>
                handleUpdate("childrenEducation", {
                  ...goals.childrenEducation,
                  plannedChildrenCount: parseInt(e.target.value) || 0,
                })
              }
              className="w-14 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-center text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-3">
          {(goals.childrenEducation?.educationLevels || []).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{item.childName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 font-bold">
                    Jenjang {item.level}
                  </span>
                  {item.targetSchoolName && (
                    <span className="text-[11px] text-slate-500">({item.targetSchoolName})</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Estimasi Biaya: <span className="font-bold text-rose-700 dark:text-rose-300">Rp {item.estimatedCostToday.toLocaleString("id-ID")}</span> • Target Masuk: Tahun {item.targetYear}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveChildEducation(item.id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Form Add Education Level */}
          <form onSubmit={handleAddChildEducation} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Tambah Rencana Jenjang Pendidikan Anak</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder="Nama / Urutan Anak (cth: Anak Pertama)"
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
              <select
                value={newChildLevel}
                onChange={(e) => setNewChildLevel(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              >
                <option value="TK">Taman Kanak-kanak (TK)</option>
                <option value="SD">Sekolah Dasar (SD)</option>
                <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
                <option value="SMA">Sekolah Menengah Atas (SMA)</option>
                <option value="Kuliah S1">Perguruan Tinggi (Kuliah S1)</option>
              </select>
              <input
                type="text"
                value={newChildSchool}
                onChange={(e) => setNewChildSchool(e.target.value)}
                placeholder="Nama Sekolah / Kampus Impian"
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="5000000"
                value={newChildCost || ""}
                onChange={(e) => setNewChildCost(parseInt(e.target.value) || 0)}
                placeholder="Estimasi Total Biaya (Rp)"
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
              <input
                type="number"
                value={newChildYear || ""}
                onChange={(e) => setNewChildYear(parseInt(e.target.value) || new Date().getFullYear())}
                placeholder="Tahun Mulai (cth: 2028)"
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simpan Rencana Pendidikan</span>
            </button>
          </form>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onPrev}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Profil Karier</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-[#0066CC] hover:bg-[#0055B8] text-white font-bold text-sm shadow-md hover:scale-[1.01] transition-all cursor-pointer"
        >
          <span>Lanjut ke Langkah 5: Profil Risiko</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
