import React from "react";
import {
  UserProfile,
  CashflowData,
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
  GraduationCap,
  Briefcase,
  Layers,
  Baby,
  Building,
  Target,
} from "lucide-react";

export interface DynamicBudgetPost {
  id: string;
  name: string;
  category: "wajib" | "opsional" | "kondisional";
  priorityBadge: "Wajib Kritis (P1)" | "Wajib Pokok (P2)" | "Wajib Bertumbuh (P3)" | "Layak di Thn 2-3" | "Opsional Fleksibel" | "Opsional Spekulatif";
  subcategory: string;
  iconName: string;
  recommendedPct: string;
  estimatedAmount: number;
  flexibility: string;
  reasons: string;
  // Trigger / Milestone explanation: Kapan pos ini berubah jadi wajib atau layak dibeli
  triggerConditions: {
    targetYearOrMilestone: string; // e.g. "Tahun ke-1", "Tahun ke-2 s/d 3", "Saat Menikah", "Surplus > 8 Jt"
    financialTrigger: string;      // e.g. "Dana Darurat >= 6 bulan & DSR < 15%"
    lifeEventTrigger: string;      // e.g. "Menikah, Lahir Anak, atau Ganti Domisili"
    actionRecommendation: string;  // e.g. "Buka rekening sinking fund terpisah dan alokasikan 10% surplus"
  };
  storageRecommendation: string;
  tipsCFP: string;
}

export interface ProfileBenchmarkComparison {
  postName: string;
  iconName: string;
  lajangStatus: { category: "Wajib" | "Opsional" | "Tunda"; note: string };
  keluargaStatus: { category: "Wajib" | "Opsional" | "Tunda"; note: string };
  pengusahaStatus: { category: "Wajib" | "Opsional" | "Tunda"; note: string };
  currentProfileStatus: { category: "Wajib" | "Opsional" | "Kondisional" | "Tunda"; note: string };
  triggerUpgrade: string;
}

/**
 * Generate 100% Dynamic, Tailored Budget Posts based on the active user's demographic,
 * family status, career path, cashflow capacity, and specific financial goals.
 */
