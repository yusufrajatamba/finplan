/**
 * Financial Theory Data — Synthesis of 10 Global Masters & OJK Indonesia
 * Covers OJK (Indonesia), Bank Indonesia, FPSB/CFP Indonesia,
 * and the 10 Ranked Global Financial Thinkers.
 */

export interface FinancialGuruTheory {
  id: string;
  rank?: number;
  author: string;
  nationality: string;
  role: string;
  title: string;
  quote: string;
  coreRule: string;
  explanation: string;
  keyTakeaways: string[];
  applicabilityIndonesia: string;
  sources: Array<{ label: string; url: string }>;
  bookOrWork?: string;
  yearPublished?: string;
  categoryTag?: "Mindset" | "Sistem" | "Kepatuhan" | "Investasi" | "Proteksi" | "Filosofi Hidup";
}

export interface FinancialUniversitySemester {
  semester: number;
  semesterName: string;
  bookTitle: string;
  author: string;
  category: string;
  focusTopics: string[];
  keyQuestion: string;
  readingAdvice: string;
  sourceUrl?: string;
}

export interface FamilyFinancialRule {
  ruleNumber: number;
  title: string;
  principle: string;
  guruInfluence: string;
  practicalAction: string;
}

export interface FiveLayerHierarchyItem {
  layer: number;
  name: string;
  subtitle: string;
  targetPercentRange: string;
  color: string;
  itemsIncluded: string[];
  ojkGuideline: string;
  guruPhilosophy: string;
}

export interface OJKFinancialStandard {
  category: string;
  ratioName: string;
  healthyBenchmark: string;
  warningBenchmark: string;
  dangerBenchmark: string;
  formula: string;
  whyItMatters: string;
  source: string;
  sourceUrl: string;
}

export interface LocalTheory {
  id: string;
  institution: string;
  country: string;
  title: string;
  description: string;
  keyPoints: string[];
  applicability: string;
  source: string;
  sourceUrl: string;
  year: string;
}

// ─── 10 Ranked Financial Masters (Keluarga & Personal Wealth) ─────────────────

