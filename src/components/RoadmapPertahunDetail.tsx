import React, { useState } from "react";
import {
  FinancialPlanResult,
  UserProfile,
  CashflowData,
  TargetGoalsData,
  CareerProfile,
  RiskProfileData,
} from "../types";
import {
  Calendar,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Flag,
  Award,
  Wallet,
  Building,
  GraduationCap,
  Car,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

interface RoadmapPertahunDetailProps {
  plan: FinancialPlanResult | null;
  profile: UserProfile;
  cashflow: CashflowData;
  goals: TargetGoalsData;
  career: CareerProfile;
  risk: RiskProfileData;
}

export interface AnnualStep {
  yearNum: number;
  yearLabel: string;
  phaseTheme: string;
  priorityBadge: string;
  badgeColor: string;
  targetNetWorthEstimate: number;
  projectedPassiveIncomeMonthly: number;
  emergencyFundStatus: string;
  actionChecklist: { text: string; category: string; doneByDefault?: boolean }[];
  recommendedInstruments: { name: string; pct: number; reason: string }[];
  milestoneGoalsAchieved: string[];
  evaluationCriterion: string;
}

export const RoadmapPertahunDetail: React.FC<RoadmapPertahunDetailProps> = ({
  plan,
  profile,
  cashflow,
  goals,
  career,
  risk,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(1);

  const totalMonthlyIncome = Math.max(
    1,
    (cashflow.monthlyMainIncome || 0) +
      (cashflow.monthlySideIncome || 0) +
      (cashflow.partnerMainIncome || 0) +
      (cashflow.partnerSideIncome || 0) +
      (cashflow.businessPassiveIncome || 0) +
      (cashflow.investmentPassiveIncome || 0)
  );

  const totalMonthlySavings =
    plan?.monthlyBudgetRecommendation?.savingsAndInvestment ??
    Math.round(totalMonthlyIncome * 0.25);

  const totalInitialAssets =
    (cashflow.cashEmergencyFund || 0) +
    (cashflow.bankSavings || 0) +
    (cashflow.deposits || 0) +
    (cashflow.stocks || 0) +
    (cashflow.mutualFunds || 0) +
    (cashflow.gold || 0) +
    (cashflow.propertyValue || 0) +
    (cashflow.vehicleValue || 0);

  const monthlyLivingExpenses = Math.max(
    1,
    (cashflow.monthlyNeeds || 0) +
      (cashflow.housingExpense || 0) +
      (cashflow.utilitiesExpense || 0) +
      (cashflow.transportationExpense || 0) +
      (cashflow.familySupportExpense || 0) +
      (cashflow.monthlyExistingInsurance || 0)
  );

  const targetEmergencyFundTotal = monthlyLivingExpenses * (goals.emergencyFund?.multiplierMonths || 6);

  // Generate Annual Steps
  const annualSteps: AnnualStep[] = [
    {
      yearNum: 1,
      yearLabel: "Tahun 1 (Fase 1: Fondasi & Penertiban Cashflow)",
      phaseTheme: "Restrukturisasi Keuangan, Penutupan Utang Konsumtif & Pembuatan Buffer Likuiditas Awal",
      priorityBadge: "Prioritas Fondasi",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
      targetNetWorthEstimate: Math.round(totalInitialAssets + totalMonthlySavings * 12 * 1.05),
      projectedPassiveIncomeMonthly: Math.round(((totalInitialAssets + totalMonthlySavings * 12) * 0.05) / 12),
      emergencyFundStatus: `Terkumpul 50% - 80% (Rp ${Math.round(targetEmergencyFundTotal * 0.7).toLocaleString("id-ID")})`,
      actionChecklist: [
        {
          text: "Buka 3 rekening bank terpisah (Operasional Harian, Tabungan Pos Tagihan, dan Rekening Investasi/RDPU).",
          category: "Struktur Akun",
        },
        {
          text: "Aktifkan autodebet tabungan investasi minimal Rp " + totalMonthlySavings.toLocaleString("id-ID") + " setiap H+1 gajian.",
          category: "Disiplin Kas",
        },
        {
          text: "Lunasi 100% utang kartu kredit / paylater konsumtif berbunga tinggi (Metode Snowball).",
          category: "Utang",
        },
        {
          text: "Pastikan kepesertaan BPJS Kesehatan aktif dan beli polis Asuransi Jiwa Murni (Term-Life) jika ada tanggungan.",
          category: "Proteksi",
        },
        {
          text: "Mulai alokasi pertama ke Reksadana Pasar Uang (RDPU) sebagai wadah dana darurat utama.",
          category: "Investasi",
        },
      ],
      recommendedInstruments: [
        { name: "Reksadana Pasar Uang (RDPU)", pct: 60, reason: "Likuiditas tinggi & return bebas pajak untuk dana darurat" },
        { name: "SBN Ritel / Sukuk Tabungan (ST/SR)", pct: 25, reason: "Pendapatan pasif kupon bulanan dijamin 100% negara" },
        { name: "Emas Logam Mulia (Antam/Digital)", pct: 15, reason: "Lindung nilai inflasi dan aset safe-haven fisik" },
      ],
      milestoneGoalsAchieved: [
        "Skor SLIK OJK / BI Checking bersih Kolektibilitas 1",
        "Pondasi dana darurat pertama 3 bulan pengeluaran pokok terkunci",
        "Disiplin anggaran autodebet bulanan terbentuk stabil",
      ],
      evaluationCriterion: "Dana darurat mencapai minimal 3x pengeluaran pokok dan 0 saldo utang konsumtif.",
    },
    {
      yearNum: 2,
      yearLabel: "Tahun 2 (Fase 2: Proteksi Penuh & Akumulasi Target Primer)",
      phaseTheme: "Kemandirian Likuiditas, Dana Darurat 100% Penuh & Persiapan Modal Target Besar",
      priorityBadge: "Stabilisasi & Proteksi",
      badgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
      targetNetWorthEstimate: Math.round(totalInitialAssets * 1.1 + totalMonthlySavings * 24 * 1.12),
      projectedPassiveIncomeMonthly: Math.round(((totalInitialAssets * 1.1 + totalMonthlySavings * 24 * 1.12) * 0.06) / 12),
      emergencyFundStatus: `100% Tercapai (Rp ${targetEmergencyFundTotal.toLocaleString("id-ID")})`,
      actionChecklist: [
        {
          text: "Genapkan saldo Dana Darurat hingga 100% target (" + (goals.emergencyFund?.multiplierMonths || 6) + " bulan pengeluaran).",
          category: "Likuiditas",
        },
        {
          text: "Buka kantong Sinking Fund khusus untuk tujuan terencana (DP Properti / Liburan Tahunan / Upgrade).",
          category: "Sinking Fund",
        },
        {
          text: "Mulai Dollar-Cost Averaging (DCA) ke Reksadana Pendapatan Tetap (RDPT) atau SBN ORI/SR.",
          category: "Investasi",
        },
        {
          text: "Review asuransi kesehatan swasta tambahan jika surplus arus kas sudah di atas Rp 5 juta/bulan.",
          category: "Proteksi",
        },
        {
          text: "Lakukan evaluasi kenaikan gaji berkala; alokasikan 50% dari kenaikan gaji langsung ke investasi.",
          category: "Karier",
        },
      ],
      recommendedInstruments: [
        { name: "Reksadana Pendapatan Tetap (RDPT Obligasi)", pct: 40, reason: "Pertumbuhan stabil 7-8%/thn melampaui inflasi" },
        { name: "RDPU (Penyimpanan Dana Darurat)", pct: 30, reason: "Mempertahankan batas aman kas darurat keluarga" },
        { name: "Saham Indeks IDX30 / LQ45 (DCA)", pct: 20, reason: "Memulai akumulasi saham bluechip berkapitalisasi besar" },
        { name: "Emas / SBN", pct: 10, reason: "Diversifikasi penyeimbang volatilitas" },
      ],
      milestoneGoalsAchieved: [
        "100% Target Dana Darurat resmi terkunci aman di instrumen likuid",
        "Tabungan modal DP Rumah / Kendaraan mulai terakumulasi 30-50%",
        "Passive income kupon obligasi mulai masuk secara konsisten",
      ],
      evaluationCriterion: "Dana darurat tuntas 100% dan tidak pernah terpakai untuk pos non-darurat.",
    },
    {
      yearNum: 3,
      yearLabel: "Tahun 3 (Fase 3: Eksekusi Keputusan Besar & Ekspansi Portofolio)",
      phaseTheme: "Pengambilan Keputusan Aset Strategis (DP KPR / Bisnis) & Diversifikasi Pertumbuhan",
      priorityBadge: "Eksekusi Aset",
      badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
      targetNetWorthEstimate: Math.round(totalInitialAssets * 1.25 + totalMonthlySavings * 36 * 1.2),
      projectedPassiveIncomeMonthly: Math.round(((totalInitialAssets * 1.25 + totalMonthlySavings * 36 * 1.2) * 0.065) / 12),
      emergencyFundStatus: "Tetap Terjaga & Disesuaikan dengan Inflasi",
      actionChecklist: [
        {
          text: "Evaluasi kesiapan DP KPR Rumah Pertama (DP min 20% + 7% biaya legal & pajak BPHTB siap tunai).",
          category: "Properti",
        },
        {
          text: "Ajukan pre-approval KPR ke bank rekanan jika DSR cicilan di bawah 25% dari penghasilan.",
          category: "KPR",
        },
        {
          text: "Tingkatkan porsi investasi saham dividend yield tinggi (>5%/thn) untuk boost pasif income.",
          category: "Investasi",
        },
        {
          text: "Mulai pos tabungan pendidikan anak tingkat pertama (TK/SD) di instrumen RDPT atau SBN.",
          category: "Pendidikan",
        },
      ],
      recommendedInstruments: [
        { name: "Reksadana Pendapatan Tetap & SBN Ritel", pct: 40, reason: "Aset defensif penghasil kupon reguler" },
        { name: "Saham Dividend Aristokrat & Indeks IDX30", pct: 35, reason: "Akselerasi capital gain & dividen berkala" },
        { name: "RDPU Dana Darurat", pct: 20, reason: "Likuiditas operasional darurat" },
        { name: "Aset Alternatif / P2P Berizin", pct: 5, reason: "Pemanis return dari alokasi uang dingin" },
      ],
      milestoneGoalsAchieved: [
        "Pembayaran DP Properti / Rumah pertama siap dieksekusi tanpa utang pihak ketiga",
        "Portofolio investasi menghasilkan passive income setara 10-15% biaya makan bulanan",
        "Aset bersih tumbuh signifikan melampaui batas inflasi nasional",
      ],
      evaluationCriterion: "DP properti terpenuhi tanpa mengorbankan saldo dana darurat minimal 6 bulan.",
    },
    {
      yearNum: 4,
      yearLabel: "Tahun 4 (Fase 4: Stabilisasi Cashflow & Pertumbuhan Pasif Income)",
      phaseTheme: "Pengelolaan Cicilan Aset Produktif, Optimalisasi Karier & Scale-up Portofolio",
      priorityBadge: "Akselerasi Portofolio",
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
      targetNetWorthEstimate: Math.round(totalInitialAssets * 1.4 + totalMonthlySavings * 48 * 1.3),
      projectedPassiveIncomeMonthly: Math.round(((totalInitialAssets * 1.4 + totalMonthlySavings * 48 * 1.3) * 0.07) / 12),
      emergencyFundStatus: "Upgrade Saldo Menyesuaikan Beban Cicilan Baru",
      actionChecklist: [
        {
          text: "Stabilisasi cashflow bulanan setelah beban cicilan KPR / aset baru masuk ke rekening.",
          category: "Cashflow",
        },
        {
          text: "Lakukan rebalancing portofolio tahunan: kunci keuntungan saham dan alihkan ke SBN jika porsi equity melebihi target profil risiko.",
          category: "Rebalancing",
        },
        {
          text: "Bangun saluran penghasilan sekunder (side business / konsultasi / royalti) untuk mempercepat pelunasan utang.",
          category: "Karier",
        },
        {
          text: "Review polis asuransi jiwa & kebakaran properti yang meng-cover aset utama.",
          category: "Risk Mgmt",
        },
      ],
      recommendedInstruments: [
        { name: "Saham Bluechip & Pertumbuhan", pct: 40, reason: "Memaksimalkan compounding jangka panjang" },
        { name: "SBN Ritel & Sukuk Tabungan", pct: 35, reason: "Kupon mengalir otomatis untuk menutup iuran IPL/listrik" },
        { name: "RDPU & Kas Likuid", pct: 15, reason: "Buffer operasional" },
        { name: "Emas Batangan", pct: 10, reason: "Aset penjaga nilai keluarga" },
      ],
      milestoneGoalsAchieved: [
        "Cicilan aset produktif berjalan lancar tanpa defisit bulanan",
        "Akumulasi dana pendidikan anak tahap 1 terkumpul 100%",
        "Arus kas pasif mulai menutup biaya utilitas rumah tangga",
      ],
      evaluationCriterion: "Rasio solvabilitas aset tetap di atas 50% dan rasio tabungan stabil ≥25%.",
    },
    {
      yearNum: 5,
      yearLabel: "Tahun 5 (Fase 5: Milestone 5 Tahun & Akselerasi Financial Freedom)",
      phaseTheme: "Pencapaian Milestone Tengah, Net Worth Kokoh & Ekspansi Aset Produktif Berkelanjutan",
      priorityBadge: "Kemandirian Finansial",
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
      targetNetWorthEstimate: Math.round(totalInitialAssets * 1.6 + totalMonthlySavings * 60 * 1.42),
      projectedPassiveIncomeMonthly: Math.round(((totalInitialAssets * 1.6 + totalMonthlySavings * 60 * 1.42) * 0.075) / 12),
      emergencyFundStatus: "Buffer Kuat Menampung 9-12 Bulan Pengeluaran",
      actionChecklist: [
        {
          text: "Audit total kekayaan bersih 5 tahun; ukur deviasi terhadap target awal pensiun dini / kemandirian finansial.",
          category: "Audit Finansial",
        },
        {
          text: "Lakukan pelunasan sebagian pokok KPR jika suku bunga floating bank mulai memberatkan.",
          category: "Optimasi Utang",
        },
        {
          text: "Perluas instrumen investasi ke properti sewa (kos/ruko) atau portofolio saham dividen global/lokal.",
          category: "Diversifikasi",
        },
        {
          text: "Siapkan perencanaan warisan awal (Estate Planning) dan wasiat tertulis demi proteksi keluarga.",
          category: "Estate Plan",
        },
      ],
      recommendedInstruments: [
        { name: "Saham Ekuitas & Dividen Aristokrat", pct: 45, reason: "Pertumbuhan nilai modal majemuk" },
        { name: "SBN Ritel / Obligasi Korporasi Rating AAA", pct: 35, reason: "Cashflow pasif bulanan berkesinambungan" },
        { name: "RDPU & Emas", pct: 20, reason: "Ketahanan likuiditas absolut" },
      ],
      milestoneGoalsAchieved: [
        "Kekayaan bersih meningkat 2.5x hingga 3.5x dibanding titik awal",
        "Target Dana Darurat, Asuransi, dan DP Properti tuntas 100%",
        "Arus kas pasif mampu membiayai 20-30% kebutuhan dasar rumah tangga",
      ],
      evaluationCriterion: "Total kekayaan bersih mencapai proyeksi 5 tahun dan passive income bertumbuh teratur.",
    },
  ];

  const currentStep = annualSteps.find((s) => s.yearNum === selectedYear) || annualSteps[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-1.5 border border-indigo-200 dark:border-indigo-800/60">
            <Calendar className="w-3.5 h-3.5" />
            <span>Roadmap Aksi Finansial Bertahap (Tahun 1 s.d. 5+)</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            2. Detail Langkah Rekomendasi Pertahun (Actionable Annual Steps)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Panduan eksekusi konkret, proyeksi target akumulasi dana, dan checklist aksi finansial yang harus diselesaikan di setiap tahun.
          </p>
        </div>
      </div>

      {/* Year Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {annualSteps.map((step) => {
          const isSelected = step.yearNum === selectedYear;
          return (
            <button
              key={step.yearNum}
              onClick={() => setSelectedYear(step.yearNum)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isSelected
                  ? "bg-slate-900 text-white dark:bg-emerald-600 dark:text-white border-slate-900 dark:border-emerald-600 shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Tahun {step.yearNum}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                Fase {step.yearNum}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Year Detail Card */}
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Banner Header for Active Year */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-indigo-50/40 to-emerald-50/40 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-emerald-950/30 border border-slate-200 dark:border-slate-700/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${currentStep.badgeColor} mb-2`}>
                {currentStep.priorityBadge}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {currentStep.yearLabel}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
                {currentStep.phaseTheme}
              </p>
            </div>

            <div className="text-left sm:text-right bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Target Estimasi Net Worth
              </span>
              <span className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                Rp {currentStep.targetNetWorthEstimate.toLocaleString("id-ID")}
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block font-semibold">
                Pasif Income: ~Rp {currentStep.projectedPassiveIncomeMonthly.toLocaleString("id-ID")}/bln
              </span>
            </div>
          </div>
        </div>

        {/* 2 Column Layout: Action Checklist vs Instruments & Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Column: Action Checklist */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Daftar Checklist Aksi Finansial Tahun Ke-{currentStep.yearNum}
              </h5>
            </div>

            <div className="space-y-2.5">
              {currentStep.actionChecklist.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/80 hover:border-emerald-300 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1 text-xs">
                    <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-1">
                      {item.category}
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Evaluation Criterion */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
              <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 block">
                Syarat Kelulusan Fase Tahun {currentStep.yearNum}:
              </span>
              <p className="text-[11px] text-amber-800 dark:text-amber-200 mt-0.5">
                {currentStep.evaluationCriterion}
              </p>
            </div>
          </div>

          {/* Right Column: Instrument Distribution & Milestones */}
          <div className="space-y-4">
            {/* Recommended Instruments */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Alokasi Portofolio Instrumen Disarankan
                </h5>
              </div>

              <div className="space-y-2.5">
                {currentStep.recommendedInstruments.map((inst, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/80 space-y-1.5"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">{inst.name}</span>
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-md">
                        {inst.pct}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                        style={{ width: `${inst.pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">{inst.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Goals Milestone Achieved */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                <Flag className="w-4 h-4 text-purple-600" />
                <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Target Capaian Finansial (Goals Milestone)
                </h5>
              </div>

              <div className="space-y-2">
                {currentStep.milestoneGoalsAchieved.map((m, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs">
                    <Award className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next Year Quick Switcher Banner */}
        {selectedYear < 5 && (
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setSelectedYear((prev) => Math.min(5, prev + 1))}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              <span>Lanjut ke Roadmap Tahun {selectedYear + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
