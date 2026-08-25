/**
 * Financial Calculations Utility
 * Centralized financial logic used by both server (API) and client (UI).
 * Implements OJK standard ratios and CFP-grade calculations for Indonesia.
 */

import type {
  CashflowData,
  UserProfile,
  CareerProfile,
  TargetGoalsData,
  RiskProfileData,
  FinancialPlanResult,
  InsuranceItem,
  InsuranceAnalysisResult,
  InsuranceRecommendation,
  RealFinancialAdvice,
  FinancialAdviceItem,
  FutureGoalProjectionResult,
  FutureYearProjection,
  YearlyGoalStatus,
} from "../types";

// ─── Income / Expense Aggregators ────────────────────────────────────────────

export function getTotalMonthlyIncome(cashflow: CashflowData): number {
  return (
    (cashflow.monthlyMainIncome || 0) +
    (cashflow.monthlySideIncome || 0) +
    (cashflow.partnerMainIncome || 0) +
    (cashflow.partnerSideIncome || 0) +
    (cashflow.businessPassiveIncome || 0) +
    (cashflow.investmentPassiveIncome || 0)
  );
}

export function getTotalLivingCost(cashflow: CashflowData): number {
  return (
    (cashflow.monthlyNeeds || 0) +
    (cashflow.housingExpense || 0) +
    (cashflow.utilitiesExpense || 0) +
    (cashflow.transportationExpense || 0) +
    (cashflow.familySupportExpense || 0) +
    (cashflow.educationCurrentExpense || 0)
  );
}

export function getTotalMonthlyExpenses(cashflow: CashflowData): number {
  const debtMonthly = getTotalDebtsMonthly(cashflow);
  return (
    getTotalLivingCost(cashflow) +
    (cashflow.monthlyWants || 0) +
    (cashflow.monthlyExistingInsurance || 0) +
    debtMonthly
  );
}

export function getTotalDebtsMonthly(cashflow: CashflowData): number {
  return (cashflow.debts || []).reduce((acc, d) => acc + (d.monthlyPayment || 0), 0);
}

export function getTotalDebtsOutstanding(cashflow: CashflowData): number {
  return (cashflow.debts || []).reduce((acc, d) => acc + (d.totalRemaining || 0), 0);
}

export function getTotalAssets(cashflow: CashflowData): number {
  return (
    (cashflow.cashEmergencyFund || 0) +
    (cashflow.bankSavings || 0) +
    (cashflow.deposits || 0) +
    (cashflow.stocks || 0) +
    (cashflow.mutualFunds || 0) +
    (cashflow.gold || 0) +
    (cashflow.cryptoAssets || 0) +
    (cashflow.propertyValue || 0) +
    (cashflow.vehicleValue || 0) +
    (cashflow.otherAssets || 0)
  );
}

export function getLiquidCash(cashflow: CashflowData): number {
  return (
    (cashflow.cashEmergencyFund || 0) +
    (cashflow.bankSavings || 0) +
    (cashflow.deposits || 0)
  );
}

export function getNetWorth(cashflow: CashflowData): number {
  return getTotalAssets(cashflow) - getTotalDebtsOutstanding(cashflow);
}

export function getMonthlySurplus(cashflow: CashflowData): number {
  return getTotalMonthlyIncome(cashflow) - getTotalMonthlyExpenses(cashflow);
}

// ─── OJK Ratio Calculations ───────────────────────────────────────────────────

export interface OJKRatiosDetailed {
  debtServiceRatio: number;       // % cicilan / income (< 30% healthy)
  savingsRatio: number;           // % tabungan / income (>= 20% healthy)
  emergencyFundMonths: number;    // bulan ketahanan dana darurat
  solvencyRatio: number;          // % net worth / total assets
  needsRatio: number;             // % kebutuhan pokok / income (< 50% ideal)
  dtiStatus: "sehat" | "waspada" | "bahaya";
  savingsStatus: "sehat" | "cukup" | "kurang";
  emergencyStatus: "aman" | "cukup" | "kurang";
}

export function calculateOJKRatios(
  cashflow: CashflowData,
  profile: UserProfile,
  career: CareerProfile
): OJKRatiosDetailed {
  const income = getTotalMonthlyIncome(cashflow);
  const debts = getTotalDebtsMonthly(cashflow);
  const living = getTotalLivingCost(cashflow);
  const liquid = getLiquidCash(cashflow);
  const totalAssets = getTotalAssets(cashflow);
  const totalDebts = getTotalDebtsOutstanding(cashflow);
  const surplus = getMonthlySurplus(cashflow);

  const dsr = income > 0 ? (debts / income) * 100 : 0;
  const savingsRate = income > 0 ? (Math.max(0, surplus) / income) * 100 : 0;
  const needsRate = income > 0 ? (living / income) * 100 : 0;
  const emergencyMonths = living > 0 ? liquid / living : 0;
  const solvency = totalAssets > 0 ? ((totalAssets - totalDebts) / totalAssets) * 100 : 0;

  return {
    debtServiceRatio: parseFloat(dsr.toFixed(1)),
    savingsRatio: parseFloat(savingsRate.toFixed(1)),
    emergencyFundMonths: parseFloat(emergencyMonths.toFixed(1)),
    solvencyRatio: parseFloat(solvency.toFixed(1)),
    needsRatio: parseFloat(needsRate.toFixed(1)),
    dtiStatus: dsr <= 30 ? "sehat" : dsr <= 40 ? "waspada" : "bahaya",
    savingsStatus: savingsRate >= 20 ? "sehat" : savingsRate >= 10 ? "cukup" : "kurang",
    emergencyStatus: emergencyMonths >= 3 ? "aman" : emergencyMonths >= 1 ? "cukup" : "kurang",
  };
}

// ─── Health Score ─────────────────────────────────────────────────────────────