export const financialGurusTheories: FinancialGuruTheory[] = [
  {
    id: "morgan_housel",
    rank: 1,
    author: "Morgan Housel",
    nationality: "Amerika Serikat",
    role: "Partner Collaborative Fund & Penulis 'The Psychology of Money'",
    title: "Psikologi Uang: Wealth ≠ Income, Menemukan 'Enough' & Menghindari Kesalahan Fatal",
    quote:
      "Mengelola uang dengan baik tidak banyak berhubungan dengan seberapa pintar Anda, melainkan bagaimana Anda berperilaku. Menjadi kaya adalah menjaga apa yang tidak terlihat.",
    coreRule: "Perilaku > Rumus Rumit, Konsep 'Enough', dan Wealth Acceleration Index",
    explanation:
      "Housel menekankan bahwa keberhasilan finansial 80% ditentukan oleh psikologi dan pengendalian ego, bukan sekadar formula matematika. Kunci membangun kekayaan bukan semata-mata 'bagaimana gaji saya naik', melainkan 'dari income yang masuk, berapa rupiah yang berhasil dikonversi menjadi aset produktif tanpa tergerus gaya hidup (lifestyle inflation)'.",
    keyTakeaways: [
      "Wealth ≠ Income: Penghasilan tinggi tanpa tabungan hanyalah konsumsi tinggi, bukan kekayaan.",
      "Konsep 'Enough': Sadari titik cukup agar kenaikan income menghasilkan percepatan surplus kas.",
      "Kekuatan Waktu Compounding: Meniru Grace Groner — konsistensi kecil dalam waktu lama mengalahkan spekulasi.",
      "Room for Error: Miliki dana darurat tebal agar tidak terpaksa menjual aset saat pasar jatuh.",
    ],
    applicabilityIndonesia:
      "Mencegah jebakan FOMO gaya hidup media sosial, paylater konsumtif, dan kebiasaan menaikkan gaya hidup secepat kenaikan gaji di kalangan keluarga muda Indonesia.",
    sources: [
      { label: "Collaborative Fund – The Psychology of Money", url: "https://collabfund.com/blog/the-psychology-of-money/" },
      { label: "Getting Wealthy vs. Staying Wealthy", url: "https://collabfund.com/blog/getting-wealthy-vs-staying-wealthy/" },
    ],
    bookOrWork: "The Psychology of Money (2020)",
    yearPublished: "2020",
    categoryTag: "Mindset",
  },
  {
    id: "ramit_sethi",
    rank: 2,
    author: "Ramit Sethi",
    nationality: "Amerika Serikat",
    role: "Penulis 'I Will Teach You to Be Rich' & Pakar Sistem Cash Flow Otomatis",
    title: "Sistem Otomasi Cash Flow & Definisi 'Rich Life' Personal",
    quote:
      "Berhentilah merasa bersalah karena membeli kopi Rp 20.000. Bangun sistem otomatis sehingga uang Anda langsung bekerja untuk hal-hal besar yang benar-benar penting bagi keluarga Anda.",
    coreRule: "Conscious Spending & 5-Layer Financial Hierarchy System",
    explanation:
      "Ramit mengajarkan bahwa budgeting tidak boleh menyiksa keluarga. Daripada memperdebatkan pengeluaran remeh, bangun sistem transfer otomatis (autodebet) pada H+1 gajian. Definisikan 'Rich Life' keluarga Anda: tinggal serumah bersama pasangan, anak terjamin, orang tua terbantu, dan pensiun tanpa cemas.",
    keyTakeaways: [
      "Conscious Spending: Hemat ekstrem pada hal tidak penting, alokasikan berlimpah untuk hal berharga.",
      "Sistem Otomasi: Hubungkan rekening penerima gaji langsung ke tabungan darurat, investasi, dan tagihan.",
      "Hirarki Anggaran 5-Layer: Survival (≤50%) → Protection (5-10%) → Goals (10-15%) → Wealth (20-30%) → Enjoyment (5-10%).",
      "Fokus pada 'Big Wins': Nego gaji, bebas utang berbunga tinggi, dan automasi investasi memberi dampak 1000× lebih besar dari sekadar memangkas kopi.",
    ],
    applicabilityIndonesia:
      "Terapkan dengan autodebet rekening gajian (BCA/Mandiri/BRI) ke RDPU Bibit/Bareksa dan autodebet premi BPJS/asuransi di awal bulan agar tidak ada rupiah yang tercecer.",
    sources: [
      { label: "I Will Teach You to Be Rich (Hachette Book Group)", url: "https://www.iwillteachyoutoberich.com/" },
      { label: "Conscious Spending Plan Guide", url: "https://www.iwillteachyoutoberich.com/conscious-spending-basics/" },
    ],
    bookOrWork: "I Will Teach You to Be Rich (2009/2019)",
    yearPublished: "2019",
    categoryTag: "Sistem",
  },
  {
    id: "ojk_indonesia",
    rank: 3,
    author: "OJK & CFP® Indonesia",
    nationality: "Indonesia",
    role: "Otoritas Jasa Keuangan & Financial Planning Standards Board Indonesia",
    title: "Standar Rasio Kesehatan Keuangan Rumah Tangga Indonesia & Kepatuhan PAYDI",
    quote:
      "Perencanaan keuangan keluarga di Indonesia harus berdiri kokoh di atas kepatuhan rasio resmi: DSR cicilan ≤30-35%, dana darurat likuid 3-6×, dan proteksi risiko terukur.",
    coreRule: "Kerangka Keuangan Sehat OJK: Rasio Likuiditas, DSR, BPJS & Kepatuhan SEOJK 5/2022",
    explanation:
      "OJK menetapkan benchmark kesehatan keuangan rumah tangga di Indonesia: dana darurat 3-6× pengeluaran, rasio utang maksimal 30-35% penghasilan, dan tabungan minimal 10-20%. Untuk asuransi, OJK mewajibkan transparansi penuh pada produk PAYDI (Unit Link) agar nasabah paham pemisahan antara biaya proteksi dan risiko fluktuasi investasi.",
    keyTakeaways: [
      "Plafon DSR (Debt Service Ratio) ≤30-35%: Total cicilan kredit tidak boleh melebihi 35% income.",
      "Fondasi Dana Darurat: Simpan 3-6× pengeluaran rutin di instrumen likuid (RDPU/Tabungan LPS).",
      "Lapisan Proteksi Wajib: BPJS Kesehatan & Ketenagakerjaan aktif sebagai lapisan proteksi pertama.",
      "SEOJK 5/2022 PAYDI: Pahami rincian biaya akuisisi asuransi, biaya pengelolaan, dan nilai tunai.",
    ],
    applicabilityIndonesia:
      "Fondasi hukum dan operasional wajib bagi setiap keluarga di Indonesia. Semua instrumen investasi yang dipilih harus berizin OJK & dijamin LPS.",
    sources: [
      { label: "OJK – Buku 9 Perencanaan Keuangan", url: "https://sikapiuangmu.ojk.go.id" },
      { label: "Regulasi PAYDI – SEOJK 5/SEOJK.05/2022", url: "https://www.ojk.go.id" },
    ],
    bookOrWork: "Buku Saku Literasi & Perencanaan Keuangan OJK",
    yearPublished: "2024",
    categoryTag: "Kepatuhan",
  },
  {
    id: "buffett_munger",
    rank: 4,
    author: "Warren Buffett & Charlie Munger",
    nationality: "Amerika Serikat",
    role: "Chairman & Vice Chairman Berkshire Hathaway",
    title: "Prinsip Compounding, Anti-Leverage & Lingkaran Kompetensi (Circle of Competence)",
    quote:
      "Rule No. 1: Jangan pernah kehilangan uang. Rule No. 2: Jangan pernah lupa Rule No. 1. Tetaplah berada di dalam lingkaran kompetensi Anda dan hindari utang berlebih yang bisa menghentikan permainan.",
    coreRule: "Preserve the Ability to Play the Game & Margin of Safety",
    explanation:
      "Buffett dan Munger bukan guru budgeting harian, melainkan filosofi menjaga keberlangsungan aset. Kunci sukses adalah 'Preserve the ability to stay in the game' — hindari leverage/utang yang memaksa Anda bangkrut saat krisis, jangan berinvestasi pada hal yang tidak dipahami (unit link tanpa tahu biaya, crypto FOMO, trading saham spekulatif), dan pahami: Price is what you pay, value is what you get.",
    keyTakeaways: [
      "Stay Inside Circle of Competence: Jangan beli produk keuangan yang mekanismenya tidak Anda pahami.",
      "Anti-Leverage: Jangan gunakan pinjaman/utang untuk spekulasi atau membebani cash flow keluarga.",
      "Price vs Value: Jangan tertipu premi murah, tetapi teliti nilai pertanggungan dan manfaat riilnya.",
      "Compounding Sabar: Pohon yang rindang hari ini ditanam dari bibit disiplin bertahun-tahun yang lalu.",
    ],
    applicabilityIndonesia:
      "Hindari godaan 'saham gorengan' TikTok, robot trading ilegal, atau mengambil cicilan KPR/mobil yang mencekik arus kas bulanan.",
    sources: [
      { label: "Berkshire Hathaway Shareholder Letters", url: "https://www.berkshirehathaway.com/letters/letters.html" },
      { label: "Poor Charlie's Almanack", url: "https://www.poorcharliesalmanack.com/" },
    ],
    bookOrWork: "Berkshire Hathaway Annual Letters (1977–2024)",
    yearPublished: "2024",
    categoryTag: "Investasi",
  },
  {
    id: "vanguard_bogle",
    rank: 5,
    author: "Vanguard Group & John C. Bogle",
    nationality: "Amerika Serikat",
    role: "Pendiri Vanguard Group & Pelopor Investasi Biaya Rendah",
    title: "4 Pilar Investasi: Goals, Balance, Cost, Discipline & Time Horizon Buckets",
    quote:
      "Jangan mencari jarum di tumpukan jerami — beli saja seluruh tumpukan jeraminya dengan biaya serendah mungkin dan pertahankan disiplin alokasi aset.",
    coreRule: "Vanguard 4 Principles & Pemetaan Portfolio Time Horizon",
    explanation:
      "Vanguard menyederhanakan kesuksesan investasi ke dalam 4 pilar: (1) Goals (tujuan terukur), (2) Balance (diversifikasi alokasi aset), (3) Cost (biaya pengelolaan minimal), (4) Discipline (tetap rutin saat pasar naik maupun turun). Vanguard mengajarkan bahwa bukan saham apa yang Anda pilih, melainkan seberapa tepat instrumen dicocokkan dengan horizon waktu kebutuhan.",
    keyTakeaways: [
      "Bucket < 1 Tahun (Likuid): Tabungan / RDPU / Deposito LPS — dana darurat & operasional.",
      "Bucket 1–3 Tahun (Jangka Pendek): SBN Ritel (ORI/SR) / RDPT — persiapan DP rumah/renovasi.",
      "Bucket 3–7 Tahun (Menengah): Reksadana Campuran / Pendapatan Tetap — dana pendidikan anak SD-SMP.",
      "Bucket > 7–10 Tahun (Panjang): Reksadana Indeks IDX30 / Saham Bluechip — dana pensiun hari tua.",
    ],
    applicabilityIndonesia:
      "Gunakan Reksadana Indeks IDX30/LQ45 dan SBN Ritel Kemenkeu yang berbiaya rendah (TER < 1%), hindari produk dengan fee manajemen tinggi.",
    sources: [
      { label: "Vanguard Principles for Investing Success", url: "https://ownyourfuture.vanguard.com/" },
      { label: "The Little Book of Common Sense Investing", url: "https://www.vanguard.com/" },
    ],
    bookOrWork: "The Little Book of Common Sense Investing (2007)",
    yearPublished: "2007",
    categoryTag: "Investasi",
  },
  {
    id: "jl_collins",
    rank: 6,
    author: "JL Collins",
    nationality: "Amerika Serikat",
    role: "Penulis 'The Simple Path to Wealth' & Pelopor Gerakan FIRE",
    title: "Jalan Sederhana Menuju Kebebasan Finansial & Kekuatan Saving Rate",
    quote:
      "Tingkat tabungan (saving rate) adalah tuas paling dahsyat untuk mencapai kebebasan finansial. Sederhanakan portofolio Anda, hindari utang, dan biarkan waktu bekerja.",
    coreRule: "High Saving Rate, Simplicity, F.U. Money & Rule of 25×",
    explanation:
      "Collins membuktikan bahwa kompleksitas seringkali merusak hasil finansial. Anda tidak perlu 17 rekening atau 40 lembar spreadsheet untuk kaya. Kuncinya sederhana: miliki F.U. Money (dana kebebasan memilih), naikkan saving rate di atas 30%, dan investasikan pada indeks pasar secara konsisten. Target kebebasan finansial tercapai saat aset produktif mencapai 25× pengeluaran tahunan (Aturan Penarikan 4%).",
    keyTakeaways: [
      "Saving Rate is King: Kekayaan = Income × Saving Rate × Waktu × Return.",
      "F.U. Money: Memiliki cadangan aset memberi kebebasan berkata 'tidak' pada situasi kerja yang merugikan keluarga.",
      "Hindari Over-Engineering: Sistem yang sederhana lebih mudah dipatuhi selama 20 tahun daripada sistem rumit.",
      "Rule of 25×: Akumulasi aset investable hingga 25× pengeluaran tahunan sebagai tolok ukur Financial Independence.",
    ],
    applicabilityIndonesia:
      "Di Indonesia, jangan telan mentah-mentah 100% saham AS VTSAX. Gunakan kombinasi SBN Ritel rupiah + Reksadana Indeks IDX30 yang sesuai dengan kebutuhan rupiah keluarga.",
    sources: [
      { label: "JL Collins – The Simple Path to Wealth", url: "https://jlcollinsnh.com/" },
      { label: "Stock Series Part 1: How I Failed My Daughter", url: "https://jlcollinsnh.com/stock-series/" },
    ],
    bookOrWork: "The Simple Path to Wealth (2016)",
    yearPublished: "2016",
    categoryTag: "Sistem",
  },
  {
    id: "benjamin_graham",
    rank: 7,
    author: "Benjamin Graham",
    nationality: "Amerika Serikat",
    role: "Bapak Value Investing, Dosen Warren Buffett di Columbia University",
    title: "Margin of Safety: Bantalan Pengaman Mutlak dalam Keuangan",
    quote:
      "Fungsi margin of safety pada dasarnya adalah membuat prediksi masa depan yang akurat menjadi tidak perlu. Margin ini menyerap ketidakpastian dan kesalahan kalkulasi.",
    coreRule: "Margin of Safety Formula pada Cash Flow & Portofolio",
    explanation:
      "Dalam The Intelligent Investor, Graham merumuskan bahwa inti perlindungan investasi adalah 'Margin of Safety'. Ketika dibawa ke personal finance keluarga: jika pengeluaran rutin Rp 10 Jt dan pemasukan Rp 19,2 Jt, ada bantalan pengaman Rp 9,2 Jt. Margin of safety memastikan jika terjadi PHK, sakit, atau krisis ekonomi, keuangan keluarga tidak langsung hancur.",
    keyTakeaways: [
      "Margin of Safety Cash Flow = (Total Income − Biaya Pokok Survival) ÷ Total Income × 100%.",
      "Jangan Hidup di 'Zero Margin': Income Rp 15 Jt dengan pengeluaran Rp 15 Jt adalah bom waktu.",
      "Buffer Likuiditas: Selalu miliki cadangan kas yang cukup agar tidak terpaksa menjual aset saat pasar terkoreksi.",
      "Disiplin Nilai: Beli instrumen di bawah estimasi nilai intrinsiknya, bukan karena euforia pasar.",
    ],
    applicabilityIndonesia:
      "Keluarga di Indonesia harus menjaga Margin of Safety minimal 30-40% dari total pendapatan untuk mengantisipasi inflasi pangan dan fluktuasi ekonomi.",
    sources: [
      { label: "The Intelligent Investor (Chapter 8 & 20)", url: "https://www.investmenttheory.org" },
      { label: "Security Analysis by Benjamin Graham", url: "https://www.cfainstitute.org/" },
    ],
    bookOrWork: "The Intelligent Investor (1949)",
    yearPublished: "1949",
    categoryTag: "Proteksi",
  },
  {
    id: "stanley_danko",
    rank: 8,
    author: "Thomas J. Stanley & William D. Danko",
    nationality: "Amerika Serikat",
    role: "Peneliti & Penulis Buku Legendaris 'The Millionaire Next Door'",
    title: "The Millionaire Next Door: Income Affluent vs Balance-Sheet Affluent",
    quote:
      "Banyak orang yang penampilannya seperti jutawan sebenarnya tidak memiliki kekayaan, sedangkan jutawan sejati hidup bersahaja di sebelah rumah Anda.",
    coreRule: "Net Worth Formula: (Usia × Income Tahunan) ÷ 10 & Kategori PAW vs UAW",
    explanation:
      "Stanley & Danko meneliti ribuan jutawan dan menemukan perbedaan mencolok antara 'Income Affluent' (penghasilan besar tapi konsumtif, aset kecil) dengan 'Balance-Sheet Affluent' (hidup bersahaja, rajin menabung, aset bersih tinggi). Ukuran keberhasilan finansial bukanlah besarnya slip gaji, melainkan seberapa cepat Kekayaan Bersih (Net Worth) bertumbuh setiap tahun.",
    keyTakeaways: [
      "Rumus Expected Net Worth: Target Kekayaan Bersih Ideal = (Usia × Total Income Tahunan) ÷ 10.",
      "Prodigious Accumulator of Wealth (PAW): Net worth aktual ≥ 2× dari expected net worth.",
      "Under Accumulator of Wealth (UAW): Net worth aktual < 0.5× dari expected net worth (waspada!).",
      "Live Below Your Means: Gaya hidup di bawah kemampuan adalah karakteristik 80%+ jutawan mandiri.",
    ],
    applicabilityIndonesia:
      "Tolak ukur evaluasi tahunan untuk keluarga muda: hitung Net Worth (Total Aset − Total Utang) setiap tanggal 31 Desember dan pantau kenaikan grafiknya.",
    sources: [
      { label: "The Millionaire Next Door Research", url: "https://www.themillionairenextdoor.com/" },
      { label: "The Next Millionaire Next Door (2018)", url: "https://www.amazon.com/Next-Millionaire-Door-Enduring-Strategies/dp/1493035351" },
    ],
    bookOrWork: "The Millionaire Next Door (1996)",
    yearPublished: "1996",
    categoryTag: "Mindset",
  },
  {
    id: "vicki_robin",
    rank: 9,
    author: "Vicki Robin & Joe Dominguez",
    nationality: "Amerika Serikat",
    role: "Aktivis Finansial & Penulis 'Your Money or Your Life'",
    title: "Uang Adalah Energi Hidup: Menghitung Biaya Barang dalam Satuan Jam Kerja",
    quote:
      "Uang bukanlah sekadar angka di rekening — uang adalah waktu dan energi kehidupan yang Anda tukarkan. Berapa jam hidup Anda yang rela Anda bayarkan untuk barang ini?",
    coreRule: "Real Hourly Wage & Life Energy Conversion Formula",
    explanation:
      "Vicki Robin mengajarkan kita melihat uang melalui kacamata 'Life Energy'. Jika Anda berpenghasilan Rp 14,7 Jt/bulan dan menghabiskan 200 jam untuk bekerja, lembur, perjalanan komuter, dan persiapan, maka upah riil Anda adalah Rp 73.500/jam. Ketika membeli barang seharga Rp 735.000, Anda sebenarnya menukar 10 jam umur hidup Anda.",
    keyTakeaways: [
      "Rumus Upah Riil per Jam = Take-Home Pay Bulanan ÷ (Jam Kerja + Komuter + Persiapan).",
      "Biaya Energi Hidup = Harga Barang ÷ Upah Riil per Jam.",
      "Pertanyaan Reflektif: 'Apakah barang/gaya hidup ini sebanding dengan X jam waktu hidup saya bersama keluarga?'",
      "Mencapai Crossover Point: Saat passive income dari aset investasi melampaui biaya hidup bulanan.",
    ],
    applicabilityIndonesia:
      "Sangat ampuh meredam godaan membeli gadget terbaru, motor baru cicilan mahal, atau nongkrong impulsif dengan mengkonversinya langsung ke jam lembur kerja.",
    sources: [
      { label: "Your Money or Your Life Official", url: "https://yourmoneyoryourlife.com/" },
      { label: "The Crossover Point Concept", url: "https://yourmoneyoryourlife.com/book-summary/" },
    ],
    bookOrWork: "Your Money or Your Life (1992/2018)",
    yearPublished: "2018",
    categoryTag: "Filosofi Hidup",
  },
  {
    id: "bill_perkins",
    rank: 10,
    author: "Bill Perkins",
    nationality: "Amerika Serikat",
    role: "Pengusaha Energi, Hedge Fund Manager & Penulis 'Die With Zero'",
    title: "Die With Zero: Maksimalkan Pengalaman Hidup & Manfaatkan 'Time Windows'",
    quote:
      "Jangan menunda seluruh kebahagiaan hidup demi mengejar angka pensiun di usia tua. Uang yang bertumpuk tanpa pernah dinikmati bersama orang tercinta adalah potensi kehidupan yang terbuang sia-sia.",
    coreRule: "Time Windows of Experiences & Memory Dividends",
    explanation:
      "Perkins memberikan perspektif penyeimbang yang elegan: tujuan menabung dan berinvestasi bukan untuk menumpuk uang sebanyak-banyaknya hingga meninggal, melainkan untuk memaksimalkan pengalaman hidup bernilai tinggi pada 'Time Windows' yang tepat. Liburan bersama anak balita, menemani orang tua selagi sehat, atau berpetualang dengan pasangan memiliki batas usia tertentu yang tidak bisa diulang di usia 70 tahun.",
    keyTakeaways: [
      "Time Windows: Pengalaman tertentu bernilai maksimal hanya pada rentang usia tertentu keluarga Anda.",
      "Memory Dividends: Kenangan indah yang dibangun saat muda akan terus menghasilkan dividen kebahagiaan seumur hidup.",
      "Jangan Ekstrem Menunda Hidup: Begitu dana darurat aman dan investasi rutin berjalan, nikmati surplus untuk keluarga tanpa rasa bersalah.",
      "Warisan Cerdas: Berikan bantuan finansial kepada anak dan orang tua saat mereka paling membutuhkan, bukan menunggu Anda wafat.",
    ],
    applicabilityIndonesia:
      "Mengimbangi budaya menabung ekstrem agar kepala keluarga tetap mengalokasikan anggaran membahagiakan istri, mudik bersama orang tua, dan rekreasi anak.",
    sources: [
      { label: "Die With Zero by Bill Perkins", url: "https://www.diewithzerobook.com/" },
      { label: "Bill Perkins Reddit AMA on Money & Experiences", url: "https://www.reddit.com/r/IAmA/comments/i058bd" },
    ],
    bookOrWork: "Die With Zero (2020)",
    yearPublished: "2020",
    categoryTag: "Filosofi Hidup",
  },
];

