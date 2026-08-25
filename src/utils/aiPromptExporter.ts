import { generateTailoredGranularBudget } from "./dynamicBudgetPosts";

/**
 * AI Prompt Exporter Utility
 * Memformat seluruh data komprehensif FinPlan (11 Pos Anggaran, 4 Simulasi, Rasio OJK, Arus Kas)
 * menjadi Master Prompt CFP super lengkap untuk ChatGPT, Google Gemini, atau Claude.
 */

export function generateMasterFinancialPrompt(
  profile: any,
  cashflow: any,
  goals: any,
  risk: any,
  plan: any
): string {
  const totalIncome =
    (cashflow?.monthlyMainIncome || 0) +
    (cashflow?.monthlySideIncome || 0) +
    (cashflow?.partnerMainIncome || 0) +
    (cashflow?.partnerSideIncome || 0) +
    (cashflow?.businessPassiveIncome || 0) +
    (cashflow?.investmentPassiveIncome || 0);

  const totalLivingExpenses =
    (cashflow?.monthlyHousing || 0) +
    (cashflow?.monthlyFood || 0) +
    (cashflow?.monthlyTransport || 0) +
    (cashflow?.monthlyUtilities || 0) +
    (cashflow?.monthlyLifestyle || 0) +
    (cashflow?.monthlyInsurance || 0) +
    (cashflow?.monthlyOther || 0);

  const totalDebtsMonthly = (cashflow?.debts || []).reduce(
    (acc: number, d: any) => acc + (d.monthlyPayment || 0),
    0
  );
  const dsr = totalIncome > 0 ? ((totalDebtsMonthly / totalIncome) * 100).toFixed(1) : "0";
  const savingsRatio = totalIncome > 0 ? (((totalIncome - totalLivingExpenses - totalDebtsMonthly) / totalIncome) * 100).toFixed(1) : "0";

  // Generate 11 Dynamic Budget Posts
  const budgetPosts = generateTailoredGranularBudget(cashflow, totalIncome, goals, profile);
  const budgetTableStr = budgetPosts
    .map(
      (p: any, idx: number) =>
        `  ${idx + 1}. [${p.type.toUpperCase()}] ${p.name}: Rp ${p.amount.toLocaleString("id-ID")}/bln (${p.pct}%) - Kantong: ${p.accountRecommendation} (Aktif: ${p.timing})`
    )
    .join("\n");

  const debtsList = (cashflow?.debts || [])
    .map(
      (d: any, idx: number) =>
        `  ${idx + 1}. ${d.name || "Cicilan"}: Angsuran Rp ${(d.monthlyPayment || 0).toLocaleString("id-ID")}/bln | Sisa Pokok: Rp ${(d.remainingAmount || 0).toLocaleString("id-ID")} | Bunga: ${d.interestRate || 0}%/thn`
    )
    .join("\n");

  // Proyeksi 4 Simulasi
  const compoundFv10 = Math.round(totalIncome * 0.2 * 12 * 10 * 1.55); // est 9%
  const estHousePrice = goals?.housingTarget?.estimatedPrice || 650000000;
  const kprAngsuran15 = Math.round((estHousePrice * 0.8 * 0.08) / 12 * 1.25);
  const estCarPrice = goals?.vehicleTarget?.estimatedPrice || 250000000;

  return `Bertindaklah sebagai Perencana Keuangan Independen Bersertifikasi CFP (Certified Financial Planner) & Berlisensi OJK di Indonesia.

Berikut adalah SELURUH DATA LENGKAP profil keuangan, arus kas, utang, pos anggaran, dan target saya yang telah dihitung oleh FinPlan App:

══════════════════════════════════════════════════════════════
👤 1. PROFIL & DEMOGRAFI KLIEN
══════════════════════════════════════════════════════════════
- Nama Klien: ${profile?.fullName || "Klien FinPlan"}
- Usia: ${profile?.age || 30} Tahun
- Status Pernikahan: ${profile?.maritalStatus || "Lajang"}
- Jumlah Tanggungan / Anak: ${profile?.dependents || 0} Orang
- Pekerjaan: ${profile?.occupation || "Karyawan"}

══════════════════════════════════════════════════════════════
💰 2. ARUS KAS BULANAN & RASIO KESEHATAN OJK
══════════════════════════════════════════════════════════════
- Total Pemasukan Bulanan: Rp ${totalIncome.toLocaleString("id-ID")}/bulan
- Total Pengeluaran Hidup: Rp ${totalLivingExpenses.toLocaleString("id-ID")}/bulan
- Total Cicilan Utang: Rp ${totalDebtsMonthly.toLocaleString("id-ID")}/bulan
- Rasio Beban Utang (DSR): ${dsr}% (Batas Aman OJK: Maksimal 30%)
- Rasio Tabungan (Savings Ratio): ${savingsRatio}% (Standar Sehat OJK: Minimal 20%)
- Financial Health Score: ${plan?.healthScore?.overall || 50}/100

${debtsList ? `Rincian Utang Riil:\n${debtsList}` : "Rincian Utang: Bersih / Tidak Ada Utang"}

══════════════════════════════════════════════════════════════
🏦 3. NERACA ASET & TABUNGAN
══════════════════════════════════════════════════════════════
- Aset Likuid & Kas/Tabungan: Rp ${(cashflow?.liquidAssets || 0).toLocaleString("id-ID")}
- Aset Investasi (Saham, SBN, RDPU): Rp ${(cashflow?.investmentAssets || 0).toLocaleString("id-ID")}
- Aset Personal (Hunian, Kendaraan): Rp ${(cashflow?.personalAssets || 0).toLocaleString("id-ID")}

══════════════════════════════════════════════════════════════
⚖️ 4. BLUEPRINT 11 POS ANGGARAN DINAMIS (100% ZERO-BASED BUDGETING)
══════════════════════════════════════════════════════════════
${budgetTableStr}

══════════════════════════════════════════════════════════════
🎯 5. TARGET KEUANGAN & HASIL 4 MODUL SIMULASI
══════════════════════════════════════════════════════════════
- Profil Risiko Investasi: ${risk?.profileType || "Moderat"}
- Target Pensiun: Usia ${goals?.retirementAge || 55} Tahun (Target Dana SWR 4%: Rp ${Math.round(totalLivingExpenses * 12 * 25).toLocaleString("id-ID")})
- Target Beli Rumah: ${goals?.housingTarget?.hasTarget ? `Rp ${estHousePrice.toLocaleString("id-ID")} (Estimasi KPR 15 Thn: ~Rp ${kprAngsuran15.toLocaleString("id-ID")}/bln, DP 20%: Rp ${Math.round(estHousePrice * 0.2).toLocaleString("id-ID")})` : "Belum Direncanakan"}
- Target Kendaraan: ${goals?.vehicleTarget?.hasTarget ? `Rp ${estCarPrice.toLocaleString("id-ID")}` : "Belum Direncanakan"}
- Proyeksi Akumulasi Bunga Majemuk 10 Tahun (9% Return): ~Rp ${compoundFv10.toLocaleString("id-ID")}

══════════════════════════════════════════════════════════════
📋 PANDUAN KONSULTASI UNTUK AI
══════════════════════════════════════════════════════════════
1. Sapa saya dengan ramah (${profile?.fullName || "Sobat FinPlan"}).
2. Berikan analisis holistik dan 3 langkah prioritas aksi finansial terpenting yang harus saya lakukan saat ini berdasarkan angka-angka riil di atas.
3. Rujuk instrumen keuangan resmi di Indonesia (RDPU untuk kas darurat, SBN Ritel ORI/SR untuk fixed income, Indeks IDX30 untuk jangka panjang, BPJS Kesehatan).
4. Gunakan gaya bahasa profesional, solutif, empatik, serta format bullet point yang rapi.`;
}

export function openInChatGPT(prompt: string) {
  const encoded = encodeURIComponent(prompt);
  // Copy to clipboard as backup
  if (navigator.clipboard) {
    navigator.clipboard.writeText(prompt);
  }
  window.open(`https://chatgpt.com/?q=${encoded}`, "_blank");
}

export function openInGemini(prompt: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(prompt);
  }
  window.open("https://gemini.google.com/app", "_blank");
}

export function openInClaude(prompt: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(prompt);
  }
  window.open("https://claude.ai/new", "_blank");
}