export function calculateHealthScore(
  cashflow: CashflowData,
  profile: UserProfile,
  career: CareerProfile
): number {
  const ratios = calculateOJKRatios(cashflow, profile, career);

  const dti = ratios.debtServiceRatio;
  const debtScore =
    dti === 0 ? 100 : dti <= 15 ? 95 : dti <= 30 ? 80 : dti <= 40 ? 55 : 25;

  const emergencyScore = Math.min(
    100,
    Math.round((ratios.emergencyFundMonths / 6) * 100)
  );

  const savingsScore =
    ratios.savingsRatio >= 25
      ? 100
      : ratios.savingsRatio >= 20
      ? 85
      : ratios.savingsRatio >= 10
      ? 65
      : 40;

  const protectionScore = profile.hasPrivateInsurance
    ? 95
    : profile.bpjsStatus?.includes("Aktif")
    ? 80
    : 50;

  const solvency = ratios.solvencyRatio;
  const solvencyScore = Math.min(100, Math.max(10, Math.round(solvency)));

  return Math.min(
    100,
    Math.max(
      20,
      Math.round(
        debtScore * 0.25 +
          emergencyScore * 0.25 +
          savingsScore * 0.25 +
          protectionScore * 0.15 +
          solvencyScore * 0.1
      )
    )
  );
}

// ─── Emergency Fund Target ────────────────────────────────────────────────────

export function calculateEmergencyFundTarget(
  cashflow: CashflowData,
  profile: UserProfile,
  career: CareerProfile
): { months: number; amount: number } {
  const isMarried = profile.maritalStatus === "Menikah";
  const hasDependents = (profile.dependents || 0) > 0;
  const isFreelance =
    career.personal?.jobType === "Freelancer / Profesional" ||
    career.personal?.jobType === "Wirausaha / Bisnis";

  let months: number;
  if (isFreelance) {
    months = isMarried || hasDependents ? 12 : 9;
  } else {
    months = isMarried || hasDependents ? 9 : 6;
  }

  const baseLiving =
    getTotalLivingCost(cashflow) || Math.round(getTotalMonthlyIncome(cashflow) * 0.5);

  return {
    months,
    amount: Math.max(25_000_000, baseLiving * months),
  };
}

// ─── Budget Recommendation ────────────────────────────────────────────────────

export function calculateBudgetAllocation(
  cashflow: CashflowData,
  profile: UserProfile,
  career: CareerProfile
) {
  const income = getTotalMonthlyIncome(cashflow);
  const living = getTotalLivingCost(cashflow);
  const debts = getTotalDebtsMonthly(cashflow);
  const insurance = cashflow.monthlyExistingInsurance || 0;
  const isMarried = profile.maritalStatus === "Menikah";

  const recNeeds = living > 0 ? living : Math.round(income * 0.5);
  const recDebt = debts;
  const recInsurance =
    insurance > 0
      ? insurance
      : isMarried || (profile.dependents || 0) > 0
      ? Math.round(income * 0.05)
      : Math.round(income * 0.03);

  const wantsTarget = Math.round(income * 0.15);
  const recSavings = Math.max(
    0,
    income - recNeeds - recDebt - recInsurance - wantsTarget
  );
  const recWants = Math.max(0, income - recNeeds - recDebt - recInsurance - recSavings);

  return {
    livingNeeds: recNeeds,
    debtRepayment: recDebt,
    insurancePremiums: recInsurance,
    savingsAndInvestment: recSavings,
    lifestyleWants: recWants,
  };
}

// ─── Multi-Year Projections ────────────────────────────────────────────────────

export function calculateMultiYearProjections(
  cashflow: CashflowData,
  career: CareerProfile,
  risk: RiskProfileData,
  budget: ReturnType<typeof calculateBudgetAllocation>
) {
  const totalAssets = getTotalAssets(cashflow);
  const totalDebts = getTotalDebtsOutstanding(cashflow);
  const liquidCash = getLiquidCash(cashflow);

  const growthRate = (career.personal?.salaryGrowthRatePercent || 7) / 100;
  const expectedReturn =
    risk.profileType === "Agresif" || risk.profileType === "Sangat Agresif"
      ? 0.11
      : risk.profileType === "Moderat" || risk.profileType === "Moderat-Agresif"
      ? 0.09
      : 0.065;

  const targetEmergency = Math.max(25_000_000, liquidCash * 3);

  return [1, 3, 5, 10, 15].map((yr) => {
    const monthlyRate = expectedReturn / 12;
    const totalMonths = yr * 12;
    const fvLumpSum = totalAssets * Math.pow(1 + expectedReturn, yr);
    const fvAnnuity =
      monthlyRate > 0
        ? budget.savingsAndInvestment *
          ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
        : budget.savingsAndInvestment * totalMonths;

    const projNetWorth = Math.round(fvLumpSum + fvAnnuity - totalDebts);
    const projEmergency = Math.min(
      targetEmergency,
      Math.round(liquidCash + budget.savingsAndInvestment * 0.4 * Math.min(totalMonths, 24))
    );
    const monthlyPassive = Math.round((projNetWorth * 0.05) / 12);

    let goalsStatus = "Fondasi dana darurat dan proteksi keluarga diperkuat.";
    if (yr === 3) goalsStatus = "Target DP Rumah / kendaraan terpenuhi, dana darurat 100% aman.";
    else if (yr === 5) goalsStatus = "Portofolio bertumbuh, persiapan dana pendidikan jenjang lanjut.";
    else if (yr === 10) goalsStatus = "Akumulasi aset mapan, pasif income mulai menopang kebutuhan rutin.";
    else if (yr === 15) goalsStatus = "Kemerdekaan finansial (Financial Freedom) & persiapan pensiun mandiri.";

    return {
      year: yr,
      projectedNetWorth: projNetWorth,
      emergencyFundTotal: projEmergency,
      estimatedMonthlyPassiveIncome: monthlyPassive,
      goalsStatus,
    };
  });
}

// ─── Insurance Needs Analysis ─────────────────────────────────────────────────