// ─── Financial University Curriculum (8 Semester Belajar Mandiri) ─────────────

export const financialUniversityCurriculum: FinancialUniversitySemester[] = [
  {
    semester: 1,
    semesterName: "Semester 1 — Money Mindset & Psychology",
    bookTitle: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Mindset",
    focusTopics: ["Wealth vs Income", "Konsep 'Enough'", "Perilaku vs Matematika", "Compounding & Luck"],
    keyQuestion: "Dari penghasilan yang masuk setiap bulan, berapa yang berhasil berubah menjadi aset nyata?",
    readingAdvice: "Fokus pada Chapter 'Never Enough' dan 'Freedom'. Pahami bahwa ego adalah pemotong kekayaan terbesar.",
    sourceUrl: "https://collabfund.com/blog/book-the-psychology-of-money/",
  },
  {
    semester: 2,
    semesterName: "Semester 2 — Personal Finance & Cash Flow System",
    bookTitle: "I Will Teach You to Be Rich",
    author: "Ramit Sethi",
    category: "Sistem",
    focusTopics: ["Otomasi Transfer", "Conscious Spending", "Definisi Rich Life", "Hirarki 5-Layer"],
    keyQuestion: "Apakah uang Anda sudah bekerja otomatis menuju hal-hal penting tanpa harus dipikirkan setiap hari?",
    readingAdvice: "Terapkan program praktis otomatisasi rekening bank dan buat pos anggaran Rich Life keluarga.",
    sourceUrl: "https://www.iwillteachyoutoberich.com/",
  },
  {
    semester: 3,
    semesterName: "Semester 3 — Standar Regulasi & Ekosistem Indonesia",
    bookTitle: "Buku Perencanaan Keuangan OJK & Panduan CFP",
    author: "OJK & FPSB Indonesia",
    category: "Kepatuhan",
    focusTopics: ["Rasio DSR ≤30%", "Dana Darurat 3-6×", "BPJS SJSN", "Kepatuhan PAYDI SEOJK 5/2022"],
    keyQuestion: "Apakah seluruh indikator rasio keuangan keluarga Anda sudah lolos standar kepatuhan OJK?",
    readingAdvice: "Unduh materi Sikapi Uangmu OJK dan pastikan kepesertaan BPJS aktif serta utang terkendali.",
    sourceUrl: "https://sikapiuangmu.ojk.go.id",
  },
  {
    semester: 4,
    semesterName: "Semester 4 — Fondasi Investasi & Margin of Safety",
    bookTitle: "The Intelligent Investor (Chapter 8 & 20)",
    author: "Benjamin Graham",
    category: "Proteksi",
    focusTopics: ["Margin of Safety", "Mr. Market Fluctuations", "Disiplin Nilai vs Spekulasi"],
    keyQuestion: "Seberapa tebal bantalan pengaman keuangan keluarga Anda jika terjadi krisis tak terduga?",
    readingAdvice: "Jangan baca seluruh 500 halaman dulu. Fokus mendalam pada Bab 8 (Fluktuasi Pasar) dan Bab 20 (Margin of Safety).",
    sourceUrl: "https://www.investmenttheory.org",
  },
  {
    semester: 5,
    semesterName: "Semester 5 — Investasi Pasif & Kesederhanaan",
    bookTitle: "The Simple Path to Wealth",
    author: "JL Collins",
    category: "Investasi",
    focusTopics: ["Saving Rate Tinggi", "Index Fund Investing", "F.U. Money", "Rule of 25×"],
    keyQuestion: "Berapa persentase saving rate Anda dan kapan portofolio mencapai 25× pengeluaran tahunan?",
    readingAdvice: "Pelajari cara menyederhanakan alokasi aset tanpa terjebak over-engineering 17 aplikasi.",
    sourceUrl: "https://jlcollinsnh.com/",
  },
  {
    semester: 6,
    semesterName: "Semester 6 — Kekayaan Bersih & Gaya Hidup",
    bookTitle: "The Millionaire Next Door",
    author: "Thomas J. Stanley & William D. Danko",
    category: "Mindset",
    focusTopics: ["Income Affluent vs Balance-Sheet Affluent", "Rumus Expected Net Worth", "Kategori PAW vs UAW"],
    keyQuestion: "Apakah Anda seorang Prodigious Accumulator of Wealth (PAW) atau sekadar berpenghasilan tinggi tapi boros?",
    readingAdvice: "Hitung Net Worth tahunan Anda dengan rumus (Usia × Income Tahunan) ÷ 10.",
    sourceUrl: "https://www.themillionairenextdoor.com/",
  },
  {
    semester: 7,
    semesterName: "Semester 7 — Waktu Hidup & Makna Uang",
    bookTitle: "Your Money or Your Life",
    author: "Vicki Robin & Joe Dominguez",
    category: "Filosofi Hidup",
    focusTopics: ["Life Energy Concept", "Upah Riil per Jam", "Crossover Point"],
    keyQuestion: "Berapa jam umur kehidupan Anda yang sebenarnya Anda tukarkan untuk setiap pengeluaran?",
    readingAdvice: "Konversikan harga barang impian ke satuan jam kerja nyata untuk menyaring pembelian impulsif.",
    sourceUrl: "https://yourmoneyoryourlife.com/",
  },
  {
    semester: 8,
    semesterName: "Semester 8 — Desain Kehidupan & Pengalaman",
    bookTitle: "Die With Zero",
    author: "Bill Perkins",
    category: "Filosofi Hidup",
    focusTopics: ["Time Windows of Experience", "Memory Dividends", "Keseimbangan Wealth & Life"],
    keyQuestion: "Pengalaman keluarga berharga apa yang harus Anda wujudkan sekarang sebelum fase usia berlalu?",
    readingAdvice: "Alokasikan pos 'Enjoyment' tanpa rasa bersalah setelah seluruh fondasi OJK dan investasi terpenuhi.",
    sourceUrl: "https://www.diewithzerobook.com/",
  },
];

