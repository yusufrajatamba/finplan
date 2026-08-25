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
  Car,
  Home,
  Heart,
  Plane,
  Briefcase,
  Smartphone,
  ShieldAlert,
  Coins,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Sparkles,
  DollarSign,
  CreditCard,
  Banknote,
} from "lucide-react";

interface TimingDecisionMatrixProps {
  plan: FinancialPlanResult | null;
  profile: UserProfile;
  cashflow: CashflowData;
  goals: TargetGoalsData;
  career: CareerProfile;
  risk: RiskProfileData;
}

export interface DecisionTimingItem {
  id: string;
  title: string;
  category: "Aset & Properti" | "Transportasi" | "Gaya Hidup & Acara" | "Bisnis & Karier" | "Proteksi & Investasi";
  icon: React.ReactNode;
  recommendedYear: string;
  recommendedYearNum: number;
  readinessStatus: "Siap Diambil Sekarang" | "Siap di Tahun ke-2" | "Siap di Tahun ke-3 - 4" | "Perlu Tunda / Menunggu Fondasi";
  statusColor: string;
  paymentSchemeRecommendation: "100% Cash / Sinking Fund" | "Kredit / Cicilan Terkendali (KPR)" | "Kredit Rumus 20/4/10" | "Bayar Tahunan (Annual)" | "Uang Dingin (Modal Sendiri)";
  schemeBadgeColor: string;
  financialReadinessChecklist: string[];
  whyThisTiming: string;
  costEstimateRange: string;
  cfpWarning: string;
}

