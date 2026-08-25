import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(200).json({ success: true, message: "FinPlan Advisor Chat API is active" });
  }

  try {
    const body = req.body || {};
    const message = body.message || "";
    const userContext = body.userContext || {};
    const profile = userContext.profile || {};
    const cashflow = userContext.cashflow || {};
    const risk = userContext.risk || {};
    const goals = userContext.goals || {};

    const totalIncome =
      (cashflow.monthlyMainIncome || 0) +
      (cashflow.monthlySideIncome || 0) +
      (cashflow.partnerMainIncome || 0) +
      (cashflow.partnerSideIncome || 0);

    const debtsList: any[] = cashflow.debts || [];
    const totalDebtsMonthly = debtsList.reduce((acc: number, d: any) => acc + (d.monthlyPayment || 0), 0);
    const dsr = totalIncome > 0 ? ((totalDebtsMonthly / totalIncome) * 100).toFixed(1) : "0";

    const query = message.toLowerCase();
    let replyText = "";

    if (query.includes("tambah") && (query.includes("utang") || query.includes("cicilan"))) {
      replyText = `💳 **Kriteria Kelayakan Menambah Cicilan Utang Baru (Kaidah OJK & CFP):**\n\n` +
        `1. **Evaluasi DSR Saat Ini (${dsr}%):** Batas maksimal total seluruh cicilan adalah **30% dari total pendapatan** (Maksimal: Rp ${Math.round(totalIncome * 0.3).toLocaleString("id-ID")}/bln).\n` +
        `2. **Plafon Cicilan Tambahan yang Boleh Diambil:** ${
          Number(dsr) < 30
            ? `Anda masih memiliki ruang cicilan aman sebesar **Rp ${Math.max(0, Math.round(totalIncome * 0.3 - totalDebtsMonthly)).toLocaleString("id-ID")}/bulan**.`
            : `⚠️ **TIDAK DISARANKAN MENAMBAH UTANG!** DSR Anda saat ini (${dsr}%) sudah berada di atas 30%. Selesaikan utang berjalan terlebih dahulu.`
        }\n` +
        `3. **Syarat Ketahanan Kas:** Dana darurat minimal 3–6 bulan sudah terisi penuh di RDPU dan arus kas bulanan surplus positif.`;
    } else if (query.includes("utang") || query.includes("cicilan") || query.includes("pinjol") || query.includes("kartu kredit") || query.includes("dsr")) {
      replyText = `Halo **${profile.fullName || "Sobat FinPlan"}**, berdasarkan analisis rasio utang riil Anda (Total Cicilan: Rp ${totalDebtsMonthly.toLocaleString("id-ID")}/bln • DSR: **${dsr}%**):\n\n` +
        `1. **Evaluasi Standar OJK:** ${Number(dsr) <= 30 ? `✅ Cicilan Anda (${dsr}%) berada dalam batas aman OJK (≤ 30%).` : `⚠️ Cicilan Anda (${dsr}%) melebihi batas aman OJK 30%. Maksimal cicilan sehat adalah **Rp ${Math.round(totalIncome * 0.3).toLocaleString("id-ID")}/bln**.`}\n` +
        `2. **Langkah Aksi:** Terapkan metode **Debt Snowball** (lunasi nominal terkecil dahulu) atau **Debt Avalanche** (lunasi bunga tertinggi lebih cepat).`;
    } else if (query.includes("akad") || query.includes("legalitas") || query.includes("bphtb") || query.includes("notaris")) {
      const estPrice = goals.housingTarget?.estimatedPrice || 650000000;
      replyText = `📑 **Rincian Biaya Akad & Legalitas Properti (Rumah Rp ${estPrice.toLocaleString("id-ID")}):**\n\n` +
        `1. **BPHTB (Pajak Pembeli):** ~5% $\\approx$ **Rp ${Math.round((estPrice - 80000000) * 0.05).toLocaleString("id-ID")}**.\n` +
        `2. **Notaris & Balik Nama SHM:** ~1.5% $\\approx$ **Rp ${Math.round(estPrice * 0.015).toLocaleString("id-ID")}**.\n` +
        `3. **Cadangan Ekstra:** Siapkan total cash sebesar **5-7% (~Rp ${Math.round(estPrice * 0.06).toLocaleString("id-ID")})** di luar uang muka DP.`;
    } else if (query.includes("rumah") || query.includes("kpr") || query.includes("dp") || query.includes("properti")) {
      const estPrice = goals.housingTarget?.estimatedPrice || 650000000;
      replyText = `🏠 **Strategi Mempersiapkan Rumah Pertama (Target: Rp ${estPrice.toLocaleString("id-ID")}):**\n\n` +
        `1. **Target DP Murni 20%:** Rp ${Math.round(estPrice * 0.2).toLocaleString("id-ID")}.\n` +
        `2. **Instrumen Simpan DP:** Simpan di Reksadana Pendapatan Tetap (RDPT) atau SBN Ritel agar terlindung dari inflasi.\n` +
        `3. **Batas Cicilan KPR:** Maksimal 25% dari pendapatan (Rp ${Math.round(totalIncome * 0.25).toLocaleString("id-ID")}/bln).`;
    } else if (query.includes("bpjs") || (query.includes("swasta") && (query.includes("asuransi") || query.includes("kesehatan")))) {
      replyText = `🛡️ **Analisis Kebutuhan: BPJS Kesehatan vs Asuransi Swasta:**\n\n` +
        `1. **BPJS Kesehatan (Wajib Pertama):** Meng-cover penyakit tanpa limit tahunan.\n` +
        `2. **Asuransi Rawat Inap Swasta:** Ambil opsi *1 Bed Cashless On-Bill* jika memiliki surplus anggaran.\n` +
        `3. **Rekomendasi CFP:** Jika arus kas masih ketat, utamakan BPJS Kesehatan dan dana darurat terlebih dahulu.`;
    } else if (query.includes("uang pertanggungan") || query.includes("up") || query.includes("jiwa") || (query.includes("premi") && query.includes("asuransi"))) {
      const annualLiving = (totalIncome * 0.6) * 12;
      replyText = `🛡️ **Kebutuhan Asuransi Jiwa & Batas Premi (Kaidah CFP):**\n\n` +
        `1. **Formula UP Ideal:** $10 \\times \\text{Pengeluaran Tahunan} = $ **Rp ${Math.round(annualLiving * 10).toLocaleString("id-ID")}**.\n` +
        `2. **Produk Terbaik:** Pilih **Asuransi Jiwa Murni (Term Life)** tanpa investasi agar premi sangat terjangkau.\n` +
        `3. **Batas Maksimal Premi:** 5% - 10% dari gaji (Rp ${Math.round(totalIncome * 0.1).toLocaleString("id-ID")}/bln).`;
    } else if (query.includes("dca") || query.includes("averaging") || query.includes("autodebet")) {
      replyText = `💡 **Panduan Dollar Cost Averaging (DCA):**\n\n` +
        `1. Setup **Autodebet H+1 Gajian** (tanggal 26).\n` +
        `2. Alokasikan rutin ke Reksadana Indeks IDX30, SBN Ritel (SR/ORI), atau Emas Digital.`;
    } else if (query.includes("pensiun") || query.includes("fire") || query.includes("swr")) {
      const annualLiving = (totalIncome * 0.6) * 12;
      replyText = `🌅 **Aturan 4% SWR (Trinity Study) untuk Pensiun:**\n\n` +
        `1. **Target Modal Pensiun (25x Pengeluaran Tahunan):** ~Rp ${Math.round(annualLiving * 25).toLocaleString("id-ID")}.\n` +
        `2. **Penarikan 4% per Tahun:** Memberikan passive income stabil tanpa menghabiskan modal pokok investasi.`;
    } else {
      replyText = `Halo **${profile.fullName || "Sobat FinPlan"}**! Data finansial Anda (Pemasukan Rp ${totalIncome.toLocaleString("id-ID")}/bln, DSR ${dsr}%, Profil ${risk.profileType || "Moderat"}) siap dipandu oleh asisten CFP.`;
    }

    return res.status(200).json({ success: true, reply: replyText });
  } catch (error) {
    return res.status(200).json({
      success: true,
      reply: "Analisis CFP siap digunakan. Silakan pilih topik simulasi Anda.",
    });
  }
}