// ─── 10 Aturan Keuangan Keluarga (Financial Manifesto) ─────────────────────────

export const tenFamilyFinancialRules: FamilyFinancialRule[] = [
  {
    ruleNumber: 1,
    title: "Hidup di Bawah Kemampuan (Live Below Your Means)",
    principle: "Gaya hidup tidak boleh naik secepat kenaikan penghasilan keluarga.",
    guruInfluence: "Stanley & Danko / Morgan Housel",
    practicalAction: "Setiap kenaikan gaji, minimal 50-70% dari kenaikan dialokasikan langsung ke tabungan/investasi.",
  },
  {
    ruleNumber: 2,
    title: "Pisahkan Uang Jangka Pendek dari Risiko Pasar",
    principle: "Jangan gunakan instrumen fluktuatif untuk kebutuhan yang akan dipakai dalam < 2 tahun.",
    guruInfluence: "Vanguard / John Bogle",
    practicalAction: "Dana darurat dan DP rumah jangka pendek wajib di simpan di RDPU, Deposito LPS, atau SBN Ritel.",
  },
  {
    ruleNumber: 3,
    title: "Selalu Miliki Margin of Safety yang Tebal",
    principle: "Selalu sediakan jarak aman antara penghasilan dan biaya hidup pokok.",
    guruInfluence: "Benjamin Graham",
    practicalAction: "Jaga biaya survival keluarga ≤ 50% dari total income agar tahan terhadap goncangan ekonomi.",
  },
  {
    ruleNumber: 4,
    title: "Lindungi Penghasilan Sebelum Mengejar Return Investasi",
    principle: "Keluarga tidak boleh jatuh miskin hanya karena satu musibah kesehatan atau tutup usia.",
    guruInfluence: "OJK / Dave Ramsey / Warren Buffett",
    practicalAction: "Aktifkan BPJS Kesehatan & Ketenagakerjaan serta miliki Asuransi Jiwa Murni (UP 8-10× income).",
  },
  {
    ruleNumber: 5,
    title: "Beli Asuransi Berdasarkan Risiko Riil, Bukan Target Agen",
    principle: "Price is what you pay, value is what you get. Pahami biaya dan manfaat riil polis.",
    guruInfluence: "Warren Buffett / OJK SEOJK 5/2022",
    practicalAction: "Hindari mencampur proteksi dengan investasi tanpa memahami transparansi biaya akuisisi.",
  },
  {
    ruleNumber: 6,
    title: "Naikkan Saving Rate Secara Konsisten",
    principle: "Tingkat tabungan (saving rate) adalah driver nomor 1 dalam pembentukan kekayaan bersih.",
    guruInfluence: "JL Collins",
    practicalAction: "Targetkan Saving & Investment Rate keluarga bertumbuh bertahap menuju 25%–35%+.",
  },
  {
    ruleNumber: 7,
    title: "Jangan Pernah Mengambil Utang Konsumtif",
    principle: "Preserve the ability to play the game — utang berbunga tinggi menghancurkan cash flow.",
    guruInfluence: "Dave Ramsey / Warren Buffett",
    practicalAction: "Lunasi kartu kredit dan paylater hingga 0%. Gunakan utang hanya untuk KPR properti pertama (DSR ≤30%).",
  },
  {
    ruleNumber: 8,
    title: "Tetap Berada di Dalam Lingkaran Kompetensi (Circle of Competence)",
    principle: "Jangan menaruh uang pada instrumen atau bisnis yang tidak Anda pahami mekanismenya.",
    guruInfluence: "Warren Buffett & Charlie Munger",
    practicalAction: "Fokus pada instrumen sederhana berizin OJK (SBN Ritel, Indeks IDX30, RDPU) daripada FOMO spekulatif.",
  },
  {
    ruleNumber: 9,
    title: "Prioritaskan Biaya Rendah, Diversifikasi & Disiplin",
    principle: "Kendalikan apa yang bisa Anda kendalikan: biaya, alokasi aset, dan disiplin waktu.",
    guruInfluence: "Vanguard / Burton Malkiel",
    practicalAction: "Pilih instrumen dengan Expense Ratio rendah (<1%) dan lakukan Dollar-Cost Averaging setiap bulan.",
  },
  {
    ruleNumber: 10,
    title: "Uang Harus Melayani Kehidupan, Bukan Menjadi Berhala",
    principle: "Kekayaan sejati adalah kebebasan waktu, keluarga bahagia, dan kemampuan untuk memberi.",
    guruInfluence: "Ramit Sethi / Vicki Robin / Bill Perkins",
    practicalAction: "Nikmati surplus halal untuk membahagiakan pasangan, anak, orang tua, dan berbagi kepada sesama.",
  },
];