export function generateDynamicBudgetPosts(
  profile: UserProfile,
  cashflow: CashflowData,
  career: CareerProfile,
  goals: TargetGoalsData,
  risk: RiskProfileData,
  plan: FinancialPlanResult | null
): DynamicBudgetPost[] {
  const totalMonthlyIncome = Math.max(
    1,
    (cashflow.monthlyMainIncome || 0) +
      (cashflow.monthlySideIncome || 0) +
      (cashflow.partnerMainIncome || 0) +
      (cashflow.partnerSideIncome || 0) +
      (cashflow.businessPassiveIncome || 0) +
      (cashflow.investmentPassiveIncome || 0)
  );

  const budgetRec = plan?.monthlyBudgetRecommendation || {
    livingNeeds: Math.round(totalMonthlyIncome * 0.5),
    debtRepayment: (cashflow.debts || []).reduce((acc, d) => acc + (d.monthlyPayment || 0), 0),
    insurancePremiums: Math.round(totalMonthlyIncome * 0.05),
    savingsAndInvestment: Math.round(totalMonthlyIncome * 0.25),
    lifestyleWants: Math.round(totalMonthlyIncome * 0.2),
  };

  const isMarried = profile.maritalStatus === "Menikah";
  const dependentsCount = profile.dependents || 0;
  const hasChildren = dependentsCount > 0;
  const isFreelancerOrBusiness =
    career.personal?.jobType === "Freelancer / Profesional" ||
    career.personal?.jobType === "Wirausaha / Bisnis";
  const userAge = profile.age || 28;
  const userName = profile.fullName || "Anda";
  const currentCity = profile.currentCity || "Kota Domisili";
  const hasPrivateIns = !!profile.hasPrivateInsurance;
  const totalDebtsCount = (cashflow.debts || []).length;
  const hasDebts = totalDebtsCount > 0 && budgetRec.debtRepayment > 0;

  const posts: DynamicBudgetPost[] = [];

  // 1. KEBUTUHAN POKOK & PANGAN (LIVING NEEDS)
  posts.push({
    id: "living_basic",
    name: "1. Kebutuhan Pokok & Konsumsi Pangan",
    category: "wajib",
    priorityBadge: "Wajib Kritis (P1)",
    subcategory: "Biaya Hidup Pokok",
    iconName: "Utensils",
    recommendedPct: isMarried ? "40% - 50%" : "35% - 45%",
    estimatedAmount: Math.round(budgetRec.livingNeeds * 0.6),
    flexibility: "Kaku (Wajib 100%)",
    reasons: isMarried
      ? `Kebutuhan pangan, belanja dapur rumah tangga, dan nutrisi keluarga (${dependentsCount > 0 ? `termasuk ${dependentsCount} anak/tanggungan` : "suami-istri"}). Pos mutlak yang tidak boleh dipangkas demi kesehatan.`
      : `Kebutuhan makan harian, belanja bahan pokok, dan nutrisi pribadi di ${currentCity}. Pos dasar kelangsungan produktivitas kerja harian.`,
    triggerConditions: {
      targetYearOrMilestone: "Tahun 1 (Setiap Bulan)",
      financialTrigger: "Selalu dievaluasi berkala saat terjadi inflasi pangan (>4-5%/thn)",
      lifeEventTrigger: "Bertambahnya anggota keluarga (kelahiran anak) atau perubahan pola makan",
      actionRecommendation: "Gunakan belanja grosir awal bulan untuk menghemat 10-15% biaya dapur.",
    },
    storageRecommendation: "Rekening Operasional Harian / Dompet Digital Pangan",
    tipsCFP: "Terapkan meal-prep mingguan dan hindari pesan antar makanan berlebih di hari kerja.",
  });

  // 2. TEMPAT TINGGAL & UTILITAS
  posts.push({
    id: "housing_utilities",
    name: "2. Tempat Tinggal, Listrik, Air & Internet",
    category: "wajib",
    priorityBadge: "Wajib Kritis (P1)",
    subcategory: "Operasional Hunian",
    iconName: "Home",
    recommendedPct: "10% - 15%",
    estimatedAmount: Math.round(budgetRec.livingNeeds * 0.4),
    flexibility: "Kaku (Wajib 100%)",
    reasons:
      profile.housingStatus === "rumah_sendiri"
        ? "Biaya IPL, PBB tahunan, listrik PLN, PDAM, dan internet rumah. Kewajiban pemeliharaan aset properti."
        : profile.housingStatus === "kos"
        ? `Biaya sewa kos bulanan di ${currentCity}, listrik, laundry, dan kuota internet kerja. Gagal bayar memutus tempat tinggal.`
        : `Biaya sewa kontrakan/apartemen, iuran lingkungan, listrik, dan air bersih. Fasilitas tempat bernaung keluarga.`,
    triggerConditions: {
      targetYearOrMilestone: goals?.housingTarget?.hasTarget ? "Tahun ke-3 (Rencana Transisi ke KPR)" : "Tahun 1-2 (Sewa/Kontrak)",
      financialTrigger: "Saat DP Rumah sudah terkumpul 20-30% & rasio cicilan KPR < 25-30% income",
      lifeEventTrigger: profile.domicilePlan?.includes("Pindah") ? "Rencana perpindahan domisili" : "Perpanjangan masa sewa tahunan",
      actionRecommendation: "Otomasi autodebet tagihan H+1 gajian agar skor utilitas tetap bersih.",
    },
    storageRecommendation: "Rekening Khusus Tagihan Hunian / Autodebet PLN",
    tipsCFP: "Batas wajar sewa tempat tinggal adalah maksimal 20% dari total pendapatan bulanan.",
  });

  // 3. DANA DARURAT (EMERGENCY FUND) - SPESIFIK BERDASARKAN STATUS
  const emergencyTargetMonths = isFreelancerOrBusiness ? (isMarried ? 12 : 9) : (isMarried ? 9 : 6);
  posts.push({
    id: "emergency_buffer",
    name: `3. Dana Darurat (${emergencyTargetMonths}x Pengeluaran)`,
    category: "wajib",
    priorityBadge: "Wajib Kritis (P1)",
    subcategory: "Ketahanan Arus Kas",
    iconName: "ShieldCheck",
    recommendedPct: "10% - 20%",
    estimatedAmount: Math.round(budgetRec.savingsAndInvestment * 0.35),
    flexibility: "Kaku (Wajib Terisi Penuh)",
    reasons: isFreelancerOrBusiness
      ? `Sebagai ${career.personal?.jobType || "Pebisnis/Freelancer"}, arus kas Anda berfluktuasi. Buffer ${emergencyTargetMonths} bulan wajib tersedia untuk menahan masa omset sepi atau keterlambatan pembayaran klien.`
      : isMarried
      ? `Memiliki keluarga di ${currentCity} dengan ${dependentsCount} tanggungan menuntut bantalan kas ${emergencyTargetMonths} bulan untuk mengantisipasi risiko PHK mendadak, sakit, atau renovasi darurat tanpa meminjam pinjol.`
      : `Sebagai lajang berusia ${userAge} tahun, dana darurat ${emergencyTargetMonths} bulan melindungi Anda dari risiko karier/pekerjaan dan memberi ketenangan saat berganti pekerjaan.`,
    triggerConditions: {
      targetYearOrMilestone: "Tahun 1 s/d Tahun 2 (Fokus Penuh)",
      financialTrigger: `Isi bertahap hingga mencapai Rp ${(Math.round(budgetRec.livingNeeds * emergencyTargetMonths)).toLocaleString("id-ID")}`,
      lifeEventTrigger: "Saat berganti pekerjaan, menikah, atau menambah tanggungan (target dinaikkan +3 bulan)",
      actionRecommendation: "Tempatkan 60% di Reksadana Pasar Uang (RDPU) dan 40% di Tabungan Digital Likuid Bebas Admin.",
    },
    storageRecommendation: "RDPU Likuid Berizin OJK + Tabungan Digital",
    tipsCFP: "Jangan sentuh dana darurat untuk belanja diskon, tiket konser, atau DP barang konsumtif.",
  });

  // 4. PROTEKSI KESEHATAN (BPJS)
  posts.push({
    id: "bpjs_health",
    name: "4. Iuran BPJS Kesehatan (JKN Keluarga)",
    category: "wajib",
    priorityBadge: "Wajib Kritis (P1)",
    subcategory: "Proteksi Katastropik",
    iconName: "HeartPulse",
    recommendedPct: "2% - 4%",
    estimatedAmount: Math.max(150000, Math.round(totalMonthlyIncome * 0.03)),
    flexibility: "Kaku (Wajib 100%)",
    reasons: `Jaring pengaman kesehatan nasional wajib tanpa batasan plafon biaya (termasuk operasi besar & penyakit kritis). Memastikan rawat inap tidak menguras habis tabungan ${userName}.`,
    triggerConditions: {
      targetYearOrMilestone: "Tahun 1 (Aktif Sepanjang Masa)",
      financialTrigger: "Wajib rutin dibayar tepat waktu setiap bulan",
      lifeEventTrigger: isMarried ? "Daftarkan pasangan dan anak ke faskes 1 yang sama" : "Pastikan data faskes 1 dekat domisili kos",
      actionRecommendation: "Aktifkan autodebet kartu debit atau e-wallet agar status kepesertaan tidak non-aktif.",
    },
    storageRecommendation: "Autodebet BPJS Kesehatan Mobile JKN",
    tipsCFP: "BPJS adalah fondasi perlindungan termurah dan terkuat di Indonesia; jangan pernah biarkan menunggak.",
  });

  // 5. ASURANSI JIWA MURNI (DYNAMIC: WAJIB UNTUK BERKELUARGA/TANGGUNGAN, OPSIONAL UNTUK LAJANG!)
  if (isMarried || dependentsCount > 0) {
    posts.push({
      id: "life_insurance",
      name: "5. Asuransi Jiwa Murni (Term Life) Pencari Nafkah",
      category: "wajib",
      priorityBadge: "Wajib Kritis (P1)",
      subcategory: "Perlindungan Nafkah Keluarga",
      iconName: "ShieldCheck",
      recommendedPct: "3% - 5%",
      estimatedAmount: Math.max(250000, Math.round(totalMonthlyIncome * 0.04)),
      flexibility: "Kaku (Wajib untuk Tulang Punggung)",
      reasons: `Karena ${userName} memiliki ${isMarried ? "pasangan" : ""}${isMarried && dependentsCount > 0 ? " dan " : ""}${dependentsCount > 0 ? `${dependentsCount} tanggungan` : ""}, asuransi jiwa murni WAJIB untuk mengganti nilai ekonomi jika terjadi risiko tutup usia, sehingga keluarga tidak jatuh miskin.`,
      triggerConditions: {
        targetYearOrMilestone: "Tahun 1 (Segera Diaktifkan)",
        financialTrigger: "Ambil Uang Pertanggungan (UP) minimal 5 - 10x pengeluaran tahunan keluarga",
        lifeEventTrigger: "Setiap penambahan anak atau peningkatan nilai utang KPR, naikkan UP asuransi jiwa",
        actionRecommendation: "Pilih produk Asuransi Jiwa Berjangka (Term Life) Murni tanpa unsur investasi unit link.",
      },
      storageRecommendation: "Polis Asuransi Jiwa Tradisional (Term Life)",
      tipsCFP: "Premi asuransi jiwa murni untuk usia 25-35 tahun sangat terjangkau (sekitar Rp 300rb - 600rb/bulan untuk UP Rp 1 Miliar).",
    });
  } else {
    // UNTUK LAJANG: MENJADI OPSIONAL SAAT INI, NAMUN ADA TRIGGER JELAS KAPAN WAJIB!
    posts.push({
      id: "life_insurance",
      name: "5. Asuransi Jiwa Murni (Term Life)",
      category: "opsional",
      priorityBadge: "Opsional Fleksibel",
      subcategory: "Perlindungan Tanggungan",
      iconName: "ShieldCheck",
      recommendedPct: "0% - 2%",
      estimatedAmount: 0,
      flexibility: "Opsional Saat Ini (Belum Ada Tanggungan)",
      reasons: `Sebagai lajang tanpa tanggungan anak/pasangan, pos ini saat ini OPSIONAL (uang pertanggungan jiwa belum mendesak). Anda lebih membutuhkan proteksi kesehatan dan akumulasi dana darurat.`,
      triggerConditions: {
        targetYearOrMilestone: "Tahun ke-2 atau ke-3 (Saat Menikah / Ada Tanggungan)",
        financialTrigger: "Menjadi WAJIB saat Anda mengambil utang KPR jangka panjang atau menafkahi orang tua secara rutin",
        lifeEventTrigger: "Wajib diaktifkan seketika Anda menikah atau memiliki anak pertama",
        actionRecommendation: "Alihkan budget ini saat ini ke penambahan Dana Darurat & Investasi Portofolio.",
      },
      storageRecommendation: "Tunda hingga ada tanggungan finansial",
      tipsCFP: "Jangan beli asuransi jiwa jika tidak ada orang yang bergantung secara finansial pada nafkah Anda.",
    });
  }

  // 6. DANA PENDIDIKAN ANAK (DYNAMIC: WAJIB UNTUK KELUARGA BERANAK, KONDISIONAL/SINKING FUND UNTUK LAJANG/BARU NIKAH)
  if (dependentsCount > 0) {
    posts.push({
      id: "education_fund",
      name: `6. Tabungan Pendidikan Anak (${dependentsCount} Anak)`,
      category: "wajib",
      priorityBadge: "Wajib Pokok (P2)",
      subcategory: "Investasi Generasi",
      iconName: "GraduationCap",
      recommendedPct: "10% - 15%",
      estimatedAmount: Math.round(budgetRec.savingsAndInvestment * 0.25),
      flexibility: "Kaku (Pendidikan Tidak Bisa Ditunda)",
      reasons: `Inflasi biaya pendidikan di Indonesia rata-rata 8-12% per tahun. Mempersiapkan dana masuk sekolah (TK/SD/SMP/Kuliah) sejak dini mengamankan masa depan anak tanpa mengorbankan dana pensiun Anda.`,
      triggerConditions: {
        targetYearOrMilestone: "Tahun 1 s/d Tahun 5 (Rutin Bulanan)",
        financialTrigger: "Investasikan pada Reksadana Pendapatan Tetap (RDPT), Emas, atau SBN Ritel untuk jangka 3-10 tahun",
        lifeEventTrigger: "Review target biaya 1 tahun sebelum anak naik jenjang sekolah baru",
        actionRecommendation: "Gunakan rekening tabungan berjangka khusus atau portofolio reksadana terpisah per anak.",
      },
      storageRecommendation: "RDPT / SBN Ritel / Tabungan Pendidikan Khusus",
      tipsCFP: "Pisahkan pos dana masuk sekolah (uang pangkal) dengan SPP bulanan rutin agar tidak tercampur.",
    });
  } else if (isMarried) {
    posts.push({
      id: "education_fund",
      name: "6. Dana Persiapan Kelahiran & Pendidikan Anak Pertama",
      category: "kondisional",
      priorityBadge: "Layak di Thn 2-3",
      subcategory: "Perencanaan Keluarga",
      iconName: "Baby",
      recommendedPct: "5% - 10%",
      estimatedAmount: Math.round(budgetRec.savingsAndInvestment * 0.15),
      flexibility: "Kondisional (Mulai saat Program Hamil)",
      reasons: `Mempersiapkan biaya persalinan rumah sakit dan dana awal perlengkapan bayi. Saat ini kondisional, namun menjadi wajib saat pasangan positif hamil.`,
      triggerConditions: {
        targetYearOrMilestone: "Tahun ke-2 (Rencana Program Kehamilan)",
        financialTrigger: "Kumpulkan dana persalinan tunai minimal Rp 15-25 Juta di RDPU",
        lifeEventTrigger: "Menjadi WAJIB KRITIS seketika saat tes kehamilan positif",
        actionRecommendation: "Siapkan sinking fund biaya persalinan dan cek cakupan BPJS untuk klaim melahirkan.",
      },
      storageRecommendation: "RDPU Likuid / Tabungan Rencana",
      tipsCFP: "Biaya 6 bulan pertama kelahiran bayi cukup besar, siapkan dana likuid di luar dana darurat.",
    });
  } else {
    // LAJANG: UPGRADE SKILL & SERTIFIKASI KARIER SEBAGAI PENGGANTI (WAJIB PRIORITAS!)
    posts.push({
      id: "skill_upgrade",
      name: "6. Pengembangan Diri, Skill & Sertifikasi Karier",
      category: "wajib",
      priorityBadge: "Wajib Bertumbuh (P3)",
      subcategory: "Investasi Human Capital",
      iconName: "Briefcase",
      recommendedPct: "5% - 10%",
      estimatedAmount: Math.round(budgetRec.savingsAndInvestment * 0.2),
      flexibility: "Prioritas Tinggi untuk Usia Produktif",
      reasons: `Aset terbesar Anda di usia ${userAge} tahun adalah 'Earning Power' (kapasitas menghasilkan uang). Investasi kursus, bahasa asing, sertifikasi profesional, dan networking meningkatkan potensi kenaikan gaji 15-30%.`,
      triggerConditions: {
        targetYearOrMilestone: "Tahun 1 & 2 (Fokus Akselerasi Gaji)",
        financialTrigger: "Alokasikan 1x per kuartal untuk sertifikasi resmi atau workshop relevan",
        lifeEventTrigger: "Persiapan promosi jabatan atau perpindahan karier ke perusahaan multinasional",
        actionRecommendation: "Gunakan platform kursus online kredibel (Coursera, Udemy, Bootcamps) dengan portofolio nyata.",
      },
      storageRecommendation: "Kantong Tabungan Khusus Self-Development",
      tipsCFP: "Return dari investasi keahlian diri sendiri di awal karier seringkali jauh lebih tinggi daripada return pasar saham.",
    });
  }

  // 7. CICILAN UTANG (JIKA ADA WAJIB, JIKA 0 BERIKAN STATUS BEBAS UTANG)
  if (hasDebts) {
    posts.push({
      id: "debt_settlement",
      name: "7. Cicilan Utang Berjalan (Debt Repayment)",
      category: "wajib",
      priorityBadge: "Wajib Kritis (P1)",
      subcategory: "Kewajiban Kontraktual",
      iconName: "CreditCard",
      recommendedPct: "0% - 30% (Maksimal OJK)",
      estimatedAmount: budgetRec.debtRepayment,
      flexibility: "Kaku (Wajib Bayar Tepat Waktu)",
      reasons: `Membayar kewajiban angsuran kredit berjalan (${totalDebtsCount} pos utang). Menjaga riwayat SLIK OJK Kol-1 dan menghindari denda penalti keterlambatan.`,
      triggerConditions: {
        targetYearOrMilestone: "Tahun 1 s/d Lunas Sesuai Tenor",
        financialTrigger: "Prioritaskan pelunasan ekstra jika DSR > 30% atau terdapat bunga di atas 10%",
        lifeEventTrigger: "Jika mendapat bonus tahunan/THR, gunakan 50% untuk percepatan pelunasan pokok utang",
        actionRecommendation: "Gunakan metode Debt Avalanche (bunga tertinggi dahulu) untuk memangkas total beban bunga.",
      },
      storageRecommendation: "Rekening Escrow Bank Kreditur",
      tipsCFP: "Jangan pernah mengambil utang konsumtif baru sebelum utang yang ada selesai dibayar.",
    });
  } else {
    posts.push({
      id: "debt_free_acceleration",
      name: "7. Akselerasi Investasi Bebas Utang (Debt-Free Surplus)",
      category: "wajib",
      priorityBadge: "Wajib Bertumbuh (P3)",
      subcategory: "Keunggulan Finansial",
      iconName: "TrendingUp",
      recommendedPct: "10% - 15%",
      estimatedAmount: Math.round(totalMonthlyIncome * 0.1),
      flexibility: "Sangat Menguntungkan",
      reasons: `Selamat! Anda saat ini bersih dari cicilan utang bulanan. Porsi yang biasanya dihabiskan untuk bunga bank dialihkan 100% untuk melipatgandakan kekayaan bersih.`,
      triggerConditions: {
        targetYearOrMilestone: "Tahun 1-5 (Pertumbuhan Aset Maksimal)",
        financialTrigger: "Jaga rasio utang tetap 0% kecuali mengambil KPR rumah pertama yang terencana",
        lifeEventTrigger: "Pertahankan gaya hidup hemat saat pendapatan meningkat",
        actionRecommendation: "Alirkan ke SBN Ritel dan Reksadana Saham Indeks untuk compounding interest.",
      },
      storageRecommendation: "Portofolio Reksadana Saham / SBN Ritel",
      tipsCFP: "Ketiadaan utang adalah leverage terbesar Anda untuk mencapai kemerdekaan finansial 5 tahun lebih cepat.",
    });
  }

  // 8. DANA PENSIUN & HARI TUA (RETIREMENT FUND)
  posts.push({
    id: "retirement_fund",
    name: isFreelancerOrBusiness ? "8. Tabungan Pensiun Mandiri (DPLK / SBN / Saham)" : "8. Tabungan Pensiun Dasar (DPLK & JHT)",
    category: "wajib",
    priorityBadge: "Wajib Pokok (P2)",
    subcategory: "Kemerdekaan Finansial",
    iconName: "TrendingUp",
    recommendedPct: "5% - 12%",
    estimatedAmount: Math.round(budgetRec.savingsAndInvestment * 0.3),
    flexibility: "Cukup Kaku (Demi Masa Depan)",
    reasons: isFreelancerOrBusiness
      ? `Karena tidak ada perusahaan yang menyetorkan JHT, Anda wajib mendisiplinkan diri menyisihkan dana pensiun mandiri agar tidak menjadi beban anak di hari tua.`
      : `Memutus rantai generasi sandwich (sandwich generation). Masa pensiun pasti tiba, namun tidak ada bank yang menyediakan pinjaman uang pensiun.`,
    triggerConditions: {
      targetYearOrMilestone: "Tahun 1 s/d Usia 55 Tahun",
      financialTrigger: "Tingkatkan alokasi 2% setiap kali mendapat kenaikan gaji atau bonus tahunan",
      lifeEventTrigger: "Review portofolio setiap 2 tahun dan lakukan rebalancing aset",
      actionRecommendation: "Kombinasikan DPLK Syariah/Konvensional, SBN Ritel (ORI/SR), dan Saham Indeks IDX30.",
    },
    storageRecommendation: "DPLK / SBN Ritel ORI & SR / Saham Dividen",
    tipsCFP: "Memulai di usia 25 tahun membutuhkan modal bulanan 3x lebih kecil dibanding baru mulai di usia 40 tahun.",
  });

  // 9. ASURANSI KESEHATAN SWASTA TAMBAHAN (DYNAMIC TRIGGER)
  posts.push({
    id: "private_health_upgrade",
    name: "9. Asuransi Rawat Inap Swasta (Kamar 1-Bed Cashless)",
    category: "opsional",
    priorityBadge: hasPrivateIns ? "Wajib Pokok (P2)" : "Layak di Thn 2-3",
    subcategory: "Kenyamanan Medis",
    iconName: "HeartPulse",
    recommendedPct: "3% - 5%",
    estimatedAmount: Math.round(totalMonthlyIncome * 0.04),
    flexibility: "Fleksibel (Sesuai Kapasitas Surplus)",
    reasons: hasPrivateIns
      ? `Memberikan kenyamanan kamar privat 1 tempat tidur di RS swasta rujukan dan klaim as-charged (sesuai tagihan). Pos ini sudah berjalan pada polis Anda.`
      : `Memberikan fasilitas bypass antrean faskes BPJS dan kenyamanan kamar privat. Saat ini opsional jika BPJS Anda berjalan baik.`,
    triggerConditions: {
      targetYearOrMilestone: hasPrivateIns ? "Sudah Aktif" : "Tahun ke-2 atau ke-3",
      financialTrigger: "LAYAK DIBELI jika: Dana Darurat sudah mencapai 6 bulan & Cashflow Surplus > Rp 7-10 Juta/bulan",
      lifeEventTrigger: isMarried && dependentsCount > 0 ? "Sangat direkomendasikan untuk anak balita yang rentan sakit" : "Saat mobilitas kerja semakin tinggi",
      actionRecommendation: "Pilih polis murni rawat inap as-charged dengan fitur Inner Limit fleksibel atau Deductible untuk menghemat premi 30%.",
    },
    storageRecommendation: "Autodebet Tahunan Polis Asuransi Swasta",
    tipsCFP: "Jika budget terbatas, utamakan BPJS Kesehatan terlebih dahulu sebelum membeli asuransi swasta mahal.",
  });

  // 10. SINKING FUND LIBURAN & REKREASI (DYNAMIC)
  posts.push({
    id: "vacation_travel",
    name: "10. Sinking Fund Liburan, Travelling & Mudik",
    category: "opsional",
    priorityBadge: "Opsional Fleksibel",
    subcategory: "Rekreasi Terencana",
    iconName: "Plane",
    recommendedPct: "3% - 8%",
    estimatedAmount: Math.round(budgetRec.lifestyleWants * 0.4),
    flexibility: "Sangat Fleksibel (Bisa Dipangkas 100%)",
    reasons: isMarried
      ? `Refreshing keluarga, silaturahmi mudik lebaran, atau liburan anak sekolah. Wajib dikumpulkan 100% tunai di muka agar tidak meninggalkan beban utang baru.`
      : `Healing akhir tahun, travelling eksplorasi destinasi baru, atau mudik tahunan. Menjaga semangat kerja tanpa merusak pos tabungan darurat.`,
    triggerConditions: {
      targetYearOrMilestone: "Tahun 1 s/d Tahun 5 (Sinking Fund Khusus)",
      financialTrigger: "HANYA BOLEH DIBERANGKATKAN jika target tabungan liburan sudah terkumpul 100% lunas",
      lifeEventTrigger: "Momen liburan sekolah anak atau cuti bersama tahunan",
      actionRecommendation: "Kunci budget liburan di kantong tabungan terpisah 6 bulan sebelum tanggal keberangkatan.",
    },
    storageRecommendation: "Kantong Tabungan Khusus Liburan / RDPU Likuid",
    tipsCFP: "Dilarang keras mencicil liburan menggunakan PayLater atau kartu kredit cicilan 12 bulan.",
  });

  // 11. PEMBELIAN / UPGRADE KENDARAAN (DYNAMIC: LAYAK DIBELI DI TAHUN KE-X)
  const vehicleGoalEnabled = goals?.vehicleTarget?.hasTarget;
  posts.push({
    id: "vehicle_acquisition",
    name: vehicleGoalEnabled ? "11. Sinking Fund DP Kendaraan Impian" : "11. Pembelian / Upgrade Kendaraan Pribadi",
    category: "opsional",
    priorityBadge: "Layak di Thn 2-3",
    subcategory: "Transportasi Sekunder",
    iconName: "Car",
    recommendedPct: "5% - 10%",
    estimatedAmount: Math.round(budgetRec.savingsAndInvestment * 0.15),
    flexibility: "Kondisional (Tergantung Kesiapan Finansial)",
    reasons: isMarried && dependentsCount > 0
      ? `Kepemilikan mobil keluarga mempermudah mobilitas anak sekolah dan bepergian bersama keluarga besar. Namun membawa beban operasional (bensin, servis, asuransi, pajak).`
      : `Membeli motor baru atau mobil pertama untuk operasional harian. Ingat bahwa kendaraan mengalami penyusutan nilai (depresiasi 15-20%/tahun).`,
    triggerConditions: {
      targetYearOrMilestone: "Tahun ke-2 atau ke-3 (Setelah DP Terkumpul)",
      financialTrigger: "LAYAK DIBELI jika: 1) DP tunai minimal 40-50% siap, 2) Cicilan KKB < 15% income, 3) Dana darurat 100% aman",
      lifeEventTrigger: dependentsCount > 0 ? "Kebutuhan antar-jemput anak sekolah meningkat" : "Jarak tempuh kantor berpindah jauh",
      actionRecommendation: "Pertimbangkan mobil bekas berusia 3-4 tahun berkualitas (certified pre-owned) untuk menghemat depresiasi hingga 40%.",
    },
    storageRecommendation: "RDPU / Deposito Berjangka Target DP Kendaraan",
    tipsCFP: "Hitung total cost of ownership (TCO) termasuk bensin dan servis bulanan, bukan hanya cicilan bulanannya saja.",
  });

  // 12. INVESTASI SPEKULATIF / ALPHA (DYNAMIC)
  posts.push({
    id: "speculative_crypto_stocks",
    name: "12. Investasi Spekulatif (Kripto, Saham Gorengan, Aset Volatil)",
    category: "opsional",
    priorityBadge: "Opsional Spekulatif",
    subcategory: "Akselerasi High Risk",
    iconName: "Coins",
    recommendedPct: risk.profileType === "Agresif" || risk.profileType === "Sangat Agresif" ? "3% - 5% (Maks)" : "0% - 2% (Opsional)",
    estimatedAmount: Math.round(budgetRec.savingsAndInvestment * 0.08),
    flexibility: "Sangat Fleksibel (Bisa 0%)",
    reasons: `Peluang return tinggi di atas rata-rata pasar dengan volatilitas ekstrem. HANYA boleh menggunakan 'uang dingin' 100% yang siap hilang tanpa mengganggu kelangsungan hidup ${userName}.`,
    triggerConditions: {
      targetYearOrMilestone: "Tahun ke-2 ke atas (Setelah Fondasi Kokoh)",
      financialTrigger: "HANYA LAYAK DICOBA jika: Dana Darurat penuh + BPJS & Jiwa aktif + Portofolio SBN/Indeks sudah berjalan",
      lifeEventTrigger: "Saat memiliki surplus ekstra di luar target tabungan utama",
      actionRecommendation: "Batasi maksimal 5% dari total portofolio aset. Jangan gunakan margin atau uang pinjaman.",
    },
    storageRecommendation: "Exchange Kripto Terdaftar Bappebti / Sekuritas OJK",
    tipsCFP: "Jangan pernah menggunakan uang sekolah anak, uang sewa rumah, atau dana darurat untuk aset spekulatif.",
  });

  return posts;
}

