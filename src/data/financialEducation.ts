import { RiskQuestion, RiskProfileResult, RiskProfileCategory, RiskProfileData } from "../types";

export const riskQuestions: RiskQuestion[] = [
  {
    id: "q1",
    question: "Berapa lama horizon (jangka waktu) Anda berencana mendiamkan uang investasi Anda?",
    subtitle: "Jangka waktu sangat menentukan jenis aset yang tepat untuk Anda",
    options: [
      {
        text: "Kurang dari 1 tahun",
        description: "Uang kemungkinan akan segera ditarik untuk kebutuhan mendesak / jangka sangat pendek.",
        points: 1,
      },
      {
        text: "1 sampai 3 tahun",
        description: "Jangka menengah pendek (misal DP rumah, modal nikah, liburan).",
        points: 2,
      },
      {
        text: "3 sampai 5 tahun",
        description: "Jangka menengah (misal ganti kendaraan, renovasi, dana pendidikan anak).",
        points: 3,
      },
      {
        text: "Lebih dari 5 tahun (Jangka Panjang)",
        description: "Uang tidak akan diutak-atik (misal dana pensiun, kebebasan finansial jangka panjang).",
        points: 4,
      },
    ],
  },
  {
    id: "q2",
    question: "Bagaimana reaksi psikologis Anda jika portofolio investasi Anda tiba-tiba anjlok 15-20% dalam sebulan karena gejolak pasar?",
    subtitle: "Ketahanan emosi saat pasar bearish adalah kunci utama profil risiko",
    options: [
      {
        text: "Panik dan langsung jual semua agar tidak semakin rugi",
        description: "Sangat tidak nyaman melihat angka merah di layar saldo.",
        points: 1,
      },
      {
        text: "Merasa cemas, tapi menunggu dan tidak melakukan apa-apa",
        description: "Khawatir tapi masih menahan diri untuk melihat perkembangan situasi.",
        points: 2,
      },
      {
        text: "Tetap tenang karena paham ini siklus pasar yang wajar",
        description: "Fokus pada fundamental jangka panjang dan tidak terburu-buru.",
        points: 3,
      },
      {
        text: "Senang dan memanfaatkan diskon untuk 'serok' / beli lebih banyak",
        description: "Melihat koreksi pasar sebagai peluang emas (Dollar Cost Averaging).",
        points: 4,
      },
    ],
  },
  {
    id: "q3",
    question: "Apa tujuan utama yang paling Anda harapkan dari penempatan dana Anda?",
    subtitle: "Trade-off antara keamanan modal (capital preservation) vs pertumbuhan (capital gain)",
    options: [
      {
        text: "Keamanan modal 100% utuh tanpa risiko penurunan sedikitpun",
        description: "Meskipun imbal hasil hanya setara atau sedikit di atas inflasi.",
        points: 1,
      },
      {
        text: "Pertumbuhan stabil moderat yang mengalahkan inflasi dengan risiko kecil",
        description: "Lebih menyukai pendapatan berkala (kupon/bunga) yang dapat diprediksi.",
        points: 2,
      },
      {
        text: "Pertumbuhan aset yang signifikan dengan toleransi fluktuasi menengah",
        description: "Kombinasi pendapatan tetap dan pertumbuhan modal.",
        points: 3,
      },
      {
        text: "Maksimalisasi return berlipat ganda (High Risk, High Return)",
        description: "Siap menerima potensi kerugian modal demi potensi cuan maksimal.",
        points: 4,
      },
    ],
  },
  {
    id: "q4",
    question: "Seberapa stabil sumber penghasilan rutin bulanan Anda saat ini?",
    subtitle: "Stabilitas cashflow menentukan daya tahan keuangan menghadapi krisis",
    options: [
      {
        text: "Sangat tidak stabil / penghasilan tidak tentu tiap bulan",
        description: "Sering ada jeda pendapatan atau proyek freelance yang musiman.",
        points: 1,
      },
      {
        text: "Cukup stabil namun sering fluktuatif atau belum ada dana darurat",
        description: "Ada gaji pokok namun ada kekhawatiran jika terjadi kendala kerja.",
        points: 2,
      },
      {
        text: "Stabil dan teratur setiap bulan",
        description: "Karyawan tetap atau bisnis mapan dengan cashflow positif.",
        points: 3,
      },
      {
        text: "Sangat stabil dengan beberapa sumber penghasilan (multiple streams)",
        description: "Gaji tetap + side income + passive income yang mencukupi.",
        points: 4,
      },
    ],
  },
  {
    id: "q5",
    question: "Bagaimana tingkat pemahaman Anda terhadap instrumen pasar modal dan produk keuangan di Indonesia?",
    subtitle: "Tingkat literasi keuangan membantu memilih instrumen yang tepat dan aman",
    options: [
      {
        text: "Hanya familiar dengan Tabungan Bank dan Deposito konvensional",
        description: "Belum pernah membeli Reksadana, SBN, atau Saham.",
        points: 1,
      },
      {
        text: "Paham dasar Reksadana Pasar Uang dan Emas Batangan",
        description: "Pernah mencoba aplikasi investasi digital pemula.",
        points: 2,
      },
      {
        text: "Paham obligasi negara (SBN), reksadana campuran, dan saham indeks",
        description: "Mengerti konsep diversifikasi, dividen, dan yield.",
        points: 3,
      },
      {
        text: "Sangat paham analisis fundamental/teknikal saham, pasar global & derivatif",
        description: "Aktif mengelola portofolio mandiri di berbagai kelas aset.",
        points: 4,
      },
    ],
  },
];