export function analyzeInsuranceNeeds(
  profile: UserProfile,
  cashflow: CashflowData,
  existingInsurances: InsuranceItem[]
): InsuranceAnalysisResult {
  const income = getTotalMonthlyIncome(cashflow);
  const annualIncome = income * 12;
  const totalDebts = getTotalDebtsOutstanding(cashflow);
  const hasDependents = (profile.dependents || 0) > 0;
  const isMarried = profile.maritalStatus === "Menikah";

  const recommendations: InsuranceRecommendation[] = [];

  // ── Term Life Insurance ────────────────────────────────────────────────────
  const recommendedLifeCoverage = annualIncome * 10 + totalDebts; // 10x annual income + debts
  const currentLife = existingInsurances
    .filter((i) => i.type === "jiwa" || i.type === "jiwa_term_life")
    .reduce((a, i) => a + i.coverageAmount, 0);
  const lifeGap = Math.max(0, recommendedLifeCoverage - currentLife);

  if (hasDependents || isMarried) {
    recommendations.push({
      type: "jiwa_term_life",
      label: "Asuransi Jiwa Term Life",
      status: currentLife === 0 ? "tidak_ada" : lifeGap > 0 ? "kurang" : "cukup",
      currentCoverage: currentLife,
      recommendedCoverage: recommendedLifeCoverage,
      gap: lifeGap,
      estimatedMonthlyPremium: Math.round((recommendedLifeCoverage * 0.001) / 12), // ~0.1% UP/tahun
      reasoning: `Uang Pertanggungan ideal = 10× penghasilan tahunan (Rp ${(annualIncome * 10 / 1_000_000).toFixed(0)} Jt) + sisa utang (Rp ${(totalDebts / 1_000_000).toFixed(0)} Jt) = Rp ${(recommendedLifeCoverage / 1_000_000).toFixed(0)} Jt`,
      urgency: currentLife === 0 ? "tinggi" : lifeGap > recommendedLifeCoverage * 0.5 ? "sedang" : "rendah",
      productSuggestions: ["Zurich Term Life", "Prudential PRUlink", "Allianz Term Life", "BRI Life Term Life"],
    });
  }

  // ── Health Insurance ───────────────────────────────────────────────────────
  const hasHealth = existingInsurances.some((i) => i.type === "kesehatan");
  const hasBPJS = profile.bpjsStatus?.includes("Aktif");
  const hasPrivate = profile.hasPrivateInsurance;
  const healthStatus = hasHealth || hasPrivate ? "cukup" : hasBPJS ? "kurang" : "tidak_ada";

  recommendations.push({
    type: "kesehatan",
    label: "Asuransi Kesehatan",
    status: healthStatus,
    currentCoverage: hasPrivate ? 500_000_000 : hasBPJS ? 200_000_000 : 0,
    recommendedCoverage: 500_000_000,
    gap: hasPrivate ? 0 : hasBPJS ? 300_000_000 : 500_000_000,
    estimatedMonthlyPremium: hasBPJS ? 150_000 : 300_000,
    reasoning: hasBPJS
      ? "BPJS Kesehatan aktif sebagai proteksi dasar. Pertimbangkan asuransi swasta untuk rawat inap kelas 1 dan penyakit kritis."
      : "Asuransi kesehatan adalah prioritas utama untuk melindungi aset dari biaya medis darurat yang bisa mencapai ratusan juta.",
    urgency: hasBPJS ? "rendah" : "tinggi",
    productSuggestions: ["Cigna Health", "Allianz Health", "Mandiri In Health", "Sequis Health"],
  });

  // ── Property Insurance ─────────────────────────────────────────────────────
  const hasProperty = (cashflow.propertyValue || 0) > 0;
  const hasPropertyInsurance = existingInsurances.some((i) => i.type === "properti");
  if (hasProperty) {
    recommendations.push({
      type: "properti",
      label: "Asuransi Properti (All Risk)",
      status: hasPropertyInsurance ? "cukup" : "tidak_ada",
      currentCoverage: hasPropertyInsurance
        ? existingInsurances.filter((i) => i.type === "properti").reduce((a, i) => a + i.coverageAmount, 0)
        : 0,
      recommendedCoverage: cashflow.propertyValue || 0,
      gap: hasPropertyInsurance ? 0 : cashflow.propertyValue || 0,
      estimatedMonthlyPremium: Math.round(((cashflow.propertyValue || 0) * 0.002) / 12),
      reasoning: "Properti senilai Rp " + ((cashflow.propertyValue || 0) / 1_000_000).toFixed(0) + " Jt perlu dilindungi dari risiko kebakaran, banjir, dan bencana alam.",
      urgency: hasPropertyInsurance ? "rendah" : "sedang",
      productSuggestions: ["Asuransi Astra", "Jasindo All Risk", "Adira Insurance", "Sompo Insurance"],
    });
  }

  // ── Education Insurance ────────────────────────────────────────────────────
  if ((profile.dependents || 0) > 0) {
    const hasEdu = existingInsurances.some((i) => i.type === "pendidikan");
    recommendations.push({
      type: "pendidikan",
      label: "Asuransi/Investasi Pendidikan Anak",
      status: hasEdu ? "cukup" : "tidak_ada",
      currentCoverage: 0,
      recommendedCoverage: 500_000_000, // Target pendidikan S1 swasta 2030+
      gap: hasEdu ? 0 : 500_000_000,
      estimatedMonthlyPremium: 500_000,
      reasoning: "Biaya kuliah S1 swasta diproyeksikan Rp 300-800 Jt pada tahun 2030+. Investasi/asuransi pendidikan memastikan masa depan anak tetap terjamin.",
      urgency: hasEdu ? "rendah" : profile.dependents > 0 && profile.age < 40 ? "sedang" : "rendah",
      productSuggestions: ["Prudential PruLink Education", "BRI Life Edu Protection", "Manulife Education", "Tabungan Pendidikan Bank BCA"],
    });
  }

  // Score
  const maxScore = recommendations.length * 100;
  let totalScore = 0;
  recommendations.forEach((r) => {
    if (r.status === "cukup") totalScore += 100;
    else if (r.status === "kurang") totalScore += 50;
    else if (r.status === "berlebih") totalScore += 80;
    // tidak_ada = 0
  });
  const overallScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 50;

  const totalPremiumRec = recommendations
    .filter((r) => r.status !== "cukup")
    .reduce((a, r) => a + r.estimatedMonthlyPremium, 0);

  const gapTotal = recommendations.reduce((a, r) => a + r.gap, 0);

  return {
    overallProtectionScore: overallScore,
    summary:
      overallScore >= 80
        ? "Proteksi Anda sudah cukup baik. Pertahankan dan review berkala setiap 2 tahun."
        : overallScore >= 50
        ? "Ada beberapa gap proteksi yang perlu segera diisi sebelum risiko terwujud."
        : "Proteksi finansial Anda masih sangat minim. Prioritaskan BPJS dan Term Life segera.",
    recommendations,
    totalMonthlyPremiumRecommended: totalPremiumRec,
    protectionGapTotal: gapTotal,
    adviceText:
      `Sebaiknya alokasikan maksimal ${income > 0 ? Math.round((500_000 / income) * 100) : 5}% dari pendapatan untuk premi asuransi (Rp ${Math.round(income * 0.05).toLocaleString("id-ID")}/bulan). ` +
      "Utamakan urutan: (1) BPJS Kesehatan aktif, (2) Asuransi Jiwa Term Life jika ada tanggungan, (3) Asuransi Kesehatan swasta, (4) Asuransi Properti.",
  };
}