// ─── 5-Layer Financial Hierarchy System (Ramit Sethi Adapted) ─────────────────

export const fiveLayerHierarchyFramework: FiveLayerHierarchyItem[] = [
  {
    layer: 1,
    name: "Layer 1 — Survival (Kebutuhan Pokok)",
    subtitle: "Makan, tempat tinggal, utilitas, transportasi, & tanggungan keluarga dasar",
    targetPercentRange: "40% – 50%",
    color: "from-blue-600 to-indigo-700",
    itemsIncluded: ["Belanja Dapur & Makanan Pokok", "Sewa Rumah / Operasional Hunian", "Listrik, Air & Internet", "Transportasi Harian", "Nafkah Orang Tua Pokok"],
    ojkGuideline: "Maksimal 50% pendapatan agar tidak memicu defisit anggaran rumah tangga.",
    guruPhilosophy: "Benjamin Graham: Menjaga survival cost rendah menciptakan 'Margin of Safety' kas yang tebal.",
  },
  {
    layer: 2,
    name: "Layer 2 — Protection (Bantalan Pengaman & Risiko)",
    subtitle: "BPJS Kesehatan, BPJS Ketenagakerjaan, Asuransi Jiwa/Kritis, & Dana Darurat",
    targetPercentRange: "5% – 10%",
    color: "from-emerald-600 to-teal-700",
    itemsIncluded: ["Iuran BPJS Kesehatan & Ketenagakerjaan", "Premi Asuransi Jiwa Murni (UP 10×)", "Premi Penyakit Kritis", "Cicilan Pembentukan Dana Darurat"],
    ojkGuideline: "OJK merekomendasikan alokasi premi sekitar 5% dan dana darurat likuid 3-6× pengeluaran.",
    guruPhilosophy: "Warren Buffett & Dave Ramsey: Lindungi lantai dasar keluarga sebelum mengejar return investasi.",
  },
  {
    layer: 3,
    name: "Layer 3 — Goals (Sasaran Strategis Keluarga)",
    subtitle: "DP Rumah KPR pertama, Dana Pendidikan Anak, & Renovasi Hunian",
    targetPercentRange: "10% – 15%",
    color: "from-amber-600 to-orange-700",
    itemsIncluded: ["Tabungan DP Rumah Impian", "Sinking Fund Pendidikan Anak (SD-Kuliah)", "Dana Pembelian Kendaraan Keluarga", "Persiapan Pindah Domisili"],
    ojkGuideline: "Kunci sasaran masa depan dengan instrumen fixed income berizin OJK (SBN Ritel/Deposito).",
    guruPhilosophy: "Vanguard Principle: Pisahkan portfolio sasaran berdasarkan Horizon Waktu kebutuhan nyata.",
  },
  {
    layer: 4,
    name: "Layer 4 — Wealth & Compounding (Investasi Pertumbuhan)",
    subtitle: "Reksadana Indeks IDX30, SBN Ritel, Saham Bluechip, & Aset Produktif",
    targetPercentRange: "20% – 30%",
    color: "from-purple-600 to-violet-700",
    itemsIncluded: ["Investasi Rutin Indeks Saham (IDX30/LQ45)", "SBN Ritel (ORI/SR/ST)", "Akumulasi Emas Logam Mulia", "Aset Penghasil Passive Income"],
    ojkGuideline: "Minimal 10-20% OJK, diakselerasi menjadi 20-30% untuk fase akumulasi usia produktif.",
    guruPhilosophy: "JL Collins & Morgan Housel: Mesin utama pengganda kekayaan menuju Rule of 25× Financial Freedom.",
  },
  {
    layer: 5,
    name: "Layer 5 — Enjoyment & Giving (Rich Life & Makna)",
    subtitle: "Rekreasi keluarga, hobi, kencan pasangan, sedekah, & membahagiakan orang tua",
    targetPercentRange: "5% – 10%",
    color: "from-rose-600 to-pink-700",
    itemsIncluded: ["Liburan / Mudik Bersama Keluarga", "Makan Enak Bersama Pasangan", "Hobi & Pengembangan Diri", "Zakat, Infaq, Sedekah & Hadiah Orang Tua"],
    ojkGuideline: "Maksimal 10-15% agar gaya hidup tetap terkontrol dan tidak memicu utang konsumtif.",
    guruPhilosophy: "Bill Perkins (Die With Zero) & Ramit Sethi: Uang harus melayani kebahagiaan hidup keluarga saat ini.",
  },
];