/**
 * Benchmark matrix comparing the 3 main archetypes (Lajang vs Keluarga vs Pengusaha)
 * with the current active user's status.
 */
export function getProfileBenchmarkMatrix(
  currentProfile: UserProfile,
  career: CareerProfile
): ProfileBenchmarkComparison[] {
  const isMarried = currentProfile.maritalStatus === "Menikah";
  const hasKids = (currentProfile.dependents || 0) > 0;
  const isBiz = career.personal?.jobType === "Freelancer / Profesional" || career.personal?.jobType === "Wirausaha / Bisnis";

  return [
    {
      postName: "Asuransi Jiwa Murni (Term Life)",
      iconName: "ShieldCheck",
      lajangStatus: {
        category: "Opsional",
        note: "Belum mendesak karena belum ada tanggungan nafkah",
      },
      keluargaStatus: {
        category: "Wajib",
        note: "Wajib Kritis P1 untuk melindungi masa depan anak & istri",
      },
      pengusahaStatus: {
        category: "Wajib",
        note: "Wajib Kritis P1 untuk memproteksi modal & kelangsungan keluarga",
      },
      currentProfileStatus: {
        category: isMarried || hasKids ? "Wajib" : "Opsional",
        note: isMarried || hasKids
          ? "Wajib aktif karena Anda memiliki tanggungan keluarga"
          : "Opsional saat ini karena Anda masih lajang tanpa tanggungan",
      },
      triggerUpgrade: "Berubah jadi WAJIB seketika saat menikah, punya anak, atau menanggung orang tua.",
    },
    {
      postName: "Dana Darurat (Emergency Fund)",
      iconName: "ShieldCheck",
      lajangStatus: {
        category: "Wajib",
        note: "Target 3 - 6 bulan pengeluaran hidup",
      },
      keluargaStatus: {
        category: "Wajib",
        note: "Target 6 - 9 bulan pengeluaran rumah tangga",
      },
      pengusahaStatus: {
        category: "Wajib",
        note: "Target 9 - 12 bulan pengeluaran (buffer fluktuasi omset bisnis)",
      },
      currentProfileStatus: {
        category: "Wajib",
        note: `Target ${isBiz ? (isMarried ? "12" : "9") : (isMarried ? "9" : "6")} bulan pengeluaran sesuai profil Anda`,
      },
      triggerUpgrade: "Naikkan target +3 bulan setiap penambahan anak baru atau saat memulai bisnis mandiri.",
    },
    {
      postName: "Pengembangan Skill & Sertifikasi Karier",
      iconName: "Briefcase",
      lajangStatus: {
        category: "Wajib",
        note: "Wajib Prioritas Utama (Earning Power adalah aset terbesar)",
      },
      keluargaStatus: {
        category: "Opsional",
        note: "Fleksibel / Sesuai jadwal kerja & kebutuhan kenaikan grade",
      },
      pengusahaStatus: {
        category: "Wajib",
        note: "Fokus ke skill manajerial, sales, dan ekspansi bisnis",
      },
      currentProfileStatus: {
        category: !isMarried && !hasKids ? "Wajib" : "Opsional",
        note: !isMarried && !hasKids
          ? "Prioritas tinggi untuk mengerek kenaikan gaji 20-30%"
          : "Disesuaikan dengan waktu luang keluarga dan target karier",
      },
      triggerUpgrade: "Fokus di 1-3 tahun pertama karier sebelum beban rumah tangga bertambah padat.",
    },
    {
      postName: "Dana Pendidikan Anak (Sinking Fund)",
      iconName: "GraduationCap",
      lajangStatus: {
        category: "Tunda",
        note: "Belum dibutuhkan saat ini",
      },
      keluargaStatus: {
        category: "Wajib",
        note: "Wajib Pokok P2 (Inflasi pendidikan 8-12%/tahun)",
      },
      pengusahaStatus: {
        category: "Wajib",
        note: "Wajib dialokasikan ke instrumen terpisah dari kas operasional usaha",
      },
      currentProfileStatus: {
        category: hasKids ? "Wajib" : isMarried ? "Kondisional" : "Tunda",
        note: hasKids
          ? "Wajib disetor rutin tiap bulan untuk jenjang sekolah anak"
          : isMarried
          ? "Mulai disiapkan saat merencanakan kehamilan anak pertama"
          : "Belum dibutuhkan saat ini",
      },
      triggerUpgrade: "Mulai disisihkan minimal 24 bulan sebelum anak masuk TK/SD atau saat program hamil.",
    },
    {
      postName: "Asuransi Kesehatan Swasta (Kamar 1-Bed)",
      iconName: "HeartPulse",
      lajangStatus: {
        category: "Opsional",
        note: "Cukup BPJS Kesehatan + Faskes 1",
      },
      keluargaStatus: {
        category: "Opsional",
        note: "Layak dibeli di Thn 2-3 untuk anak balita jika surplus >Rp 7 Jt/bln",
      },
      pengusahaStatus: {
        category: "Wajib",
        note: "Sangat dianjurkan (karena tidak ada subsidi asuransi kantor)",
      },
      currentProfileStatus: {
        category: isBiz ? "Wajib" : "Opsional",
        note: isBiz
          ? "Penting sebagai pengganti benefit kesehatan korporat"
          : "Opsional jika BPJS sudah memadai dan surplus kas < Rp 7 Jt/bln",
      },
      triggerUpgrade: "Layak diambil saat surplus bulanan > Rp 7-10 Juta dan Dana Darurat sudah mencapai 50%.",
    },
    {
      postName: "Mobil / Kendaraan Pribadi",
      iconName: "Car",
      lajangStatus: {
        category: "Opsional",
        note: "Utamakan transportasi umum / motor jika dana darurat belum penuh",
      },
      keluargaStatus: {
        category: "Opsional",
        note: "Layak di Thn 2-3 untuk kenyamanan anak (DP cash 40-50%)",
      },
      pengusahaStatus: {
        category: "Opsional",
        note: "Layak jika mendukung operasional bisnis / distribusi barang",
      },
      currentProfileStatus: {
        category: "Opsional",
        note: "Layak dipertimbangkan jika DP tunai siap & cicilan < 15% income",
      },
      triggerUpgrade: "Hanya layak dibeli jika Dana Darurat 100% penuh, DP 40% tunai siap, dan DSR < 15%.",
    },
    {
      postName: "Investasi Kripto / Saham Spekulatif",
      iconName: "Coins",
      lajangStatus: {
        category: "Opsional",
        note: "Maksimal 5% dari portofolio (khusus uang dingin)",
      },
      keluargaStatus: {
        category: "Opsional",
        note: "Maksimal 2-3% (prioritaskan SBN & RDPU keluarga)",
      },
      pengusahaStatus: {
        category: "Opsional",
        note: "Tunda jika cadangan modal kerja usaha belum 6 bulan",
      },
      currentProfileStatus: {
        category: "Opsional",
        note: "Gunakan maksimal 3-5% uang dingin setelah fondasi darurat aman",
      },
      triggerUpgrade: "Hanya boleh dimasuki saat dana darurat dan proteksi keluarga sudah 100% terpasang.",
    },
  ];
}