export const TimingDecisionMatrix: React.FC<TimingDecisionMatrixProps> = ({
  plan,
  profile,
  cashflow,
  goals,
  career,
  risk,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeItem, setActiveItem] = useState<DecisionTimingItem | null>(null);

  const totalMonthlyIncome = Math.max(
    1,
    (cashflow.monthlyMainIncome || 0) +
      (cashflow.monthlySideIncome || 0) +
      (cashflow.partnerMainIncome || 0) +
      (cashflow.partnerSideIncome || 0) +
      (cashflow.businessPassiveIncome || 0) +
      (cashflow.investmentPassiveIncome || 0)
  );

  const monthlyLivingExpenses = Math.max(
    1,
    (cashflow.monthlyNeeds || 0) +
      (cashflow.housingExpense || 0) +
      (cashflow.utilitiesExpense || 0) +
      (cashflow.transportationExpense || 0) +
      (cashflow.familySupportExpense || 0) +
      (cashflow.monthlyExistingInsurance || 0)
  );

  const existingEmergencyFund =
    (cashflow.cashEmergencyFund || 0) + (cashflow.bankSavings || 0);

  const emergencyMonthsAvailable = existingEmergencyFund / monthlyLivingExpenses;
  const currentDSR = plan?.ojkRatios?.debtServiceRatio ?? 15;

  const decisionItems: DecisionTimingItem[] = [
    {
      id: "buy_vehicle",
      title: "Pembelian / Upgrade Kendaraan Pribadi (Mobil / Motor)",
      category: "Transportasi",
      icon: <Car className="w-5 h-5 text-indigo-600" />,
      recommendedYear: emergencyMonthsAvailable >= 6 ? "Tahun ke-2 (Bulan 13-18)" : "Tahun ke-2 atau ke-3",
      recommendedYearNum: emergencyMonthsAvailable >= 6 ? 2 : 3,
      readinessStatus:
        emergencyMonthsAvailable >= 6 && currentDSR < 20
          ? "Siap di Tahun ke-2"
          : "Perlu Tunda / Menunggu Fondasi",
      statusColor:
        emergencyMonthsAvailable >= 6 && currentDSR < 20
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300"
          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300",
      paymentSchemeRecommendation:
        totalMonthlyIncome > 20000000 ? "Kredit Rumus 20/4/10" : "100% Cash / Sinking Fund",
      schemeBadgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
      financialReadinessChecklist: [
        "Dana Darurat minimal 6 bulan pengeluaran sudah 100% aman dan tidak tersentuh untuk DP.",
        "Menerapkan Aturan CFP 20/4/10: Down Payment (DP) minimal 20-30%, tenor kredit maksimal 4 tahun, dan total cicilan + bensin/servis <10% pendapatan bulanan.",
        "Biaya tahunan (Pajak STNK & Asuransi All-Risk/TLO) sudah disiapkan dalam pos tabungan terpisah.",
      ],
      whyThisTiming:
        "Kendaraan adalah aset yang nilainya menyusut (depresiasi 15-20% di tahun pertama). Jika dibeli sebelum dana darurat kokoh, biaya servis dan bensin rutin akan mencekik arus kas bulanan Anda.",
      costEstimateRange: "Mobil Baru: Rp 200 - 350 Juta | Mobil Bekas Berkualitas (3-5 thn): Rp 120 - 200 Juta",
      cfpWarning:
        "Hindari DP 0% atau tenor 5-7 tahun karena bunga total akan membengkak hingga 40-50% dari harga pokok kendaraan.",
    },
    {
      id: "buy_house_kpr",
      title: "Pembelian Rumah Pertama & Pengambilan KPR (Hunian)",
      category: "Aset & Properti",
      icon: <Home className="w-5 h-5 text-emerald-600" />,
      recommendedYear: "Tahun ke-2 s.d. Tahun ke-4",
      recommendedYearNum: 3,
      readinessStatus:
        emergencyMonthsAvailable >= 6 ? "Siap di Tahun ke-3 - 4" : "Perlu Tunda / Menunggu Fondasi",
      statusColor:
        emergencyMonthsAvailable >= 6
          ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300"
          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300",
      paymentSchemeRecommendation: "Kredit / Cicilan Terkendali (KPR)",
      schemeBadgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
      financialReadinessChecklist: [
        "DP Rumah minimal 15-20% siap tunai + Biaya Akad/Notaris/Pajak BPHTB (5-7% dari harga rumah).",
        "Cicilan KPR bulanan maksimal 25% - 30% dari total penghasilan bersih keluarga.",
        "Dana Darurat minimal 6-9 bulan tetap utuh di RDPU setelah membayar uang muka.",
        "Skor SLIK OJK (BI Checking) bersih Kolektibilitas 1 tanpa ada tunggakan paylater/kartu kredit.",
      ],
      whyThisTiming:
        "Pengambilan KPR adalah komitmen jangka panjang (10-15 tahun). Diperlukan waktu 2-3 tahun untuk mengumpulkan tabungan DP tunai tanpa mengorbankan dana darurat keluarga.",
      costEstimateRange: "Rumah Pertama: Rp 400 - 900 Juta | DP + Biaya Akad Siap Tunai: Rp 80 - 200 Juta",
      cfpWarning:
        "Pilih skema KPR dengan Fixed Rate berjenjang minimal 3-5 tahun dan pastikan bank membolehkan pelunasan pokok dipercepat tanpa penalti tinggi.",
    },
    {
      id: "wedding_celebration",
      title: "Pernikahan & Pesta Resepsi (Wedding Fund)",
      category: "Gaya Hidup & Acara",
      icon: <Heart className="w-5 h-5 text-rose-600" />,
      recommendedYear: "Tahun ke-1 atau ke-2 (Setelah 12 Bulan Menabung Bersama)",
      recommendedYearNum: 2,
      readinessStatus: "Siap di Tahun ke-2",
      statusColor: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 border-pink-300",
      paymentSchemeRecommendation: "100% Cash / Sinking Fund",
      schemeBadgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
      financialReadinessChecklist: [
        "100% biaya resepsi dan katering berasal dari tabungan tunai bersama.",
        "Dilarang keras berutang pinjol / KTA untuk membiayai pesta 1 hari.",
        "Modal hidup bulan pertama setelah menikah (sewa hunian/kontrakan dan dana darurat awal) sudah disiapkan di luar biaya pesta.",
      ],
      whyThisTiming:
        "Pernikahan menandai awal kehidupan finansial baru. Memulai pernikahan dengan beban utang pesta akan memicu konflik finansial rumah tangga di tahun-tahun pertama.",
      costEstimateRange: "Intimate Wedding (50-100 pax): Rp 30 - 70 Juta | Standar Gedung: Rp 100 - 200 Juta",
      cfpWarning:
        "Utamakan keabsahan akad nikah dan kenyamanan hidup pasca nikah dibanding gengsi resepsi berlebihan.",
    },
    {
      id: "vacation_travel",
      title: "Liburan Jarak Jauh / Ibadah Umrah / Wisata Luar Negeri",
      category: "Gaya Hidup & Acara",
      icon: <Plane className="w-5 h-5 text-sky-600" />,
      recommendedYear: "Tahun ke-2+ (Berkala Setiap 1-2 Tahun Sekali)",
      recommendedYearNum: 2,
      readinessStatus: "Siap di Tahun ke-2",
      statusColor: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-300",
      paymentSchemeRecommendation: "100% Cash / Sinking Fund",
      schemeBadgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
      financialReadinessChecklist: [
        "Didanai 100% dari kantong tabungan Sinking Fund liburan yang disisihkan rutin 6-12 bulan sebelumnya.",
        "Tiket pesawat, hotel, dan asuransi perjalanan lunas sebelum hari keberangkatan.",
        "Pos tabungan investasi dan dana darurat bulan berjalan tetap disetor penuh.",
      ],
      whyThisTiming:
        "Liburan adalah pos pemulihan energi (self-reward). Hanya boleh dieksekusi setelah arus kas wajib berjalan otomatis selama 1 tahun.",
      costEstimateRange: "Domestik: Rp 5 - 15 Juta | Umrah / Asia: Rp 25 - 45 Juta | Eropa: Rp 40 - 70 Juta",
      cfpWarning:
        "Jangan pernah menggunakan PayLater cicilan untuk liburan; beban cicilan berbulan-bulan setelah liburan selesai akan merusak psikologi finansial Anda.",
    },
    {
      id: "side_business",
      title: "Membuka Bisnis Sampingan / Modal Usaha Mandiri",
      category: "Bisnis & Karier",
      icon: <Briefcase className="w-5 h-5 text-amber-600" />,
      recommendedYear: "Tahun ke-2 atau ke-3",
      recommendedYearNum: 2,
      readinessStatus: "Siap di Tahun ke-2",
      statusColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300",
      paymentSchemeRecommendation: "Uang Dingin (Modal Sendiri)",
      schemeBadgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
      financialReadinessChecklist: [
        "Modal kerja bisnis menggunakan tabungan 'uang dingin' tanpa menyentuh dana darurat keluarga.",
        "Pisahkan 100% rekening bisnis dari rekening rumah tangga sejak hari pertama.",
        "Bisnis telah melalui tahap validasi MVP (Minimum Viable Product) modal kecil sebelum ekspansi besar.",
      ],
      whyThisTiming:
        "Tahun ke-1 difokuskan pada stabilitas karier utama. Tahun ke-2 saat arus kas sudah surplus adalah saat terbaik menguji ide bisnis sampingan.",
      costEstimateRange: "Micro/Online Business: Rp 5 - 25 Juta | Toko Fisik/F&B: Rp 50 - 150 Juta",
      cfpWarning:
        "Jangan mengambil kredit usaha berbunga tinggi di tahap awal saat model bisnis belum terbukti menghasilkan profit konsisten.",
    },
    {
      id: "private_insurance_upgrade",
      title: "Upgrade Asuransi Kesehatan Swasta (Kamar 1-Bed As-Charged)",
      category: "Proteksi & Investasi",
      icon: <ShieldAlert className="w-5 h-5 text-pink-600" />,
      recommendedYear: totalMonthlyIncome >= 10000000 ? "Tahun ke-1 (Bulan ke-6)" : "Tahun ke-2",
      recommendedYearNum: 1,
      readinessStatus:
        totalMonthlyIncome >= 10000000 ? "Siap Diambil Sekarang" : "Siap di Tahun ke-2",
      statusColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300",
      paymentSchemeRecommendation: "Bayar Tahunan (Annual)",
      schemeBadgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
      financialReadinessChecklist: [
        "Pemasukan bulanan stabil dan surplus minimal Rp 3 - 5 juta setelah kebutuhan pokok.",
        "Polis merupakan asuransi murni tradisional (Murni Kesehatan Sesuai Tagihan tanpa Unit Link).",
        "Total premi seluruh asuransi keluarga tidak melebihi 10% dari total pendapatan bulanan.",
      ],
      whyThisTiming:
        "Semakin muda usia saat masuk asuransi, semakin murah premi tahunan dan tidak ada pengecualian riwayat penyakit (pre-existing condition).",
      costEstimateRange: "Premi Usia 25-35: Rp 6 - 15 Juta/Tahun (Rp 500rb - 1.2jt/bulan)",
      cfpWarning:
        "Pilih metode pembayaran tahunan untuk mendapatkan diskon 1 bulan premi gratis dibanding potong bulanan.",
    },
    {
      id: "gadget_upgrade_timing",
      title: "Upgrade Smartphone Flagship / Laptop Gaming Konsumtif",
      category: "Gaya Hidup & Acara",
      icon: <Smartphone className="w-5 h-5 text-amber-500" />,
      recommendedYear: "Kapan Saja (Sesuai Alokasi Pos Wants / Tabungan Sinking Fund)",
      recommendedYearNum: 1,
      readinessStatus: "Siap Diambil Sekarang",
      statusColor: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300",
      paymentSchemeRecommendation: "100% Cash / Sinking Fund",
      schemeBadgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
      financialReadinessChecklist: [
        "Uang tunai 100% sudah ada di rekening tabungan sebelum transaksi.",
        "Cicilan 0% kartu kredit HANYA boleh diambil jika uang tunai penuh sudah dialokasikan di RDPU untuk menghasilkan return selama masa tenor.",
      ],
      whyThisTiming:
        "Bukan keputusan krusial kehidupan, asalkan tidak melanggar batasan anggaran pos Gaya Hidup (maks 20% income).",
      costEstimateRange: "Smartphone Flagship: Rp 12 - 25 Juta",
      cfpWarning:
        "Jangan gunakan limit PayLater bunga 2-4% per bulan untuk barang konsumtif yang nilainya turun.",
    },
    {
      id: "crypto_aggressive_investing",
      title: "Investasi Aset Berisiko Tinggi (Kripto / Saham Spekulatif)",
      category: "Proteksi & Investasi",
      icon: <Coins className="w-5 h-5 text-yellow-500" />,
      recommendedYear: "Tahun ke-2+ (Setelah Fondasi RDPU & SBN Terbentuk)",
      recommendedYearNum: 2,
      readinessStatus:
        emergencyMonthsAvailable >= 6 ? "Siap di Tahun ke-2" : "Perlu Tunda / Menunggu Fondasi",
      statusColor:
        emergencyMonthsAvailable >= 6
          ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300"
          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300",
      paymentSchemeRecommendation: "Uang Dingin (Modal Sendiri)",
      schemeBadgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
      financialReadinessChecklist: [
        "Porsi maksimal 5% - 10% dari total aset investasi keseluruhan.",
        "Khusus menggunakan 'uang dingin' yang jika turun 50% tidak mengganggu kebutuhan harian.",
        "Dana darurat dan asuransi jiwa/kesehatan keluarga sudah aman 100%.",
      ],
      whyThisTiming:
        "Investasi spekulatif membutuhkan kematangan psikologis dan pondasi likuiditas agar tidak panik saat terjadi volatilitas market (bear market).",
      costEstimateRange: "Alokasi DCA: Rp 500rb - 2 Juta / Bulan dari surplus investasi",
      cfpWarning:
        "Dilarang keras memakai uang pinjaman atau margin trading untuk aset berisiko tinggi.",
    },
  ];

  const categories = [
    { id: "all", label: "Semua Keputusan" },
    { id: "Transportasi", label: "Kendaraan" },
    { id: "Aset & Properti", label: "Rumah & KPR" },
    { id: "Gaya Hidup & Acara", label: "Gaya Hidup & Acara" },
    { id: "Bisnis & Karier", label: "Bisnis & Modal" },
    { id: "Proteksi & Investasi", label: "Proteksi & Investasi" },
  ];

  const filteredItems = decisionItems.filter(
    (item) => selectedCategory === "all" || item.category === selectedCategory
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 text-xs font-bold mb-1.5 border border-amber-200 dark:border-amber-800/60">
            <Clock className="w-3.5 h-3.5" />
            <span>Matriks Waktu Pengambilan Keputusan Finansial Besar</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            3. Kapan Pos / Keputusan Besar Baru Boleh Diambil & Rekomendasi Skema (Cash vs Cicilan)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analisis kesiapan finansial untuk keputusan besar seperti beli kendaraan, KPR rumah, pernikahan, liburan, dan bisnis berdasarkan kapasitas keuangan Anda saat ini.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              selectedCategory === cat.id
                ? "bg-slate-900 text-white dark:bg-amber-600 dark:text-white border-slate-900 dark:border-amber-600 shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Decision Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-amber-400 dark:hover:border-amber-500 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header Card */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-xs shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Timing & Recommendation Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Kapan Boleh Diambil:
                  </span>
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block">
                    {item.recommendedYear}
                  </span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${item.statusColor}`}>
                    {item.readinessStatus}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Rekomendasi Skema Bayar:
                  </span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
                    {item.paymentSchemeRecommendation}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {item.costEstimateRange.split("|")[0]}
                  </span>
                </div>
              </div>

              {/* Why This Timing */}
              <div className="text-xs text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                  Rasional Keuangan:
                </span>
                <p className="leading-relaxed">{item.whyThisTiming}</p>
              </div>

              {/* Checklist Snippet */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white block">
                  Syarat Kesiapan Mutlak CFP:
                </span>
                <div className="space-y-1">
                  {item.financialReadinessChecklist.slice(0, 2).map((chk, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{chk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between">
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
                Peringatan: {item.cfpWarning.slice(0, 45)}...
              </span>
              <button
                onClick={() => setActiveItem(item)}
                className="px-3 py-1 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white transition-all cursor-pointer shrink-0"
              >
                Lihat Detail Lengkap
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
                  {activeItem.icon}
                </div>
                <div>
                  <span className="text-xs text-slate-400">{activeItem.category}</span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {activeItem.title}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Timing & Scheme Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                  <span className="font-bold text-indigo-900 dark:text-indigo-300 block text-[11px]">
                    Kapan Waktu Ideal Diambil:
                  </span>
                  <span className="text-sm font-extrabold text-indigo-700 dark:text-indigo-200 mt-0.5 block">
                    {activeItem.recommendedYear}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Status: {activeItem.readinessStatus}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 block text-[11px]">
                    Rekomendasi Skema Bayar:
                  </span>
                  <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-200 mt-0.5 block">
                    {activeItem.paymentSchemeRecommendation}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Metode Teraman CFP
                  </span>
                </div>
              </div>

              {/* Cost Range */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  Estimasi Biaya / Patokan Budget:
                </span>
                <p className="text-slate-900 dark:text-white font-semibold mt-0.5">
                  {activeItem.costEstimateRange}
                </p>
              </div>

              {/* Rationale */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  Alasan Rasional Waktu Eksekusi:
                </span>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {activeItem.whyThisTiming}
                </p>
              </div>

              {/* Checklist */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Syarat Kesiapan Finansial Sebelum Mengambil Keputusan Ini:
                </span>
                <div className="space-y-1.5">
                  {activeItem.financialReadinessChecklist.map((chk, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {chk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300 space-y-1">
                <span className="font-bold block flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Peringatan & Jebakan Finansial:</span>
                </span>
                <p className="text-[11px] leading-relaxed text-rose-800 dark:text-rose-200">
                  {activeItem.cfpWarning}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveItem(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
