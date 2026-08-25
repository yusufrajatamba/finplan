import React, { useState } from "react";
import {
  CashflowData,
  UserProfile,
  CareerProfile,
  TargetGoalsData,
  RiskProfileData,
  FinancialPlanResult,
} from "../types";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  CreditCard,
  HeartPulse,
  Home,
  Utensils,
  Plane,
  Smartphone,
  Car,
  Coins,
  Sparkles,
  Filter,
  GraduationCap,
  Briefcase,
  Layers,
  Baby,
  Building,
  Target,
  ArrowRight,
  HelpCircle,
  Compass,
  Calendar,
  Users,
  Check,
  Clock,
} from "lucide-react";
import {
  generateDynamicBudgetPosts,
  getProfileBenchmarkMatrix,
  DynamicBudgetPost,
  ProfileBenchmarkComparison,
} from "../utils/dynamicBudgetPosts";

interface PosKeuanganTableProps {
  cashflow: CashflowData;
  profile: UserProfile;
  career: CareerProfile;
  goals: TargetGoalsData;
  risk: RiskProfileData;
  plan: FinancialPlanResult | null;
}

export const PosKeuanganTable: React.FC<PosKeuanganTableProps> = ({
  cashflow,
  profile,
  career,
  goals,
  risk,
  plan,
}) => {
  const [activeTab, setActiveTab] = useState<"table" | "comparison">("table");
  const [filter, setFilter] = useState<"all" | "wajib" | "opsional" | "kondisional">("all");
  const [selectedPos, setSelectedPos] = useState<DynamicBudgetPost | null>(null);

  const totalMonthlyIncome = Math.max(
    1,
    (cashflow.monthlyMainIncome || 0) +
      (cashflow.monthlySideIncome || 0) +
      (cashflow.partnerMainIncome || 0) +
      (cashflow.partnerSideIncome || 0) +
      (cashflow.businessPassiveIncome || 0) +
      (cashflow.investmentPassiveIncome || 0)
  );

  // Generate 100% dynamic list based on the active user profile
  const posList = generateDynamicBudgetPosts(profile, cashflow, career, goals, risk, plan);
  const benchmarkList = getProfileBenchmarkMatrix(profile, career);

  const filteredList = posList.filter((item) => {
    if (filter === "wajib") return item.category === "wajib";
    if (filter === "opsional") return item.category === "opsional";
    if (filter === "kondisional") return item.category === "kondisional" || item.priorityBadge.includes("Layak");
    return true;
  });

  const totalWajibAmount = posList
    .filter((p) => p.category === "wajib")
    .reduce((acc, p) => acc + p.estimatedAmount, 0);

  const totalOpsionalAmount = posList
    .filter((p) => p.category === "opsional" || p.category === "kondisional")
    .reduce((acc, p) => acc + p.estimatedAmount, 0);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Utensils":
        return <Utensils className="w-4 h-4 text-emerald-600" />;
      case "Home":
        return <Home className="w-4 h-4 text-blue-600" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-4 h-4 text-teal-600" />;
      case "HeartPulse":
        return <HeartPulse className="w-4 h-4 text-rose-600" />;
      case "CreditCard":
        return <CreditCard className="w-4 h-4 text-amber-600" />;
      case "TrendingUp":
        return <TrendingUp className="w-4 h-4 text-indigo-600" />;
      case "Sparkles":
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case "Plane":
        return <Plane className="w-4 h-4 text-sky-600" />;
      case "Car":
        return <Car className="w-4 h-4 text-indigo-500" />;
      case "Coins":
        return <Coins className="w-4 h-4 text-yellow-500" />;
      case "GraduationCap":
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case "Briefcase":
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
      case "Baby":
        return <Baby className="w-4 h-4 text-pink-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-600" />;
    }
  };

  const isMarried = profile.maritalStatus === "Menikah";
  const dependentsCount = profile.dependents || 0;
  const isBiz =
    career.personal?.jobType === "Freelancer / Profesional" ||
    career.personal?.jobType === "Wirausaha / Bisnis";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header Title & View Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1.5 border border-emerald-200 dark:border-emerald-800/60">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Struktur Anggaran CFP Dinamis Sesuai Profil: {profile.fullName || "Pengguna"}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            1. Tabel Daftar Pos Keuangan: Wajib vs Opsional & Trigger Naik Kelas
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dirancang spesifik untuk profil{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {isBiz ? "Pebisnis/Freelancer" : isMarried ? "Keluarga Berkeluarga" : "Lajang Produktif"} ({profile.age || 28} thn, {isMarried ? "Menikah" : "Lajang"}, {dependentsCount} tanggungan)
            </span>{" "}
            dengan panduan kapan pos opsional berubah menjadi wajib.
          </p>
        </div>

        {/* Tab View Switcher (Tabel Dinamis vs Matriks Perbandingan Profil) */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            onClick={() => setActiveTab("table")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "table"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pos Profil Ini ({posList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("comparison")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "comparison"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-indigo-600"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Bandingkan 3 Profil (Lajang vs Keluarga vs Bisnis)</span>
          </button>
        </div>
      </div>

      {activeTab === "table" ? (
        <>
          {/* Filter Tabs & Overview Stat Cards */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filter === "all"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                Semua Pos ({posList.length})
              </button>
              <button
                onClick={() => setFilter("wajib")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filter === "wajib"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-emerald-600"
                }`}
              >
                Wajib Sekarang ({posList.filter((p) => p.category === "wajib").length})
              </button>
              <button
                onClick={() => setFilter("kondisional")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filter === "kondisional"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-amber-600"
                }`}
              >
                Kondisional / Layak Thn 2-3 ({posList.filter((p) => p.category === "kondisional" || p.priorityBadge.includes("Layak")).length})
              </button>
              <button
                onClick={() => setFilter("opsional")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filter === "opsional"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-purple-600"
                }`}
              >
                Opsional ({posList.filter((p) => p.category === "opsional").length})
              </button>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              *Klik tombol <span className="font-bold text-slate-700 dark:text-slate-300">"Detail & Trigger"</span> pada baris untuk melihat trigger kapan pos layak dibeli.
            </div>
          </div>

          {/* Overview Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  Total Estimasi Pos Wajib
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200/70 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                  {posList.filter((p) => p.category === "wajib").length} Pos
                </span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-200">
                Rp {totalWajibAmount.toLocaleString("id-ID")}/bln
              </div>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400">
                {((totalWajibAmount / totalMonthlyIncome) * 100).toFixed(1)}% dari income • Fondasi dasar perlindungan & kelangsungan hidup
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-800 dark:text-purple-300">
                  Total Estimasi Pos Opsional / Target
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-200/70 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                  {posList.filter((p) => p.category !== "wajib").length} Pos
                </span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-purple-700 dark:text-purple-200">
                Rp {totalOpsionalAmount.toLocaleString("id-ID")}/bln
              </div>
              <p className="text-[11px] text-purple-600/80 dark:text-purple-400">
                {((totalOpsionalAmount / totalMonthlyIncome) * 100).toFixed(1)}% dari income • Fleksibel dialokasikan saat surplus kas siap
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Prinsip Kenaikan Kelas Pos (Trigger)
              </span>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                "Safety First, Wants Second"
              </div>
              <p className="text-[11px] text-slate-500">
                Pos opsional (misal: asuransi swasta, mobil, liburan) baru boleh diaktifkan jika Dana Darurat minimal 6 bulan sudah tercapai.
              </p>
            </div>
          </div>

          {/* Dynamic Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-3.5 font-bold w-12 text-center">No</th>
                  <th className="py-3 px-3.5 font-bold min-w-[200px]">Nama Pos Keuangan</th>
                  <th className="py-3 px-3.5 font-bold min-w-[110px]">Status & Prioritas</th>
                  <th className="py-3 px-3.5 font-bold min-w-[130px]">Estimasi & Alokasi</th>
                  <th className="py-3 px-3.5 font-bold min-w-[240px]">Alasan Rasional (CFP)</th>
                  <th className="py-3 px-3.5 font-bold min-w-[220px]">Kapan Jadi Wajib / Layak Dibeli?</th>
                  <th className="py-3 px-3.5 font-bold min-w-[110px] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredList.map((item, idx) => {
                  const isWajib = item.category === "wajib";
                  const isKondisional = item.category === "kondisional" || item.priorityBadge.includes("Layak");

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-3.5 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-3.5">
                        <div className="flex items-center space-x-2.5">
                          <div
                            className={`p-1.5 rounded-lg shrink-0 ${
                              isWajib
                                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600"
                                : isKondisional
                                ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600"
                                : "bg-purple-50 dark:bg-purple-950/60 text-purple-600"
                            }`}
                          >
                            {renderIcon(item.iconName)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-slate-400">{item.subcategory}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isWajib
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : isKondisional
                              ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                              : "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                          }`}
                        >
                          {item.priorityBadge}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-1">
                          {item.flexibility}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          Rp {item.estimatedAmount.toLocaleString("id-ID")}/bln
                        </span>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                          Porsi: {item.recommendedPct}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5">
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.reasons}
                        </p>
                      </td>
                      <td className="py-3.5 px-3.5">
                        <div className="space-y-1">
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/60">
                            <Clock className="w-3 h-3" />
                            <span>{item.triggerConditions.targetYearOrMilestone}</span>
                          </span>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                            {item.triggerConditions.financialTrigger}
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 px-3.5 text-center">
                        <button
                          onClick={() => setSelectedPos(item)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer inline-flex items-center space-x-1"
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* COMPARISON MATRIX VIEW */
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex items-start space-x-3">
            <Compass className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
              <span className="font-bold block text-sm">
                Matriks Perbandingan: Kenapa Tiap Profil Berbeda Pos Wajib & Opsionalnya?
              </span>
              <p>
                Dalam perencanaan keuangan profesional (CFP), prioritas anggaran bergeser sesuai <strong>fase hidup (life cycle)</strong>, <strong>tanggungan keluarga</strong>, dan <strong>stabilitas pendapatan</strong>. Lihat perbandingan di bawah untuk memahami mengapa sebuah pos bisa berstatus 'Opsional' di fase lajang namun menjadi 'Wajib Kritis' setelah berkeluarga atau menjadi pengusaha.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3.5 px-3.5 font-bold min-w-[180px]">Nama Pos Pengeluaran</th>
                  <th className="py-3.5 px-3.5 font-bold min-w-[180px] bg-emerald-50/50 dark:bg-emerald-950/20">
                    Profil 1: Lajang / First Jobber
                  </th>
                  <th className="py-3.5 px-3.5 font-bold min-w-[180px] bg-blue-50/50 dark:bg-blue-950/20">
                    Profil 2: Keluarga Muda (1-2 Anak)
                  </th>
                  <th className="py-3.5 px-3.5 font-bold min-w-[180px] bg-purple-50/50 dark:bg-purple-950/20">
                    Profil 3: Pebisnis / Freelancer
                  </th>
                  <th className="py-3.5 px-3.5 font-bold min-w-[200px] bg-amber-50/50 dark:bg-amber-950/20">
                    Status Anda ({profile.fullName || "User"}) & Kapan Naik Kelas?
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {benchmarkList.map((bm, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3.5">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
                          {renderIcon(bm.iconName)}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {bm.postName}
                        </span>
                      </div>
                    </td>

                    {/* Profil 1: Lajang */}
                    <td className="py-3.5 px-3.5 bg-emerald-50/20 dark:bg-emerald-950/10">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mb-1 ${
                          bm.lajangStatus.category === "Wajib"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                            : bm.lajangStatus.category === "Opsional"
                            ? "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                        }`}
                      >
                        {bm.lajangStatus.category}
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        {bm.lajangStatus.note}
                      </p>
                    </td>

                    {/* Profil 2: Keluarga */}
                    <td className="py-3.5 px-3.5 bg-blue-50/20 dark:bg-blue-950/10">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mb-1 ${
                          bm.keluargaStatus.category === "Wajib"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                            : bm.keluargaStatus.category === "Opsional"
                            ? "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                        }`}
                      >
                        {bm.keluargaStatus.category}
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        {bm.keluargaStatus.note}
                      </p>
                    </td>

                    {/* Profil 3: Pebisnis */}
                    <td className="py-3.5 px-3.5 bg-purple-50/20 dark:bg-purple-950/10">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mb-1 ${
                          bm.pengusahaStatus.category === "Wajib"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                            : bm.pengusahaStatus.category === "Opsional"
                            ? "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                        }`}
                      >
                        {bm.pengusahaStatus.category}
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        {bm.pengusahaStatus.note}
                      </p>
                    </td>

                    {/* Active User Status & Trigger */}
                    <td className="py-3.5 px-3.5 bg-amber-50/30 dark:bg-amber-950/20">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              bm.currentProfileStatus.category === "Wajib"
                                ? "bg-emerald-600 text-white"
                                : bm.currentProfileStatus.category === "Kondisional"
                                ? "bg-amber-600 text-white"
                                : "bg-purple-600 text-white"
                            }`}
                          >
                            Status Anda: {bm.currentProfileStatus.category}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-800 dark:text-slate-200">
                          {bm.currentProfileStatus.note}
                        </p>
                        <div className="p-1.5 rounded bg-amber-100/60 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-[10px] text-amber-900 dark:text-amber-300">
                          <strong>Trigger Naik Kelas:</strong> {bm.triggerUpgrade}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal / Detail Drawer for Pos & Trigger Condition */}
      {selectedPos && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                  {renderIcon(selectedPos.iconName)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {selectedPos.name}
                  </h4>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-xs text-slate-400">{selectedPos.subcategory}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {selectedPos.priorityBadge}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPos(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Alasan Rasional */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  Alasan Rasional CFP untuk Profil {profile.fullName || "Anda"}:
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedPos.reasons}
                </p>
              </div>

              {/* Box Kapan Jadi Wajib / Layak Dibeli (Trigger Milestones) */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                <div className="flex items-center space-x-1.5 text-amber-900 dark:text-amber-200 font-bold">
                  <Target className="w-4 h-4 text-amber-600" />
                  <span>Kondisi & Waktu Naik Kelas (Kapan Jadi Wajib / Layak Dibeli?)</span>
                </div>
                <div className="space-y-1.5 text-amber-900/90 dark:text-amber-200/90">
                  <p>
                    <strong>• Target Waktu:</strong> {selectedPos.triggerConditions.targetYearOrMilestone}
                  </p>
                  <p>
                    <strong>• Syarat Finansial:</strong> {selectedPos.triggerConditions.financialTrigger}
                  </p>
                  <p>
                    <strong>• Trigger Peristiwa Hidup:</strong> {selectedPos.triggerConditions.lifeEventTrigger}
                  </p>
                  <p className="p-2 rounded bg-amber-100/70 dark:bg-amber-900/40 font-semibold text-amber-950 dark:text-amber-200">
                    <strong>Aksi Rekomendasi:</strong> {selectedPos.triggerConditions.actionRecommendation}
                  </p>
                </div>
              </div>

              {/* Rekomendasi Rekening */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                  Rekomendasi Penempatan Rekening:
                </span>
                <p className="text-emerald-800 dark:text-emerald-200 leading-relaxed font-semibold">
                  {selectedPos.storageRecommendation}
                </p>
              </div>

              {/* Tips Taktis CFP */}
              <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-1">
                <span className="font-bold text-indigo-900 dark:text-indigo-300 block">
                  Saran Taktis Certified Financial Planner:
                </span>
                <p className="text-indigo-800 dark:text-indigo-200 leading-relaxed">
                  {selectedPos.tipsCFP}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPos(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