// ─── Real Financial Advice ────────────────────────────────────────────────────

export function generateRealFinancialAdvice(
  profile: UserProfile,
  cashflow: CashflowData,
  career: CareerProfile,
  risk: RiskProfileData
): RealFinancialAdvice {
  const income = getTotalMonthlyIncome(cashflow);
  const expenses = getTotalMonthlyExpenses(cashflow);
  const surplus = getMonthlySurplus(cashflow);
  const debts = getTotalDebtsMonthly(cashflow);
  const dsr = income > 0 ? (debts / income) * 100 : 0;

  const adviceItems: FinancialAdviceItem[] = [];
  const urgentActions: string[] = [];
  const sideHustleIdeas: string[] = [];
  const investmentOpportunities: string[] = [];

  // ── Income advice ─────────────────────────────────────────────────────────
  if (surplus < income * 0.2) {
    const skills = profile.skillsAndTalents || [];
    if (skills.includes("Software Engineering") || skills.includes("Data Analytics")) {
      sideHustleIdeas.push("Freelance coding / data analysis via Toptal, Upwork, atau Sribu");
      sideHustleIdeas.push("Buat kursus online di Udemy atau Skill Academy");
    }
    if (skills.includes("Digital Marketing")) {
      sideHustleIdeas.push("Social media management atau ads campaign untuk UMKM");
      sideHustleIdeas.push("Konten kreator di YouTube atau TikTok dengan niche finansial/edukasi");
    }
    if (skills.includes("Pendidikan & Training")) {
      sideHustleIdeas.push("Bimbingan belajar online atau offline (les privat)");
      sideHustleIdeas.push("Pembuatan modul / e-book edukasi");
    }
    if (skills.includes("UI/UX Design")) {
      sideHustleIdeas.push("Freelance desain UI/UX via 99designs atau fiverr");
    }
    if (skills.includes("Finance & Accounting")) {
      sideHustleIdeas.push("Konsultasi pajak / bookkeeping untuk UMKM");
      sideHustleIdeas.push("Persiapkan sertifikasi CFP / QWP untuk nilai tambah karir");
    }

    // Generic ideas
    if (sideHustleIdeas.length < 3) {
      sideHustleIdeas.push("Jual produk/jasa via Tokopedia, Shopee, atau Gojek");
      sideHustleIdeas.push("Investasi properti micro (kos-kosan, kost petakan)");
    }

    adviceItems.push({
      category: "tambah_pemasukan",
      title: "Tingkatkan Penghasilan Aktif Melalui Side Hustle",
      description:
        "Surplus bulanan Anda saat ini di bawah 20% income. Menambah sumber pemasukan adalah cara tercepat memperbaiki arus kas.",
      estimatedImpact: `+Rp ${Math.round(income * 0.15).toLocaleString("id-ID")} – ${Math.round(income * 0.3).toLocaleString("id-ID")}/bulan`,
      timeframe: "1-6 bulan",
      difficulty: "sedang",
      actionSteps: [
        "Identifikasi 1-2 skill yang bisa dimonetisasi dalam 30 hari",
        "Daftar di platform freelance dan buat portofolio mini",
        "Target pendapatan side hustle minimal 15-20% dari gaji utama",
        "Reinvestasikan seluruh penghasilan side hustle untuk membangun aset",
      ],
    });
  }

  // ── Expense advice ────────────────────────────────────────────────────────
  const wantsRatio = income > 0 ? ((cashflow.monthlyWants || 0) / income) * 100 : 0;
  if (wantsRatio > 30) {
    urgentActions.push(
      `Pengeluaran gaya hidup (wants) Anda sebesar ${wantsRatio.toFixed(1)}% melebihi batas ideal 30%. Kurangi langganan yang tidak aktif digunakan.`
    );
    adviceItems.push({
      category: "kurangi_pengeluaran",
      title: "Audit & Pangkas Pengeluaran Gaya Hidup (Wants)",
      description: `Pos wants Anda mencapai ${wantsRatio.toFixed(1)}% dari income, di atas batas ideal 30% (standar 50/30/20 Warren/Elizabeth Warren).`,
      estimatedImpact: `Hemat Rp ${Math.round((cashflow.monthlyWants || 0) * 0.3).toLocaleString("id-ID")}/bulan`,
      timeframe: "Segera (bulan ini)",
      difficulty: "mudah",
      actionSteps: [
        "Buat daftar semua langganan rutin (streaming, gym, app) — batalkan yang tidak digunakan >2 bulan",
        "Gunakan prinsip 24-jam: tunggu 24 jam sebelum membeli barang non-esensial >Rp 500.000",
        "Kurangi makan di luar 2x/minggu dan ganti dengan masak sendiri",
        "Cabut kartu kredit dari marketplace untuk mencegah impulse buying",
      ],
    });
  }

  // ── Debt advice ───────────────────────────────────────────────────────────
  if (dsr > 30) {
    urgentActions.push(
      `Cicilan utang Anda ${dsr.toFixed(1)}% dari income (OJK limit 30%). Fokus percepat pelunasan utang berbunga tinggi.`
    );
    adviceItems.push({
      category: "pelunasan_hutang",
      title: "Strategi Percepat Pelunasan Utang (Debt Snowball / Avalanche)",
      description: `DSR ${dsr.toFixed(1)}% melebihi batas sehat OJK 30%. Setiap cicilan tambahan dari surplus perlu diprioritaskan ke utang berbunga tertinggi.`,
      estimatedImpact: `Bebas cicilan lebih cepat 12-24 bulan`,
      timeframe: "6-24 bulan",
      difficulty: "sedang",
      actionSteps: [
        "List semua utang beserta suku bunga (dari tertinggi ke terendah)",
        "Bayar minimum semua utang, lalu lempar surplus ke utang berbunga TERTINGGI (Avalanche Method)",
        "Jika butuh motivasi psikologis: lunasi utang TERKECIL dulu (Snowball Method — Dave Ramsey)",
        "Stop menambah utang konsumtif baru (paylater, KTA) sampai DSR < 30%",
        "Pertimbangkan refinancing KPR jika bunga floating sudah di atas 11%",
      ],
    });
  }

  // ── Investment advice ─────────────────────────────────────────────────────
  const profileType = risk.profileType;
  if (profileType === "Konservatif") {
    investmentOpportunities.push("Reksadana Pasar Uang (RDPU) — likuid, risiko minimal");
    investmentOpportunities.push("SBN Syariah Sukuk Tabungan ST (OJK guaranteed)");
    investmentOpportunities.push("Deposito Bank BUKU IV (BCA, BRI, BNI, Mandiri)");
    investmentOpportunities.push("Emas Logam Mulia Antam (hedge inflasi jangka panjang)");
  } else if (profileType === "Moderat" || profileType === "Moderat-Agresif") {
    investmentOpportunities.push("Obligasi Negara Ritel (ORI) — kupon tetap, dijamin pemerintah");
    investmentOpportunities.push("Reksadana Indeks IDX30 (DCA bulanan via Bibit/Bareksa)");
    investmentOpportunities.push("Sukuk Ritel SR / PBS — return 6-7% p.a.");
    investmentOpportunities.push("Emas digital di Tokopedia/Pegadaian Digital");
  } else {
    investmentOpportunities.push("Saham Blue Chip IHSG (BBCA, BBRI, TLKM, ASII) via DCA");
    investmentOpportunities.push("Reksadana Saham Indeks LQ45 atau IDX30");
    investmentOpportunities.push("REITs / Dana Investasi Real Estate (DIRE) untuk passive income");
    investmentOpportunities.push("P2P Lending terdaftar OJK (risiko moderat, return 12-18%)");
  }

  if (surplus > 0) {
    adviceItems.push({
      category: "optimasi_investasi",
      title: `Mulai DCA ${profileType} Portfolio dengan Surplus Bulanan`,
      description: `Anda memiliki surplus Rp ${surplus.toLocaleString("id-ID")}/bulan yang bisa diinvestasikan secara konsisten dengan metode Dollar Cost Averaging (DCA).`,
      estimatedImpact: `Net worth +Rp ${Math.round(surplus * 12 * 5).toLocaleString("id-ID")} dalam 5 tahun (asumsi return 9%/tahun)`,
      timeframe: "Mulai bulan ini",
      difficulty: "mudah",
      actionSteps: [
        "Buka rekening khusus investasi terpisah dari rekening operasional",
        "Setup autodebet investasi di tanggal gajian (bukan akhir bulan)",
        "Alokasi: 50% RDPU (dana darurat) + 30% Obligasi/SBN + 20% Reksadana Saham",
        "Review dan rebalancing portofolio setiap 6 bulan",
        "Jangan tarik investasi kecuali darurat — biarkan compound interest bekerja",
      ],
    });
  }

  const summary =
    surplus <= 0
      ? "Arus kas Anda saat ini defisit (pengeluaran > pemasukan). Fokus utama: pangkas pengeluaran dan cari sumber income tambahan segera."
      : dsr > 30
      ? "Prioritas utama adalah mengurangi beban cicilan utang di bawah 30% income, baru kemudian akselerasi investasi."
      : `Kondisi keuangan cukup baik dengan surplus Rp ${surplus.toLocaleString("id-ID")}/bulan. Optimalkan dengan investasi rutin dan proteksi yang memadai.`;

  return {
    summary,
    urgentActions,
    adviceItems,
    sideHustleIdeas,
    investmentOpportunities,
  };
}