// ─── DYNAMIC TAILORED GRANULAR BUDGET GENERATOR (PROFILE-BASED) ────────────────

export interface GranularBudgetCategory {
  id: string;
  name: string;
  pct: number;
  amount: number;
  categoryBadge: string;
  colorTheme: "purple" | "blue" | "pink" | "rose" | "teal" | "emerald" | "indigo" | "amber" | "sky" | "orange";
  description: string;
  iconName: string;
}

export function generateTailoredGranularBudget(
  profile: UserProfile,
  cashflow: CashflowData,
  career: CareerProfile,
  goals: TargetGoalsData,
  risk: RiskProfileData,
  plan: FinancialPlanResult | null
): GranularBudgetCategory[] {
  const totalMonthlyIncome = Math.max(
    1,
    (cashflow.monthlyMainIncome || 0) +
      (cashflow.monthlySideIncome || 0) +
      (cashflow.partnerMainIncome || 0) +
      (cashflow.partnerSideIncome || 0) +
      (cashflow.businessPassiveIncome || 0) +
      (cashflow.investmentPassiveIncome || 0)
  );

  const isMarried = profile.maritalStatus === "Menikah";
  const dependentsCount = profile.dependents || 0;
  const hasChildren = dependentsCount > 0;
  const isFreelancerOrBiz =
    career.personal?.jobType === "Freelancer / Profesional" ||
    career.personal?.jobType === "Wirausaha / Bisnis";

  // Check profile conditions
  const debtsList = cashflow.debts || [];
  const totalDebtsMonthly = debtsList.reduce((acc, d) => acc + (d.monthlyPayment || 0), 0);
  const hasDebts = totalDebtsMonthly > 0;

  const currentLiving =
    (cashflow.monthlyNeeds || 0) +
    (cashflow.housingExpense || 0) +
    (cashflow.utilitiesExpense || 0) +
    (cashflow.transportationExpense || 0);

  const hasLDM = isMarried && profile.isLDM === true;

  const isSandwich = (cashflow.familySupportExpense || 0) > 0;
  const hasHousingGoal = !!goals.housingTarget?.hasTarget;
  const hasVehicleGoal = !!goals.vehicleTarget?.hasTarget;
  const hasWeddingGoal =
    !isMarried &&
    (goals.customGoals || []).some(
      (g) =>
        g.title?.toLowerCase().includes("nikah") ||
        g.title?.toLowerCase().includes("wedding") ||
        g.title?.toLowerCase().includes("mahar")
    );

  // 1. Calculate base draft percentages based on actual profile data
  let pctLiving = 45.0;
  if (currentLiving > 0 && totalMonthlyIncome > 0) {
    const rawLivingPct = (currentLiving / totalMonthlyIncome) * 100;
    pctLiving = Math.min(55, Math.max(30, Math.round(rawLivingPct * 10) / 10));
  } else {
    pctLiving = isMarried ? (hasChildren ? 45.0 : 40.0) : 35.0;
  }

  let pctDebt = 0;
  if (hasDebts) {
    pctDebt = Math.round(((totalDebtsMonthly / totalMonthlyIncome) * 100) * 10) / 10;
  }

  let pctInsurance = 5.0;
  if (cashflow.monthlyExistingInsurance && cashflow.monthlyExistingInsurance > 0) {
    pctInsurance = Math.min(12, Math.max(3, Math.round(((cashflow.monthlyExistingInsurance / totalMonthlyIncome) * 100) * 10) / 10));
  } else {
    pctInsurance = isMarried ? (hasChildren ? 8.0 : 6.0) : 4.0;
  }

  const pctSocial = 5.0;
  const currentEmergencyFund = (cashflow.cashEmergencyFund || 0) + (cashflow.bankSavings || 0);
  const targetMultiplier = isFreelancerOrBiz ? (isMarried ? 12 : 9) : (isMarried ? 9 : 6);
  const targetEmergencyFund = Math.max(25000000, (currentLiving || totalMonthlyIncome * 0.4) * targetMultiplier);
  const isEmergencyFull = currentEmergencyFund >= targetEmergencyFund;
  const pctEmergency = isEmergencyFull ? 3.0 : isMarried ? 5.0 : 7.0;

  const draftCategories: Array<{
    id: string;
    name: string;
    targetPct: number;
    categoryBadge: string;
    colorTheme: "purple" | "blue" | "pink" | "rose" | "teal" | "emerald" | "indigo" | "amber" | "sky" | "orange";
    description: string;
    iconName: string;
  }> = [];

  draftCategories.push({
    id: "social_charity",
    name: isMarried ? "1. Pelayanan / Sosial Keluarga" : "1. Sosial, Zakat & Berbagi",
    targetPct: pctSocial,
    categoryBadge: "Kewajiban Moral",
    colorTheme: "purple",
    description: "Zakat 2.5%, perpuluhan, donasi sosial & sedekah rutin",
    iconName: "Sparkles",
  });

  draftCategories.push({
    id: "living_basic",
    name: isMarried
      ? `2. Living (Dapur & Biaya Hidup ${dependentsCount > 0 ? `${dependentsCount + 2} Jiwa` : "Keluarga"})`
      : "2. Living (Pangan, Kost & Kebutuhan Harian)",
    targetPct: pctLiving,
    categoryBadge: "Biaya Hidup Pokok",
    colorTheme: "blue",
    description: isMarried
      ? "Belanja dapur, nutrisi keluarga, listrik, air & sewa/operasional rumah"
      : "Makan harian, belanja kebutuhan bulanan & utilitas kerja",
    iconName: "Utensils",
  });

  if (hasDebts && pctDebt > 0) {
    draftCategories.push({
      id: "debt_service",
      name: "3. Cicilan Utang Berjalan",
      targetPct: pctDebt,
      categoryBadge: pctDebt <= 30 ? "Kewajiban Kontrak" : "Waspada DSR Tinggi",
      colorTheme: pctDebt <= 30 ? "orange" : "rose",
      description: `Membayar ${debtsList.length} cicilan aktif (DSR riil: ${pctDebt.toFixed(1)}%${pctDebt > 30 ? " • Melebihi batas aman OJK 30%" : ""})`,
      iconName: "CreditCard",
    });
  }

  if (hasLDM) {
    draftCategories.push({
      id: "ldm_together",
      name: "LDM to Together (Persiapan Serumah)",
      targetPct: 5.0,
      categoryBadge: "Transisi Keluarga",
      colorTheme: "pink",
      description: "Tiket kunjungan keluarga & sinking fund persiapan tinggal satu atap",
      iconName: "Home",
    });
  }

  if (isSandwich) {
    const sandwichPct = Math.min(15, Math.max(3, Math.round(((cashflow.familySupportExpense / totalMonthlyIncome) * 100) * 10) / 10));
    draftCategories.push({
      id: "sandwich_parents",
      name: "Dukungan Orang Tua / Keluarga Besar",
      targetPct: sandwichPct,
      categoryBadge: "Bakti Keluarga",
      colorTheme: "pink",
      description: "Bantuan bulanan orang tua / adik untuk memutus rantai sandwich",
      iconName: "Sparkles",
    });
  }

  draftCategories.push({
    id: "insurance_protection",
    name: isMarried ? "Asuransi & Proteksi Keluarga" : "Asuransi & Proteksi Pribadi",
    targetPct: pctInsurance,
    categoryBadge: "Proteksi Risiko",
    colorTheme: "rose",
    description: isMarried
      ? `BPJS Kesehatan sekeluarga, Asuransi Jiwa Pencari Nafkah & Swasta`
      : "BPJS Kesehatan aktif, proteksi kritis & perlindungan pendapatan",
    iconName: "ShieldCheck",
  });

  draftCategories.push({
    id: "emergency_buffer",
    name: `Dana Darurat (${targetMultiplier}x Pengeluaran)`,
    targetPct: pctEmergency,
    categoryBadge: "Bantalan Likuiditas",
    colorTheme: "teal",
    description: isEmergencyFull
      ? "Dana darurat aman 100% (porsi maintenance di RDPU)"
      : `Top up kas darurat bertahap di RDPU likuid`,
    iconName: "ShieldCheck",
  });

  if (isMarried || hasChildren) {
    const pctChildren = Math.max(6.0, Math.min(15.0, dependentsCount * 4.0 || 8.0));
    draftCategories.push({
      id: "children_edu",
      name: `Kebutuhan & Tabungan Edukasi Anak (${dependentsCount > 0 ? `${dependentsCount} Anak` : "Persiapan Anak"})`,
      targetPct: pctChildren,
      categoryBadge: "Investasi Generasi",
      colorTheme: "indigo",
      description: "SPP, les pengembangan bakat & sinking fund uang pangkal sekolah",
      iconName: "GraduationCap",
    });
  } else if (hasWeddingGoal) {
    draftCategories.push({
      id: "wedding_fund",
      name: "Tabungan Persiapan Menikah & Mahar",
      targetPct: 10.0,
      categoryBadge: "Milestone Hidup",
      colorTheme: "indigo",
      description: "Sinking fund resepsi pernikahan terencana tanpa utang paylater",
      iconName: "Sparkles",
    });
  } else if (!isMarried) {
    draftCategories.push({
      id: "skill_growth",
      name: "Pengembangan Diri & Sertifikasi Karier",
      targetPct: 5.0,
      categoryBadge: "Human Capital",
      colorTheme: "indigo",
      description: "Investasi kursus, bahasa asing & sertifikasi akselerasi earning power",
      iconName: "TrendingUp",
    });
  }

  if (hasHousingGoal || hasVehicleGoal) {
    draftCategories.push({
      id: "asset_goals",
      name: hasHousingGoal && hasVehicleGoal
        ? "Goals (DP Rumah & Kendaraan)"
        : hasHousingGoal
        ? "Goals (DP KPR Rumah Impian)"
        : "Goals (DP & Angsuran Kendaraan)",
      targetPct: 10.0,
      categoryBadge: "Akumulasi Aset",
      colorTheme: "amber",
      description: "Sinking fund kepemilikan aset riil keluarga berjangka menengah",
      iconName: "Home",
    });
  }

  draftCategories.push({
    id: "wealth_investment",
    name: "Investasi Pasar Modal & Dana Pensiun",
    targetPct: 10.0,
    categoryBadge: "Kemerdekaan Finansial",
    colorTheme: "emerald",
    description: `Compounding aset di SBN Ritel / Indeks Saham IDX30 (Profil ${risk.profileType || "Moderat"})`,
    iconName: "TrendingUp",
  });

  let pctLifestyle = Math.max(3.0, Math.round((100 - draftCategories.reduce((acc, c) => acc + c.targetPct, 0)) * 10) / 10);

  draftCategories.push({
    id: "lifestyle_wants",
    name: isMarried ? "Lifestyle, Hiburan & Liburan Keluarga" : "Gaya Hidup, Hiburan & Rekreasi",
    targetPct: pctLifestyle,
    categoryBadge: "Kesehatan Mental",
    colorTheme: "sky",
    description: "Refreshing akhir pekan, jajan terukur & sinking fund liburan",
    iconName: "Sparkles",
  });

  const nonDebtCategories = draftCategories.filter((c) => c.id !== "debt_service");
  const totalNonDebtRaw = nonDebtCategories.reduce((acc, c) => acc + c.targetPct, 0);

  let normalizedCategories: GranularBudgetCategory[] = [];

  if (hasDebts && pctDebt > 0 && pctDebt < 90) {
    const remainingBudgetPct = Math.max(10, 100.0 - pctDebt);
    normalizedCategories = draftCategories.map((c, idx) => {
      if (c.id === "debt_service") {
        return {
          id: c.id,
          name: `${idx + 1}. ${c.name.replace(/^[0-9]+\.\s*/, "")}`,
          pct: pctDebt,
          amount: totalDebtsMonthly,
          categoryBadge: c.categoryBadge,
          colorTheme: c.colorTheme,
          description: c.description,
          iconName: c.iconName,
        };
      }
      const proportionalPct = Math.round(((c.targetPct / totalNonDebtRaw) * remainingBudgetPct) * 10) / 10;
      return {
        id: c.id,
        name: `${idx + 1}. ${c.name.replace(/^[0-9]+\.\s*/, "")}`,
        pct: proportionalPct,
        amount: Math.round((proportionalPct / 100) * totalMonthlyIncome),
        categoryBadge: c.categoryBadge,
        colorTheme: c.colorTheme,
        description: c.description,
        iconName: c.iconName,
      };
    });
  } else {
    const totalRawPct = draftCategories.reduce((acc, c) => acc + c.targetPct, 0);
    normalizedCategories = draftCategories.map((c, idx) => {
      let finalPct = Math.round((c.targetPct / totalRawPct) * 100 * 10) / 10;
      let finalAmount = c.id === "debt_service" ? totalDebtsMonthly : Math.round((finalPct / 100) * totalMonthlyIncome);
      return {
        id: c.id,
        name: `${idx + 1}. ${c.name.replace(/^[0-9]+\.\s*/, "")}`,
        pct: finalPct,
        amount: finalAmount,
        categoryBadge: c.categoryBadge,
        colorTheme: c.colorTheme,
        description: c.description,
        iconName: c.iconName,
      };
    });
  }

  const nonDebtItems = normalizedCategories.filter((c) => c.id !== "debt_service");
  const sumPct = normalizedCategories.reduce((acc, c) => acc + c.pct, 0);
  const diffPct = Math.round((100.0 - sumPct) * 10) / 10;

  if (Math.abs(diffPct) > 0.01 && nonDebtItems.length > 0) {
    const lastItem = nonDebtItems[nonDebtItems.length - 1];
    lastItem.pct = Math.max(0, Math.round((lastItem.pct + diffPct) * 10) / 10);
    lastItem.amount = Math.round((lastItem.pct / 100) * totalMonthlyIncome);
  }

  return normalizedCategories;
}
