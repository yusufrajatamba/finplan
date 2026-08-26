import React, { useState } from "react";
import { UserProfile, CashflowData, TargetGoalsData } from "../../types";
import { formatRupiah, formatRupiahShort } from "../../utils/formatters";
import { MoneyInput } from "../ui/MoneyInput";
import {
  TrendingUp,
  Shield,
  Home,
  Car,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown,
  Users,
  UserCheck,
  Heart,
  Baby,
} from "lucide-react";

interface ManualSimulationSuiteProps {
  profile: UserProfile;
  cashflow: CashflowData;
  goals: TargetGoalsData;
}

export const ManualSimulationSuite: React.FC<ManualSimulationSuiteProps> = ({
  profile,
  cashflow,
  goals,
}) => {
  // Sub-tabs state
  const [activeTab, setActiveTab] = useState<"tabungan" | "asuransi" | "kpr" | "kendaraan">("tabungan");

  // Marriage and family context
  const isMarried = profile.maritalStatus === "Menikah" || (profile.dependents || 0) > 0;
  const partnerName = profile.partnerName || "Pasangan";
  const partnerAge = profile.partnerAge || (profile.age ? profile.age - 1 : 28);
  const dependentsCount = profile.dependents || 0;

  // Planning Scope: "household" (Keluarga) vs "individual" (Pribadi)
  const [planningScope, setPlanningScope] = useState<"household" | "individual">(
    isMarried ? "household" : "individual"
  );

  // Income calculations
  const individualIncome =
    (cashflow.monthlyMainIncome || 0) +
    (cashflow.monthlySideIncome || 0) || 10000000;

  const partnerIncome =
    (cashflow.partnerMainIncome || 0) +
    (cashflow.partnerSideIncome || 0);

  const householdIncome =
    individualIncome +
    partnerIncome +
    (cashflow.businessPassiveIncome || 0) +
    (cashflow.investmentPassiveIncome || 0);

  // Effective income used based on scope
  const monthlyIncome = planningScope === "household" ? householdIncome : individualIncome;

  const totalAssetsNow =
    (cashflow.cashEmergencyFund || 0) +
    (cashflow.bankSavings || 0) +
    (cashflow.deposits || 0) +
    (cashflow.stocks || 0) +
    (cashflow.mutualFunds || 0) +
    (cashflow.gold || 0) +
    (cashflow.cryptoAssets || 0);

  const totalDebtsNow = (cashflow.debts || []).reduce(
    (acc, d) => acc + (d.totalRemaining || 0),
    0
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. STATE SIMULASI TABUNGAN & INVESTASI
  // ─────────────────────────────────────────────────────────────────────────────
  const [savingsInitial, setSavingsInitial] = useState<number>(totalAssetsNow > 0 ? totalAssetsNow : 10000000);
  const [savingsMonthly, setSavingsMonthly] = useState<number>(
    Math.max(1000000, Math.round(monthlyIncome * 0.2))
  );
  const [savingsReturn, setSavingsReturn] = useState<number>(9);
  const [savingsInflation, setSavingsInflation] = useState<number>(4.5);
  const [savingsYears, setSavingsYears] = useState<number>(10);

  const handlePresetInstrument = (rate: number) => {
    setSavingsReturn(rate);
  };

  const calculateSavingsCompound = (years: number) => {
    const months = years * 12;
    const monthlyRate = savingsReturn / 100 / 12;
    let balance = savingsInitial;
    let totalDeposited = savingsInitial;

    for (let m = 1; m <= months; m++) {
      balance = (balance + savingsMonthly) * (1 + monthlyRate);
      totalDeposited += savingsMonthly;
    }

    const realDiscountFactor = Math.pow(1 + savingsInflation / 100, years);
    const realFutureValue = Math.round(balance / realDiscountFactor);

    return {
      futureValue: Math.round(balance),
      totalDeposited: Math.round(totalDeposited),
      interestEarned: Math.round(balance - totalDeposited),
      realFutureValue,
      passiveIncomeMonthly: Math.round((balance * 0.04) / 12),
    };
  };

  const savingsResult = calculateSavingsCompound(savingsYears);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. STATE SIMULASI ASURANSI (DENGAN PILIHAN KELUARGA & FLOATING)
  // ─────────────────────────────────────────────────────────────────────────────
  type InsuranceTypeChoice = "jiwa_term_life" | "kesehatan" | "penyakit_kritis" | "properti" | "kendaraan";
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<InsuranceTypeChoice>("jiwa_term_life");

  // Insurance Coverage Scope: Family Plan vs Individual
  const [insFamilyScope, setInsFamilyScope] = useState<"family" | "individual">(
    isMarried ? "family" : "individual"
  );

  // Premium Input Mode: "auto" (Estimasi Rumus) vs "manual" (Input Nominal Sendiri)
  const [insPremiumInputMode, setInsPremiumInputMode] = useState<"auto" | "manual">("auto");
  const [insManualMonthlyPremium, setInsManualMonthlyPremium] = useState<number>(
    Math.max(500000, Math.round(monthlyIncome * 0.05))
  );

  // Premium Scheme: Fixed (Level) vs Floating (Age-Banded & Medical Inflation)
  const [insPremiumScheme, setInsPremiumScheme] = useState<"fixed" | "floating">("fixed");
  const [insMedicalInflation, setInsMedicalInflation] = useState<number>(8); // % inflasi medis tahunan

  // Insurance Input Parameters (allow 0 and any amount)
  const idealTermLifeUP = isMarried
    ? Math.max(750000000, monthlyIncome * 12 * 12 + totalDebtsNow)
    : Math.max(500000000, monthlyIncome * 12 * 10 + totalDebtsNow);

  const [insTermLifeUP, setInsTermLifeUP] = useState<number>(idealTermLifeUP);
  const [insAge, setInsAge] = useState<number>(profile.age || 30);
  const [insIsSmoker, setInsIsSmoker] = useState<boolean>(false);
  const [insTermTenor, setInsTermTenor] = useState<number>(20);

  // Health Insurance Options
  const [insHealthRoomPlan, setInsHealthRoomPlan] = useState<"1_bed_vip" | "1_bed_standard" | "2_bed">("1_bed_standard");
  const [insHealthAnnualLimit, setInsHealthAnnualLimit] = useState<number>(1000000000);
  const [insHealthOutpatient, setInsHealthOutpatient] = useState<boolean>(false);

  // Critical Illness Options
  const [insCriticalUP, setInsCriticalUP] = useState<number>(
    Math.max(300000000, monthlyIncome * 12 * (isMarried ? 5 : 3))
  );

  // Property Insurance Options
  const [insPropertyValue, setInsPropertyValue] = useState<number>(
    cashflow.propertyValue > 0 ? cashflow.propertyValue : 500000000
  );
  const [insPropertyEarthquake, setInsPropertyEarthquake] = useState<boolean>(true);

  // Vehicle Insurance Options
  const [insVehicleValue, setInsVehicleValue] = useState<number>(
    cashflow.vehicleValue > 0 ? cashflow.vehicleValue : 250000000
  );
  const [insVehicleCoverageType, setInsVehicleCoverageType] = useState<"all_risk" | "tlo">("all_risk");

  // Calculate Insurance Estimates
  const calculateInsuranceEstimates = () => {
    let monthlyPremium = 0;
    let annualPremium = 0;
    let coverageDisplay = 0;
    let description = "";
    let features: string[] = [];
    let providerList: string[] = [];

    // Family Member Multiplier for Health Insurance
    // Klien (1.0) + Pasangan (0.85) + Anak (0.55 per anak)
    const familyMemberMultiplier =
      insFamilyScope === "family" && isMarried
        ? 1.0 + 0.85 + (dependentsCount * 0.55)
        : 1.0;

    switch (selectedInsuranceType) {
      case "jiwa_term_life": {
        coverageDisplay = insTermLifeUP;
        let rate = 0.001;
        if (insAge > 40) rate += 0.0006;
        if (insAge > 50) rate += 0.0012;
        if (insIsSmoker) rate *= 1.45;
        annualPremium = Math.round(insTermLifeUP * rate);
        monthlyPremium = Math.round(annualPremium / 12);

        if (insFamilyScope === "family" && isMarried) {
          description = `Proteksi Jiwa Kepala Keluarga dirancang sebagai pengganti penghasilan (Income Replacement) selama 10-15 tahun ke depan agar ${partnerName} dan ${dependentsCount} anak tetap dapat melanjutkan hidup dan pendidikan layak tanpa risiko finansial jika pencari nafkah wafat.`;
          features = [
            `Uang Pertanggungan (UP) Tunai: ${formatRupiah(insTermLifeUP)}`,
            `Penerima Manfaat Utama: ${partnerName} & ${dependentsCount} Tanggungan Anak`,
            `Masa Pertanggungan: ${insTermTenor} Tahun (hingga usia ${insAge + insTermTenor} thn / anak mandiri)`,
            `Cair Tunai 100% Bebas Pajak Warisan & Bebas Sengketa`,
          ];
        } else {
          description = "Proteksi jiwa murni (Term Life) memberikan santunan tunai 100% jika tertanggung meninggal dunia dalam masa polis. Sangat efisien karena tanpa potongan investasi tersembunyi.";
          features = [
            `Uang Pertanggungan (UP) Tunai: ${formatRupiah(insTermLifeUP)}`,
            `Masa Pertanggungan: ${insTermTenor} Tahun (hingga usia ${insAge + insTermTenor} tahun)`,
            `Bebas Biaya Akuisisi & Transparan (Bukan Unit Link)`,
            `Proteksi untuk ${profile.dependents || 1} Tanggungan Keluarga`,
          ];
        }
        providerList = ["Allianz Term Life", "Prudential PRULink Term", "Zurich Pro-Care", "BRI Life Term"];
        break;
      }
      case "kesehatan": {
        coverageDisplay = insHealthAnnualLimit;
        let baseAnnual = 4500000;
        if (insHealthRoomPlan === "1_bed_vip") baseAnnual = 8500000;
        else if (insHealthRoomPlan === "2_bed") baseAnnual = 3500000;
        if (insAge > 35) baseAnnual *= 1.25;
        if (insAge > 45) baseAnnual *= 1.5;
        if (insHealthOutpatient) baseAnnual += 3000000;

        annualPremium = Math.round(baseAnnual * familyMemberMultiplier);
        monthlyPremium = Math.round(annualPremium / 12);

        if (insFamilyScope === "family" && isMarried) {
          description = `Paket Asuransi Kesehatan Keluarga (Family Plan) mencakup perlindungan untuk seluruh anggota keluarga (${1 + (profile.partnerAge ? 1 : 1) + dependentsCount} Jiwa: Klien, Pasangan, dan ${dependentsCount} Anak) dengan sistem kartu cashless terpisah dan limit on-bill per orang.`;
          features = [
            `Limit Tahunan (On-Bill per Orang): ${formatRupiah(insHealthAnnualLimit)}`,
            `Peserta Tertanggung: Klien (${insAge} thn), ${partnerName} (${partnerAge} thn)${dependentsCount > 0 ? `, & ${dependentsCount} Anak` : ""}`,
            `Tipe Kamar: ${insHealthRoomPlan === "1_bed_vip" ? "1 Tempat Tidur VIP" : insHealthRoomPlan === "1_bed_standard" ? "1 Tempat Tidur Standar (Kelas 1)" : "2 Tempat Tidur"}`,
            `Sistem Pembayaran: Cashless Kartu Digital Keluarga (RS Indonesia & Malaysia)`,
          ];
        } else {
          description = "Asuransi kesehatan swasta murni melengkapi BPJS Kesehatan dengan sistem klaim cashless, akses rumah sakit rekanan kelas VIP/1-Bed, dan limit tahunan miliaran rupiah (on-bill).";
          features = [
            `Limit Tahunan: ${formatRupiah(insHealthAnnualLimit)} (Sesuai Tagihan / On-Bill)`,
            `Tipe Kamar: ${insHealthRoomPlan === "1_bed_vip" ? "1 Tempat Tidur VIP" : insHealthRoomPlan === "1_bed_standard" ? "1 Tempat Tidur Standar (Kelas 1)" : "2 Tempat Tidur"}`,
            `Sistem Pembayaran: Cashless dengan Kartu / Digital App`,
            `Cakupan Wilayah: Seluruh Rumah Sakit Indonesia & Malaysia`,
          ];
        }
        providerList = ["Allianz Flexi Medical", "Prudential PRUPrime", "Cigna Proteksi Sehat", "Mandiri InHealth"];
        break;
      }
      case "penyakit_kritis": {
        coverageDisplay = insCriticalUP;
        let rate = 0.0028;
        if (insAge > 40) rate += 0.0015;
        if (insIsSmoker) rate *= 1.35;
        annualPremium = Math.round(insCriticalUP * rate * (insFamilyScope === "family" && isMarried ? 1.75 : 1.0));
        monthlyPremium = Math.round(annualPremium / 12);
        description = isMarried
          ? `Santunan tunai lumpsum untuk melindungi kelangsungan ekonomi keluarga jika suami atau istri terdiagnosa penyakit kritis (kanker, stroke, jantung), sehingga biaya hidup keluarga tidak terganggu selama proses pemulihan.`
          : "Santunan tunai lumpsum saat terdiagnosa penyakit kritis (kanker, stroke, serangan jantung, gagal ginjal) untuk menopang biaya hidup dan masa pemulihan.";
        features = [
          `Santunan Tunai Cair: ${formatRupiah(insCriticalUP)}`,
          `Melindungi hingga 50-100 Kondisi Kritis Tahap Awal sampai Akhir`,
          `Dana Lumpsum Bebas Digunakan untuk Biaya Hidup & Sekolah Anak`,
          `Survival Benefit & Second Medical Opinion Internasional`,
        ];
        providerList = ["Manulife Critical Care", "Allianz Critical Illness", "Prudential PRUCritical", "Sequis Q-Critical"];
        break;
      }
      case "properti": {
        coverageDisplay = insPropertyValue;
        let rate = 0.0012;
        if (insPropertyEarthquake) rate += 0.0008;
        annualPremium = Math.round(insPropertyValue * rate);
        monthlyPremium = Math.round(annualPremium / 12);
        description = "Melindungi aset bangunan rumah tinggal keluarga Anda dari risiko kebakaran, petir, ledakan, kerusuhan, dan gempa bumi / tsunami.";
        features = [
          `Nilai Pertanggungan Bangunan: ${formatRupiah(insPropertyValue)}`,
          `Cakupan: Kebakaran, Petir, Ledakan, Asap, Kejatuhan Pesawat (FLEXAS)`,
          insPropertyEarthquake ? "Termasuk Perluasan Gempa Bumi & Letusan Gunung Berapi" : "Tanpa Perluasan Gempa",
          "Klaim Biaya Pembersihan Puing & Tempat Tinggal Sementara Keluarga",
        ];
        providerList = ["Asuransi Astra Properti", "Jasindo All Risk Properti", "Adira Home Insurance", "Chubb Properti"];
        break;
      }
      case "kendaraan": {
        coverageDisplay = insVehicleValue;
        const rate = insVehicleCoverageType === "all_risk" ? 0.024 : 0.0055;
        annualPremium = Math.round(insVehicleValue * rate);
        monthlyPremium = Math.round(annualPremium / 12);
        description = insVehicleCoverageType === "all_risk"
          ? "Asuransi Comprehensive (All Risk) menanggung segala jenis kerusakan dari lecet kecil, benturan, hingga kehilangan total akibat pencurian."
          : "Asuransi Total Loss Only (TLO) hanya menanggung kerusakan di atas 75% dari nilai pasar atau kehilangan total akibat pencurian.";
        features = [
          `Nilai Pertanggungan: ${formatRupiah(insVehicleValue)}`,
          `Jenis Proteksi: ${insVehicleCoverageType === "all_risk" ? "All Risk (Komprehensif)" : "Total Loss Only (TLO)"}`,
          "Layanan Derek 24 Jam & Bengkel Rekanan Resmi (Authorized)",
          "Tanggung Jawab Hukum Pihak Ketiga (TJH III) s/d Rp 25 Juta",
        ];
        providerList = ["Garda Oto (Astra)", "Autocillin (Zurich)", "Adira Autocillin", "Mandiri AXA General"];
        break;
      }
    }

    if (insPremiumInputMode === "manual") {
      monthlyPremium = insManualMonthlyPremium;
      annualPremium = insManualMonthlyPremium * 12;
    }

    const premiumToIncomeRatio = monthlyIncome > 0 ? (monthlyPremium / monthlyIncome) * 100 : 0;

    // Floating Premium Projections: Compound Annual Growth Formula
    // Premi tahun ke-n = MonthlyPremium * (1 + insMedicalInflation / 100)^n
    const r = insMedicalInflation / 100;
    const factor5 = Math.pow(1 + r, 5);
    const factor10 = Math.pow(1 + r, 10);
    const factor20 = Math.pow(1 + r, 20);

    const currentRatio = premiumToIncomeRatio > 0 ? premiumToIncomeRatio : 2.5;

    const floatingProjections = [
      {
        years: 0,
        ageLabel: `Usia ${insAge} Thn (Sekarang)`,
        monthly: monthlyPremium,
        annual: annualPremium,
        multiplier: "1.0× (Baseline)",
        targetIncomeMaintainRatio: monthlyIncome,
        targetIncomeOjkSafe5: Math.round(monthlyPremium / 0.05),
        targetIncomeOjkMax10: Math.round(monthlyPremium / 0.10),
        ratioIfStagnant: monthlyIncome > 0 ? (monthlyPremium / monthlyIncome) * 100 : 0,
      },
      {
        years: 5,
        ageLabel: `Usia ${insAge + 5} Thn (+5 Thn)`,
        monthly: Math.round(monthlyPremium * factor5),
        annual: Math.round(annualPremium * factor5),
        multiplier: `+${((factor5 - 1) * 100).toFixed(1)}%`,
        targetIncomeMaintainRatio: Math.round((monthlyPremium * factor5) / (currentRatio / 100)),
        targetIncomeOjkSafe5: Math.round((monthlyPremium * factor5) / 0.05),
        targetIncomeOjkMax10: Math.round((monthlyPremium * factor5) / 0.10),
        ratioIfStagnant: monthlyIncome > 0 ? ((monthlyPremium * factor5) / monthlyIncome) * 100 : 0,
      },
      {
        years: 10,
        ageLabel: `Usia ${insAge + 10} Thn (+10 Thn)`,
        monthly: Math.round(monthlyPremium * factor10),
        annual: Math.round(annualPremium * factor10),
        multiplier: `+${((factor10 - 1) * 100).toFixed(1)}%`,
        targetIncomeMaintainRatio: Math.round((monthlyPremium * factor10) / (currentRatio / 100)),
        targetIncomeOjkSafe5: Math.round((monthlyPremium * factor10) / 0.05),
        targetIncomeOjkMax10: Math.round((monthlyPremium * factor10) / 0.10),
        ratioIfStagnant: monthlyIncome > 0 ? ((monthlyPremium * factor10) / monthlyIncome) * 100 : 0,
      },
      {
        years: 20,
        ageLabel: `Usia ${insAge + 20} Thn (+20 Thn)`,
        monthly: Math.round(monthlyPremium * factor20),
        annual: Math.round(annualPremium * factor20),
        multiplier: `+${((factor20 - 1) * 100).toFixed(1)}%`,
        targetIncomeMaintainRatio: Math.round((monthlyPremium * factor20) / (currentRatio / 100)),
        targetIncomeOjkSafe5: Math.round((monthlyPremium * factor20) / 0.05),
        targetIncomeOjkMax10: Math.round((monthlyPremium * factor20) / 0.10),
        ratioIfStagnant: monthlyIncome > 0 ? ((monthlyPremium * factor20) / monthlyIncome) * 100 : 0,
      },
    ];

    return {
      monthlyPremium,
      annualPremium,
      coverageDisplay,
      description,
      features,
      providerList,
      premiumToIncomeRatio,
      floatingProjections,
      familyMemberMultiplier,
    };
  };

  const insuranceResult = calculateInsuranceEstimates();

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. STATE SIMULASI KPR (KREDIT PEMILIKAN RUMAH)
  // ─────────────────────────────────────────────────────────────────────────────
  const [kprHousePrice, setKprHousePrice] = useState<number>(
    goals.housingTarget?.estimatedCost && goals.housingTarget.estimatedCost > 0
      ? goals.housingTarget.estimatedCost
      : 650000000
  );
  const [kprDpPercent, setKprDpPercent] = useState<number>(20);
  const [kprFixedRate, setKprFixedRate] = useState<number>(5.85);
  const [kprFixedYears, setKprFixedYears] = useState<number>(3);
  const [kprFloatingRate, setKprFloatingRate] = useState<number>(10.5);
  const [kprTotalTenorYears, setKprTotalTenorYears] = useState<number>(15);

  const calculateKPR = () => {
    const dpAmount = Math.round((kprHousePrice * kprDpPercent) / 100);
    const loanPrincipal = Math.max(0, kprHousePrice - dpAmount);

    const fixedMonthlyRate = kprFixedRate / 100 / 12;
    const totalMonths = kprTotalTenorYears * 12;
    const fixedInstallment =
      fixedMonthlyRate > 0
        ? Math.round(
            (loanPrincipal * (fixedMonthlyRate * Math.pow(1 + fixedMonthlyRate, totalMonths))) /
              (Math.pow(1 + fixedMonthlyRate, totalMonths) - 1)
          )
        : Math.round(loanPrincipal / totalMonths);

    const floatingMonthlyRate = kprFloatingRate / 100 / 12;
    const remainingMonths = Math.max(12, (kprTotalTenorYears - kprFixedYears) * 12);
    const estRemainingPrincipal = Math.round(loanPrincipal * (1 - (kprFixedYears / kprTotalTenorYears) * 0.45));
    const floatingInstallment =
      floatingMonthlyRate > 0
        ? Math.round(
            (estRemainingPrincipal * (floatingMonthlyRate * Math.pow(1 + floatingMonthlyRate, remainingMonths))) /
              (Math.pow(1 + floatingMonthlyRate, remainingMonths) - 1)
          )
        : Math.round(estRemainingPrincipal / remainingMonths);

    const totalPaidFixed = fixedInstallment * (kprFixedYears * 12);
    const totalPaidFloating = floatingInstallment * remainingMonths;
    const totalPayment = totalPaidFixed + totalPaidFloating;
    const totalInterest = Math.max(0, totalPayment - loanPrincipal);

    const npoptkp = 60000000;
    const taxablePrice = Math.max(0, kprHousePrice - npoptkp);
    const bphtbTax = Math.round(taxablePrice * 0.05);
    const notaryAndAphtFee = Math.round(kprHousePrice * 0.015);
    const provisionBank = Math.round(loanPrincipal * 0.01);
    const adminAppraisalFee = 1500000;
    const lifeFireInsuranceBank = Math.round(loanPrincipal * 0.015);
    const totalClosingCosts = bphtbTax + notaryAndAphtFee + provisionBank + adminAppraisalFee + lifeFireInsuranceBank;
    const totalCashNeededFirst = dpAmount + totalClosingCosts;

    const dsrFixed = monthlyIncome > 0 ? (fixedInstallment / monthlyIncome) * 100 : 0;
    const dsrFloating = monthlyIncome > 0 ? (floatingInstallment / monthlyIncome) * 100 : 0;

    return {
      dpAmount,
      loanPrincipal,
      fixedInstallment,
      floatingInstallment,
      totalPayment,
      totalInterest,
      bphtbTax,
      notaryAndAphtFee,
      provisionBank,
      adminAppraisalFee,
      lifeFireInsuranceBank,
      totalClosingCosts,
      totalCashNeededFirst,
      dsrFixed,
      dsrFloating,
    };
  };

  const kprResult = calculateKPR();

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. STATE SIMULASI KREDIT KENDARAAN (MOBIL / MOTOR)
  // ─────────────────────────────────────────────────────────────────────────────
  const [vehicleCategory, setVehicleCategory] = useState<"mobil_baru" | "mobil_bekas" | "motor">("mobil_baru");
  const [vehicleOtrPrice, setVehicleOtrPrice] = useState<number>(300000000);
  const [vehicleDpPercent, setVehicleDpPercent] = useState<number>(20);
  const [vehicleFlatRate, setVehicleFlatRate] = useState<number>(4.2);
  const [vehicleTenorYears, setVehicleTenorYears] = useState<number>(3);
  const [vehicleInsuranceType, setVehicleInsuranceType] = useState<"all_risk" | "tlo" | "kombinasi">("all_risk");
  const [vehiclePaymentScheme, setVehiclePaymentScheme] = useState<"addb" | "addm">("addm");

  const calculateVehicleCredit = () => {
    const dpAmount = Math.round((vehicleOtrPrice * vehicleDpPercent) / 100);
    const loanPrincipal = Math.max(0, vehicleOtrPrice - dpAmount);

    const totalInterest = Math.round(loanPrincipal * (vehicleFlatRate / 100) * vehicleTenorYears);
    const totalLoanWithInterest = loanPrincipal + totalInterest;
    const totalMonths = vehicleTenorYears * 12;
    const monthlyInstallment = Math.round(totalLoanWithInterest / totalMonths);

    const insuranceRate = vehicleInsuranceType === "all_risk" ? 0.025 : vehicleInsuranceType === "kombinasi" ? 0.018 : 0.007;
    const year1InsuranceCost = Math.round(vehicleOtrPrice * insuranceRate);
    const adminLeasingFee = vehicleCategory === "motor" ? 750000 : 2500000;
    const fidusiaFee = vehicleCategory === "motor" ? 250000 : 750000;

    const totalFirstPayment =
      dpAmount +
      adminLeasingFee +
      fidusiaFee +
      year1InsuranceCost +
      (vehiclePaymentScheme === "addm" ? monthlyInstallment : 0);

    const totalPaidOverTenor = totalFirstPayment + (monthlyInstallment * (vehiclePaymentScheme === "addm" ? totalMonths - 1 : totalMonths));
    const effectiveRateEst = (vehicleFlatRate * 1.85).toFixed(1);

    const vehicleDsr = monthlyIncome > 0 ? (monthlyInstallment / monthlyIncome) * 100 : 0;

    return {
      dpAmount,
      loanPrincipal,
      totalInterest,
      monthlyInstallment,
      year1InsuranceCost,
      adminLeasingFee,
      fidusiaFee,
      totalFirstPayment,
      totalPaidOverTenor,
      effectiveRateEst,
      vehicleDsr,
    };
  };

  const vehicleResult = calculateVehicleCredit();

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Family / Household Context Header Banner if Married */}
      {isMarried && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/40 dark:via-indigo-950/40 dark:to-blue-950/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Konteks Finansial Rumah Tangga (Keluarga)
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                  Status: Menikah
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                👨 Klien ({profile.age || 30} thn) • 👩 Pasangan: {partnerName} ({partnerAge} thn) • 👶 {dependentsCount} Tanggungan Anak
              </p>
            </div>
          </div>

          {/* Planning Scope Toggle */}
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              type="button"
              onClick={() => setPlanningScope("household")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                planningScope === "household"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>👨‍👩‍👧 Gabungan Keluarga ({formatRupiahShort(householdIncome)}/bln)</span>
            </button>
            <button
              type="button"
              onClick={() => setPlanningScope("individual")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                planningScope === "individual"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>👤 Pribadi Saja ({formatRupiahShort(individualIncome)}/bln)</span>
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tabs Selector */}
      <div className="bg-slate-100 dark:bg-slate-850 p-1.5 rounded-2xl flex items-center space-x-2 overflow-x-auto scrollbar-none border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("tabungan")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "tabungan"
              ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <span>1. Simulasi Tabungan & Investasi</span>
        </button>

        <button
          onClick={() => setActiveTab("asuransi")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "asuransi"
              ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Shield className="w-4 h-4 text-purple-500" />
          <span>2. Simulasi Asuransi ({insFamilyScope === "family" && isMarried ? "Paket Keluarga" : "Proteksi"})</span>
        </button>

        <button
          onClick={() => setActiveTab("kpr")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "kpr"
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Home className="w-4 h-4 text-blue-500" />
          <span>3. Simulasi KPR Rumah</span>
        </button>

        <button
          onClick={() => setActiveTab("kendaraan")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "kendaraan"
              ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Car className="w-4 h-4 text-emerald-500" />
          <span>4. Simulasi Kredit Kendaraan</span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 1. TAB SIMULASI TABUNGAN & INVESTASI */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "tabungan" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Controls */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {planningScope === "household" ? "Parameter Tabungan Keluarga" : "Parameter Tabungan Pribadi"}
                </h3>
                <p className="text-xs text-slate-500">Hitung bunga majemuk & nilai riil daya beli</p>
              </div>
            </div>

            <div className="space-y-4">
              <MoneyInput
                label="Modal Awal Investasi / Tabungan (Rp):"
                value={savingsInitial}
                onChange={(val) => setSavingsInitial(val)}
                placeholder="0"
              />

              <MoneyInput
                label="Setoran Menabung Bulanan (Rp/bln):"
                value={savingsMonthly}
                onChange={(val) => setSavingsMonthly(val)}
                placeholder="0"
                hint={`≈ ${monthlyIncome > 0 ? ((savingsMonthly / monthlyIncome) * 100).toFixed(0) : 0}% dari income ${planningScope === "household" ? "keluarga" : "pribadi"}`}
              />

              {/* Preset Instrument Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Pilihan Profil Instrumen:
                </label>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {[
                    { label: "RDPU (4.5%)", rate: 4.5 },
                    { label: "SBN Ritel (6.5%)", rate: 6.5 },
                    { label: "Campuran (9%)", rate: 9 },
                    { label: "Saham IDX30 (12%)", rate: 12 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handlePresetInstrument(p.rate)}
                      className={`p-2 rounded-xl border font-semibold transition cursor-pointer text-center ${
                        savingsReturn === p.rate
                          ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Asumsi Return Investasi (%/thn)</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{savingsReturn}%</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="20"
                  step="0.5"
                  value={savingsReturn}
                  onChange={(e) => setSavingsReturn(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Asumsi Inflasi Tahunan (%/thn)</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{savingsInflation}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.5"
                  value={savingsInflation}
                  onChange={(e) => setSavingsInflation(parseFloat(e.target.value))}
                  className="w-full accent-rose-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Horizon Waktu Simulasi</span>
                  <span className="font-bold text-slate-900 dark:text-white">{savingsYears} Tahun</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={savingsYears}
                  onChange={(e) => setSavingsYears(parseInt(e.target.value))}
                  className="w-full accent-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                Hasil Simulasi Bunga Majemuk ({planningScope === "household" ? "Keluarga" : "Pribadi"})
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Proyeksi Akumulasi Aset dalam {savingsYears} Tahun
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Modal Awal: {formatRupiah(savingsInitial)} • Setoran Bulanan: {formatRupiah(savingsMonthly)}/bln • Return {savingsReturn}%/thn
              </p>
            </div>

            {/* Big Main Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-center space-y-2.5">
              <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                Estimasi Total Nilai Aset Terkumpul:
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-700 dark:text-indigo-300 tracking-tight">
                {formatRupiah(savingsResult.futureValue)}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-300 pt-1">
                <span className="bg-white/80 dark:bg-slate-800 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900">
                  🌱 Modal Disetor: <b>{formatRupiah(savingsResult.totalDeposited)}</b>
                </span>
                <span className="bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 font-bold">
                  🚀 Bunga/Profit: +{formatRupiah(savingsResult.interestEarned)}
                </span>
              </div>
            </div>

            {/* Real Purchasing Power & Passive Income */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/60 space-y-1">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  Nilai Riil (Daya Beli Terkikis Inflasi {savingsInflation}%):
                </span>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatRupiah(savingsResult.realFutureValue)}
                </div>
                <p className="text-[11px] text-slate-500">
                  Daya beli setara harga barang saat ini setelah disesuaikan inflasi tahunan.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/60 space-y-1">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  Potensi Passive Income Bulanan (4% SWR):
                </span>
                <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                  {formatRupiah(savingsResult.passiveIncomeMonthly)} / bulan
                </div>
                <p className="text-[11px] text-slate-500">
                  Tarik 4% per tahun untuk hidup bebas finansial bersama keluarga tanpa mengurangi modal pokok.
                </p>
              </div>
            </div>

            {/* Milestone Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Titik Capaian Portofolio:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[1, 3, 5, 10].map((yr) => {
                  const res = calculateSavingsCompound(yr);
                  return (
                    <div key={yr} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] text-slate-500 font-semibold block">{yr} Tahun</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">
                        {formatRupiahShort(res.futureValue)}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                        +{formatRupiahShort(res.interestEarned)} profit
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 2. TAB SIMULASI ASURANSI (DENGAN PILIHAN KELUARGA & FLOATING) */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "asuransi" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Controls */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Pilihan Produk Asuransi</h3>
                <p className="text-xs text-slate-500">Pilih jenis proteksi & hitung estimasi premi</p>
              </div>
            </div>

            {/* Scope Selection: Family vs Individual for Married */}
            {isMarried && (
              <div className="p-3 rounded-xl bg-purple-50/80 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 space-y-2">
                <label className="block text-xs font-bold text-purple-950 dark:text-purple-200">
                  Cakupan Penerima Manfaat / Tertanggung:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInsFamilyScope("family")}
                    className={`py-2 px-2 rounded-lg border text-xs font-bold transition cursor-pointer text-center ${
                      insFamilyScope === "family"
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    👨‍👩‍👧 Paket Keluarga
                  </button>
                  <button
                    type="button"
                    onClick={() => setInsFamilyScope("individual")}
                    className={`py-2 px-2 rounded-lg border text-xs font-bold transition cursor-pointer text-center ${
                      insFamilyScope === "individual"
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    👤 Klien Saja
                  </button>
                </div>
                <span className="text-[10px] text-purple-900/70 dark:text-purple-300/70 block leading-tight">
                  {insFamilyScope === "family"
                    ? `Melindungi Klien (${insAge} thn), ${partnerName} (${partnerAge} thn), dan ${dependentsCount} anak.`
                    : "Hanya menghitung premi dan proteksi untuk diri sendiri."}
                </span>
              </div>
            )}

            {/* Insurance Type Selector Buttons */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Jenis Asuransi:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: "jiwa_term_life",
                    label: insFamilyScope === "family" && isMarried ? "🛡️ Jiwa Kepala Keluarga (Term Life)" : "🛡️ Jiwa Term Life (Murni)",
                    sub: insFamilyScope === "family" && isMarried ? "Santunan tunai nafkah keluarga jika pencari nafkah wafat" : "Uang pertanggungan kematian",
                  },
                  {
                    id: "kesehatan",
                    label: insFamilyScope === "family" && isMarried ? "🏥 Kesehatan Keluarga (Family Plan)" : "🏥 Kesehatan Swasta (Hospital)",
                    sub: insFamilyScope === "family" && isMarried ? `Proteksi cashless VIP/1-Bed untuk ${2 + dependentsCount} jiwa` : "Kamar VIP/1-Bed cashless on-bill",
                  },
                  { id: "penyakit_kritis", label: "🩺 Penyakit Kritis (Critical Illness)", sub: "Santunan tunai kanker/stroke/jantung" },
                  { id: "properti", label: "🏠 Asuransi Properti / Rumah", sub: "Proteksi kebakaran & gempa bumi" },
                  { id: "kendaraan", label: "🚗 Asuransi Kendaraan (All Risk/TLO)", sub: "Proteksi mobil / motor dari tabrakan & hilang" },
                ].map((ins) => (
                  <button
                    key={ins.id}
                    type="button"
                    onClick={() => setSelectedInsuranceType(ins.id as any)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      selectedInsuranceType === ins.id
                        ? "bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-900 dark:text-purple-200 ring-1 ring-purple-500"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span className="text-xs font-bold block">{ins.label}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">{ins.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Metodologi Penentuan Premi: Auto vs Manual */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Metode Penentuan Premi:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInsPremiumInputMode("auto")}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                    insPremiumInputMode === "auto"
                      ? "bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  🤖 Hitung Otomatis
                </button>
                <button
                  type="button"
                  onClick={() => setInsPremiumInputMode("manual")}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                    insPremiumInputMode === "manual"
                      ? "bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  ✍️ Input Premi Manual
                </button>
              </div>
            </div>

            {insPremiumInputMode === "manual" && (
              <div className="p-3.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2">
                <MoneyInput
                  label="Nominal Premi Anda / Polis Asli (Rp/bulan):"
                  value={insManualMonthlyPremium}
                  onChange={(val) => setInsManualMonthlyPremium(val)}
                  placeholder="0"
                  hint={`Setara ${formatRupiah(insManualMonthlyPremium * 12)} per tahun`}
                />
              </div>
            )}

            {/* Premium Scheme Selector (Fixed vs Floating) */}
            <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-900/60 space-y-2">
              <label className="block text-xs font-bold text-purple-950 dark:text-purple-200">
                Skema Kenaikan Premi:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInsPremiumScheme("fixed")}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition cursor-pointer text-center ${
                    insPremiumScheme === "fixed"
                      ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  🔒 Premi Fixed (Tetap)
                </button>
                <button
                  type="button"
                  onClick={() => setInsPremiumScheme("floating")}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition cursor-pointer text-center ${
                    insPremiumScheme === "floating"
                      ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  📈 Premi Floating (Naik)
                </button>
              </div>
              <p className="text-[10px] text-purple-900/70 dark:text-purple-300/70 leading-relaxed">
                {insPremiumScheme === "fixed"
                  ? "Premi dikunci tetap sama setiap tahun sepanjang masa kontrak (standar Term Life)."
                  : "Premi naik bertahap mengikuti kenaikan usia dan inflasi biaya medis rumah sakit."}
              </p>
            </div>

            {/* Medical Inflation slider if floating */}
            {insPremiumScheme === "floating" && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Asumsi Kenaikan Premi / Inflasi Medis:</span>
                  <span className="font-bold text-purple-600">{insMedicalInflation}% / tahun</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="20"
                  step="1"
                  value={insMedicalInflation}
                  onChange={(e) => setInsMedicalInflation(parseInt(e.target.value))}
                  className="w-full accent-purple-600"
                />
                <div className="grid grid-cols-5 gap-1 text-[10px]">
                  {[5, 8, 10, 12, 15].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setInsMedicalInflation(rate)}
                      className={`py-1 rounded-lg border font-bold transition cursor-pointer text-center ${
                        insMedicalInflation === rate
                          ? "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-400"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Controls based on selected type */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4">
              {selectedInsuranceType === "jiwa_term_life" && (
                <>
                  <MoneyInput
                    label="Uang Pertanggungan (UP) Jiwa (Rp):"
                    value={insTermLifeUP}
                    onChange={(val) => setInsTermLifeUP(val)}
                    placeholder="0"
                    hint={
                      isMarried
                        ? `Rekomendasi CFP Keluarga: 10-12× biaya hidup keluarga (${formatRupiah(monthlyIncome * 12 * 10)})`
                        : `Rekomendasi CFP: 10× income tahunan (${formatRupiah(monthlyIncome * 12 * 10)})`
                    }
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Usia Tertanggung:
                      </label>
                      <input
                        type="number"
                        min="18"
                        max="65"
                        value={insAge || ""}
                        placeholder="30"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setInsAge(e.target.value === "" ? 0 : parseInt(e.target.value, 10) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Tenor Polis:
                      </label>
                      <select
                        value={insTermTenor}
                        onChange={(e) => setInsTermTenor(parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                      >
                        <option value={10}>10 Tahun</option>
                        <option value={15}>15 Tahun</option>
                        <option value={20}>20 Tahun</option>
                        <option value={25}>25 Tahun</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="smokerTerm"
                      checked={insIsSmoker}
                      onChange={(e) => setInsIsSmoker(e.target.checked)}
                      className="rounded text-purple-600 accent-purple-600"
                    />
                    <label htmlFor="smokerTerm" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                      Status Perokok Aktif (Mempengaruhi premi)
                    </label>
                  </div>
                </>
              )}

              {selectedInsuranceType === "kesehatan" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Tipe Kamar Rawat Inap:
                    </label>
                    <select
                      value={insHealthRoomPlan}
                      onChange={(e) => setInsHealthRoomPlan(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                    >
                      <option value="1_bed_vip">1 Tempat Tidur VIP (Paling Nyaman)</option>
                      <option value="1_bed_standard">1 Tempat Tidur Standar / Kelas 1 (Paling Populer)</option>
                      <option value="2_bed">2 Tempat Tidur (Ekonomis)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Limit Tahunan (On-Bill per Orang):
                    </label>
                    <select
                      value={insHealthAnnualLimit}
                      onChange={(e) => setInsHealthAnnualLimit(parseInt(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                    >
                      <option value={500000000}>Rp 500 Juta / Tahun</option>
                      <option value={1000000000}>Rp 1 Miliar / Tahun (Direkomendasikan)</option>
                      <option value={2000000000}>Rp 2 Miliar / Tahun</option>
                      <option value={5000000000}>Rp 5 Miliar / Tahun (Regional Asia)</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="outpatientOpt"
                      checked={insHealthOutpatient}
                      onChange={(e) => setInsHealthOutpatient(e.target.checked)}
                      className="rounded text-purple-600 accent-purple-600"
                    />
                    <label htmlFor="outpatientOpt" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                      Tambah Manfaat Rawat Jalan (Outpatient Rider)
                    </label>
                  </div>
                </>
              )}

              {selectedInsuranceType === "penyakit_kritis" && (
                <>
                  <MoneyInput
                    label="Santunan Tunai Penyakit Kritis (Rp):"
                    value={insCriticalUP}
                    onChange={(val) => setInsCriticalUP(val)}
                    placeholder="0"
                    hint={`Standar CFP: 3 - 5× biaya hidup tahunan (${formatRupiah(monthlyIncome * 12 * 3)})`}
                  />
                </>
              )}

              {selectedInsuranceType === "properti" && (
                <>
                  <MoneyInput
                    label="Nilai Bangunan Rumah (Rp):"
                    value={insPropertyValue}
                    onChange={(val) => setInsPropertyValue(val)}
                    placeholder="0"
                    hint="Catatan: Tanah tidak diasuransikan, hanya nilai fisik bangunan & isi."
                  />

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="earthquakeOpt"
                      checked={insPropertyEarthquake}
                      onChange={(e) => setInsPropertyEarthquake(e.target.checked)}
                      className="rounded text-purple-600 accent-purple-600"
                    />
                    <label htmlFor="earthquakeOpt" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                      Sertakan Risiko Gempa Bumi & Tsunami (Wajib untuk zona rawan)
                    </label>
                  </div>
                </>
              )}

              {selectedInsuranceType === "kendaraan" && (
                <>
                  <MoneyInput
                    label="Nilai Pasar Kendaraan OTR (Rp):"
                    value={insVehicleValue}
                    onChange={(val) => setInsVehicleValue(val)}
                    placeholder="0"
                  />

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Jenis Pertanggungan:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setInsVehicleCoverageType("all_risk")}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                          insVehicleCoverageType === "all_risk"
                            ? "bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-800 dark:text-purple-300"
                            : "border-slate-200 dark:border-slate-700 text-slate-600"
                        }`}
                      >
                        All Risk (Komprehensif)
                      </button>
                      <button
                        type="button"
                        onClick={() => setInsVehicleCoverageType("tlo")}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                          insVehicleCoverageType === "tlo"
                            ? "bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-800 dark:text-purple-300"
                            : "border-slate-200 dark:border-slate-700 text-slate-600"
                        }`}
                      >
                        TLO (Total Loss Only)
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                Hasil Simulasi Proteksi Asuransi {insFamilyScope === "family" && isMarried ? "(Paket Keluarga)" : "(Individu)"}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Estimasi Premi & Manfaat Polis ({insPremiumScheme === "fixed" ? "Skema Fixed" : "Skema Floating"})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {insuranceResult.description}
              </p>
            </div>

            {/* Premium Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-800/70 text-center space-y-1">
                <span className="text-xs font-semibold text-purple-900 dark:text-purple-300">
                  Estimasi Premi {insFamilyScope === "family" && isMarried ? "Seluruh Keluarga" : "Saat Ini"}:
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 dark:text-purple-300">
                  {formatRupiah(insuranceResult.monthlyPremium)} / bln
                </div>
                <span className="text-[11px] text-purple-900/70 dark:text-purple-300/70 block">
                  ({formatRupiah(insuranceResult.annualPremium)} per tahun)
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/70 text-center space-y-1">
                <span className="text-xs font-semibold text-blue-900 dark:text-blue-300">
                  Total Nilai Perlindungan (UP / Limit):
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-300">
                  {formatRupiah(insuranceResult.coverageDisplay)}
                </div>
                <span className="text-[11px] text-blue-900/70 dark:text-blue-300/70 block">
                  {insFamilyScope === "family" && isMarried ? "Limit santunan on-bill per jiwa / uang pertanggungan tunai" : "Nilai santunan maksimum yang dibayarkan polis"}
                </span>
              </div>
            </div>

            {/* Floating Premium Breakdown if Floating is selected */}
            {insPremiumScheme === "floating" && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-purple-200 dark:border-purple-800">
                  <div>
                    <span className="text-xs font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wider block">
                      📈 Proyeksi Kenaikan Premi & Kebutuhan Kenaikan Penghasilan (+{insMedicalInflation}%/thn):
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Target income dihitung agar rasio beban asuransi tetap sehat (tidak menggerus porsi tabungan & investasi keluarga).
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {insuranceResult.floatingProjections.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/95 dark:bg-slate-800/95 border border-purple-100 dark:border-purple-900 space-y-2.5 shadow-xs"
                    >
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{step.ageLabel}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          {step.multiplier}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Estimasi Premi:</span>
                        <span className="text-sm font-extrabold text-purple-700 dark:text-purple-300 block">
                          {formatRupiah(step.monthly)}/bln
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block">
                          🎯 Target Income Ideal:
                        </span>
                        <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 block">
                          {formatRupiah(step.targetIncomeMaintainRatio)}/bln
                        </span>
                        <span className="text-[9px] text-slate-500 block">
                          Min. {formatRupiah(step.targetIncomeOjkMax10)}/bln (OJK 10%)
                        </span>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">Jika Gaji Stagnan:</span>
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                            step.ratioIfStagnant <= 10
                              ? "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-extrabold"
                          }`}
                        >
                          {step.ratioIfStagnant.toFixed(1)}% {step.ratioIfStagnant > 10 ? "⚠️" : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rumus & Panduan Hitung Manual */}
                <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-purple-200 dark:border-purple-900 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-purple-900 dark:text-purple-200 font-bold">
                    <Info className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>📘 Rumus Matematis untuk Hitung Manual Sendiri:</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-slate-700 dark:text-slate-300 pt-1">
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-purple-700 dark:text-purple-400 block mb-1">
                        1. Proyeksi Premi Tahun ke-n:
                      </span>
                      <code className="text-[10px] font-mono bg-purple-50 dark:bg-purple-950 px-1 py-0.5 rounded block text-purple-900 dark:text-purple-200 mb-1">
                        Premi_n = Premi_0 × (1 + r)^n
                      </code>
                      <span className="text-[10px] text-slate-500">
                        Contoh +5 thn: {formatRupiah(insuranceResult.monthlyPremium)} × (1 + {insMedicalInflation/100})^5 = {formatRupiah(insuranceResult.floatingProjections[1].monthly)}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                        2. Kebutuhan Target Income:
                      </span>
                      <code className="text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950 px-1 py-0.5 rounded block text-emerald-900 dark:text-emerald-200 mb-1">
                        Income = Premi_n ÷ Target_Rasio
                      </code>
                      <span className="text-[10px] text-slate-500">
                        Batas OJK 10%: {formatRupiah(insuranceResult.floatingProjections[1].monthly)} ÷ 0,10 = {formatRupiah(insuranceResult.floatingProjections[1].targetIncomeOjkMax10)}/bln
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">
                        3. Laju Kenaikan Gaji Minimum:
                      </span>
                      <code className="text-[10px] font-mono bg-amber-50 dark:bg-amber-950 px-1 py-0.5 rounded block text-amber-900 dark:text-amber-200 mb-1">
                        CAGR Income ≥ +{insMedicalInflation}% / tahun
                      </code>
                      <span className="text-[10px] text-slate-500">
                        Penghasilan keluarga wajib tumbuh minimal seimbang dengan inflasi medis agar porsi investasi tidak tergerus.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Benchmark Rasio OJK */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Rasio Beban Premi terhadap Penghasilan {planningScope === "household" ? "Keluarga" : "Pribadi"}:
                </span>
                <p className="text-[11px] text-slate-500">
                  Standar OJK & CFP: Total premi asuransi idealnya berkisar <b>3% – 10%</b> dari income bulanan.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-lg font-extrabold text-purple-600 dark:text-purple-400 block">
                  {insuranceResult.premiumToIncomeRatio.toFixed(1)}%
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  insuranceResult.premiumToIncomeRatio <= 10
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                }`}>
                  {insuranceResult.premiumToIncomeRatio <= 10 ? "Sangat Sehat" : "Cukup Tinggi"}
                </span>
              </div>
            </div>

            {/* Checklist Manfaat */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Fitur & Manfaat yang Didapatkan:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {insuranceResult.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Provider Suggestions */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 block mb-2">
                Rekomendasi Perusahaan Asuransi Terdaftar & Diawasi OJK:
              </span>
              <div className="flex flex-wrap gap-2">
                {insuranceResult.providerList.map((prov, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900"
                  >
                    🏢 {prov}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 3. TAB SIMULASI KPR RUMAH */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "kpr" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Controls */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {planningScope === "household" ? "Parameter KPR Rumah Keluarga" : "Parameter KPR Rumah"}
                </h3>
                <p className="text-xs text-slate-500">Simulasi cicilan fixed, floating & biaya akad</p>
              </div>
            </div>

            <div className="space-y-4">
              <MoneyInput
                label="Harga Properti / Rumah (Rp):"
                value={kprHousePrice}
                onChange={(val) => setKprHousePrice(val)}
                placeholder="0"
              />

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Uang Muka (DP %):</span>
                  <span className="font-bold text-blue-600">{kprDpPercent}% ({formatRupiahShort(kprResult.dpAmount)})</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={kprDpPercent}
                  onChange={(e) => setKprDpPercent(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Bunga Fixed (%/thn):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={kprFixedRate || ""}
                    placeholder="0"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setKprFixedRate(e.target.value === "" ? 0 : parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Masa Fixed:
                  </label>
                  <select
                    value={kprFixedYears}
                    onChange={(e) => setKprFixedYears(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  >
                    <option value={1}>1 Tahun</option>
                    <option value={2}>2 Tahun</option>
                    <option value={3}>3 Tahun</option>
                    <option value={5}>5 Tahun</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Bunga Floating (%/thn):
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={kprFloatingRate || ""}
                    placeholder="0"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setKprFloatingRate(e.target.value === "" ? 0 : parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Total Tenor:
                  </label>
                  <select
                    value={kprTotalTenorYears}
                    onChange={(e) => setKprTotalTenorYears(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  >
                    <option value={5}>5 Tahun</option>
                    <option value={10}>10 Tahun</option>
                    <option value={15}>15 Tahun</option>
                    <option value={20}>20 Tahun</option>
                    <option value={25}>25 Tahun</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                Hasil Simulasi KPR {planningScope === "household" ? "(Joint Income Keluarga)" : ""}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Estimasi Cicilan & Rincian Akad Kredit
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Harga Rumah: {formatRupiah(kprHousePrice)} • DP {kprDpPercent}% ({formatRupiah(kprResult.dpAmount)}) • Plafon KPR: {formatRupiah(kprResult.loanPrincipal)}
              </p>
            </div>

            {/* Installment Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                    Cicilan Periode Fixed ({kprFixedYears} Thn Pertama):
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-bold">
                    {kprFixedRate}%
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-300">
                  {formatRupiah(kprResult.fixedInstallment)} / bln
                </div>
                <span className="text-[11px] text-slate-500 block">
                  DSR Beban Cicilan: <b>{kprResult.dsrFixed.toFixed(1)}%</b> dari income {planningScope === "household" ? "keluarga" : "pribadi"}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-800/70 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                    Cicilan Periode Floating (Tahun {kprFixedYears + 1}+):
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100 font-bold">
                    {kprFloatingRate}%
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                  {formatRupiah(kprResult.floatingInstallment)} / bln
                </div>
                <span className="text-[11px] text-slate-500 block">
                  DSR Periode Floating: <b>{kprResult.dsrFloating.toFixed(1)}%</b> ({kprResult.dsrFloating > 30 ? "⚠️ Waspada" : "✅ Aman"})
                </span>
              </div>
            </div>

            {/* Closing Costs Breakdown (Biaya Akad) */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Estimasi Biaya Tambahan Akad & Notaris:
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Total: {formatRupiah(kprResult.totalClosingCosts)}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Pajak BPHTB (5%):</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatRupiah(kprResult.bphtbTax)}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Notaris & Akta APHT:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatRupiah(kprResult.notaryAndAphtFee)}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Provisi Bank (1%):</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatRupiah(kprResult.provisionBank)}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Asuransi Jiwa & Kebakaran:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatRupiah(kprResult.lifeFireInsuranceBank)}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Appraisal & Admin:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatRupiah(kprResult.adminAppraisalFee)}</span>
                </div>
                <div className="p-2 rounded-lg bg-blue-100/60 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
                  <span className="text-blue-800 dark:text-blue-300 text-[10px] font-bold block">Total Cash Wajib (DP + Akad):</span>
                  <span className="font-extrabold text-blue-900 dark:text-blue-200">{formatRupiah(kprResult.totalCashNeededFirst)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 4. TAB SIMULASI KREDIT KENDARAAN (MOBIL / MOTOR) */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "kendaraan" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Controls */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Parameter Kredit Kendaraan</h3>
                <p className="text-xs text-slate-500">Hitung angsuran, TDP, asuransi & bunga leasing</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Kategori Kendaraan:
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {[
                    { id: "mobil_baru", label: "Mobil Baru", defaultPrice: 300000000, defaultRate: 4.2 },
                    { id: "mobil_bekas", label: "Mobil Bekas", defaultPrice: 180000000, defaultRate: 6.5 },
                    { id: "motor", label: "Sepeda Motor", defaultPrice: 35000000, defaultRate: 8.5 },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setVehicleCategory(cat.id as any);
                        setVehicleOtrPrice(cat.defaultPrice);
                        setVehicleFlatRate(cat.defaultRate);
                      }}
                      className={`py-2 px-1 rounded-xl border text-center font-bold transition cursor-pointer text-[11px] ${
                        vehicleCategory === cat.id
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <MoneyInput
                label="Harga OTR Kendaraan (Rp):"
                value={vehicleOtrPrice}
                onChange={(val) => setVehicleOtrPrice(val)}
                placeholder="0"
              />

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>Uang Muka (DP %):</span>
                  <span className="font-bold text-emerald-600">{vehicleDpPercent}% ({formatRupiahShort(vehicleResult.dpAmount)})</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="5"
                  value={vehicleDpPercent}
                  onChange={(e) => setVehicleDpPercent(parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Suku Bunga Flat (%/thn):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={vehicleFlatRate || ""}
                    placeholder="0"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setVehicleFlatRate(e.target.value === "" ? 0 : parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tenor:
                  </label>
                  <select
                    value={vehicleTenorYears}
                    onChange={(e) => setVehicleTenorYears(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  >
                    <option value={1}>1 Tahun (12 bln)</option>
                    <option value={2}>2 Tahun (24 bln)</option>
                    <option value={3}>3 Tahun (36 bln)</option>
                    <option value={4}>4 Tahun (48 bln)</option>
                    <option value={5}>5 Tahun (60 bln)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Asuransi:
                  </label>
                  <select
                    value={vehicleInsuranceType}
                    onChange={(e) => setVehicleInsuranceType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  >
                    <option value="all_risk">All Risk</option>
                    <option value="kombinasi">Kombinasi</option>
                    <option value="tlo">TLO Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Skema Angsuran:
                  </label>
                  <select
                    value={vehiclePaymentScheme}
                    onChange={(e) => setVehiclePaymentScheme(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  >
                    <option value="addm">ADDM (Di Muka)</option>
                    <option value="addb">ADDB (Di Belakang)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Hasil Simulasi Kredit Kendaraan {planningScope === "household" ? "(Keluarga)" : ""}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Estimasi Angsuran Bulanan & Total DP Pertama (TDP)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Harga OTR: {formatRupiah(vehicleOtrPrice)} • Pokok Hutang: {formatRupiah(vehicleResult.loanPrincipal)} • Bunga Flat {vehicleFlatRate}%/thn (≈ Efektif {vehicleResult.effectiveRateEst}%)
              </p>
            </div>

            {/* Installment and TDP Banners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 space-y-1.5">
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block">
                  Angsuran / Cicilan Bulanan:
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-300">
                  {formatRupiah(vehicleResult.monthlyInstallment)} / bln
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Beban Arus Kas: <b>{vehicleResult.vehicleDsr.toFixed(1)}%</b> dari income {planningScope === "household" ? "keluarga" : "pribadi"}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/70 space-y-1.5">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block">
                  Total Pembayaran Pertama (TDP):
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700 dark:text-indigo-300">
                  {formatRupiah(vehicleResult.totalFirstPayment)}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Uang tunai wajib setor ke leasing/dealer saat serah terima
                </span>
              </div>
            </div>

            {/* TDP Breakdown */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Rincian Komponen TDP (Total Down Payment):
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Skema: {vehiclePaymentScheme.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">DP Murni ({vehicleDpPercent}%):</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatRupiah(vehicleResult.dpAmount)}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Biaya Asuransi Thn 1:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatRupiah(vehicleResult.year1InsuranceCost)}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Biaya Admin & Fidusia:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatRupiah(vehicleResult.adminLeasingFee + vehicleResult.fidusiaFee)}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">
                    {vehiclePaymentScheme === "addm" ? "Angsuran Pertama (ADDM):" : "Angsuran Pertama (ADDB):"}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {vehiclePaymentScheme === "addm" ? formatRupiah(vehicleResult.monthlyInstallment) : "Rp 0 (Bulan Depan)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Cost Comparison */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-bold text-amber-900 dark:text-amber-200 block">
                  💡 Total Pengeluaran Selama {vehicleTenorYears} Tahun:
                </span>
                <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                  Total yang dibayarkan (TDP + seluruh sisa angsuran) = <b>{formatRupiah(vehicleResult.totalPaidOverTenor)}</b>
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] text-amber-800 dark:text-amber-300 block">Total Bunga Leasing:</span>
                <span className="font-extrabold text-amber-900 dark:text-amber-200">+{formatRupiah(vehicleResult.totalInterest)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