// ─── Standar Rasio Keuangan OJK Indonesia ─────────────────────────────────────

export const ojkStandards: OJKFinancialStandard[] = [
  {
    category: "Rasio Dana Darurat (Liquidity Ratio)",
    ratioName: "Rasio Likuiditas Dana Darurat",
    healthyBenchmark: "≥ 3–6× pengeluaran bulanan (Lajang: 3-6×, Menikah: 6-9×, Anak: 9-12×)",
    warningBenchmark: "1–3× pengeluaran bulanan",
    dangerBenchmark: "< 1× pengeluaran bulanan (Rawan krisis)",
    formula: "Total Aset Likuid (Kas + Tabungan + Deposito + RDPU) ÷ Pengeluaran Rutin Bulanan",
    whyItMatters:
      "Melindungi keluarga dari risiko kehilangan mata pencaharian, sakit mendadak, atau kerusakan aset tanpa harus berutang ke pinjol atau menjual aset investasi saat rugi.",
    source: "OJK — Buku 9 Perencanaan Keuangan Keluarga & FPSB Indonesia",
    sourceUrl: "https://sikapiuangmu.ojk.go.id",
  },
  {
    category: "Batas Beban Utang (Debt Service Ratio)",
    ratioName: "Debt Service Ratio (DSR)",
    healthyBenchmark: "≤ 30% dari total pemasukan bulanan",
    warningBenchmark: "30% – 35% (Batas maksimal kepatuhan OJK)",
    dangerBenchmark: "> 35% (Kategori bahaya gagal bayar & skor SLIK buruk)",
    formula: "(Total Pembayaran Cicilan Utang Bulanan ÷ Total Pemasukan Bulanan) × 100%",
    whyItMatters:
      "Memastikan arus kas rumah tangga tidak tercekik oleh beban bunga. Menjaga skor SLIK OJK tetap lancar untuk pengajuan KPR rumah pertama.",
    source: "Standar Batas Aman Analisis Kredit Perbankan OJK & Bank Indonesia",
    sourceUrl: "https://ojk.go.id",
  },
  {
    category: "Tingkat Tabungan & Investasi (Savings Ratio)",
    ratioName: "Savings & Investment Rate",
    healthyBenchmark: "≥ 20% – 35% dari total pemasukan bulanan",
    warningBenchmark: "10% – 20% (Standar minimal OJK)",
    dangerBenchmark: "< 10% (Kekayaan bersih sulit bertumbuh)",
    formula: "(Total Alokasi Tabungan + Investasi Bulanan ÷ Total Pemasukan) × 100%",
    whyItMatters:
      "Kunci utama akselerasi kekayaan bersih (Wealth Accumulation). Tanpa saving rate memadai, kenaikan gaji hanya akan menjadi konsumsi yang menguap.",
    source: "JL Collins & OJK Buku Saku Literasi Keuangan",
    sourceUrl: "https://sikapiuangmu.ojk.go.id",
  },
  {
    category: "Beban Kebutuhan Pokok (Survival Needs)",
    ratioName: "Rasio Kebutuhan Hidup Pokok",
    healthyBenchmark: "≤ 50% dari total pemasukan (Standar 50/30/20 & Graham)",
    warningBenchmark: "50% – 65% (Kategori Sandwich Generation / Kota Besar)",
    dangerBenchmark: "> 65% (Zero margin of safety — rentan kolaps)",
    formula: "(Total Pengeluaran Kebutuhan Pokok ÷ Total Pemasukan) × 100%",
    whyItMatters:
      "Memberikan ruang nafas bagi proteksi asuransi, tabungan masa depan, dan dana darurat.",
    source: "Benjamin Graham & Elizabeth Warren",
    sourceUrl: "https://sikapiuangmu.ojk.go.id",
  },
  {
    category: "Beban Proteksi Asuransi (Insurance Ratio)",
    ratioName: "Rasio Premi Proteksi Asuransi",
    healthyBenchmark: "5% – 10% dari total pemasukan bulanan",
    warningBenchmark: "< 3% (Under-insured) atau 10% - 15% (Cukup tinggi)",
    dangerBenchmark: "0% tanpa BPJS (Sangat berbahaya) atau > 20% (Over-insured / Terjebak PAYDI mahal)",
    formula: "(Total Premi BPJS + Asuransi Murni ÷ Total Pemasukan) × 100%",
    whyItMatters:
      "Menjamin kesinambungan hidup keluarga jika pencari nafkah mengalami sakit kritis atau tutup usia.",
    source: "AAJI & OJK SEOJK 5/2022",
    sourceUrl: "https://aaji.or.id",
  },
];