// ─── 10-Year Step-by-Step Projection ─────────────────────────────────────────

export function generateFutureGoalProjection(
  profile: UserProfile,
  cashflow: CashflowData,
  career: CareerProfile,
  goals: TargetGoalsData,
  risk: RiskProfileData
): FutureGoalProjectionResult {
  const currentYear = new Date().getFullYear();
  const income = getTotalMonthlyIncome(cashflow);
  const budget = calculateBudgetAllocation(cashflow, profile, career);
  const netWorth = getNetWorth(cashflow);
  const totalAssets = getTotalAssets(cashflow);
  const debts = getTotalDebtsOutstanding(cashflow);

  const expectedReturn =
    risk.profileType === "Agresif" || risk.profileType === "Sangat Agresif"
      ? 0.11
      : risk.profileType === "Moderat" || risk.profileType === "Moderat-Agresif"
      ? 0.09
      : 0.065;

  const salaryGrowth = (career.personal?.salaryGrowthRatePercent || 7) / 100;
  const inflation = 0.045;

  const yearlyProjections: FutureYearProjection[] = [];
  let runningNetWorth = netWorth;
  let runningAssets = totalAssets;
  let runningDebts = debts;
  let runningMonthlyIncome = income;
  let runningMonthlySavings = budget.savingsAndInvestment;

  for (let yr = 1; yr <= 10; yr++) {
    // Grow income by salary growth rate
    runningMonthlyIncome *= 1 + salaryGrowth / 12;
    runningMonthlySavings = Math.max(0, runningMonthlySavings * (1 + salaryGrowth / 12));

    // Investment return on existing assets
    const annualReturn = runningAssets * expectedReturn;
    // Add annual savings
    const annualSavings = runningMonthlySavings * 12;
    runningAssets += annualReturn + annualSavings;
    // Reduce debts (approximate)
    runningDebts = Math.max(0, runningDebts - annualSavings * 0.3);
    runningNetWorth = runningAssets - runningDebts;

    // Goal statuses
    const goalsStatus: YearlyGoalStatus[] = [];

    if (goals.housingTarget?.hasTarget) {
      const targetDP = goals.housingTarget.estimatedPrice * (goals.housingTarget.downPaymentPercent / 100);
      const achieved = Math.min(runningNetWorth * 0.3, targetDP);
      goalsStatus.push({
        goalName: `DP Rumah (${goals.housingTarget.location || "Target"})`,
        targetAmount: targetDP,
        achievedAmount: achieved,
        isAchieved: achieved >= targetDP,
        percentageComplete: Math.min(100, Math.round((achieved / targetDP) * 100)),
      });
    }

    if (goals.vehicleTarget?.hasTarget) {
      const targetVehicle = goals.vehicleTarget.estimatedPrice;
      const achieved = Math.min(runningNetWorth * 0.1, targetVehicle);
      goalsStatus.push({
        goalName: `Kendaraan (${goals.vehicleTarget.vehicleType || "Target"})`,
        targetAmount: targetVehicle,
        achievedAmount: achieved,
        isAchieved: achieved >= targetVehicle,
        percentageComplete: Math.min(100, Math.round((achieved / targetVehicle) * 100)),
      });
    }

    const milestones: Record<number, string> = {
      1: "Bangun dana darurat & pondasi proteksi asuransi",
      2: "Mulai investasi rutin DCA, optimalkan arus kas",
      3: "Dana darurat penuh, fokus akselerasi aset",
      4: "Pertimbangkan properti investasi / KPR pertama",
      5: "Review portofolio besar, rebalancing & diversifikasi",
      6: "Persiapkan dana pendidikan anak (jika ada)",
      7: "Akselerasi passive income (REITs, dividen, sewa)",
      8: "Evaluasi target financial freedom",
      9: "Optimalkan pajak & estate planning",
      10: "Financial freedom horizon — passive income menutupi living cost",
    };

    const actions: Record<number, string[]> = {
      1: ["Setup autodebet tabungan", "Aktifkan BPJS Kesehatan", "Beli Term Life jika punya tanggungan"],
      2: ["Mulai DCA ke RDPU + SBN", "Audit dan pangkas pengeluaran tidak perlu"],
      3: ["Lunasi 1 utang kecil (Snowball)", "Naikkan alokasi investasi ke 25%"],
      4: ["Survey properti pertama", "Pertimbangkan passive income stream pertama"],
      5: ["Rebalancing portofolio", "Review premi asuransi", "Naikkan target investasi"],
      6: ["Buka rekening pendidikan anak", "Pertimbangkan bisnis sampingan"],
      7: ["Masuk ke instrumen yield tinggi (REITs, P2P terdaftar OJK)"],
      8: ["Hitung proyeksi passive income vs living cost", "Target gap < 20%"],
      9: ["Konsultasi pajak & waris dengan notaris", "Optimalkan struktur aset"],
      10: ["Passive income ≥ living cost = Financial Freedom!", "Celebrate & review next decade goals"],
    };

    yearlyProjections.push({
      year: yr,
      calendarYear: currentYear + yr,
      projectedNetWorth: Math.round(runningNetWorth),
      projectedSavings: Math.round(runningMonthlySavings * 12 * yr * 0.3),
      projectedInvestmentValue: Math.round(runningAssets * 0.7),
      projectedPassiveIncome: Math.round((runningNetWorth * 0.05) / 12),
      goalsStatus,
      keyMilestone: milestones[yr] || "Terus konsisten menjalankan rencana keuangan",
      recommendedActions: actions[yr] || ["Pertahankan konsistensi investasi dan review berkala"],
    });
  }

  // Estimate financial freedom year
  const targetPassiveIncome = getTotalMonthlyExpenses(cashflow);
  const freedomProjection = yearlyProjections.find(
    (p) => p.projectedPassiveIncome >= targetPassiveIncome
  );

  return {
    summary: `Proyeksi 10 tahun ke depan menunjukkan kekayaan bersih Anda berpotensi mencapai Rp ${(yearlyProjections[9]?.projectedNetWorth / 1_000_000_000 || 0).toFixed(1)} Miliar pada tahun ${currentYear + 10}, dengan passive income Rp ${(yearlyProjections[9]?.projectedPassiveIncome / 1_000_000 || 0).toFixed(1)} Jt/bulan.`,
    yearlyProjections,
    financialFreedomYear: freedomProjection
      ? currentYear + freedomProjection.year
      : undefined,
    totalProjectedWealth10Yr: yearlyProjections[9]?.projectedNetWorth || 0,
  };
}

