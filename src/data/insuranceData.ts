/**
 * Insurance Data for Indonesia
 * Sources: OJK AALI (Asosiasi Asuransi Jiwa Indonesia),
 * AAUI (Asosiasi Asuransi Umum Indonesia), OJK Statistik 2024.
 */

export interface InsuranceProduct {
  id: string;
  type: "jiwa_term_life" | "jiwa_whole_life" | "kesehatan" | "properti" | "kendaraan" | "pendidikan";
  provider: string;
  productName: string;
  minPremiumMonthly: number;
  minCoverage: number;
  maxCoverage: number;
  ojkLicenseNo: string;
  features: string[];
  pros: string[];
  cons: string[];
  website: string;
}

export interface InsuranceEducationItem {
  id: string;
  title: string;
  content: string;
  source: string;
  sourceUrl: string;
  category: "dasar" | "tips" | "regulasi" | "pilihan";
}

export const insuranceTypeLabels: Record<string, string> = {
  jiwa: "Asuransi Jiwa",
  jiwa_term_life: "Asuransi Jiwa Term Life (Murni)",
  jiwa_whole_life: "Asuransi Jiwa Seumur Hidup",
  kesehatan: "Asuransi Kesehatan",
  properti: "Asuransi Properti",
  kendaraan: "Asuransi Kendaraan",
  pendidikan: "Asuransi/Investasi Pendidikan",
};

export const insuranceCalculationGuide = {
  lifeInsurance: {
    title: "Cara Hitung Kebutuhan Asuransi Jiwa",
    formula: "UP Ideal = (10 × Penghasilan Tahunan) + Total Utang",
    example:
      "Penghasilan Rp 10 Jt/bln → Rp 120 Jt/tahun. UP ideal = (10 × Rp 120 Jt) + sisa utang = Rp 1,2 Miliar + utang.",
    sources: [
      { label: "OJK: Panduan Perencanaan Keuangan 2024", url: "https://ojk.go.id/id/kanal/edukasi-dan-perlindungan-konsumen" },
      { label: "AAJI: Pentingnya Asuransi Jiwa", url: "https://aaji.or.id/" },
    ],
  },
  healthInsurance: {
    title: "Cara Memilih Asuransi Kesehatan",
    formula: "Premi ideal = 3-5% dari total penghasilan bulanan",
    example:
      "Penghasilan Rp 10 Jt/bln → alokasi premi kesehatan Rp 300.000 - 500.000/bulan.",
    sources: [
      { label: "BPJS Kesehatan: Panduan Kepesertaan", url: "https://bpjs-kesehatan.go.id" },
      { label: "OJK: Produk Asuransi Kesehatan", url: "https://ojk.go.id/id/kanal/iknb/produk-dan-layanan/asuransi" },
    ],
  },
  propertyInsurance: {
    title: "Asuransi Properti All Risk",
    formula: "Premi ≈ 0.1-0.3% dari nilai properti per tahun",
    example:
      "Properti Rp 500 Juta → premi Rp 500.000 - 1.500.000/tahun (Rp 42.000 - 125.000/bulan).",
    sources: [
      { label: "AAUI: Panduan Asuransi Umum", url: "https://www.aaui.or.id/" },
    ],
  },
};

export const ojkInsuranceRegulations = [
  {
    id: "reg1",
    title: "OJK Wajib BPJS Kesehatan",
    description:
      "Setiap warga negara Indonesia wajib terdaftar dan aktif di BPJS Kesehatan sesuai UU No. 40 Tahun 2004 tentang Sistem Jaminan Sosial Nasional (SJSN). BPJS Kesehatan menjamin layanan kesehatan dasar hingga rawat inap.",
    source: "OJK & Kemenkes RI",
    sourceUrl: "https://bpjs-kesehatan.go.id",
  },
  {
    id: "reg2",
    title: "Batas Premi Asuransi yang Wajar",
    description:
      "OJK dan CFP Indonesia menyarankan total premi asuransi (jiwa + kesehatan + lainnya) tidak melebihi 10-15% dari total penghasilan bulanan agar tidak membebani arus kas. Idealnya dimulai dari 3-5% untuk BPJS + asuransi kesehatan swasta.",
    source: "FPSB Indonesia – Standar CFP",
    sourceUrl: "https://fpsb.org/",
  },
  {
    id: "reg3",
    title: "Unit Link vs Term Life",
    description:
      "OJK mengingatkan konsumen untuk memahami perbedaan Unit Link (kombinasi investasi + proteksi, biaya tinggi) vs Term Life (proteksi murni, premi murah, lebih efisien untuk proteksi jiwa saja). Jika tujuan utama proteksi, pilih Term Life.",
    source: "OJK: POJK No. 69/POJK.05/2016",
    sourceUrl: "https://ojk.go.id",
  },
  {
    id: "reg4",
    title: "Cek Lisensi Asuransi di OJK",
    description:
      "Pastikan perusahaan asuransi terdaftar dan berizin di OJK sebelum membeli polis. Cek di website OJK atau melalui kontak OJK 157 / www.ojk.go.id/id/kanal/iknb.",
    source: "OJK",
    sourceUrl: "https://ojk.go.id/id/kanal/iknb/layanan-konsumen",
  },
];