// ─── Local Indonesia Financial Institutions ───────────────────────────────────

export const localFinancialTheories: LocalTheory[] = [
  {
    id: "bi_financial_framework",
    institution: "Bank Indonesia",
    country: "Indonesia",
    title: "Kerangka Stabilitas Moneter BI — Suku Bunga Acuan & Mitigasi Inflasi",
    description:
      "Bank Indonesia menetapkan BI-Rate yang memengaruhi suku bunga deposito, SBN, dan bunga pinjaman KPR. Di tingkat keluarga, prinsip ini mengajarkan pentingnya investasi dengan imbal hasil di atas inflasi riil Indonesia (4-6%/tahun).",
    keyPoints: [
      "Inflasi riil Indonesia 4-6%/tahun — tabungan biasa bunga 0% membuat daya beli tergerus.",
      "SBN Ritel (ORI, SR, ST, SBR) dijamin 100% negara dan bebas risiko gagal bayar.",
      "Diversifikasi aset ke instrumen legal yang mengimbangi pergerakan suku bunga acuan.",
    ],
    applicability:
      "Manfaatkan masa penerbitan SBN Ritel Kemenkeu dengan kupon menarik (6.4%+ p.a.) sebagai tempat parkir dana jangka menengah yang aman dan menguntungkan.",
    source: "Bank Indonesia — Laporan Kebijakan Moneter & Stabilitas Sistem Keuangan",
    sourceUrl: "https://www.bi.go.id",
    year: "2024",
  },
  {
    id: "ojk_literasi_keuangan",
    institution: "OJK (Otoritas Jasa Keuangan)",
    country: "Indonesia",
    title: "Edukasi & Perlindungan Konsumen OJK — Anti Pinjol Ilegal & Investasi Bodong",
    description:
      "OJK mengatur seluruh lembaga jasa keuangan di Indonesia dan menyediakan kanal Sikapi Uangmu untuk edukasi masyarakat. OJK secara tegas melarang skema ponzi, robot trading ilegal, dan pinjol tidak berizin.",
    keyPoints: [
      "Hanya gunakan platform investasi berizin resmi OJK (BEI, Bareksa, Bibit, Pluang, dll).",
      "Waspadai ciri investasi bodong: menjanjikan return pasti tinggi tanpa risiko.",
      "Cek histori kredit Anda di SLIK OJK (idDebtor.ojk.go.id) sebelum mengajukan pinjaman rumah.",
    ],
    applicability:
      "Selalu gunakan prinsip 2L dari OJK: Legal (berizin resmi) & Logis (imbal hasil masuk akal). Hubungi Kontak OJK 157 untuk verifikasi.",
    source: "OJK — Edukasi & Perlindungan Konsumen Indonesia",
    sourceUrl: "https://sikapiuangmu.ojk.go.id",
    year: "2024",
  },
  {
    id: "bpjs_protection_layer",
    institution: "BPJS Kesehatan & BPJS Ketenagakerjaan",
    country: "Indonesia",
    title: "Sistem Jaminan Sosial Nasional (SJSN) — Perlindungan Dasar Warga Negara",
    description:
      "BPJS Kesehatan dan Ketenagakerjaan (JHT, JP, JKK, JKm) merupakan lapisan proteksi lantai dasar (safety floor) yang wajib dimiliki sebelum membeli produk asuransi swasta komersial.",
    keyPoints: [
      "BPJS Kesehatan wajib aktif untuk seluruh anggota keluarga guna mencegah risiko biaya rawat inap ratusan juta.",
      "JHT (Jaminan Hari Tua) & JP (Jaminan Pensiun) adalah aset tabungan wajib karyawan yang dijamin negara.",
      "Pekerja mandiri/freelancer wajib mendaftar program BPJS Ketenagakerjaan BPU (Bukan Penerima Upah).",
    ],
    applicability:
      "Pastikan status BPJS keluarga aktif 100%. Lengkapi dengan asuransi jiwa swasta sebagai lapisan proteksi tambahan bagi pencari nafkah utama.",
    source: "BPJS Ketenagakerjaan & BPJS Kesehatan Indonesia",
    sourceUrl: "https://www.bpjsketenagakerjaan.go.id",
    year: "2024",
  },
];