export function evaluateRiskProfile(answers: Record<string, number>): RiskProfileData {
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

  if (totalScore <= 8) {
    return {
      profileType: "Konservatif",
      totalScore,
      maxScore: 20,
      summaryDescription:
        "Anda mengutamakan keamanan modal di atas segalanya. Anda tidak menyukai risiko penurunan nilai dan membutuhkan likuiditas tinggi untuk ketenangan pikiran.",
      investmentHorizon: "< 2 Tahun",
      toleranceToLoss: "Sangat rendah. Tidak siap menghadapi fluktuasi nilai modal.",
      recommendedAssetAllocation: {
        pasarUangDeposito: 50,
        obligasiSBN: 35,
        sahamEquity: 10,
        emasAsetAlternatif: 5,
      },
      suitableInstruments: [
        "Reksadana Pasar Uang (RDPU) Likuid",
        "Surat Berharga Negara Ritel (SBR / ORI / ST / SR)",
        "Deposito Bank Digital Berbunga Kompetitif",
        "Emas Batangan Fisik (Antam/Pegadaian)",
      ],
    };
  } else if (totalScore <= 13) {
    return {
      profileType: "Moderat",
      totalScore,
      maxScore: 20,
      summaryDescription:
        "Anda menginginkan pertumbuhan aset di atas laju inflasi dengan risiko terukur. Anda dapat mentoleransi fluktuasi nilai jangka pendek asalkan tren jangka menengah tetap naik.",
      investmentHorizon: "2 - 5 Tahun",
      toleranceToLoss: "Moderat. Mampu menerima koreksi pasar jangka pendek hingga 5-10%.",
      recommendedAssetAllocation: {
        pasarUangDeposito: 25,
        obligasiSBN: 40,
        sahamEquity: 25,
        emasAsetAlternatif: 10,
      },
      suitableInstruments: [
        "Reksadana Pendapatan Tetap (RDPT)",
        "SBN Ritel dengan Kupon Menarik (ORI / Sukuk Ritel SR)",
        "Reksadana Indeks Saham (IDX30 / LQ45)",
        "Reksadana Pasar Uang untuk penampung dana darurat",
        "Emas Batangan sebagai lindung nilai",
      ],
    };
  } else if (totalScore <= 17) {
    return {
      profileType: "Moderat-Agresif",
      totalScore,
      maxScore: 20,
      summaryDescription:
        "Anda siap menghadapi volatilitas pasar yang tinggi demi potensi imbal hasil yang optimal dalam jangka panjang (di atas 5 tahun). Anda melihat penurunan pasar sebagai peluang akumulasi.",
      investmentHorizon: "5 - 10 Tahun",
      toleranceToLoss: "Tinggi. Siap menerima koreksi pasar hingga 15-20% demi target jangka panjang.",
      recommendedAssetAllocation: {
        pasarUangDeposito: 15,
        obligasiSBN: 25,
        sahamEquity: 50,
        emasAsetAlternatif: 10,
      },
      suitableInstruments: [
        "Saham Blue Chip IHSG (Perbankan Big 4, Konsumer, Telco)",
        "Reksadana Saham & ETF Indeks (LQ45, IDX30)",
        "Reksadana Pendapatan Tetap (RDPT) sebagai penyeimbang",
        "SBN Ritel sebagai jangkar arus kas kupon bulanan",
      ],
    };
  } else {
    return {
      profileType: "Agresif",
      totalScore,
      maxScore: 20,
      summaryDescription:
        "Fokus utama Anda adalah pertumbuhan modal maksimal jangka panjang. Anda memiliki horizon waktu panjang, sumber penghasilan mapan, dan pemahaman pasar modal yang mendalam.",
      investmentHorizon: "> 10 Tahun",
      toleranceToLoss: "Sangat tinggi. Berfokus penuh pada capital gain jangka panjang.",
      recommendedAssetAllocation: {
        pasarUangDeposito: 10,
        obligasiSBN: 15,
        sahamEquity: 60,
        emasAsetAlternatif: 15,
      },
      suitableInstruments: [
        "Portofolio Saham Individual (Growth & Value Investing)",
        "Reksadana Saham Offshore / Teknologi Global",
        "ETF dan Indeks Saham Terkemuka",
        "Aset Kripto Terpilih (maksimal 5-10% dari total portofolio)",
        "RDPU/SBN untuk dana darurat",
      ],
    };
  }
}