export const insuranceEducation: InsuranceEducationItem[] = [
  {
    id: "edu1",
    title: "Apa itu Term Life Insurance dan Mengapa Penting?",
    content:
      "Term Life Insurance (Asuransi Jiwa Berjangka) adalah proteksi jiwa murni yang membayar Uang Pertanggungan (UP) kepada ahli waris jika tertanggung meninggal dalam periode polis aktif. Berbeda dengan Unit Link, premi Term Life jauh lebih murah karena 100% dialokasikan untuk proteksi — bukan investasi. Sangat direkomendasikan untuk siapapun yang memiliki tanggungan (pasangan, anak, orang tua).",
    source: "OJK – Edukasi Keuangan & AAJI",
    sourceUrl: "https://aaji.or.id/Halaman/produk-dan-layanan",
    category: "dasar",
  },
  {
    id: "edu2",
    title: "BPJS Kesehatan vs Asuransi Swasta — Kapan Perlu Keduanya?",
    content:
      "BPJS Kesehatan menjamin layanan kesehatan dasar dengan sistem rujukan berjenjang. Kelemahannya: antrian panjang, ruang rawat terbatas, dan prosedur tertentu memerlukan rujukan. Asuransi swasta melengkapi BPJS dengan akses RS premium, kamar kelas 1, dan klaim lebih fleksibel. Kombinasi BPJS + asuransi swasta adalah solusi terbaik.",
    source: "BPJS Kesehatan & OJK",
    sourceUrl: "https://bpjs-kesehatan.go.id",
    category: "pilihan",
  },
  {
    id: "edu3",
    title: "Cara Cerdas Memilih Asuransi: Checklist OJK",
    content:
      "1. Pastikan perusahaan terdaftar OJK. 2. Baca seluruh polis, terutama pengecualian. 3. Pilih manfaat sesuai kebutuhan, bukan karena tawaran. 4. Hitung premi vs manfaat secara realistis. 5. Hindari agen yang menekan keputusan cepat tanpa penjelasan.",
    source: "OJK – Tips Memilih Asuransi",
    sourceUrl: "https://sikapiuangmu.ojk.go.id",
    category: "tips",
  },
  {
    id: "edu4",
    title: "Berapa Besar Uang Pertanggungan (UP) yang Ideal?",
    content:
      "Rumus standar CFP Indonesia: UP Ideal = 10× penghasilan tahunan + total utang + estimasi biaya pendidikan anak. Contoh: Penghasilan Rp 120 Jt/tahun, utang Rp 200 Jt, biaya pendidikan anak Rp 500 Jt → UP ideal Rp 1,9 Miliar. Premi Term Life untuk UP sebesar ini umumnya hanya Rp 300.000 - 500.000/bulan.",
    source: "FPSB Indonesia – Standar CFP 2024",
    sourceUrl: "https://fpsb.org/",
    category: "dasar",
  },
];

export const topInsuranceProviders = [
  { name: "Allianz Life Indonesia", type: ["jiwa_term_life", "kesehatan"], ojkRating: "A+", website: "https://www.allianz.co.id" },
  { name: "Prudential Indonesia", type: ["jiwa_term_life", "kesehatan", "pendidikan"], ojkRating: "A+", website: "https://www.prudential.co.id" },
  { name: "Cigna Indonesia", type: ["kesehatan"], ojkRating: "A", website: "https://www.cigna.co.id" },
  { name: "Asuransi Astra (Garda Oto)", type: ["kendaraan", "properti"], ojkRating: "A+", website: "https://www.astra-life.co.id" },
  { name: "Jasindo", type: ["properti", "kendaraan"], ojkRating: "A", website: "https://www.jasindo.co.id" },
  { name: "Manulife Indonesia", type: ["jiwa_term_life", "pendidikan"], ojkRating: "A+", website: "https://www.manulife.co.id" },
  { name: "BRI Life", type: ["jiwa_term_life", "pendidikan", "kesehatan"], ojkRating: "A", website: "https://www.brilife.co.id" },
  { name: "Zurich Asuransi Indonesia", type: ["jiwa_term_life", "kesehatan"], ojkRating: "A", website: "https://www.zurich.co.id" },
];
