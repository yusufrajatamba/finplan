import { jsPDF } from "jspdf";
import {
  FinancialPlanResult,
  UserProfile,
  CashflowData,
  TargetGoalsData,
  CareerProfile,
  RiskProfileData,
} from "../types";
import {
  generateTailoredGranularBudget,
  generateDynamicBudgetPosts,
} from "./dynamicBudgetPosts";

export interface PDFExportOptions {
  includeSavingsCompoundSim?: boolean;
  includeInsuranceSim?: boolean;
  includeKprSim?: boolean;
  includeVehicleSim?: boolean;
  includeDetailedBudgetTable?: boolean;
  includeAnnualRoadmap?: boolean;
  includeDecisionMatrix?: boolean;
  includeTheoryAppendix?: boolean;
}

interface ExportPlanParams {
  plan: FinancialPlanResult;
  profile: UserProfile;
  cashflow: CashflowData;
  goals: TargetGoalsData;
  career: CareerProfile;
  risk: RiskProfileData;
  options?: PDFExportOptions;
}

// Text sanitizer to prevent jsPDF standard font encoding glitches
function cleanText(str: string | undefined | null): string {
  if (!str) return "";
  return str
    .replace(/[≤]/g, "<=")
    .replace(/[≥]/g, ">=")
    .replace(/[•]/g, "-")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2026]/g, "...")
    .replace(/[^\x20-\x7E\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function generateFinancialPlanPDF({
  plan,
  profile,
  cashflow,
  goals,
  career,
  risk,
  options,
}: ExportPlanParams) {
  const exportOpts: Required<PDFExportOptions> = {
    includeSavingsCompoundSim: options?.includeSavingsCompoundSim ?? true,
    includeInsuranceSim: options?.includeInsuranceSim ?? true,
    includeKprSim: options?.includeKprSim ?? (goals.housingTarget?.hasTarget ?? true),
    includeVehicleSim: options?.includeVehicleSim ?? (goals.vehicleTarget?.hasTarget ?? true),
    includeDetailedBudgetTable: options?.includeDetailedBudgetTable ?? true,
    includeAnnualRoadmap: options?.includeAnnualRoadmap ?? true,
    includeDecisionMatrix: options?.includeDecisionMatrix ?? true,
    includeTheoryAppendix: options?.includeTheoryAppendix ?? true,
  };
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182mm

  // High-Contrast Executive Color Palette
  const cNavyDark = [15, 23, 42]; // Slate 900
  const cCharcoal = [30, 41, 59]; // Slate 800
  const cMuted = [71, 85, 105]; // Slate 600
  const cLightGray = [100, 116, 139]; // Slate 500
  const cBorder = [203, 213, 225]; // Slate 300
  const cCardBg = [255, 255, 255]; // Pure White for crispness
  const cBannerBg = [248, 250, 252]; // Slate 50

  const cEmerald = [5, 150, 105]; // Emerald 600
  const cEmeraldDark = [4, 120, 87]; // Emerald 700
  const cBlue = [37, 99, 235]; // Blue 600
  const cIndigo = [79, 70, 229]; // Indigo 600
  const cPurple = [126, 34, 206]; // Purple 700
  const cRose = [225, 29, 72]; // Rose 600
  const cAmber = [217, 119, 6]; // Amber 600
  const cTeal = [13, 148, 136]; // Teal 600

  // Financial Calculations
  const totalMonthlyIncome = Math.max(
    1,
    (cashflow.monthlyMainIncome || 0) +
      (cashflow.monthlySideIncome || 0) +
      (cashflow.partnerMainIncome || 0) +
      (cashflow.partnerSideIncome || 0) +
      (cashflow.businessPassiveIncome || 0) +
      (cashflow.investmentPassiveIncome || 0)
  );

  const livingCost =
    (cashflow.monthlyNeeds || 0) +
    (cashflow.housingExpense || 0) +
    (cashflow.utilitiesExpense || 0) +
    (cashflow.transportationExpense || 0) +
    (cashflow.familySupportExpense || 0) +
    (cashflow.educationCurrentExpense || 0);

  const totalDebtsMonthly = (cashflow.debts || []).reduce(
    (acc, d) => acc + (d.monthlyPayment || 0),
    0
  );
  const totalDebtsRemaining = (cashflow.debts || []).reduce(
    (acc, d) => acc + (d.totalRemaining || 0),
    0
  );

  const existingInsurance = cashflow.monthlyExistingInsurance || 0;
  const currentWants = cashflow.monthlyWants || 0;
  const totalMonthlyExpenses = livingCost + totalDebtsMonthly + existingInsurance + currentWants;
  const netMonthlySurplus = Math.max(0, totalMonthlyIncome - totalMonthlyExpenses);

  const liquidCash =
    (cashflow.cashEmergencyFund || 0) +
    (cashflow.bankSavings || 0) +
    (cashflow.deposits || 0);
  const investmentAssets =
    (cashflow.stocks || 0) +
    (cashflow.mutualFunds || 0) +
    (cashflow.gold || 0) +
    (cashflow.cryptoAssets || 0);
  const physicalAssets =
    (cashflow.propertyValue || 0) +
    (cashflow.vehicleValue || 0) +
    (cashflow.otherAssets || 0);
  const totalAssets = liquidCash + investmentAssets + physicalAssets;
  const currentNetWorth = totalAssets - totalDebtsRemaining;

  const isMarried = profile.maritalStatus === "Menikah";
  const dependentsCount = profile.dependents || 0;

  // Health Score Color Dynamism
  const isScoreGood = (plan.healthScore ?? 0) >= 80;
  const isScoreMed = (plan.healthScore ?? 0) >= 60 && (plan.healthScore ?? 0) < 80;
  const scoreBadgeColor = isScoreGood ? cEmerald : isScoreMed ? cAmber : cRose;

  // Pagination & Layout Coordinates
  let yPos = 35;
  const maxContentY = pageHeight - 20;

  const drawHeader = (sectionSubtitle: string) => {
    doc.setFillColor(cNavyDark[0], cNavyDark[1], cNavyDark[2]);
    doc.rect(0, 0, pageWidth, 24, "F");

    doc.setFillColor(cEmerald[0], cEmerald[1], cEmerald[2]);
    doc.rect(0, 24, pageWidth, 1.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("LAPORAN PERENCANAAN KEUANGAN PRIBADI & KELUARGA (CFP)", marginX, 11);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text(cleanText(sectionSubtitle), marginX, 18);
  };

  const checkPageBreak = (neededHeight: number, sectionSubtitle: string) => {
    if (yPos + neededHeight > maxContentY) {
      doc.addPage();
      drawHeader(sectionSubtitle);
      yPos = 34;
    }
  };

  const drawSectionHeading = (title: string, subtitle?: string) => {
    checkPageBreak(16, title);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(cNavyDark[0], cNavyDark[1], cNavyDark[2]);
    doc.text(cleanText(title), marginX, yPos);
    yPos += 5.5;

    if (subtitle) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
      const subLines = doc.splitTextToSize(cleanText(subtitle), contentWidth);
      doc.text(subLines, marginX, yPos);
      yPos += subLines.length * 4.2 + 2;
    } else {
      yPos += 1.5;
    }
  };

  const drawCardBox = (
    x: number,
    y: number,
    w: number,
    h: number,
    accentColor: number[],
    bgColor: number[] = cCardBg
  ) => {
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(x, y, w, h, "F");

    doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
    doc.rect(x, y, w, h, "S");

    // Solid accent line on the left (2.5mm)
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(x, y, 2.5, h, "F");
  };

  // ============================================================
  // PAGE 1: PROFIL KLIEN, RINGKASAN ARUS KAS & HEALTH SCORE
  // ============================================================
  drawHeader("BAGIAN 1: PROFIL KLIEN, RINGKASAN ARUS KAS & INDEKS KESEHATAN KEUANGAN");

  // 1. Profil Identitas Banner
  drawCardBox(marginX, yPos, contentWidth, 24, cIndigo, cBannerBg);

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(cNavyDark[0], cNavyDark[1], cNavyDark[2]);
  doc.text(`Klien: ${cleanText(profile.fullName || "Klien")} (${profile.age || 30} Tahun)`, marginX + 5, yPos + 6);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  doc.text(
    cleanText(`Status: ${profile.maritalStatus || "Lajang"} • Tanggungan: ${dependentsCount} Orang • Domisili: ${profile.currentCity || "Kota Domisili"}`),
    marginX + 5,
    yPos + 12
  );
  doc.text(
    cleanText(`Pekerjaan: ${career.personal?.jobType || "Karyawan"} (${career.personal?.companyField || "Umum"}) • Status Hunian: ${profile.housingStatus || "Sewa/Kontrak"}`),
    marginX + 5,
    yPos + 18
  );

  yPos += 30;

  // 2. 4 Kartu Ringkasan Arus Kas Masuk & Keluar
  drawSectionHeading("1. Ringkasan Arus Kas Masuk, Keluar, Surplus & Kekayaan Bersih");

  const cardW = (contentWidth - 9) / 4;
  const cards = [
    {
      title: "TOTAL PEMASUKAN",
      val: `Rp ${totalMonthlyIncome.toLocaleString("id-ID")}`,
      sub: "Per Bulan (Gaji + Usaha)",
      col: cEmerald,
    },
    {
      title: "TOTAL PENGELUARAN",
      val: `Rp ${totalMonthlyExpenses.toLocaleString("id-ID")}`,
      sub: "Living + Utang + Asuransi",
      col: cRose,
    },
    {
      title: "SURPLUS KAS BERSIH",
      val: `Rp ${netMonthlySurplus.toLocaleString("id-ID")}`,
      sub: `${totalMonthlyIncome > 0 ? ((netMonthlySurplus / totalMonthlyIncome) * 100).toFixed(1) : 0}% Kapasitas Nabung`,
      col: cBlue,
    },
    {
      title: "KEKAYAAN BERSIH",
      val: `Rp ${currentNetWorth.toLocaleString("id-ID")}`,
      sub: "Total Aset - Total Utang",
      col: cPurple,
    },
  ];

  cards.forEach((c, idx) => {
    const cX = marginX + idx * (cardW + 3);
    drawCardBox(cX, yPos, cardW, 23, c.col, cCardBg);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(c.col[0], c.col[1], c.col[2]);
    doc.text(cleanText(c.title), cX + 5, yPos + 6);

    doc.setFontSize(9.5);
    doc.setTextColor(cNavyDark[0], cNavyDark[1], cNavyDark[2]);
    doc.text(cleanText(c.val), cX + 5, yPos + 12.5);

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    const cleanSub = c.sub.length > 22 ? c.sub.slice(0, 20) + ".." : c.sub;
    doc.text(cleanText(cleanSub), cX + 5, yPos + 18.5);
  });

  yPos += 29;

  // 3. Executive Summary & Health Index Score (DYNAMIC COLOR DARI SKOR)
  drawSectionHeading("2. Ringkasan Eksekutif Finansial & Financial Health Score");

  const summaryText = cleanText(plan.executiveSummary || "Rencana keuangan Anda telah disusun secara komprehensif sesuai kaidah Certified Financial Planner.");
  const splitSummary = doc.splitTextToSize(summaryText, contentWidth - 48);
  const summaryBoxH = Math.max(42, splitSummary.length * 4.5 + 14);

  drawCardBox(marginX, yPos, contentWidth, summaryBoxH, scoreBadgeColor, cCardBg);

  // Health Score Box with DYNAMIC COLOR (Red if <60, Yellow if 60-79, Green if >=80)
  doc.setFillColor(scoreBadgeColor[0], scoreBadgeColor[1], scoreBadgeColor[2]);
  doc.rect(marginX + 5, yPos + 4, 34, summaryBoxH - 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(`${plan.healthScore}`, marginX + 22, yPos + 17, { align: "center" });
  doc.setFontSize(7.5);
  doc.text("DARI 100 SKOR", marginX + 22, yPos + 24, { align: "center" });
  doc.text(
    plan.healthScore >= 80 ? "SANGAT SEHAT" : plan.healthScore >= 60 ? "CUKUP SEHAT" : "RESTRUKTURISASI",
    marginX + 22,
    yPos + 30,
    { align: "center" }
  );

  // Summary Lines in High-Contrast Dark Slate
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  doc.text(splitSummary, marginX + 44, yPos + 8);

  yPos += summaryBoxH + 6;

  // 4. Strategic Milestones
  drawSectionHeading("3. Tonggak Strategis Finansial Bertahap (Strategic Milestones)");

  (plan.strategicMilestones || []).forEach((m) => {
    const splitMDesc = doc.splitTextToSize(cleanText(m.description), contentWidth - 10);
    const mHeight = splitMDesc.length * 4.2 + 10;

    checkPageBreak(mHeight + 3, "BAGIAN 1: STRATEGIC MILESTONES");

    drawCardBox(marginX, yPos, contentWidth, mHeight, cPurple, cCardBg);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(cPurple[0], cPurple[1], cPurple[2]);
    doc.text(`- [${cleanText(m.timeframe)}] ${cleanText(m.title)}`, marginX + 5, yPos + 5.5);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    doc.text(splitMDesc, marginX + 5, yPos + 10);

    yPos += mHeight + 3;
  });

  // ============================================================
  // PAGE 2: ANALISIS RASIO OJK & ALOKASI ANGGARAN PRESISI
  // ============================================================
  doc.addPage();
  drawHeader("BAGIAN 2: ANALISIS RASIO STANDAR OJK & STRUKTUR ANGGARAN BULANAN");
  yPos = 34;

  drawSectionHeading("4. Analisis Rasio Kesehatan Finansial (Standar OJK & CFP)");

  const ojkRatios = [
    {
      name: "Rasio Tabungan (Savings Ratio)",
      val: `${plan.ojkRatios.savingsRatio.toFixed(1)}%`,
      target: "Target OJK: >= 20%",
      status: plan.ojkRatios.savingsRatio >= 20 ? "SANGAT SEHAT" : plan.ojkRatios.savingsRatio >= 10 ? "CUKUP" : "PERLU DITINGKATKAN",
      desc: "Menunjukkan porsi penghasilan bulanan yang dialokasikan untuk tabungan, investasi dan akumulasi aset masa depan.",
      isGood: plan.ojkRatios.savingsRatio >= 20,
    },
    {
      name: "Rasio Beban Utang (Debt Service Ratio / DSR)",
      val: `${plan.ojkRatios.debtServiceRatio.toFixed(1)}%`,
      target: "Batas Aman: <= 30%",
      status: plan.ojkRatios.debtServiceRatio <= 30 ? "AMAN TERKENDALI" : "WASPADA UTANG TINGGI",
      desc: "Perbandingan seluruh cicilan utang bulanan terhadap total penghasilan agar arus kas tidak defisit.",
      isGood: plan.ojkRatios.debtServiceRatio <= 30,
    },
    {
      name: "Ketahanan Kas Darurat (Emergency Fund)",
      val: `${plan.ojkRatios.emergencyFundMonths.toFixed(1)} Bulan Pengeluaran`,
      target: `Target: ${isMarried ? 9 : 6} Bulan`,
      status: plan.ojkRatios.emergencyFundMonths >= (isMarried ? 9 : 6) ? "TERISI PENUH" : "PERLU DITAMBAH",
      desc: "Bantalan kas likuid di RDPU untuk menopang biaya hidup jika terjadi risiko darurat krisis atau PHK.",
      isGood: plan.ojkRatios.emergencyFundMonths >= (isMarried ? 9 : 6),
    },
    {
      name: "Rasio Solvabilitas (Solvency Ratio)",
      val: `${plan.ojkRatios.solvencyRatio.toFixed(1)}%`,
      target: "Standar Sehat: >= 50%",
      status: plan.ojkRatios.solvencyRatio >= 50 ? "BEBAS KEBANGKRUTAN" : "PERLU PERBAIKAN ASET",
      desc: "Perbandingan kekayaan bersih terhadap total aset keseluruhan untuk mengukur daya tahan neraca keuangan.",
      isGood: plan.ojkRatios.solvencyRatio >= 50,
    },
  ];

  ojkRatios.forEach((r) => {
    const accentCol = r.isGood ? cEmerald : cRose;
    drawCardBox(marginX, yPos, contentWidth, 14.5, accentCol, cCardBg);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(cNavyDark[0], cNavyDark[1], cNavyDark[2]);
    doc.text(cleanText(r.name), marginX + 5, yPos + 5.5);

    doc.setFontSize(8.5);
    doc.setTextColor(accentCol[0], accentCol[1], accentCol[2]);
    doc.text(cleanText(`${r.val} • [${r.status}]`), pageWidth - marginX - 58, yPos + 5.5);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    doc.text(cleanText(`${r.target} | ${r.desc}`), marginX + 5, yPos + 11);

    yPos += 17.5;
  });

  yPos += 3;

  // 5. Rekomendasi Alokasi Anggaran Terperinci (Dinamis Profil)
  drawSectionHeading(
    "5. Struktur Alokasi Anggaran Bulanan Presisi (100% Zero-Based Budgeting)",
    `Total anggaran bulanan diatur presisi Rp ${totalMonthlyIncome.toLocaleString("id-ID")}/bln (100.0%) sesuai profil demografi riil Anda.`
  );

  const dynamicBudgetItems = generateTailoredGranularBudget(profile, cashflow, career, goals, risk, plan);

  dynamicBudgetItems.forEach((b) => {
    checkPageBreak(16, "BAGIAN 2: STRUKTUR ALOKASI ANGGARAN");

    const isDebtItem = b.id === "debt_service";
    const itemAccent = isDebtItem ? (b.pct > 30 ? cRose : cAmber) : cBlue;

    drawCardBox(marginX, yPos, contentWidth, 14.5, itemAccent, cCardBg);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(cNavyDark[0], cNavyDark[1], cNavyDark[2]);
    doc.text(cleanText(b.name), marginX + 5, yPos + 5.5);

    doc.setFontSize(8.5);
    doc.setTextColor(isDebtItem && b.pct > 30 ? cRose[0] : cEmeraldDark[0], isDebtItem && b.pct > 30 ? cRose[1] : cEmeraldDark[1], isDebtItem && b.pct > 30 ? cRose[2] : cEmeraldDark[2]);
    doc.text(cleanText(`Rp ${b.amount.toLocaleString("id-ID")} (${b.pct.toFixed(1)}%)`), pageWidth - marginX - 52, yPos + 5.5);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    const splitBDesc = doc.splitTextToSize(cleanText(b.description), contentWidth - 10);
    doc.text(splitBDesc[0] || cleanText(b.description), marginX + 5, yPos + 11);

    yPos += 17.5;
  });

  // =========================================================================
  // PAGE 3: HASIL LENGKAP MODUL SIMULASI FINANSIAL (CONDITIONAL)
  // =========================================================================
  const hasAnySim =
    exportOpts.includeSavingsCompoundSim ||
    exportOpts.includeInsuranceSim ||
    exportOpts.includeKprSim ||
    exportOpts.includeVehicleSim;

  if (hasAnySim) {
    doc.addPage();
    drawHeader("BAGIAN 3: HASIL MODUL SIMULASI FINANSIAL & KALKULATOR EKSEKUSI");
    yPos = 34;

    drawSectionHeading(
      "6. Hasil Rinci Modul Simulasi Finansial Terpilih",
      "Data simulasi di bawah ini telah dikalkulasi lengkap sesuai pilihan modul simulasi yang Anda aktifkan."
    );

    // A. Simulasi Tabungan & Bunga Majemuk
    if (exportOpts.includeSavingsCompoundSim) {
      const simMonthlySavings = Math.max(1000000, Math.round(totalMonthlyIncome * 0.2));
      const simInitial = totalAssets > 0 ? totalAssets : 10000000;
      const simRate = 0.09;
      const simMonths = 120;
      const mRate = simRate / 12;
      let simFv = simInitial;
      for (let m = 1; m <= simMonths; m++) {
        simFv = (simFv + simMonthlySavings) * (1 + mRate);
      }
      const simDeposited = simInitial + simMonthlySavings * simMonths;
      const simProfit = Math.round(simFv - simDeposited);
      const simPassive = Math.round((simFv * 0.04) / 12);

      drawCardBox(marginX, yPos, contentWidth, 25, cEmerald, cCardBg);

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(cEmeraldDark[0], cEmeraldDark[1], cEmeraldDark[2]);
      doc.text("A. Simulasi Tabungan & Bunga Majemuk (Compound Interest - 10 Tahun)", marginX + 5, yPos + 6);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
      doc.text(cleanText(`- Modal Awal: Rp ${simInitial.toLocaleString("id-ID")} | Setoran Bulanan: Rp ${simMonthlySavings.toLocaleString("id-ID")}/bln | Return: 9% / tahun`), marginX + 5, yPos + 11.5);
      doc.text(cleanText(`- Total Modal Disetor: Rp ${simDeposited.toLocaleString("id-ID")} | Keuntungan Bunga Majemuk: +Rp ${simProfit.toLocaleString("id-ID")}`), marginX + 5, yPos + 16.5);
      doc.setFont("helvetica", "bold");
      doc.text(cleanText(`- Estimasi Nilai Akhir Aset: Rp ${Math.round(simFv).toLocaleString("id-ID")} (Potensi Pasif Income 4% SWR: Rp ${simPassive.toLocaleString("id-ID")}/bulan)`), marginX + 5, yPos + 21.5);

      yPos += 29;
    }

    // B. Simulasi Asuransi & Floating Premi Usia (INFORMATIVE TABLE VIEW)
    if (exportOpts.includeInsuranceSim) {
      checkPageBreak(54, "BAGIAN 3: SIMULASI ASURANSI FLOATING");
      const baseInsMonthly = Math.max(500000, Math.round(totalMonthlyIncome * 0.05));
      const insInflation = 0.08;
      const ins5 = Math.round(baseInsMonthly * Math.pow(1 + insInflation, 5));
      const ins10 = Math.round(baseInsMonthly * Math.pow(1 + insInflation, 10));
      const ins20 = Math.round(baseInsMonthly * Math.pow(1 + insInflation, 20));

      const insBoxH = 50;
      drawCardBox(marginX, yPos, contentWidth, insBoxH, cPurple, cCardBg);

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(cPurple[0], cPurple[1], cPurple[2]);
      doc.text("B. Simulasi Asuransi: Proyeksi Kenaikan Premi Floating & Target Pendapatan", marginX + 5, yPos + 6);

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
      doc.text(
        cleanText(`Premi awal saat ini (Usia ${profile.age || 30}): Rp ${baseInsMonthly.toLocaleString("id-ID")}/bulan • Asumsi inflasi medis: 8%/tahun majemuk`),
        marginX + 5,
        yPos + 11
      );

      // Mini Table Header
      const tableY = yPos + 14;
      doc.setFillColor(cBannerBg[0], cBannerBg[1], cBannerBg[2]);
      doc.rect(marginX + 5, tableY, contentWidth - 10, 6, "F");
      doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
      doc.rect(marginX + 5, tableY, contentWidth - 10, 6, "S");

      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(cNavyDark[0], cNavyDark[1], cNavyDark[2]);
      doc.text("Periode Usia", marginX + 8, tableY + 4.2);
      doc.text("Premi Bulanan", marginX + 42, tableY + 4.2);
      doc.text("Faktor Kenaikan", marginX + 82, tableY + 4.2);
      doc.text("Target Income Ideal", marginX + 118, tableY + 4.2);
      doc.text("Rasio Beban", marginX + 156, tableY + 4.2);

      // Rows
      const insRows = [
        { usia: `Usia ${profile.age || 30} (Sekarang)`, premi: `Rp ${baseInsMonthly.toLocaleString("id-ID")}`, faktor: "Baseline (0%)", income: `Rp ${totalMonthlyIncome.toLocaleString("id-ID")}/bln`, rasio: "5.0%" },
        { usia: `Usia ${(profile.age || 30) + 5} (+5 Thn)`, premi: `Rp ${ins5.toLocaleString("id-ID")}`, faktor: "+47% Majemuk", income: `Rp ${Math.round(ins5 / 0.05).toLocaleString("id-ID")}/bln`, rasio: "5.0%" },
        { usia: `Usia ${(profile.age || 30) + 10} (+10 Thn)`, premi: `Rp ${ins10.toLocaleString("id-ID")}`, faktor: "+116% Majemuk", income: `Rp ${Math.round(ins10 / 0.05).toLocaleString("id-ID")}/bln`, rasio: "5.0%" },
        { usia: `Usia ${(profile.age || 30) + 20} (+20 Thn)`, premi: `Rp ${ins20.toLocaleString("id-ID")}`, faktor: "+366% Majemuk", income: `Rp ${Math.round(ins20 / 0.05).toLocaleString("id-ID")}/bln`, rasio: "5.0%" },
      ];

      insRows.forEach((r, idx) => {
        const rowY = tableY + 6 + idx * 5.5;
        doc.setFillColor(idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252, idx % 2 === 0 ? 255 : 255);
        doc.rect(marginX + 5, rowY, contentWidth - 10, 5.5, "F");
        doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
        doc.rect(marginX + 5, rowY, contentWidth - 10, 5.5, "S");

        doc.setFontSize(6.8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
        doc.text(cleanText(r.usia), marginX + 8, rowY + 3.8);
        doc.setFont("helvetica", "bold");
        doc.text(cleanText(r.premi), marginX + 42, rowY + 3.8);
        doc.setFont("helvetica", "normal");
        doc.text(cleanText(r.faktor), marginX + 82, rowY + 3.8);
        doc.setTextColor(cEmeraldDark[0], cEmeraldDark[1], cEmeraldDark[2]);
        doc.setFont("helvetica", "bold");
        doc.text(cleanText(r.income), marginX + 118, rowY + 3.8);
        doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
        doc.text(cleanText(r.rasio), marginX + 156, rowY + 3.8);
      });

      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
      doc.text("Rumus Matematis: Premi_n = Premi_0 x (1 + r)^n | Target_Income_n = Premi_n / Rasio_Premi (Mencegah beban asuransi menggerus investasi)", marginX + 5, yPos + 46.5);

      yPos += insBoxH + 4;
    }

    // C. Simulasi KPR Rumah
    if (exportOpts.includeKprSim) {
      checkPageBreak(28, "BAGIAN 3: SIMULASI KPR RUMAH");
      const housePrice = goals.housingTarget?.estimatedPrice || 650000000;
      const kprDp = Math.round(housePrice * 0.2);
      const kprLoan = housePrice - kprDp;
      const kprFixedRate = 0.0585 / 12;
      const kprFixedInstallment = Math.round((kprLoan * (kprFixedRate * Math.pow(1 + kprFixedRate, 180))) / (Math.pow(1 + kprFixedRate, 180) - 1));
      const closingCost = Math.round(housePrice * 0.06);

      drawCardBox(marginX, yPos, contentWidth, 25, cBlue, cCardBg);

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(cBlue[0], cBlue[1], cBlue[2]);
      doc.text("C. Simulasi Kredit Pemilikan Rumah (KPR 15 Tahun)", marginX + 5, yPos + 6);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
      doc.text(cleanText(`- Harga Properti: Rp ${housePrice.toLocaleString("id-ID")} | Uang Muka (DP 20%): Rp ${kprDp.toLocaleString("id-ID")} | Plafon Pinjaman: Rp ${kprLoan.toLocaleString("id-ID")}`), marginX + 5, yPos + 11.5);
      doc.text(cleanText(`- Estimasi Angsuran Fixed (5.85% thn 1-3): Rp ${kprFixedInstallment.toLocaleString("id-ID")}/bln (DSR: ${totalMonthlyIncome > 0 ? ((kprFixedInstallment/totalMonthlyIncome)*100).toFixed(1) : 0}% dari gaji)`), marginX + 5, yPos + 16.5);
      doc.setFont("helvetica", "bold");
      doc.text(cleanText(`- Estimasi Biaya Legalitas & Akad (BPHTB, Notaris, Asuransi 6%): Rp ${closingCost.toLocaleString("id-ID")} | Total Cash Wajib: Rp ${(kprDp + closingCost).toLocaleString("id-ID")}`), marginX + 5, yPos + 21.5);

      yPos += 29;
    }

    // D. Simulasi Kredit Kendaraan
    if (exportOpts.includeVehicleSim) {
      checkPageBreak(28, "BAGIAN 3: SIMULASI KREDIT KENDARAAN");
      const otrPrice = goals.vehicleTarget?.estimatedPrice || 300000000;
      const vDp = Math.round(otrPrice * 0.2);
      const vLoan = otrPrice - vDp;
      const vInterest = Math.round(vLoan * 0.042 * 3);
      const vInstallment = Math.round((vLoan + vInterest) / 36);
      const tdp = vDp + 2500000 + 750000 + Math.round(otrPrice * 0.025) + vInstallment;

      drawCardBox(marginX, yPos, contentWidth, 25, cTeal, cCardBg);

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(cTeal[0], cTeal[1], cTeal[2]);
      doc.text("D. Simulasi Kredit Kendaraan Bermotor (KKB 3 Tahun)", marginX + 5, yPos + 6);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
      doc.text(cleanText(`- Harga OTR: Rp ${otrPrice.toLocaleString("id-ID")} | Uang Muka Murni (DP 20%): Rp ${vDp.toLocaleString("id-ID")} | Tenor: 36 Bulan (3 Tahun)`), marginX + 5, yPos + 11.5);
      doc.text(cleanText(`- Angsuran Bulanan (Bunga Flat 4.2%): Rp ${vInstallment.toLocaleString("id-ID")}/bln (DSR: ${totalMonthlyIncome > 0 ? ((vInstallment/totalMonthlyIncome)*100).toFixed(1) : 0}% dari gaji)`), marginX + 5, yPos + 16.5);
      doc.setFont("helvetica", "bold");
      doc.text(cleanText(`- Total Pembayaran Pertama (TDP ADDM + Asuransi All-Risk + Admin + Polis): Rp ${tdp.toLocaleString("id-ID")}`), marginX + 5, yPos + 21.5);

      yPos += 29;
    }
  }

  // =========================================================================
  // PAGE 4: STRUKTUR PEMISAHAN ANGGARAN, ALASAN & JADWAL TIAP POS (CONDITIONAL)
  // =========================================================================
  if (exportOpts.includeDetailedBudgetTable) {
    doc.addPage();
    drawHeader("BAGIAN 4: STRUKTUR PEMISAHAN ANGGARAN, ALASAN & JADWAL EKSEKUSI TIAP POS");
    yPos = 34;

    drawSectionHeading(
      "7. Struktur Pemisahan Anggaran & Alasan Finansial Tiap Pos",
      "Daftar lengkap alokasi pos Wajib, Kondisional, dan Opsional beserta jadwal eksekusi dan kriteria kelayakan finansial."
    );

    const fullDynamicPosts = generateDynamicBudgetPosts(profile, cashflow, career, goals, risk, plan);

    fullDynamicPosts.forEach((pos) => {
      const isWajib = pos.category === "wajib";
      const isKondisional = pos.category === "kondisional" || pos.priorityBadge.includes("Layak");
      const badgeColor = isWajib ? cEmerald : isKondisional ? cAmber : cPurple;

      const splitReasons = doc.splitTextToSize(`Alasan CFP: ${cleanText(pos.reasons)}`, contentWidth - 12);

      // Contextual Timing Label (NOT awkward "Kapan Jadi Wajib" for already mandatory items)
      const timingPrefix = isWajib
        ? "Jadwal & Status Eksekusi: "
        : isKondisional
        ? "Syarat Kelayakan Upgrade: "
        : "Kriteria Fleksibilitas: ";

      const triggerStr = `${timingPrefix}[${cleanText(pos.triggerConditions.targetYearOrMilestone)}] ${cleanText(pos.triggerConditions.financialTrigger)}`;
      const splitTrigger = doc.splitTextToSize(triggerStr, contentWidth - 12);
      const splitStorage = doc.splitTextToSize(`Tempat Simpan Rekomendasi: ${cleanText(pos.storageRecommendation)}`, contentWidth - 12);

      const cardH = 8 + (splitReasons.length + splitTrigger.length + splitStorage.length) * 4 + 4;

      checkPageBreak(cardH + 3, "BAGIAN 4: STRUKTUR POS ANGGARAN LENGKAP");

      drawCardBox(marginX, yPos, contentWidth, cardH, badgeColor, cCardBg);

      // Badge
      doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
      doc.rect(marginX + 5, yPos + 3, 20, 4.5, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      doc.text(isWajib ? "WAJIB" : isKondisional ? "KONDISI" : "OPSIONAL", marginX + 15, yPos + 6.2, { align: "center" });

      // Title
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(cNavyDark[0], cNavyDark[1], cNavyDark[2]);
      doc.text(cleanText(pos.name), marginX + 28, yPos + 6.5);

      // Amount & Porsi
      doc.setFontSize(8);
      doc.setTextColor(badgeColor[0], badgeColor[1], badgeColor[2]);
      doc.text(cleanText(`Rp ${pos.estimatedAmount.toLocaleString("id-ID")}/bln (${pos.recommendedPct})`), pageWidth - marginX - 58, yPos + 6.5);

      // Lines
      let lineY = yPos + 11.5;

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
      doc.text(splitReasons, marginX + 5, lineY);
      lineY += splitReasons.length * 4;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(badgeColor[0], badgeColor[1], badgeColor[2]);
      doc.text(splitTrigger, marginX + 5, lineY);
      lineY += splitTrigger.length * 4;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
      doc.text(splitStorage, marginX + 5, lineY);

      yPos += cardH + 3.5;
    });
  }

  // ============================================================
  // PAGE 5: ROADMAP AKSI TAHUNAN & MATRIKS KEPUTUSAN (CONDITIONAL)
  // ============================================================
  if (exportOpts.includeAnnualRoadmap || exportOpts.includeDecisionMatrix) {
    doc.addPage();
    drawHeader("BAGIAN 5: ROADMAP AKSI PERTAHUN & MATRIKS KEPUTUSAN FINANSIAL");
    yPos = 34;

    if (exportOpts.includeAnnualRoadmap) {
      drawSectionHeading("8. Roadmap Aksi Finansial Bertahap (Tahun 1 s.d. Tahun 15)");

      const annualRoadmapSteps = [
        {
          year: "Tahun 1 (Fondasi Arus Kas, Pelunasan Utang & Dana Darurat Awal)",
          action: "Buka 3 rekening terpisah; aktifkan autodebet investasi H+1 gajian; lunasi 100% utang konsumtif/pinjol; amankan BPJS & asuransi jiwa murni; isi dana darurat 3-6 bulan di RDPU.",
        },
        {
          year: "Tahun 2 (Proteksi Penuh, Sinking Fund & Akumulasi Target Primer)",
          action: "Genapkan dana darurat hingga 100% target; mulai investasi SBN ORI/SR kupon bulanan & RDPT; buka sinking fund DP rumah/mobil; alokasikan 50% kenaikan gaji ke investasi.",
        },
        {
          year: "Tahun 3 (Eksekusi Aset Strategis: Rumah KPR / Kendaraan Berkelanjutan)",
          action: "Eksekusi DP KPR Rumah Pertama (DP min 20% + 7% legalitas siap tunai) atau beli kendaraan dengan rumus 20/4/10; mulai pos dana pendidikan anak tahap 1.",
        },
        {
          year: "Tahun 4-5 (Stabilisasi Cashflow Beban Baru & Pertumbuhan Pasif Income)",
          action: "Stabilisasi cashflow setelah cicilan masuk; rebalancing portofolio tahunan; bangun side income sekunder; review polis proteksi aset keluarga.",
        },
        {
          year: "Tahun 10-15 (Milestone Kemerdekaan Finansial & Persiapan Pensiun Mandiri)",
          action: "Akumulasi aset produktif menghasilkan pasif income rutin; percepat pelunasan KPR; amankan dana pensiun mandiri bersama pasangan (Aturan 4% SWR).",
        },
      ];

      annualRoadmapSteps.forEach((s) => {
        const splitAct = doc.splitTextToSize(cleanText(s.action), contentWidth - 10);
        const boxH = splitAct.length * 4.2 + 10;

        checkPageBreak(boxH + 3, "BAGIAN 5: ROADMAP AKSI PERTAHUN");

        drawCardBox(marginX, yPos, contentWidth, boxH, cPurple, cCardBg);

        doc.setFontSize(8.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(cPurple[0], cPurple[1], cPurple[2]);
        doc.text(`- ${cleanText(s.year)}`, marginX + 5, yPos + 5.5);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
        doc.text(splitAct, marginX + 5, yPos + 10);

        yPos += boxH + 3;
      });

      yPos += 3;
    }

    if (exportOpts.includeDecisionMatrix) {
      drawSectionHeading("9. Kapan Pos Boleh Diambil & Rekomendasi Skema Bayar (Cash vs Cicilan)");

      const decisionMatrixItems = [
        {
          title: "Beli Rumah Pertama (KPR)",
          timing: "Tahun ke-2 s.d. Tahun ke-4",
          skema: "Kredit KPR Terkendali (Tenor 10-15 thn, Fixed Rate 3-5 thn, cicilan maks 25-30% income keluarga).",
          syarat: "DP 20% + Biaya Akad 5-7% siap tunai di rekening; riwayat SLIK OJK Kol 1 Lancar.",
        },
        {
          title: "Beli Kendaraan (Mobil / Motor)",
          timing: "Tahun ke-2 / ke-3 (Dana Darurat 100% Aman)",
          skema: "Rumus 20/4/10 (DP min 20-30%, Tenor maks 4 thn, total cicilan+bensin <10% gaji) ATAU Cash Bekas.",
          syarat: "Dana darurat keluarga tidak tersentuh; DSR total tetap di bawah 20%.",
        },
        {
          title: "Pernikahan / Renovasi Rumah",
          timing: "Tahun ke-1 / ke-2",
          skema: "100% Cash Sinking Fund Tabungan Terencana (Dilarang keras berutang pinjol/KTA untuk konsumtif).",
          syarat: "Biaya hidup bulan pertama pasca pernikahan sudah tersedia di rekening operasional.",
        },
        {
          title: "Liburan Besar / Ibadah Umrah",
          timing: "Tahun ke-2+ (Berkala 1-2 Tahun Sekali)",
          skema: "100% Cash Sinking Fund (Lunas sebelum keberangkatan tanpa cicilan PayLater).",
          syarat: "Pos tabungan investasi rutin bulan berjalan tetap disetor penuh.",
        },
      ];

      decisionMatrixItems.forEach((d) => {
        drawCardBox(marginX, yPos, contentWidth, 18, cBlue, cCardBg);

        doc.setFontSize(8.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(cNavyDark[0], cNavyDark[1], cNavyDark[2]);
        doc.text(`[${cleanText(d.title)}]`, marginX + 5, yPos + 5);

        doc.setFontSize(8);
        doc.setTextColor(cEmeraldDark[0], cEmeraldDark[1], cEmeraldDark[2]);
        doc.text(`Waktu Ideal: ${cleanText(d.timing)}`, pageWidth - marginX - 68, yPos + 5);

        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
        doc.text(cleanText(`- Skema: ${d.skema}`), marginX + 5, yPos + 9.5);
        doc.text(cleanText(`- Syarat CFP: ${d.syarat}`), marginX + 5, yPos + 14);

        yPos += 21;
      });
    }
  }

  // ============================================================
  // PAGE 6: LAMPIRAN TEORI & KAIDAH FUNDAMENTAL (CONDITIONAL)
  // ============================================================
  if (exportOpts.includeTheoryAppendix) {
    doc.addPage();
    drawHeader("BAGIAN 6: LAMPIRAN TEORI-TEORI & KAIDAH FUNDAMENTAL PERENCANA KEUANGAN");
    yPos = 34;

    drawSectionHeading(
      "10. Landasan Teori, Rumus & Prinsip Finansial (Financial Knowledge Base)",
      "Rangkuman kaidah resmi Certified Financial Planner (CFP), OJK, Bank Indonesia, dan para pakar keuangan dunia sebagai bahan pembelajaran jangka panjang Anda."
    );

    const theoriesList = [
      {
        title: "1. Teori Piramida Perencanaan Keuangan (Financial Planning Pyramid)",
        author: "Standar Certified Financial Planner (CFP) & OJK",
        summary: "Perencanaan keuangan wajib dibangun dari bawah ke atas: (1) Pondasi: Arus kas positif & Dana Darurat; (2) Proteksi: Asuransi Jiwa & BPJS Kesehatan; (3) Akumulasi Aset: Investasi SBN/Saham/Reksadana; (4) Distribusi: Warisan & Pensiun.",
        rule: "Kaidah Emas: 'Jangan pernah berinvestasi sebelum fondasi dana darurat & asuransi terpasang kokoh'.",
      },
      {
        title: "2. Teori Bunga Majemuk & The Rule of 72 (Compound Interest)",
        author: "Albert Einstein & Warren Buffett",
        summary: "Bunga majemuk adalah proses di mana keuntungan investasi menghasilkan keuntungan berikutnya secara eksponensial: FV = PV x (1 + r)^n. 'The Rule of 72' menghitung waktu penggandaan aset: Tahun Penggandaan = 72 / Return Tahunan (misal: 72 / 9% = 8 tahun modal berlipat ganda).",
        rule: "Kaidah Emas: 'Waktu dan konsistensi menabung bulanan jauh lebih berharga daripada modal besar di akhir waktu'.",
      },
      {
        title: "3. Kaidah Rasio Beban Utang Maksimal 30% (Debt-to-Income Ratio)",
        author: "Standar OJK & Bank Indonesia",
        summary: "Total seluruh angsuran kewajiban utang bulanan (KPR + KKB + cicilan lain) tidak boleh melebihi 30% dari total penghasilan kotor bulanan. Melebihi 30% meningkatkan risiko gagal bayar (NPL) dan menggerus porsi tabungan darurat.",
        rule: "Kaidah Emas: 'DSR <= 30% menjamin kelayakan kredit perbankan (SLIK OJK Kol-1) dan ketenangan hidup keluarga'.",
      },
      {
        title: "4. Kaidah 4% Safe Withdrawal Rate (The Trinity Study / Gerakan FIRE)",
        author: "Prof. Philip L. Cooley et al. (Trinity University)",
        summary: "Untuk mencapai kemerdekaan finansial (Financial Freedom), Anda membutuhkan portofolio sebesar 25x pengeluaran tahunan. Dengan menarik 4% per tahun (SWR), modal pokok portofolio tidak akan pernah habis tergerus inflasi selama masa pensiun.",
        rule: "Kaidah Emas: 'Target Portofolio Bebas Finansial = Pengeluaran Tahunan x 25 (Pasif Income Bulanan = Portofolio x 4% / 12)'.",
      },
      {
        title: "5. Rumus Proyeksi Kenaikan Premi Asuransi Floating & CAGR Income",
        author: "Aktuaria Asuransi & Inflasi Medis",
        summary: "Premi asuransi kesehatan floating naik majemuk mengikuti kenaikan usia dan inflasi medis: Premi_n = Premi_0 x (1 + r)^n. Agar rasio beban asuransi tidak menggerus investasi, pertumbuhan gaji (CAGR) harus seimbang: Income_n = Premi_n / Target_Rasio.",
        rule: "Kaidah Emas: 'Pastikan kenaikan penghasilan tahunan seimbang atau melebihi laju inflasi biaya rumah sakit (+8-10%/thn)'.",
      },
      {
        title: "6. Sistem Pemisahan Rekening & Zero-Based Budgeting",
        author: "Kaidah Manajemen Arus Kas Modern",
        summary: "Pisahkan keuangan ke dalam 3 rekening berbeda: (1) Rekening Operasional Harian; (2) Rekening Sinking Fund / Dana Darurat (RDPU Likuid); (3) Rekening Investasi & Tabungan Masa Depan. Terapkan autodebet H+1 gajian.",
        rule: "Kaidah Emas: 'Jangan menabung sisa pengeluaran, tetapi belanjakan sisa tabungan yang sudah dipotong di awal gajian'.",
      },
    ];

    theoriesList.forEach((t) => {
      const splitSummary = doc.splitTextToSize(cleanText(t.summary), contentWidth - 10);
      const boxH = splitSummary.length * 4.2 + 18;

      checkPageBreak(boxH + 3, "BAGIAN 6: LAMPIRAN TEORI & KAIDAH PERENCANA KEUANGAN");

      drawCardBox(marginX, yPos, contentWidth, boxH, cPurple, cCardBg);

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(cPurple[0], cPurple[1], cPurple[2]);
      doc.text(cleanText(t.title), marginX + 5, yPos + 5.5);

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(cLightGray[0], cLightGray[1], cLightGray[2]);
      doc.text(cleanText(`Sumber / Penggagas: ${t.author}`), marginX + 5, yPos + 10);

      doc.setFontSize(8);
      doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
      doc.text(splitSummary, marginX + 5, yPos + 15);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(cEmeraldDark[0], cEmeraldDark[1], cEmeraldDark[2]);
      doc.text(cleanText(`- ${t.rule}`), marginX + 5, yPos + boxH - 3.5);

      yPos += boxH + 3;
    });

    // Final Disclaimer Box
    checkPageBreak(16, "BAGIAN 6: DISCLAIMER RESMI CFP");
    drawCardBox(marginX, yPos, contentWidth, 14, cRose, cBannerBg);

    doc.setFontSize(7.5);
    doc.setTextColor(cRose[0], cRose[1], cRose[2]);
    doc.setFont("helvetica", "bold");
    doc.text("CATATAN & DISCLAIMER RESMI CERTIFIED FINANCIAL PLANNER (CFP):", marginX + 5, yPos + 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    doc.text(
      cleanText("Laporan ini diterbitkan sebagai panduan edukasi finansial komprehensif. Pastikan selalu memverifikasi legalitas produk keuangan pada regulator resmi (OJK & Bappebti) sebelum bertransaksi."),
      marginX + 5,
      yPos + 9.5
    );
  }

  // ============================================================
  // FINAL PASS: DRAW FOOTER WITH ACCURATE TOTAL PAGES
  // ============================================================
  const finalTotalPages = doc.getNumberOfPages();
  for (let p = 1; p <= finalTotalPages; p++) {
    doc.setPage(p);

    doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
    doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(cLightGray[0], cLightGray[1], cLightGray[2]);
    doc.text(
      cleanText(`Dokumen Rencana Keuangan Komprehensif • Klien: ${profile.fullName || "Klien"} • Dibuat: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`),
      marginX,
      pageHeight - 7
    );
    doc.text(`Halaman ${p} dari ${finalTotalPages}`, pageWidth - marginX - 32, pageHeight - 7);
  }

  // Save the PDF
  const filename = `Laporan_Master_Rencana_Keuangan_${(profile.fullName || "Klien").replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
}