export interface EducationArticle {
  id: string;
  category: "Piramida Keuangan" | "Instrumen Investasi" | "Aturan Budgeting" | "Asuransi & Proteksi" | "Bebas Utang";
  title: string;
  readTime: string;
  icon: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
}

export const financialArticles: EducationArticle[] = [
  {
    id: "piramida_keuangan",
    category: "Piramida Keuangan",
    title: "Fondasi Piramida Perencanaan Keuangan: Jangan Langsung Loncat Investasi!",
    readTime: "4 menit baca",
    icon: "Layers",
    summary: "Memahami urutan prioritas keuangan yang benar dari tingkat paling bawah (Cashflow & Dana Darurat) hingga puncak (Investasi & Warisan).",
    content: [
      "Banyak pemula terjebak langsung membeli saham atau kripto sebelum membereskan arus kas dan dana darurat. Akibatnya, saat ada kebutuhan mendadak, investasi terpaksa dijual rugi.",
      "Tingkat 1 (Dasar): Arus Kas Sehat & Manajemen Utang. Pastikan pendapatan lebih besar dari pengeluaran, dan cicilan utang tidak melebihi 30-35% pendapatan.",
      "Tingkat 2: Manajemen Risiko & Proteksi. Miliki Dana Darurat (3-12x pengeluaran) dan Asuransi Dasar (BPJS Kesehatan & Asuransi Jiwa jika ada tanggungan).",
      "Tingkat 3: Tujuan Keuangan Jangka Pendek & Menengah. DP rumah, modal nikah, atau pendidikan anak menggunakan instrumen rendah risiko seperti SBN dan RDPU.",
      "Tingkat 4: Investasi Pertumbuhan Jangka Panjang. Dana pensiun dan kebebasan finansial menggunakan saham, reksadana saham, dan properti.",
      "Tingkat 5 (Puncak): Distribusi Kekayaan & Warisan (Estate Planning). Memastikan warisan tertata rapi tanpa membebani keturunan.",
    ],
    keyTakeaways: [
      "Jangan pernah berinvestasi dengan uang dapur atau uang darurat.",
      "Dana darurat dan BPJS Kesehatan adalah sabuk pengaman sebelum Anda menginjak gas investasi.",
      "Setiap tingkatan piramida harus kokoh sebelum membangun lantai berikutnya.",
    ],
  },
  {
    id: "instrumen_indonesia",
    category: "Instrumen Investasi",
    title: "Mengenal Kelas Aset Investasi Legal di Indonesia (Berizin OJK & Kemenkeu)",
    readTime: "6 menit baca",
    icon: "TrendingUp",
    summary: "Panduan lengkap perbandingan SBN, Reksadana, Saham, Deposito, dan Emas batangan.",
    content: [
      "1. Reksadana Pasar Uang (RDPU): Wadah investasi yang mengalokasikan 100% dana ke deposito dan obligasi jatuh tempo <1 tahun. Kelebihan: Sangat likuid, tanpa potongan pajak (sudah nett), return rata-rata 4.5% - 6% p.a., bebas biaya beli/jual.",
      "2. Surat Berharga Negara (SBN Ritel: ORI, SR, SBR, ST): Surat utang yang diterbitkan resmi oleh Pemerintah Republik Indonesia melalui Kementerian Keuangan. Kupon dijamin 100% oleh Undang-Undang tanpa risiko gagal bayar. Pajak kupon hanya 10% (lebih rendah dari pajak bunga deposito 20%).",
      "3. Reksadana Pendapatan Tetap (RDPT): Berisi minimal 80% obligasi pemerintah atau korporasi. Cocok untuk jangka waktu 1 - 3 tahun dengan ekspektasi return 6% - 8.5% p.a.",
      "4. Saham (Bursa Efek Indonesia / BEI): Bukti kepemilikan atas suatu perusahaan terbuka. Menghasilkan potensi dividen tahunan dan kenaikan harga saham (capital gain). Volatilitas tinggi, cocok untuk jangka >5 tahun.",
      "5. Emas Batangan (Antam/UBS): Berfungsi sebagai lindung nilai (hedging) terhadap pelemahan nilai tukar dan inflasi jangka panjang (>5-10 tahun).",
    ],
    keyTakeaways: [
      "Pilih instrumen berdasarkan TUJUAN dan JANGKA WAKTU, bukan sekadar ikut tren teman.",
      "SBN Ritel adalah pilihan terbaik untuk passive income bulanan yang dijamin negara 100%.",
      "Pastikan selalu bertransaksi di platform yang terdaftar dan diawasi oleh OJK atau Bappebti.",
    ],
  },
  {
    id: "metode_budgeting",
    category: "Aturan Budgeting",
    title: "Aturan Alokasi Gaji: 50/30/20 vs Zero-Based Budgeting",
    readTime: "5 menit baca",
    icon: "PieChart",
    summary: "Memilih formula budgeting yang paling sesuai dengan tingkat penghasilan dan gaya hidup Anda.",
    content: [
      "Formula 50/30/20 Klasik: 50% untuk Kebutuhan Pokok (Needs), 30% untuk Keinginan & Lifestyle (Wants), dan 20% untuk Tabungan, Investasi, & Pelunasan Utang.",
      "Penyesuaian untuk Gaji UMR di Kota Besar (Formula 60/20/20): Jika biaya sewa dan makan tinggi, naikkan pos Kebutuhan Pokok ke 60%, tekan pos Keinginan ke 20%, dan pertahankan pos Investasi minimal 20%.",
      "Zero-Based Budgeting (Anggaran Berbasis Nol): Setiap rupiah yang masuk memiliki 'tugas' tertentu hingga sisa kas menjadi nol di awal bulan. Sangat efektif untuk menghentikan kebocoran halus.",
      "Prinsip 'Pay Yourself First': Segera pindahkan porsi tabungan & investasi (20%) pada hari Anda gajian ke rekening terpisah, JANGAN menabung dari sisa uang di akhir bulan.",
    ],
    keyTakeaways: [
      "Nabung bukan menyisakan, tapi menyisihkan di awal.",
      "Kebocoran halus (latte factor, delivery fee, langganan tak terpakai) bisa menggerus 10-15% gaji tanpa terasa.",
      "Gunakan fitur autodebet perbankan agar menabung berjalan otomatis tanpa godaan.",
    ],
  },
  {
    id: "asuransi_rasional",
    category: "Asuransi & Proteksi",
    title: "Strategi Proteksi Rasional: BPJS vs Asuransi Swasta vs Unit Link",
    readTime: "5 menit baca",
    icon: "ShieldCheck",
    summary: "Cara memilih asuransi yang tepat tanpa boncos membayar premi yang tidak perlu.",
    content: [
      "1. BPJS Kesehatan adalah Pondasi Wajib: Sistem jaminan kesehatan nasional tanpa batasan plafon (unlimited) untuk penyakit katastropik (kanker, jantung, cuci darah). Pastikan status kepesertaan selalu aktif.",
      "2. Siapa yang Butuh Asuransi Jiwa? HANYA orang yang memiliki tanggungan (istri/suami, anak, atau orang tua yang nafkahnya bergantung pada Anda). Jika Anda masih lajang tanpa tanggungan, asuransi jiwa BELUM prioritas.",
      "3. Pilih Asuransi Jiwa Murni (Term-Life): Biaya premi sangat terjangkau (misal Rp 200rb-500rb/bulan) untuk Uang Pertanggungan (UP) hingga Rp 1-2 Miliar. Hindari mencampur asuransi dengan investasi jika biaya preminya mahal.",
      "4. Rumus Menghitung Uang Pertanggungan (UP) Jiwa Ideal: UP = (Pengeluaran Bulanan Keluarga x 12 Bulan x 10 Tahun) + Total Sisa Hutang. Uang ini menjamin keluarga tetap bisa hidup layak jika pencari nafkah tutup usia.",
    ],
    keyTakeaways: [
      "Tujuan asuransi adalah PROTEKSI (mengganti risiko kerugian finansial), bukan mencari keuntungan investasi.",
      "Jangan bayar premi asuransi melebihi 10% dari total pendapatan bulanan Anda.",
      "Pisahkan rekening proteksi dan rekening investasi agar keduanya bekerja maksimal.",
    ],
  },
  {
    id: "bebas_utang",
    category: "Bebas Utang",
    title: "Strategi Bebas Jeratan Utang Konsumtif: Metode Snowball vs Avalanche",
    readTime: "4 menit baca",
    icon: "CheckCircle",
    summary: "Dua metode terbukti secara psikologis dan matematis untuk melunasi utang kartu kredit, pinjol, dan paylater.",
    content: [
      "Langkah Pertama: STOP menambah utang baru. Hapus aplikasi paylater dan batasi limit kartu kredit.",
      "Metode Bola Salju (Debt Snowball): Urutkan seluruh utang dari NOMINAL TERKECIL ke terbesar. Bayar cicilan minimum di semua utang, lalu fokuskan seluruh sisa uang ekstra untuk melunasi utang paling kecil. Keunggulan: Kemenangan cepat (quick wins) secara psikologis membangun motivasi tinggi.",
      "Metode Longsoran (Debt Avalanche): Urutkan utang berdasarkan SUKU BUNGA TERTINGGI (misal pinjol 24-36% p.a., kartu kredit 21% p.a., KTA, KKB). Lunasi utang berbunga tertinggi lebih dulu. Keunggulan: Secara matematis paling menghemat total biaya bunga.",
      "Restrukturisasi & Konsolidasi: Jika arus kas terjepit, hubungi pihak perbankan resmi untuk mengajukan perpanjangan tenor atau penurunan suku bunga.",
    ],
    keyTakeaways: [
      "Pilih metode yang paling cocok dengan kepribadian Anda: Snowball untuk dorongan emosi positif, Avalanche untuk efisiensi matematis bunga.",
      "DTI (Debt to Income ratio) di atas 30% adalah sinyal bahaya yang harus segera dibereskan.",
      "Setelah utang lunas, alihkan porsi cicilan tersebut langsung ke pos tabungan dana darurat.",
    ],
  },
];