// ─── Mathematical Formulas (Kalkulator & Metrik FinPlan) ──────────────────────

export const financialFormulas = [
  {
    id: "margin_of_safety_cf",
    name: "Rumus Margin of Safety Cash Flow (Benjamin Graham)",
    formula: "Margin of Safety (%) = ((Total Income − Biaya Pokok Survival) ÷ Total Income) × 100%",
    example:
      "Income keluarga Rp 19,2 Jt dan biaya kebutuhan pokok Rp 9,6 Jt → Margin of Safety = ((19,2 − 9,6) ÷ 19,2) × 100% = 50.0% (Sangat Kokoh!).",
    explanation:
      "Mengukur persentase ruang penyangga kas keluarga. Semakin tinggi persentase ini, semakin tahan keluarga Anda terhadap risiko PHK, penurunan omzet, atau kenaikan inflasi.",
    source: "The Intelligent Investor — Benjamin Graham (Bab 20)",
    sourceUrl: "https://www.investmenttheory.org",
  },
  {
    id: "life_energy_vicki",
    name: "Rumus Life Energy & Upah Riil per Jam (Vicki Robin)",
    formula: "Upah Riil per Jam = Income Bersih Bulanan ÷ Total Jam Kerja Nyata (Kerja + Komuter)",
    example:
      "Gaji Rp 14,7 Jt dengan 200 jam kerja/komuter = Rp 73.500/jam. Barang seharga Rp 735.000 = Anda menukar 10 jam waktu hidup Anda!",
    explanation:
      "Mengkonversi rupiah ke satuan jam kehidupan manusia, memberikan rem psikologis alami untuk menghindari pembelian barang yang tidak memberi nilai sepadan.",
    source: "Your Money or Your Life — Vicki Robin & Joe Dominguez",
    sourceUrl: "https://yourmoneyoryourlife.com/",
  },
  {
    id: "expected_net_worth",
    name: "Rumus Expected Net Worth & PAW Status (Stanley & Danko)",
    formula: "Target Net Worth Ideal = (Usia × Total Income Tahunan) ÷ 10",
    example:
      "Usia 30 tahun dengan income Rp 230 Jt/tahun → Target Net Worth = (30 × 230 Jt) ÷ 10 = Rp 690 Juta. Jika aset bersih Anda ≥ Rp 1,38 Miliar, Anda adalah PAW (Prodigious Accumulator of Wealth).",
    explanation:
      "Tolok ukur kekayaan riil karya Dr. Thomas J. Stanley untuk membedakan orang yang benar-benar kaya (balance-sheet affluent) dengan yang sekadar bergaya mewah (income affluent).",
    source: "The Millionaire Next Door — Dr. Thomas J. Stanley (1996)",
    sourceUrl: "https://www.themillionairenextdoor.com/",
  },
  {
    id: "rule_25x_fire",
    name: "Rumus Rule of 25× & Financial Independence (JL Collins / Trinity Study)",
    formula: "Target FI Number = Pengeluaran Tahunan × 25 (Berdasarkan 4% Safe Withdrawal Rate)",
    example:
      "Pengeluaran keluarga Rp 15 Jt/bulan (Rp 180 Jt/tahun) → Target Aset Mandiri = Rp 180 Jt × 25 = Rp 4,5 Miliar. Dengan portofolio Rp 4,5 Miliar menghasilkan return 7-8%, keluarga bisa hidup mandiri selamanya.",
    explanation:
      "Rumus ilmiah gerak kemerdekaan finansial yang membuktikan berapa banyak portofolio investable yang dibutuhkan untuk menutup seluruh biaya hidup tanpa menggerus modal pokok.",
    source: "Trinity Study (1998) & Simple Path to Wealth (JL Collins)",
    sourceUrl: "https://jlcollinsnh.com/",
  },
  {
    id: "rule_72",
    name: "Rule of 72 (Rumus Waktu Penggandaan Uang Compounding)",
    formula: "Tahun Penggandaan = 72 ÷ Return Tahunan (%)",
    example:
      "Jika investasi SBN/Indeks memberi imbal hasil 7.2% per tahun, modal Anda berlipat ganda 2× lipat dalam waktu 72 ÷ 7.2 = 10 tahun!",
    explanation:
      "Aturan praktis untuk menghitung kecepatan compounding aset tanpa perlu kalkulator finansial rumit.",
    source: "Albert Einstein (dipopulerkan) — Compound Interest Principle",
    sourceUrl: "https://www.investopedia.com/terms/r/ruleof72.asp",
  },
  {
    id: "wealth_acceleration",
    name: "Indeks Akselerasi Kekayaan (Wealth Acceleration Rate)",
    formula: "Akselerasi Rate (%) = (Kenaikan Surplus Bulanan ÷ Kenaikan Total Income) × 100%",
    example:
      "Gaji naik Rp 5 Jt (dari Rp 19 Jt ke Rp 24 Jt). Jika surplus tabungan naik Rp 4 Jt, Akselerasi Rate = (4 ÷ 5) × 100% = 80.0% (Sangat Sehat, Anti-Lifestyle Creep!).",
    explanation:
      "Mengukur ketahanan keluarga terhadap 'lifestyle inflation'. Menjaga agar kenaikan gaji tidak habis ditelan gaya hidup.",
    source: "Morgan Housel — Collaborative Fund",
    sourceUrl: "https://collabfund.com/blog/the-psychology-of-money/",
  },
];
