/**
 * AI Prompt Exporter Utility
 * Memformat seluruh knowledge base, rasio OJK, arus kas, dan profil klien
 * menjadi Master Prompt CFP yang siap dibuka/ditempel di akun ChatGPT, Google Gemini, atau Claude milik pengguna sendiri.
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

  const totalDebtsMonthly = (cashflow?.debts || []).reduce(
    (acc: number, d: any) => acc + (d.monthlyPayment || 0),
    0
  );
  const dsr = totalIncome > 0 ? ((totalDebtsMonthly / totalIncome) * 100).toFixed(1) : "0";

  const debtsList = (cashflow?.debts || [])
    .map(
      (d: any, idx: number) =>
        `  ${idx + 1}. ${d.name || "Cicilan"}: Rp ${(d.monthlyPayment || 0).toLocaleString("id-ID")}/bln (Sisa Pokok: Rp ${(d.remainingAmount || 0).toLocaleString("id-ID")})`
    )
    .join("\n");

  return `Bertindaklah sebagai Perencana Keuangan Independen Bersertifikasi CFP (Certified Financial Planner) & Berlisensi OJK di Indonesia.

Berikut adalah seluruh data profil, arus kas, aset, utang, dan target keuangan riil saya:

👤 PROFIL KLIEN:
- Nama Lengkap: ${profile?.fullName || "Klien FinPlan"}
- Usia: ${profile?.age || 30} Tahun
- Status Pernikahan: ${profile?.maritalStatus || "Lajang"}
- Jumlah Tanggungan / Anak: ${profile?.dependents || 0} Orang
- Pekerjaan: ${profile?.occupation || "Karyawan Swasta"}

💰 ARUS KAS BULANAN (CASHFLOW):
- Total Pemasukan Bulanan: Rp ${totalIncome.toLocaleString("id-ID")}/bulan
- Total Cicilan Utang: Rp ${totalDebtsMonthly.toLocaleString("id-ID")}/bulan
- Rasio Beban Utang (DSR): ${dsr}% (Standar Batas Aman OJK: ≤ 30%)
${debtsList ? `Rincian Utang:\n${debtsList}` : "- Utang: Tidak memiliki cicilan aktif"}

🏦 NERACA ASET & TABUNGAN:
- Aset Likuid & Kas: Rp ${(cashflow?.liquidAssets || 0).toLocaleString("id-ID")}
- Aset Investasi: Rp ${(cashflow?.investmentAssets || 0).toLocaleString("id-ID")}
- Aset Properti/Personal: Rp ${(cashflow?.personalAssets || 0).toLocaleString("id-ID")}

🎯 TARGET KEUANGAN & PROFIL RISIKO:
- Profil Risiko Investasi: ${risk?.profileType || "Moderat"} (${risk?.score || 50}/100)
- Target Beli Rumah: ${
    goals?.housingTarget?.hasTarget
      ? `Target Rp ${goals?.housingTarget?.estimatedPrice?.toLocaleString("id-ID")} dalam ${goals?.housingTarget?.targetYears || 3} tahun (DP Terkumpul: Rp ${(goals?.housingTarget?.downPaymentSaved || 0).toLocaleString("id-ID")})`
      : "Belum direncanakan"
  }
- Target Kendaraan: ${
    goals?.vehicleTarget?.hasTarget
      ? `Target Rp ${goals?.vehicleTarget?.estimatedPrice?.toLocaleString("id-ID")} dalam ${goals?.vehicleTarget?.targetYears || 2} tahun`
      : "Belum direncanakan"
  }
- Target Pensiun: Usia ${goals?.retirementAge || 55} Tahun

📊 STATUS KESEHATAN FINANSIAL (CFP & OJK BENCHMARK):
- Financial Health Score: ${plan?.healthScore?.overall || 50}/100
- Metode Anggaran: 100% Zero-Based Budgeting (Kaidah Piramida Keuangan CFP: Fondasi Dana Darurat di RDPU $\\rightarrow$ Proteksi Asuransi UP 10x $\\rightarrow$ Investasi SBN/Saham DCA).

PANDUAN MENJAWAB UNTUK AI:
1. Sapa saya dengan ramah dan panggil nama saya (${profile?.fullName || "Sobat FinPlan"}).
2. Berikan evaluasi objektif terhadap kondisi arus kas dan rasio utang (DSR) saya saat ini.
3. Berikan 3 langkah aksi prioritas terpenting yang harus saya lakukan dalam 1-3 bulan ke depan.
4. Rekomendasikan instrumen keuangan resmi di Indonesia (RDPU, SBN Ritel ORI/SR, RDPT, Saham IDX30, BPJS Kesehatan).
5. Format jawaban dengan bullet point dan penekanan tebal (bold) yang rapi.`;
}

export function openInChatGPT(prompt: string) {
  const encoded = encodeURIComponent(prompt);
  // ChatGPT URL format with pre-filled prompt query
  window.open(`https://chatgpt.com/?q=${encoded}`, "_blank");
}

export function openInGemini(prompt: string) {
  // Copy to clipboard first then open Gemini Web
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