// ─── Deterministic CFP Financial Plan Generator ──────────────────────────────

export function generateDeterministicFinancialPlan(data: {
  profile?: UserProfile;
  cashflow?: CashflowData;
  career?: CareerProfile;
  goals?: TargetGoalsData;
  risk?: RiskProfileData;
}): FinancialPlanResult {
  const profile = data.profile || ({} as UserProfile);
  const cashflow = data.cashflow || ({} as CashflowData);
  const career = data.career || ({ personal: {} } as CareerProfile);
  const goals = data.goals || ({} as TargetGoalsData);
  const risk = data.risk || ({ profileType: "Moderat" } as RiskProfileData);

  const monthlyIncome =
    (cashflow.monthlyMainIncome || 0) +
    (cashflow.monthlySideIncome || 0) +
    (cashflow.partnerMainIncome || 0) +
    (cashflow.partnerSideIncome || 0) +
    (cashflow.businessPassiveIncome || 0) +
    (cashflow.investmentPassiveIncome || 0);

  const livingCost =
    (cashflow.monthlyNeeds || 0) +
    (cashflow.housingExpense || 0) +
    (cashflow.utilitiesExpense || 0) +
    (cashflow.transportationExpense || 0) +
    (cashflow.familySupportExpense || 0) +
    (cashflow.educationCurrentExpense || 0);

  const debtsList = cashflow.debts || [];
  const totalDebtsMonthly = debtsList.reduce((acc, d) => acc + (d.monthlyPayment || 0), 0);
  const totalDebtsRemaining = debtsList.reduce((acc, d) => acc + (d.totalRemaining || 0), 0);

  const existingInsurance = cashflow.monthlyExistingInsurance || 0;

  const liquidCash = (cashflow.cashEmergencyFund || 0) + (cashflow.bankSavings || 0) + (cashflow.deposits || 0);
  const investmentAssets = (cashflow.stocks || 0) + (cashflow.mutualFunds || 0) + (cashflow.gold || 0) + (cashflow.cryptoAssets || 0);
  const physicalAssets = (cashflow.propertyValue || 0) + (cashflow.vehicleValue || 0) + (cashflow.otherAssets || 0);
  const totalAssets = liquidCash + investmentAssets + physicalAssets;

  const recNeeds = livingCost > 0 ? livingCost : Math.round(monthlyIncome * 0.5);
  const recDebt = totalDebtsMonthly;
  const isMarriedOrDeps = profile.maritalStatus === "Menikah" || (profile.dependents || 0) > 0;
  const recInsurance = existingInsurance > 0
    ? existingInsurance
    : isMarriedOrDeps ? Math.round(monthlyIncome * 0.05) : Math.round(monthlyIncome * 0.03);
  const recSavings = Math.max(0, monthlyIncome - recNeeds - recDebt - recInsurance - Math.round(monthlyIncome * 0.15));
  const recWants = Math.max(0, monthlyIncome - recNeeds - recDebt - recInsurance - recSavings);

  const isFreelance = career.personal?.jobType === "Freelancer / Profesional" || career.personal?.jobType === "Wirausaha / Bisnis";
  const emergencyMultiplier = isFreelance ? (isMarriedOrDeps ? 12 : 9) : (isMarriedOrDeps ? 9 : 6);
  const baseLivingCostForEmergency = livingCost > 0 ? livingCost : Math.round(monthlyIncome * 0.5);
  const targetEmergencyFund = Math.max(25000000, baseLivingCostForEmergency * emergencyMultiplier);
  const currentEmergencyFund = (cashflow.cashEmergencyFund || 0) + (cashflow.bankSavings || 0);

  // Health Score
  const dti = monthlyIncome > 0 ? (totalDebtsMonthly / monthlyIncome) * 100 : 0;
  const debtScore = dti === 0 ? 100 : dti <= 15 ? 95 : dti <= 30 ? 80 : dti <= 40 ? 55 : 25;
  const emergencyCoverageMonths = baseLivingCostForEmergency > 0 ? currentEmergencyFund / baseLivingCostForEmergency : 0;
  const liquidityScore = emergencyCoverageMonths >= emergencyMultiplier ? 100 : Math.min(95, Math.round((emergencyCoverageMonths / emergencyMultiplier) * 100));
  const savingsRate = monthlyIncome > 0 ? (recSavings / monthlyIncome) * 100 : 0;
  const savingsScore = savingsRate >= 25 ? 100 : savingsRate >= 20 ? 85 : savingsRate >= 10 ? 65 : 40;
  const protectionScore = profile.hasPrivateInsurance ? 95 : profile.bpjsStatus?.includes("Aktif") ? 80 : 50;
  const solvencyScore = totalAssets > 0 ? Math.min(100, Math.max(10, Math.round(((totalAssets - totalDebtsRemaining) / totalAssets) * 100))) : 60;
  const healthScore = Math.min(100, Math.max(20, Math.round((liquidityScore * 0.25) + (debtScore * 0.25) + (savingsScore * 0.25) + (protectionScore * 0.15) + (solvencyScore * 0.1))));

  // Multi-Year Projections
  const expectedReturn = risk.profileType === "Agresif" || risk.profileType === "Sangat Agresif" ? 0.11 : risk.profileType === "Moderat" || risk.profileType === "Moderat-Agresif" ? 0.09 : 0.065;
  const multiYearProjections = [1, 3, 5, 10, 15].map((yr) => {
    const monthlyRate = expectedReturn / 12;
    const totalMonths = yr * 12;
    const fvLumpSum = totalAssets * Math.pow(1 + expectedReturn, yr);
    const fvAnnuity = monthlyRate > 0 ? recSavings * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) : recSavings * totalMonths;
    const projNetWorth = Math.round(fvLumpSum + fvAnnuity);
    const projEmergency = Math.min(targetEmergencyFund, Math.round(currentEmergencyFund + (recSavings * 0.4 * Math.min(totalMonths, 24))));
    const monthlyPassive = Math.round((projNetWorth * 0.05) / 12);
    let goalsStatus = "Fondasi dana darurat dan proteksi keluarga diperkuat.";
    if (yr === 3) goalsStatus = "Target DP Rumah / kendaraan terpenuhi, dana darurat 100% aman.";
    else if (yr === 5) goalsStatus = "Portofolio bertumbuh, persiapan dana pendidikan jenjang lanjut.";
    else if (yr === 10) goalsStatus = "Akumulasi aset mapan, pasif income mulai menopang kebutuhan rutin.";
    else if (yr === 15) goalsStatus = "Kemerdekaan finansial (Financial Freedom) & persiapan pensiun mandiri.";
    return { year: yr, projectedNetWorth: projNetWorth, emergencyFundTotal: projEmergency, estimatedMonthlyPassiveIncome: monthlyPassive, goalsStatus };
  });

  const isMarried = profile.maritalStatus === "Menikah" || (profile.dependents || 0) > 0;
  const partnerInfo = profile.partnerName ? ` bersama pasangan (${profile.partnerName})` : profile.maritalStatus === "Menikah" ? " bersama pasangan" : "";

  const strategicMilestones = [
    {
      timeframe: "Bulan 1-3",
      title: isMarried ? "Otomasi Arus Kas Keluarga & Dana Darurat" : "Otomasi Autodebet & Dana Darurat",
      description: isMarried
        ? `Pisahkan rekening operasional rumah tangga dari tabungan. Setup autodebet dana darurat keluarga (${emergencyMultiplier}x pengeluaran) ke instrumen likuid (RDPU/SBN).`
        : "Pisahkan rekening operasional dari rekening tabungan. Setup autodebet tabungan pada tanggal gajian ke RDPU.",
      targetAllocation: `Rp ${Math.round(recSavings * 0.5).toLocaleString("id-ID")}/bulan ke RDPU/SBN`,
    },
    {
      timeframe: "Bulan 4-6",
      title: isMarried ? "Audit Pengeluaran & Proteksi Polis Keluarga" : "Audit Pengeluaran & Proteksi Polis",
      description: isMarried
        ? `Amankan asuransi jiwa pencari nafkah keluarga (UP tunai 10x biaya hidup keluarga) dan pastikan kepesertaan BPJS/asuransi kesehatan seluruh anggota keluarga aktif.`
        : "Pastikan kepesertaan BPJS Kesehatan aktif dan amankan polis asuransi jiwa murni (Term-Life) jika memiliki tanggungan.",
      targetAllocation: "Premi hemat terjangkau (Maks 5% - 10% income)",
    },
    {
      timeframe: "Tahun 1-2",
      title: isMarried ? "Investasi Rutin DCA & Dana Pendidikan / Rumah" : "Investasi Rutin DCA & Target DP Rumah",
      description: isMarried
        ? `Rutin Dollar-Cost Averaging portofolio keluarga ke SBN Ritel, RDPT, dan Indeks Saham IDX30 untuk persiapan DP rumah keluarga dan dana pendidikan anak.`
        : "Rutin Dollar-Cost Averaging ke instrumen SBN Ritel, RDPT, dan Indeks Saham IDX30 sesuai profil risiko.",
      targetAllocation: `${risk.profileType || "Moderat"} Portofolio Keluarga`,
    },
    {
      timeframe: "Tahun 3-5",
      title: isMarried ? "Akselerasi Kekayaan Bersih Keluarga & Pensiun Bersama" : "Eksekusi Goals Properti & Akselerasi Aset",
      description: isMarried
        ? "Realisasikan kepemilikan aset riil keluarga, optimalisasi pendapatan pasif rumah tangga, dan review berkala roadmap kemerdekaan finansial masa tua bersama pasangan."
        : "Realisasikan target kepemilikan aset riil, optimalisasi pendapatan pasif, dan review berkala kenaikan nilai portofolio.",
      targetAllocation: "Pertumbuhan Aset Jangka Panjang Rumah Tangga",
    },
  ];

  const executiveSummary = isMarried
    ? `Berdasarkan analisis perencana keuangan (CFP) untuk ${profile.fullName || "Klien"}${partnerInfo} (status menikah dengan ${profile.dependents || 0} tanggungan), kondisi finansial rumah tangga Anda memiliki indeks kesehatan ${healthScore}/100 dengan profil risiko ${risk.profileType || "Moderat"}. Rasio cicilan utang tercatat ${dti.toFixed(1)}% (batas aman OJK ≤30%) dan kapasitas tabungan keluarga mencapai Rp ${recSavings.toLocaleString("id-ID")}/bulan. Rencana keuangan komprehensif ini mengintegrasikan dana darurat keluarga sebesar ${emergencyMultiplier}x pengeluaran pokok (Rp ${targetEmergencyFund.toLocaleString("id-ID")}), proteksi asuransi jiwa pencari nafkah, dan investasi terstruktur demi kemakmuran masa depan keluarga.`
    : `Berdasarkan analisis perencana keuangan (CFP) untuk ${profile.fullName || "Klien"}, kondisi finansial Anda memiliki indeks kesehatan ${healthScore}/100 dengan profil risiko ${risk.profileType || "Moderat"}. Rasio beban cicilan saat ini tercatat ${dti.toFixed(1)}% (batas aman OJK ≤30%) dan kapasitas tabungan bulanan mencapai Rp ${recSavings.toLocaleString("id-ID")}/bulan. Dengan mendisiplinkan alokasi dana darurat ${emergencyMultiplier}x pengeluaran dan investasi rutin pada instrumen legal berizin OJK, target kemerdekaan finansial Anda diproyeksikan tercapai sesuai jadwal.`;

  return {
    executiveSummary,
    healthScore,
    ojkRatios: {
      savingsRatio: parseFloat(savingsRate.toFixed(1)),
      debtServiceRatio: parseFloat(dti.toFixed(1)),
      emergencyFundMonths: parseFloat(emergencyCoverageMonths.toFixed(1)),
      solvencyRatio: parseFloat(solvencyScore.toFixed(1)),
    },
    monthlyBudgetRecommendation: {
      livingNeeds: recNeeds,
      debtRepayment: recDebt,
      insurancePremiums: recInsurance,
      savingsAndInvestment: recSavings,
      lifestyleWants: recWants,
    },
    multiYearProjections,
    strategicMilestones,
  };
}
