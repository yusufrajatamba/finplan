import { generateTailoredGranularBudget } from "./dynamicBudgetPosts";

/**
 * AI Prompt Exporter Utility
 * Memformat seluruh data komprehensif FinPlan (11 Pos Anggaran, 4 Simulasi, Rasio OJK, Arus Kas)
 * menjadi Master Prompt CFP super lengkap untuk ChatGPT, Google Gemini, atau Claude.
 */

export function generateMasterFinancialPrompt(
  profile: any = {},
  cashflow: any = {},
  goals: any = {},
  risk: any = {},
  plan: any = null,
  career: any = {}
): string {
  try {
    const totalIncome = Math.max(
      1,
      (cashflow?.monthlyMainIncome || 0) +
        (cashflow?.monthlySideIncome || 0) +
        (cashflow?.partnerMainIncome || 0) +
        (cashflow?.partnerSideIncome || 0) +
        (cashflow?.businessPassiveIncome || 0) +
        (cashflow?.investmentPassiveIncome || 0)
    );

    const totalLivingExpenses =
      (cashflow?.monthlyNeeds || 0) +
      (cashflow?.housingExpense || 0) +
      (cashflow?.utilitiesExpense || 0) +
      (cashflow?.transportationExpense || 0) +
      (cashflow?.monthlyLivingExpenses || 0);

    const totalDebtsMonthly = (cashflow?.debts || []).reduce(
      (acc: number, d: any) => acc + (d.monthlyPayment || 0),
      0
    );
    const dsr = totalIncome > 0 ? ((totalDebtsMonthly / totalIncome) * 100).toFixed(1) : "0";
    const savingsRatio =
      totalIncome > 0
        ? (((totalIncome - totalLivingExpenses - totalDebtsMonthly) / totalIncome) * 100).toFixed(1)
        : "0";

    // Safe generate 11 Dynamic Budget Posts
    let budgetTableStr = "";
    try {
      const budgetPosts = generateTailoredGranularBudget(
        cashflow || {},
        profile || {},
        career || { personal: {} },
        goals || {},
        risk || { profileType: "Moderat" },
        plan || null
      );
      budgetTableStr = budgetPosts
        .map(
          (p: any, idx: number) =>
            `  ${idx + 1}. [${(p.type || "Wajib").toUpperCase()}] ${p.name}: Rp ${(p.amount || 0).toLocaleString("id-ID")}/bln (${p.pct || 0}%) - Kantong: ${p.accountRecommendation || "BCA/Jago"} (Status: ${p.timing || "Tahun 1"})`
        )
        .join("\n");
    } catch {
      budgetTableStr = "  • Alokasi 100% Zero-Based Budgeting: Living Pokok, Cicilan Utang, Dana Darurat, Asuransi, dan Investasi SBN/Saham.";
    }

    const debtsList = (cashflow?.debts || [])
      .map(
        (d: any, idx: number) =>
          `  ${idx + 1}. ${d.name || "Cicilan"}: Angsuran Rp ${(d.monthlyPayment || 0).toLocaleString("id-ID")}/bln | Sisa Pokok: Rp ${(d.remainingAmount || 0).toLocaleString("id-ID")} | Bunga: ${d.interestRate || 0}%/thn`
      )
      .join("\n");

    const compoundFv10 = Math.round(totalIncome * 0.2 * 12 * 10 * 1.55);
    const estHousePrice = goals?.housingTarget?.estimatedPrice || 650000000;
    const kprAngsuran15 = Math.round(((estHousePrice * 0.8 * 0.08) / 12) * 1.25);
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
  } catch (err) {
    console.error("Error generating master prompt:", err);
    return `Bertindaklah sebagai CFP Financial Planner untuk ${profile?.fullName || "Klien FinPlan"}. Bantu analisis keuangan dan investasi saya.`;
  }
}

function copyTextFallback(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
      return;
    }
  } catch {}

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
  } catch {}
  document.body.removeChild(textArea);
}

export function openInChatGPT(prompt: string) {
  copyTextFallback(prompt);
  const encoded = encodeURIComponent(prompt.slice(0, 3500)); // safe url limit
  window.open(`https://chatgpt.com/?q=${encoded}`, "_blank");
}

export function openInGemini(prompt: string) {
  copyTextFallback(prompt);
  window.open("https://gemini.google.com/app", "_blank");
}

export function openInClaude(prompt: string) {
  copyTextFallback(prompt);
  window.open("https://claude.ai/new", "_blank");
}
