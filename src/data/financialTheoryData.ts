/**
 * Financial Theory Data — Expanded with Source Citations
 * Covers OJK (Indonesia), Bank Indonesia, FPSB, CFP Indonesia,
 * and international financial gurus.
 *
 * Sources:
 * - OJK: https://ojk.go.id/id/kanal/edukasi-dan-perlindungan-konsumen
 * - Bank Indonesia: https://www.bi.go.id/id/edukasi
 * - FPSB: https://fpsb.org/
 * - CFP Indonesia: https://fpaindonesia.or.id/
 * - Sikapiuangmu OJK: https://sikapiuangmu.ojk.go.id
 */

export interface FinancialGuruTheory {
  id: string;
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

// ─── International Financial Gurus ───────────────────────────────────────────

export const financialGurusTheories: FinancialGuruTheory[] = [
  {
    id: "warren_buffett",
    author: "Warren Buffett",
    nationality: "Amerika Serikat",
    role: "Chairman & CEO Berkshire Hathaway, Investor Terkaya ke-6 Dunia",
    title: "Aturan No. 1: Jangan Pernah Kehilangan Uang & Pay Yourself First",
    quote:
      "Rule No. 1: Never lose money. Rule No. 2: Never forget Rule No. 1. Jangan menabung apa yang tersisa setelah belanja — belanjakan apa yang tersisa setelah menabung.",
    coreRule: "Pay Yourself First & Margin of Safety",
    explanation:
      "Buffett menekankan bahwa kekayaan besar dibangun melalui kebiasaan menyisihkan uang di awal (bukan di akhir bulan), menjaga cadangan kas tunai yang cukup agar tidak terpaksa menjual aset saat pasar jatuh, serta berinvestasi pada instrumen berfundamental kuat dengan 'Margin of Safety'.",
    keyTakeaways: [
      "Autodebet tabungan & investasi langsung pada H+1 setelah gajian.",
      "Miliki 'Dry Powder' (dana kas likuid) agar bisa memanfaatkan diskon pasar saham.",
      "Gunakan strategi Dollar Cost Averaging (DCA) pada instrumen indeks (IDX30 / S&P500).",
      "Hindari utang konsumtif kartu kredit berbunga tinggi seperti wabah penyakit.",
    ],
    applicabilityIndonesia:
      "Di Indonesia, terapkan dengan menyisihkan minimal 20-30% penghasilan ke RDPU atau SBN Ritel segera setelah tanggal transfer gaji. Gunakan fitur autodebet di aplikasi Bibit atau Bareksa.",
    sources: [
      { label: "Berkshire Hathaway Annual Letters", url: "https://www.berkshirehathaway.com/letters/letters.html" },
      { label: "Warren Buffett's Biography – The Snowball", url: "https://www.goodreads.com/book/show/2054761.The_Snowball" },
    ],
    bookOrWork: "The Snowball: Warren Buffett and the Business of Life",
    yearPublished: "2008",
  },
  {
    id: "elizabeth_warren",
    author: "Elizabeth Warren & Amelia Warren Tyagi",
    nationality: "Amerika Serikat",
    role: "Pakar Hukum Keuangan Harvard & Senator AS — Penggagas Aturan 50/30/20",
    title: "Metode Alokasi Anggaran Seimbang 50/30/20",
    quote:
      "Anggaran bukanlah penjara yang membatasi kesenangan, melainkan peta jalan yang memberi izin untuk menikmati hidup tanpa rasa bersalah.",
    coreRule: "50% Kebutuhan (Needs) + 30% Keinginan (Wants) + 20% Tabungan/Investasi (Savings)",
    explanation:
      "Aturan 50/30/20 membagi pemasukan bersih menjadi 3 pos utama yang tegas. 50% untuk kebutuhan mutlak (makan pokok, sewa, tagihan listrik, cicilan wajib), 30% untuk gaya hidup dan rekreasi terukur, serta 20% wajib untuk dana darurat dan akumulasi aset masa depan.",
    keyTakeaways: [
      "Kebutuhan Pokok (Needs) maksimal 50% dari total penghasilan.",
      "Keinginan & Lifestyle (Wants) dibatasi maksimal 30% agar tidak bocor halus.",
      "Tabungan & Investasi (Savings) minimal 20% untuk pertumbuhan kekayaan bersih.",
      "Jika ada cicilan utang konsumtif, pangkas pos Wants untuk mempercepat pelunasan.",
    ],
    applicabilityIndonesia:
      "Sangat relevan untuk kelas pekerja perkotaan di Indonesia. Jika biaya hidup tinggi (sandwich generation), modifikasi menjadi 50/20/25/5 (5% proteksi BPJS/asuransi). Cocok dipadukan dengan standar OJK DSR ≤30%.",
    sources: [
      { label: "All Your Worth: The Ultimate Lifetime Money Plan", url: "https://www.amazon.com/All-Your-Worth-Ultimate-Lifetime/dp/0743269888" },
      { label: "CNBC: 50/30/20 Rule Explained", url: "https://www.cnbc.com/select/what-is-the-50-30-20-rule/" },
    ],
    bookOrWork: "All Your Worth: The Ultimate Lifetime Money Plan",
    yearPublished: "2005",
  },
  {
    id: "morgan_housel",
    author: "Morgan Housel",
    nationality: "Amerika Serikat",
    role: "Partner Collaborative Fund & Penulis Buku Best-Seller 'The Psychology of Money'",
    title: "Psikologi Uang: Kekayaan Adalah Apa yang Tidak Anda Lihat",
    quote:
      "Menjadi kaya (wealthy) adalah memiliki pilihan, fleksibilitas, dan kebebasan waktu — bukan sekadar memamerkan barang mahal yang dibeli dengan utang.",
    coreRule: "Ego Management, Savings Rate & Staying Wealthy",
    explanation:
      "Housel mengajarkan bahwa kesuksesan finansial 80% ditentukan oleh perilaku emosional (psikologi) dan hanya 20% pengetahuan matematis. Menekan ego dan rasa ingin pamer (*keeping up with the Joneses*) adalah tuas penghematan nomor satu.",
    keyTakeaways: [
      "Savings Rate (tingkat tabungan) lebih krusial daripada sekadar mengejar return investasi tinggi.",
      "Ruang untuk kesalahan (Room for Error): miliki dana darurat yang lebih dari cukup agar bisa tidur nyenyak.",
      "Kekayaan sejati adalah aset produktif tak terlihat yang menghasilkan passive income, bukan tagihan barang mewah.",
      "Kebutuhan Anda di masa depan mungkin berbeda drastis dari hari ini — jaga fleksibilitas finansial.",
    ],
    applicabilityIndonesia:
      "Pencegah efektif fenomena 'FOMO' gaya hidup media sosial dan jebakan paylater di kalangan generasi muda Indonesia. Relevan dengan budaya konsumtif Lebaran dan liburan akhir tahun.",
    sources: [
      { label: "The Psychology of Money (Morgan Housel, 2020)", url: "https://www.collaborativefund.com/blog/the-psychology-of-money/" },
      { label: "Morgan Housel's Blog – Collaborative Fund", url: "https://www.collaborativefund.com/blog/" },
    ],
    bookOrWork: "The Psychology of Money",
    yearPublished: "2020",
  },
  {
    id: "dave_ramsey",
    author: "Dave Ramsey",
    nationality: "Amerika Serikat",
    role: "Pakar Pembebasan Utang, Host Podcast & Pencipta 7 Baby Steps",
    title: "7 Baby Steps & Metode Bola Salju Utang (Debt Snowball)",
    quote:
      "Utang adalah beban terbesar penghalang kemerdekaan finansial. Bunuh utang terkecil terlebih dahulu untuk membangun momentum psikologis kemenangan.",
    coreRule: "Debt Snowball Method & Zero Debt Lifestyle",
    explanation:
      "Ramsey menyarankan melunasi utang dari nominal saldo terkecil terlebih dahulu tanpa melihat suku bunga (Debt Snowball). Kemenangan melunasi 1 utang akan memberi dorongan psikologis dahsyat untuk menaklukkan utang berikutnya.",
    keyTakeaways: [
      "Baby Step 1: Kumpulkan Dana Darurat Pemula (Rp 5-10 Juta) secepat kilat.",
      "Baby Step 2: Lunasi semua utang non-KPR dengan metode Debt Snowball.",
      "Baby Step 3: Lengkapi Dana Darurat Penuh (3-6 bulan pengeluaran).",
      "Baby Step 4: Investasikan 15% pendapatan ke dana pensiun jangka panjang.",
    ],
    applicabilityIndonesia:
      "Sangat ampuh untuk masyarakat yang terjerat multi-utang (pinjol, paylater, kartu kredit, KTA) agar memiliki arah pelunasan bertahap yang realistis. Sesuaikan Baby Step 1 dengan Rp 5 Juta minimum.",
    sources: [
      { label: "Dave Ramsey 7 Baby Steps", url: "https://www.ramseysolutions.com/dave-ramsey-7-baby-steps" },
      { label: "The Total Money Makeover", url: "https://www.daveramsey.com/store/product/the-total-money-makeover-book" },
    ],
    bookOrWork: "The Total Money Makeover",
    yearPublished: "2003",
  },
  {
    id: "robert_kiyosaki",
    author: "Robert T. Kiyosaki",
    nationality: "Amerika Serikat (keturunan Jepang)",
    role: "Pengusaha, Investor, & Penulis Buku 'Rich Dad Poor Dad'",
    title: "Aset vs Liabilitas — Beli Aset, Bukan Kemewahan",
    quote:
      "Orang kaya membeli aset. Orang miskin hanya punya pengeluaran. Kelas menengah membeli liabilitas sambil mengira mereka membeli aset.",
    coreRule: "Cash Flow Quadrant & Aset yang Menghasilkan Passive Income",
    explanation:
      "Kiyosaki mengajarkan perbedaan fundamental antara aset (menghasilkan uang masuk) dan liabilitas (mengeluarkan uang). Rumah tempat tinggal adalah liabilitas, bukan aset. Investasi yang menghasilkan passive income adalah aset sejati.",
    keyTakeaways: [
      "Pindah kuadran dari E (Employee) dan S (Self-employed) ke B (Business Owner) dan I (Investor).",
      "Bangun passive income stream: sewa properti, dividen saham, royalti bisnis.",
      "Jangan berinvestasi untuk barang konsumtif — investasikan terlebih dahulu, habiskan sisanya.",
      "Financial IQ: pahami laporan keuangan pribadi (neraca aset-liabilitas) Anda sendiri.",
    ],
    applicabilityIndonesia:
      "Konteks properti di Indonesia berbeda — KPR yang disewa bisa menjadi aset jika rental yield > cicilan. Relevan untuk transisi dari karyawan menjadi investor aktif melalui instrumen seperti saham, reksadana, dan DIRE.",
    sources: [
      { label: "Rich Dad Poor Dad (1997)", url: "https://www.richdad.com/rich-dad-poor-dad" },
      { label: "Cashflow Quadrant", url: "https://www.richdad.com/cashflow-quadrant" },
    ],
    bookOrWork: "Rich Dad Poor Dad",
    yearPublished: "1997",
  },
  {
    id: "john_bogle",
    author: "John C. Bogle",
    nationality: "Amerika Serikat",
    role: "Pendiri Vanguard Group & Penggagas Investasi Indeks Pasif",
    title: "Investasi Indeks Pasif — Menang dengan Tidak Kalah",
    quote:
      "Jangan cari jarum dalam tumpukan jerami — beli saja seluruh tumpukan jeraminya.",
    coreRule: "Index Fund Investing & Low Cost Strategy",
    explanation:
      "Bogle membuktikan bahwa mayoritas fund manager aktif gagal mengalahkan return pasar dalam jangka panjang setelah dikurangi biaya. Investasi pada indeks pasar dengan biaya rendah (expense ratio rendah) secara konsisten mengalahkan strategi aktif dalam 20+ tahun.",
    keyTakeaways: [
      "Pilih reksa dana indeks dengan total expense ratio (TER) serendah mungkin (<1% per tahun).",
      "Jangan market timing — lakukan DCA (Dollar Cost Averaging) secara konsisten.",
      "Diversifikasi pada pasar luas, bukan hanya satu sektor.",
      "Stay the course: jangan panik jual saat koreksi pasar. Tetap investasi rutin.",
    ],
    applicabilityIndonesia:
      "Terapkan dengan investasi rutin di Reksadana Indeks IDX30 atau IDX80 melalui Bibit/Bareksa dengan TER rendah. Hindari biaya transaksi yang menggerus return jangka panjang.",
    sources: [
      { label: "The Little Book of Common Sense Investing (2007)", url: "https://www.vanguard.com/bogle_site/lib/sp20050901.html" },
      { label: "Vanguard Index Fund Research", url: "https://www.vanguard.com/research" },
    ],
    bookOrWork: "The Little Book of Common Sense Investing",
    yearPublished: "2007",
  },
  {
    id: "peter_lynch",
    author: "Peter Lynch",
    nationality: "Amerika Serikat",
    role: "Mantan Manajer Fidelity Magellan Fund — Legenda Wall Street",
    title: "Invest in What You Know — Temukan Multi-Bagger dari Kehidupan Sehari-hari",
    quote:
      "Investasi terbaik ada di depan Anda. Jika Anda tahu produk bagus sebelum analis Wall Street menyadarinya, Anda memiliki keuntungan nyata.",
    coreRule: "Invest in What You Know & Fundamental Stock Picking",
    explanation:
      "Lynch percaya investor individual memiliki keunggulan atas fund manager karena bisa mengamati tren konsumen dari kehidupan sehari-hari. Temukan perusahaan bagus sebelum pasar menyadarinya dengan memahami bisnis yang Anda gunakan sendiri.",
    keyTakeaways: [
      "Teliti 5-10 saham perusahaan yang produknya Anda gunakan setiap hari.",
      "Cari saham 'ten-bagger': perusahaan dengan potensi tumbuh 10× lipat.",
      "Pahami cerita di balik saham: mengapa bisnis ini akan bertumbuh?",
      "Jangan diversifikasi terlalu banyak (over-diversification) — fokus pada 5-10 saham terbaik Anda.",
    ],
    applicabilityIndonesia:
      "Terapkan di saham IHSG: bank digital (GOTO, BUKA), consumer staples (INDF, ICBP, UNVR), infrastruktur digital (TLKM). Manfaatkan insider knowledge industri Anda untuk menemukan peluang.",
    sources: [
      { label: "One Up on Wall Street (1989)", url: "https://www.amazon.com/One-Up-Wall-Street-Already/dp/0743200403" },
      { label: "Beating the Street (1993)", url: "https://www.amazon.com/Beating-Street-Peter-Lynch/dp/0671891634" },
    ],
    bookOrWork: "One Up on Wall Street",
    yearPublished: "1989",
  },
  {
    id: "rhenald_kasali",
    author: "Prof. Rhenald Kasali",
    nationality: "Indonesia",
    role: "Guru Besar Manajemen UI & Pakar Transformasi Bisnis Indonesia",
    title: "Disruption Mindset — Adaptasi Finansial di Era Digital Indonesia",
    quote:
      "Bukan yang terkuat atau terpintar yang bertahan, melainkan yang paling adaptif terhadap perubahan. Begitu pula dengan keuangan Anda di era digital.",
    coreRule: "Digital Financial Literacy & Self-Disruption",
    explanation:
      "Kasali menekankan bahwa revolusi digital menciptakan peluang baru bagi masyarakat Indonesia untuk mengakses produk investasi (reksa dana, SBN ritel, saham) melalui teknologi fintech, namun juga membawa risiko penipuan investasi bodong dan pinjaman online ilegal.",
    keyTakeaways: [
      "Manfaatkan fintech OJK-terdaftar untuk investasi otomatis (Bibit, Bareksa, Ajaib).",
      "Kenali ciri investasi bodong: return tidak masuk akal (>30%/tahun tanpa risiko).",
      "Literasi digital keuangan: pahami fee, TER, dan biaya tersembunyi sebelum investasi.",
      "Bangun digital income stream: konten kreator, afiliasi, atau marketplace online.",
    ],
    applicabilityIndonesia:
      "Sangat relevan untuk generasi milenial dan Gen Z Indonesia yang aktif di platform digital. Framework ini memandu adaptasi keuangan dari tabungan konvensional ke ekosistem fintech OJK.",
    sources: [
      { label: "Disruption (Prof. Rhenald Kasali, 2017)", url: "https://rhenaldkasali.com/buku/" },
      { label: "Self Disruption", url: "https://rhenaldkasali.com" },
    ],
    bookOrWork: "Disruption",
    yearPublished: "2017",
  },
  {
    id: "george_clason",
    author: "George S. Clason",
    nationality: "Amerika Serikat",
    role: "Penulis Klasik Finansial Paling Abadi Sepanjang Masa",
    title: "The Richest Man in Babylon — 7 Hukum Emas Keuangan",
    quote:
      "Setiap koin yang Anda simpan adalah budak yang bekerja untuk Anda. Setiap koin yang Anda habiskan tanpa pikir panjang adalah hilangnya budak masa depan Anda.",
    coreRule: "Pay Yourself First (10% Rule) & Make Money Work for You",
    explanation:
      "Clason merangkum 7 hukum kekayaan abadi dalam alegori Babilonia kuno. Hukum utama: simpan minimal 1/10 (10%) dari setiap penghasilan sebagai wajib bayar kepada diri sendiri sebelum membayar orang lain.",
    keyTakeaways: [
      "Hukum ke-1: Mulai mengisi kantong Anda (simpan 10% sebelum pengeluaran apapun).",
      "Hukum ke-2: Kendalikan pengeluaran — batas biaya hidup agar tidak melebihi 90% penghasilan.",
      "Hukum ke-3: Buat emas bekerja untuk Anda — investasikan tabungan ke instrumen produktif.",
      "Hukum ke-7: Kembangkan kemampuan dan penghasilan Anda terus-menerus.",
    ],
    applicabilityIndonesia:
      "Aturan 10% ini adalah minimum. Untuk konteks Indonesia dengan inflasi 4-5% dan biaya hidup yang tinggi, idealkan di 20-30%. Mulai dari autodebet Rp 500.000/bulan jika masih fresh graduate.",
    sources: [
      { label: "The Richest Man in Babylon (1926)", url: "https://www.amazon.com/Richest-Man-Babylon-George-Clason/dp/0451205367" },
    ],
    bookOrWork: "The Richest Man in Babylon",
    yearPublished: "1926",
  },
];

// ─── OJK Financial Standards ──────────────────────────────────────────────────

export const ojkStandards: OJKFinancialStandard[] = [
  {
    category: "Beban Hutang & Cicilan",
    ratioName: "Debt-to-Income Ratio (DSR / DTI)",
    healthyBenchmark: "< 30% dari penghasilan bulanan",
    warningBenchmark: "30% - 40% (Zona Kuning)",
    dangerBenchmark: "> 40% (Zona Merah / Over-leverage)",
    formula: "(Total Semua Cicilan Bulanan ÷ Total Pemasukan Bersih) × 100%",
    whyItMatters:
      "Standar OJK & Perbankan Indonesia menetapkan bahwa total cicilan (KPR + Kendaraan + Kartu Kredit) maksimal 30-35% agar arus kas keluarga tidak rentan gagal bayar saat terjadi guncangan ekonomi.",
    source: "OJK – POJK No. 42/POJK.03/2017 tentang Kualitas Aset",
    sourceUrl: "https://ojk.go.id/id/regulasi/Pages/POJK-Tentang-Kualitas-Aset-Bank-Umum.aspx",
  },
  {
    category: "Likuiditas & Ketahanan",
    ratioName: "Rasio Dana Darurat (Emergency Fund Ratio)",
    healthyBenchmark: "3 - 6x Pengeluaran (Lajang), 6 - 12x (Menikah/Wirausaha)",
    warningBenchmark: "1 - 2x Pengeluaran",
    dangerBenchmark: "< 1x Pengeluaran (Rentan Krisis)",
    formula: "Total Kas Likuid ÷ Total Pengeluaran Rutin Bulanan",
    whyItMatters:
      "Melindungi keluarga dari risiko PHK, penurunan omset bisnis, atau musibah mendadak tanpa perlu berutang atau mencairkan aset investasi saat rugi.",
    source: "OJK – Sikapiuangmu: Panduan Dana Darurat",
    sourceUrl: "https://sikapiuangmu.ojk.go.id/FrontEnd/CMS/Article/20",
  },
  {
    category: "Akumulasi Kekayaan",
    ratioName: "Rasio Menabung & Investasi (Savings Ratio)",
    healthyBenchmark: "≥ 20% dari total pemasukan bulanan",
    warningBenchmark: "10% - 19%",
    dangerBenchmark: "< 10% (Lambat mencapai tujuan finansial)",
    formula: "(Alokasi Tabungan + Investasi Bulanan ÷ Total Pemasukan) × 100%",
    whyItMatters:
      "Semakin tinggi rasio menabung, semakin cepat Anda mencapai kebebasan finansial (Financial Independence / FIRE) berkat keajaiban bunga berbunga (compounding interest).",
    source: "OJK – Sikapiuangmu: Menabung & Investasi",
    sourceUrl: "https://sikapiuangmu.ojk.go.id/FrontEnd/CMS/Category/14",
  },
  {
    category: "Kesehatan Neraca",
    ratioName: "Rasio Solvabilitas & Kekayaan Bersih (Net Worth)",
    healthyBenchmark: "Kekayaan Bersih > Total Hutang (Positif & Bertumbuh)",
    warningBenchmark: "Aset = Total Hutang",
    dangerBenchmark: "Kekayaan Bersih Negatif (Hutang > Total Aset)",
    formula: "Total Seluruh Aset (Kas, Saham, Properti) − Total Seluruh Kewajiban Hutang",
    whyItMatters:
      "Mengukur nilai kekayaan murni Anda yang sebenarnya setelah semua kewajiban utang dilunasi.",
    source: "CFP Indonesia – FPSB Standard Financial Ratios",
    sourceUrl: "https://fpaindonesia.or.id/",
  },
  {
    category: "Proteksi Keluarga",
    ratioName: "Rasio Premi Asuransi (Insurance-to-Income)",
    healthyBenchmark: "3% - 10% dari total penghasilan bulanan",
    warningBenchmark: "< 3% (Kurang terlindungi)",
    dangerBenchmark: "> 15% (Terlalu tinggi, membebani cashflow)",
    formula: "(Total Premi Asuransi Bulanan ÷ Total Pemasukan) × 100%",
    whyItMatters:
      "Asuransi adalah fondasi keuangan keluarga. Tanpa proteksi memadai, satu kejadian tak terduga (sakit kritis, kecelakaan, meninggal) bisa menghapus seluruh akumulasi aset yang dibangun bertahun-tahun.",
    source: "AAJI – Panduan Perencanaan Proteksi 2024",
    sourceUrl: "https://aaji.or.id/",
  },
  {
    category: "Beban Kebutuhan Pokok",
    ratioName: "Rasio Kebutuhan Pokok (Needs Ratio)",
    healthyBenchmark: "≤ 50% dari penghasilan (Standar 50/30/20)",
    warningBenchmark: "50% - 65% (Sandwich generation / kota besar)",
    dangerBenchmark: "> 65% (Tidak ada ruang untuk tabungan & proteksi)",
    formula: "(Kebutuhan Pokok Bulanan ÷ Total Pemasukan) × 100%",
    whyItMatters:
      "Jika kebutuhan pokok melebihi 65% income, hampir tidak ada ruang untuk menabung, investasi, atau membayar premi asuransi — kondisi rentan finansial jangka panjang.",
    source: "Elizabeth Warren & Tyagi – All Your Worth (2005) & OJK Literasi 2024",
    sourceUrl: "https://sikapiuangmu.ojk.go.id",
  },
];

// ─── Local Indonesia Theories ─────────────────────────────────────────────────

export const localFinancialTheories: LocalTheory[] = [
  {
    id: "bi_financial_framework",
    institution: "Bank Indonesia",
    country: "Indonesia",
    title: "Kerangka Stabilitas Keuangan BI — Manajemen Risiko Individu",
    description:
      "Bank Indonesia (BI) menetapkan kerangka stabilitas keuangan yang juga berlaku pada level individu: menjaga inflasi, mengelola utang, dan membangun cadangan devisa. Di level personal, prinsip ini diterjemahkan sebagai: waspadai inflasi nyata (4-5%/tahun di Indonesia), kelola utang di bawah batas aman, dan bangun 'cadangan devisa' berupa dana darurat & portofolio terdiversifikasi.",
    keyPoints: [
      "Inflasi Indonesia rata-rata 4-5%/tahun — return investasi harus melebihi inflasi untuk tumbuh riil.",
      "BI Rate (suku bunga acuan) mempengaruhi KPR, obligasi, dan deposito Anda.",
      "Diversifikasi mata uang: simpan sebagian aset dalam USD/emas sebagai hedge inflasi.",
      "Obligasi Negara Ritel (SBN) dijamin pemerintah RI — alternatif deposito paling aman.",
    ],
    applicability:
      "Perhatikan pengumuman BI Rate — saat BI Rate turun, harga obligasi naik (keuntungan bagi pemegang SBN). Alokasikan sebagian tabungan ke SBN Ritel (ORI/SR) yang dijamin 100% oleh negara.",
    source: "Bank Indonesia — Framework Stabilitas Sistem Keuangan",
    sourceUrl: "https://www.bi.go.id/id/fungsi-utama/stabilitas-sistem-keuangan/default.aspx",
    year: "2024",
  },
  {
    id: "ojk_literasi_keuangan",
    institution: "OJK (Otoritas Jasa Keuangan)",
    country: "Indonesia",
    title: "Indeks Literasi & Inklusi Keuangan Indonesia 2024",
    description:
      "Survei OJK 2024 menunjukkan bahwa indeks literasi keuangan Indonesia berada di angka 65.43% — artinya lebih dari 1/3 penduduk Indonesia masih belum paham produk dan layanan keuangan. OJK menetapkan 5 pilar literasi keuangan: perencanaan keuangan, tabungan, asuransi, investasi, dan perlindungan konsumen.",
    keyPoints: [
      "Perencanaan Keuangan: buat anggaran bulanan berdasarkan 5 pos (kebutuhan, cicilan, asuransi, tabungan, keinginan).",
      "Produk Investasi Legal: hanya gunakan instrumen yang terdaftar OJK (SBN, reksa dana, saham di BEI).",
      "Hindari Investasi Bodong: ciri utama — return tidak masuk akal, tidak berizin OJK.",
      "SLIK OJK: cek riwayat kredit Anda di idDebtor.ojk.go.id sebelum mengajukan pinjaman.",
    ],
    applicability:
      "Gunakan platform resmi OJK: Sikapiuangmu (edukasi), idDebtor.ojk.go.id (cek kredit), dan kontak OJK 157 untuk pengaduan.",
    source: "OJK — Survei Nasional Literasi & Inklusi Keuangan 2024",
    sourceUrl: "https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/Survei-Nasional-Literasi-dan-Inklusi-Keuangan-2024.aspx",
    year: "2024",
  },
  {
    id: "fpsb_cfp_standard",
    institution: "FPSB Indonesia / FPA Indonesia",
    country: "Indonesia",
    title: "Standar CFP Indonesia — 6 Langkah Perencanaan Keuangan Profesional",
    description:
      "Financial Planning Standards Board (FPSB) Indonesia menetapkan standar perencanaan keuangan komprehensif (CFP) yang mencakup 6 tahap profesional: (1) Menetapkan hubungan klien-perencana, (2) Mengumpulkan data, (3) Analisis data, (4) Menyusun rekomendasi, (5) Mengimplementasikan, (6) Monitoring berkala.",
    keyPoints: [
      "Perencanaan keuangan bukan one-time activity — review setiap 6-12 bulan.",
      "Rasio keuangan standar CFP: DSR <30%, Savings >20%, Emergency Fund 3-12 bulan.",
      "Perencanaan komprehensif mencakup: arus kas, asuransi, investasi, pajak, pensiun, warisan.",
      "CFP adalah gelar berstandar internasional yang bisa dicari di fpaindonesia.or.id.",
    ],
    applicability:
      "Gunakan FinPlan ini sebagai digital CFP self-assessment. Untuk kasus kompleks (warisan, pajak, bisnis), konsultasikan dengan CFP berlisensi di fpaindonesia.or.id.",
    source: "FPSB / FPA Indonesia — Standar Perencanaan Keuangan 2024",
    sourceUrl: "https://fpaindonesia.or.id/",
    year: "2024",
  },
  {
    id: "bi_sjsn_bpjs",
    institution: "Kementerian Keuangan & BPJS",
    country: "Indonesia",
    title: "Sistem Jaminan Sosial Nasional (SJSN) — Fondasi Proteksi Dasar",
    description:
      "UU No. 40/2004 mewajibkan seluruh WNI terdaftar dalam SJSN melalui BPJS Kesehatan dan BPJS Ketenagakerjaan. BPJS Ketenagakerjaan menyediakan 4 program: Jaminan Hari Tua (JHT), Jaminan Pensiun (JP), Jaminan Kecelakaan Kerja (JKK), dan Jaminan Kematian (JKm).",
    keyPoints: [
      "JHT BPJS Ketenagakerjaan: bisa dicairkan saat pensiun (57 tahun) atau resign (tunggu 1 bulan).",
      "Pastikan perusahaan Anda mendaftarkan dan membayar iuran BPJS Ketenagakerjaan secara rutin.",
      "BPJS Kesehatan wajib aktif — denda keterlambatan dua setengah persen dari biaya rawat inap.",
      "Pekerja mandiri (freelancer/pengusaha) wajib daftar BPJS mandiri.",
    ],
    applicability:
      "Cek status kepesertaan BPJS Anda di aplikasi Mobile JKN dan JMO (Jamsostek Mobile). Pastikan iuran BPJS Ketenagakerjaan tidak ada tunggakan karena mempengaruhi klaim JHT.",
    source: "BPJS Ketenagakerjaan & BPJS Kesehatan — Panduan 2024",
    sourceUrl: "https://www.bpjsketenagakerjaan.go.id",
    year: "2024",
  },
  {
    id: "ojk_keuangan_sehat",
    institution: "OJK",
    country: "Indonesia",
    title: "Kerangka Keuangan Sehat OJK — Empat Pilar Utama",
    description:
      "Otoritas Jasa Keuangan (OJK) mendefinisikan keuangan sehat melalui 4 pilar utama: (1) Perencanaan keuangan, (2) Pengelolaan pendapatan dan pengeluaran, (3) Proteksi melalui asuransi, dan (4) Investasi untuk pertumbuhan aset. OJK telah menetapkan standar literasi keuangan nasional melalui SNLKI (Strategi Nasional Literasi Keuangan Indonesia).",
    keyPoints: [
      "Rasio tabungan minimum ≥20% dari total penghasilan bulanan bersih.",
      "Debt Service Ratio (DSR) maksimal 30% dari penghasilan untuk keuangan sehat.",
      "Dana darurat minimal 3-12 bulan pengeluaran (3 bln single, 6 bln keluarga kecil, 12 bln keluarga besar).",
      "Asuransi jiwa minimal 8-10x penghasilan tahunan untuk breadwinner keluarga.",
      "Alokasikan minimal 10% penghasilan untuk asuransi dan perlindungan risiko.",
    ],
    applicability:
      "Gunakan SNLKI OJK sebagai benchmark dasar sebelum memilih produk keuangan apapun. Pastikan DSR ≤30%, simpan dana darurat di deposito/reksa dana pasar uang yang terpisah dari rekening operasional, dan lindungi diri dengan BPJS Kesehatan + asuransi jiwa swasta.",
    source: "OJK — Strategi Nasional Literasi Keuangan Indonesia (SNLKI) 2021-2025",
    sourceUrl: "https://ojk.go.id/id/berita-dan-kegiatan/siaran-pers/Pages/Strategi-Nasional-Literasi-Keuangan-Indonesia-(SNLKI)-2021-2025.aspx",
    year: "2021",
  },
  {
    id: "bi_financial_deepening",
    institution: "Bank Indonesia",
    country: "Indonesia",
    title: "Bank Indonesia — Pilar Pendalaman Pasar Keuangan & Inklusi Keuangan",
    description:
      "Bank Indonesia (BI) mendorong inklusi keuangan melalui program QRIS, SBN (Surat Berharga Negara) ritel, dan pengembangan pasar obligasi lokal. BI menetapkan target inflasi 2.5±1% per tahun sebagai acuan perencanaan keuangan jangka panjang.",
    keyPoints: [
      "Gunakan target inflasi BI (2.5±1%/tahun) sebagai asumsi dasar kalkulasi FIRE dan dana pendidikan.",
      "SBN Ritel (ORI, SBR, Sukuk Ritel) menawarkan imbal hasil kompetitif dengan risiko sangat rendah (dijamin pemerintah).",
      "QRIS dan perbankan digital memudahkan diversifikasi dan otomasi investasi rutin.",
      "Investasi pada instrumen berbasis Rupiah melindungi dari risiko kurs bagi mayoritas pengeluaran di Indonesia.",
      "Obligasi korporasi investment grade Indonesia menawarkan yield premium atas SBN.",
    ],
    applicability:
      "Alokasikan 10-20% portofolio ke SBN Ritel (ORI/SBR) sebagai anchor yield rendah risiko. Gunakan asumsi inflasi 3-4% (konservatif) untuk proyeksi biaya pendidikan, biaya hidup pensiun, dan aset properti jangka panjang.",
    source: "Bank Indonesia — Laporan Kebijakan Moneter & Rencana Strategis Inklusi Keuangan",
    sourceUrl: "https://www.bi.go.id/id/publikasi/laporan/Pages/LPI_2023.aspx",
    year: "2023",
  },
  {
    id: "fpsb_cfp_indonesia",
    institution: "FPSB Indonesia",
    country: "Indonesia",
    title: "FPSB — Framework CFP Indonesia: Proses 7 Langkah Perencanaan Keuangan",
    description:
      "Financial Planning Standards Board (FPSB) Indonesia menetapkan standar CFP (Certified Financial Planner) yang diakui internasional. Framework CFP mencakup 7 proses sistematis: (1) Bangun hubungan dengan klien, (2) Kumpulkan data & tujuan, (3) Analisis situasi keuangan, (4) Susun rekomendasi, (5) Presentasikan rencana, (6) Implementasikan, (7) Monitor & review berkala.",
    keyPoints: [
      "Perencanaan keuangan harus bersifat holistik: mencakup cashflow, investasi, pajak, asuransi, dan warisan.",
      "Tujuan keuangan SMART: Specific, Measurable, Achievable, Relevant, Time-bound.",
      "Review rencana keuangan minimal 1x per tahun atau saat ada perubahan kehidupan besar.",
      "Diversifikasi portofolio berdasarkan profil risiko (konservatif/moderat/agresif) dan time horizon.",
      "Pajak penghasilan final 15% untuk kupon SBN, 10% untuk dividen saham — hitung net-of-tax yield.",
    ],
    applicability:
      "Gunakan framework CFP ini sebagai pedoman sistematis setiap tahun. Jadwalkan 'financial check-up' tahunan untuk mereview apakah alokasi aset, target goals, dan coverage asuransi masih sesuai dengan kondisi hidup Anda.",
    source: "FPSB Indonesia — Standar Kompetensi & Etika CFP® Indonesia",
    sourceUrl: "https://fpaindonesia.or.id/profesi-cfp/standar-kompetensi/",
    year: "2022",
  },
  {
    id: "bpjs_protection_layer",
    institution: "BPJS",
    country: "Indonesia",
    title: "BPJS — Lapisan Perlindungan Sosial Dasar: Kesehatan & Ketenagakerjaan",
    description:
      "BPJS Kesehatan dan BPJS Ketenagakerjaan merupakan fondasi wajib perlindungan sosial di Indonesia. BPJS Ketenagakerjaan mencakup: JHT (Jaminan Hari Tua), JP (Jaminan Pensiun), JKK (Jaminan Kecelakaan Kerja), JKm (Jaminan Kematian), dan JKP (Jaminan Kehilangan Pekerjaan).",
    keyPoints: [
      "BPJS Kesehatan: Pastikan iuran aktif — lindungi dari risiko biaya RS yang bisa mencapai ratusan juta rupiah.",
      "JHT BPJS Ketenagakerjaan: Saldo bisa dicairkan setelah usia 56 tahun atau resign.",
      "JP BPJS Ketenagakerjaan: Manfaat bulanan pensiun ± 0.5-3% gaji terakhir per tahun masa kerja.",
      "Karyawan mandiri/freelancer bisa mendaftar BPJS mandiri — jangan lewatkan manfaat JHT & JKK.",
      "BPJS hanya merupakan lapisan pertama (floor protection) — tambahkan asuransi swasta sebagai lapisan kedua.",
    ],
    applicability:
      "Pastikan BPJS Kesehatan dan BPJS Ketenagakerjaan aktif sebelum membeli produk asuransi swasta apapun. Tambahkan asuransi jiwa swasta (min. 8-10x income/tahun) dan asuransi penyakit kritis sebagai lapisan pelengkap.",
    source: "BPJS Ketenagakerjaan — Panduan Program & Manfaat Peserta",
    sourceUrl: "https://www.bpjsketenagakerjaan.go.id/informasi-program.html",
    year: "2023",
  },
];

// ─── Financial Formulas ───────────────────────────────────────────────────────

export const financialFormulas = [
  {
    id: "rule_72",
    name: "Rule of 72 (Rumus Penggandaan Uang)",
    formula: "Tahun Penggandaan = 72 ÷ Return Tahunan (%)",
    example:
      "Jika investasi memberi imbal hasil 12% per tahun (cth: Saham/Index), uang Anda akan berlipat ganda 2x lipat dalam waktu 72 ÷ 12 = 6 tahun!",
    explanation:
      "Aturan matematis praktis untuk mengetahui berapa tahun yang dibutuhkan uang Anda untuk menjadi 2x lipat tanpa kalkulator rumit.",
    source: "Albert Einstein (dipopulerkan) — Prinsip Compound Interest",
    sourceUrl: "https://www.investopedia.com/terms/r/ruleof72.asp",
  },
  {
    id: "future_inflation",
    name: "Rumus Nilai Masa Depan Terkikis Inflasi (Future Value)",
    formula: "FV = Biaya Sekarang × (1 + Tingkat Inflasi)^Tahun",
    example:
      "Uang kuliah Rp 100 Juta saat ini, dengan inflasi pendidikan 10% per tahun, dalam 10 tahun ke depan akan menjadi Rp 100 Jt × (1 + 0.10)^10 = Rp 259,37 Juta!",
    explanation:
      "Alasan mengapa menaruh seluruh uang di tabungan biasa dengan bunga 0.1% membuat nilai riil kekayaan Anda tergerus setiap tahun.",
    source: "Prinsip Time Value of Money — CFA Institute",
    sourceUrl: "https://www.cfainstitute.org/",
  },
  {
    id: "net_worth_target",
    name: "Rumus Target Kekayaan Bersih Ideal (The Millionaire Next Door)",
    formula: "Target Net Worth = (Usia × Total Penghasilan Tahunan) ÷ 10",
    example:
      "Jika Anda berusia 30 tahun dengan penghasilan Rp 120 Juta/tahun, target kekayaan bersih ideal Anda saat ini adalah (30 × Rp 120 Jt) ÷ 10 = Rp 360 Juta.",
    explanation:
      "Tolok ukur standar internasional karya Dr. Thomas J. Stanley untuk menguji apakah Anda seorang Accumulator of Wealth (PAW) yang handal.",
    source: "The Millionaire Next Door — Dr. Thomas J. Stanley (1996)",
    sourceUrl: "https://www.amazon.com/Millionaire-Next-Door-Surprising-Americas/dp/1589795474",
  },
  {
    id: "fire_number",
    name: "Rumus FIRE Number — Target Dana Pensiun",
    formula: "FIRE Number = Pengeluaran Tahunan × 25 (Aturan 4%)",
    example:
      "Jika pengeluaran bulanan Anda Rp 10 Jt (Rp 120 Jt/tahun), FIRE Number Anda = Rp 120 Jt × 25 = Rp 3 Miliar. Dengan portofolio Rp 3 Miliar dan withdrawal rate 4%/tahun, Anda bisa pensiun selamanya.",
    explanation:
      "Aturan 4% (Trinity Study) menyatakan bahwa portofolio investasi bisa bertahan seumur hidup jika Anda menarik maksimal 4% per tahun dari total nilai portofolio.",
    source: "Trinity Study (1998) — William Bengen, CFP",
    sourceUrl: "https://www.investopedia.com/terms/f/four-percent-rule.asp",
  },
];

