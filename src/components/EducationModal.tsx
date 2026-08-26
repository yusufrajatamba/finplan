import React, { useState } from "react";
import { financialArticles, EducationArticle } from "../data/financialEducation";
import {
  financialGurusTheories,
  financialUniversityCurriculum,
  tenFamilyFinancialRules,
  fiveLayerHierarchyFramework,
  FinancialGuruTheory,
} from "../data/financialTheoryData";
import {
  BookOpen,
  X,
  ChevronRight,
  CheckCircle2,
  Search,
  Sparkles,
  Award,
  GraduationCap,
  Bookmark,
  ExternalLink,
  Layers,
  ArrowRight,
} from "lucide-react";

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAI: (question: string) => void;
}

export const EducationModal: React.FC<EducationModalProps> = ({
  isOpen,
  onClose,
  onAskAI,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<"gurus" | "curriculum" | "manifesto" | "articles" | "references">("gurus");
  const [selectedGuru, setSelectedGuru] = useState<FinancialGuruTheory>(financialGurusTheories[0]);
  const [selectedArticle, setSelectedArticle] = useState<EducationArticle | null>(financialArticles[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [refCategory, setRefCategory] = useState<string>("Semua");

  if (!isOpen) return null;

  const categories = [
    "Semua",
    "Piramida Keuangan",
    "Instrumen Investasi",
    "Aturan Budgeting",
    "Asuransi & Proteksi",
    "Bebas Utang",
  ];

  const financialReferencesList = [
    {
      id: "ojk-buku-9",
      category: "Regulasi & OJK",
      title: "Buku 9 Seri Literasi Keuangan: Perencanaan Keuangan Keluarga",
      sourceOrg: "Otoritas Jasa Keuangan (OJK)",
      description: "Pedoman resmi rasio kesehatan keuangan rumah tangga Indonesia, formula dana darurat bertingkat, batas aman cicilan kredit DSR ≤30%, dan tabungan ≥10-20%.",
      implementedInFinPlan: "Diagnosis 6 Rasio Finansial (Langkah 6), batas aman cicilan DSR ≤30%, dan target dana darurat keluarga.",
      url: "https://sikapiuangmu.ojk.go.id",
      badge: "OJK Resmi",
    },
    {
      id: "fpsb-cfp",
      category: "Regulasi & OJK",
      title: "Kurikulum & Standar Sertifikasi Certified Financial Planner (CFP®)",
      sourceOrg: "FPSB Indonesia (Financial Planning Standards Board)",
      description: "Kaidah baku 6-Step Financial Planning Process, Capital Needs Analysis, dan standar etika perencanaan keuangan independen.",
      implementedInFinPlan: "Alur 7 langkah komprehensif, perhitungan Uang Pertanggungan (UP) asuransi jiwa murni, dan profiling risiko.",
      url: "https://fpsbindonesia.net",
      badge: "Standar CFP®",
    },
    {
      id: "seojk-paydi",
      category: "Regulasi & OJK",
      title: "SEOJK No. 5/SEOJK.05/2022 tentang Produk Asuransi Yang Dikaitkan dengan Investasi (PAYDI)",
      sourceOrg: "Otoritas Jasa Keuangan (OJK)",
      description: "Regulasi transparansi biaya akuisisi, pemisahan proteksi vs investasi, dan perlindungan konsumen asuransi unit link.",
      implementedInFinPlan: "Modul edukasi asuransi unit link vs asuransi jiwa murni (Term Life) di Langkah 7 & Edukatips.",
      url: "https://www.ojk.go.id",
      badge: "Regulasi OJK",
    },
    {
      id: "bi-rate",
      category: "Pasar & Makro",
      title: "Suku Bunga Acuan (BI-Rate) & Laporan Kebijakan Moneter",
      sourceOrg: "Bank Indonesia (BI)",
      description: "Data indikator transmisi suku bunga, inflasi nasional, dan suku bunga penjaminan simpanan perbankan.",
      implementedInFinPlan: "Ticker makroekonomi terintegrasi, acuan return RDPU dan instrumen pasar uang.",
      url: "https://www.bi.go.id",
      badge: "Bank Indonesia",
    },
    {
      id: "kemenkeu-sbn",
      category: "Pasar & Makro",
      title: "Penerbitan Surat Berharga Negara Ritel (SBN: ORI, SBR, SR, ST)",
      sourceOrg: "Kementerian Keuangan RI (DJPPR)",
      description: "Informasi kupon obligasi negara ritel terbitan pemerintah RI sebagai instrumen pendapatan tetap aman bebas risiko gagal bayar.",
      implementedInFinPlan: "Simulasi alokasi aset pendapatan tetap berkupon bulanan di Langkah 7.",
      url: "https://www.kemenkeu.go.id",
      badge: "Kemenkeu RI",
    },
    {
      id: "bpjs-kesehatan-tk",
      category: "Regulasi & OJK",
      title: "Jaminan Kesehatan Nasional (JKN) & Program Jamsostek (JHT, JKK, JKM, JP)",
      sourceOrg: "BPJS Kesehatan & BPJS Ketenagakerjaan",
      description: "Sistem jaminan sosial nasional sebagai fondasi proteksi dasar kesehatan dan ketenagakerjaan seluruh warga Indonesia.",
      implementedInFinPlan: "Lapisan proteksi pertama (Layer 2) pada hirarki anggaran keluarga FinPlan.",
      url: "https://bpjs-kesehatan.go.id",
      badge: "Jaminan Sosial",
    },
    {
      id: "housel-psychology",
      category: "Buku & Pakar Global",
      title: "The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness",
      sourceOrg: "Morgan Housel (Collaborative Fund)",
      description: "Analisis perilaku mengelola uang, konsep 'Wealth ≠ Income', Room for Error, dan bahaya inflasi gaya hidup.",
      implementedInFinPlan: "Guru Finansial #1, peringatan 3 jebakan kekayaan, dan filosofi titik cukup (Enough).",
      url: "https://collabfund.com/blog/the-psychology-of-money/",
      badge: "Buku & Pakar",
    },
    {
      id: "sethi-iwtytbr",
      category: "Buku & Pakar Global",
      title: "I Will Teach You to Be Rich: Conscious Spending Plan",
      sourceOrg: "Ramit Sethi",
      description: "Sistem otomasi arus kas harian, hirarki anggaran 5 lapis, dan penentuan definisi 'Rich Life' keluarga.",
      implementedInFinPlan: "Guru Finansial #2, 5-Layer Financial Hierarchy, dan strategi autodebet tabungan awal bulan.",
      url: "https://www.iwillteachyoutoberich.com/",
      badge: "Buku & Pakar",
    },
    {
      id: "collins-simple-path",
      category: "Buku & Pakar Global",
      title: "The Simple Path to Wealth: Your Road Map to Financial Independence",
      sourceOrg: "JL Collins",
      description: "Panduan investasi pasif berbasis indeks pasar luas (Broad Market Indexing), dana 'F-You Money', dan disiplin jangka panjang.",
      implementedInFinPlan: "Guru Finansial #5, strategi DCA reksa dana indeks/pasar uang, dan kalkulator bebas finansial.",
      url: "https://jlcollinsnh.com/stock-series/",
      badge: "Buku & Pakar",
    },
    {
      id: "buffett-munger-letters",
      category: "Buku & Pakar Global",
      title: "Berkshire Hathaway Annual Shareholder Letters & Circle of Competence",
      sourceOrg: "Warren Buffett & Charlie Munger",
      description: "Prinsip pelestarian modal ('Preserve the ability to stay in the game'), anti-leverage spekulasi, dan bunga majemuk.",
      implementedInFinPlan: "Guru Finansial #4, Rule 72 Bunga Majemuk, dan strategi anti-utang konsumtif.",
      url: "https://www.berkshirehathaway.com/letters/letters.html",
      badge: "Buku & Pakar",
    },
    {
      id: "graham-intelligent-investor",
      category: "Buku & Pakar Global",
      title: "The Intelligent Investor: Margin of Safety Principle",
      sourceOrg: "Benjamin Graham",
      description: "Konsep Margin of Safety (ruang aman finansial) untuk melindungi kekayaan dari ketidakpastian masa depan.",
      implementedInFinPlan: "Kalkulator Margin of Safety dan batas ketahanan kas darurat keluarga.",
      url: "https://en.wikipedia.org/wiki/The_Intelligent_Investor",
      badge: "Buku & Pakar",
    },
    {
      id: "robin-your-money",
      category: "Buku & Pakar Global",
      title: "Your Money or Your Life: Transforming Your Relationship with Money",
      sourceOrg: "Vicki Robin & Joe Dominguez",
      description: "Mengukur nilai uang berdasarkan energi hidup (Life Energy / jam kerja yang dikorbankan) dan konsep Crossover Point.",
      implementedInFinPlan: "Guru Finansial #6 dan Kalkulator Nilai Energi Hidup (Langkah 7).",
      url: "https://yourmoneyoryourlife.com/",
      badge: "Buku & Pakar",
    },
    {
      id: "stanley-millionaire-next-door",
      category: "Buku & Pakar Global",
      title: "The Millionaire Next Door: Expected Net Worth Formula (PAW vs UAW)",
      sourceOrg: "Thomas J. Stanley & William D. Danko",
      description: "Kajian empiris gaya hidup hemat miliarder sejati dan formula target kekayaan bersih ideal berdasarkan usia.",
      implementedInFinPlan: "Kalkulator Akumulator Kekayaan Bersih (PAW / AAW / UAW) di simulasi FinPlan.",
      url: "https://en.wikipedia.org/wiki/The_Millionaire_Next_Door",
      badge: "Buku & Pakar",
    },
    {
      id: "bogle-bogleheads",
      category: "Buku & Pakar Global",
      title: "The Little Book of Common Sense Investing & Bogleheads Philosophy",
      sourceOrg: "John C. Bogle / Bogleheads Community",
      description: "Prinsip investasi berbasis biaya rendah, diversifikasi maksimal, dan menolak biaya manajemen tinggi yang menggerus return.",
      implementedInFinPlan: "Rekomendasi pemilihan instrumen investasi berbiaya rendah (TER rendah) di Langkah 7.",
      url: "https://www.bogleheads.org/",
      badge: "Buku & Pakar",
    },
    {
      id: "perkins-die-with-zero",
      category: "Buku & Pakar Global",
      title: "Die with Zero: Getting All You Can from Your Money and Your Life",
      sourceOrg: "Bill Perkins",
      description: "Konsep Time-Bucketing: memaksimalkan kepuasan hidup di setiap dekade usia tanpa meninggalkan penyesalan.",
      implementedInFinPlan: "Guru Finansial #10 dan modul alokasi budget kenikmatan hidup keluarga (Layer 5).",
      url: "https://www.diewithzerobook.com/",
      badge: "Buku & Pakar",
    },
  ];

  const filteredArticles = financialArticles.filter((art) => {
    const matchCategory = activeCategory === "Semua" || art.category === activeCategory;
    const matchSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const filteredGurus = financialGurusTheories.filter((g) => {
    const term = searchTerm.toLowerCase();
    return (
      g.author.toLowerCase().includes(term) ||
      g.title.toLowerCase().includes(term) ||
      g.coreRule.toLowerCase().includes(term)
    );
  });

  const filteredReferences = financialReferencesList.filter((ref) => {
    const matchCategory = refCategory === "Semua" || ref.category === refCategory;
    const matchSearch =
      ref.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.sourceOrg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.implementedInFinPlan.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full h-[92vh] max-h-[780px] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-blue-900/60 flex items-center justify-between bg-[#0B5DA7] text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/15 text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Edukatips Finansial & Master Knowledge Base
              </h2>
              <p className="text-xs text-blue-100">
                10 Guru Finansial Dunia, Kurikulum 8 Semester, 10 Aturan Keluarga, Standar Resmi OJK & Sumber Rujukan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Tab Navigation */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-2 bg-slate-50/50 dark:bg-slate-850/50 overflow-x-auto scrollbar-none">
          {[
            { id: "gurus", label: "🧠 10 Guru Finansial Dunia", icon: Award },
            { id: "curriculum", label: "🎓 Kurikulum 8 Semester", icon: GraduationCap },
            { id: "manifesto", label: "📜 10 Aturan Keluarga", icon: Bookmark },
            { id: "articles", label: "📚 Artikel Literasi OJK & BI", icon: BookOpen },
            { id: "references", label: "🔗 Sumber & Rujukan Resmi", icon: ExternalLink },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveMainTab(t.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap shrink-0 flex items-center space-x-1.5 cursor-pointer ${
                activeMainTab === t.id
                  ? "bg-[#0B5DA7] text-white shadow-xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200/80 dark:border-slate-700"
              }`}
            >
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ─── TAB 1: 10 GURU FINANSIAL DUNIA ──────────────────────────────── */}
        {activeMainTab === "gurus" && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            {/* Left Guru List (5 cols) */}
            <div className="md:col-span-5 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full overflow-hidden bg-slate-50/30 dark:bg-slate-850/30">
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-800">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari guru finansial / topik..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                {filteredGurus.map((g) => {
                  const isSelected = selectedGuru.id === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGuru(g)}
                      className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 shadow-xs"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center space-x-1.5 mb-0.5">
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                            g.rank === 1 ? "bg-amber-100 text-amber-900" : g.rank === 2 ? "bg-slate-200 text-slate-800" : g.rank === 3 ? "bg-orange-100 text-orange-900" : "bg-blue-100 text-blue-900"
                          }`}>
                            #{g.rank}
                          </span>
                          <h4 className="text-xs font-bold truncate text-slate-900 dark:text-white">{g.author}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{g.coreRule}</p>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-[#003399] dark:text-blue-400" : "text-slate-400"}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Guru Viewer (7 cols) */}
            <div className="md:col-span-7 flex flex-col h-full overflow-y-auto p-5 sm:p-7 space-y-5">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#003399] dark:text-blue-400 font-black text-sm">
                    #{selectedGuru.rank}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#003399] dark:text-blue-400 uppercase tracking-wider">
                      {selectedGuru.role}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{selectedGuru.author}</h2>
                  </div>
                </div>
                {selectedGuru.categoryTag && (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                    {selectedGuru.categoryTag}
                  </span>
                )}
              </div>

              <blockquote className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-l-4 border-[#003399] text-xs italic text-slate-700 dark:text-slate-300 leading-relaxed">
                "{selectedGuru.quote}"
              </blockquote>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Esensi Filosofi:
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedGuru.explanation}
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Poin Kunci & Tindakan:
                </h4>
                {selectedGuru.keyTakeaways.map((pt, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200">
                <strong>🇮🇩 Penerapan di Indonesia:</strong> {selectedGuru.applicabilityIndonesia}
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => {
                    onAskAI(`Tolong jelaskan secara mendalam bagaimana saya bisa menerapkan filosofi ${selectedGuru.author} (${selectedGuru.coreRule}) ke dalam kondisi keuangan keluarga saya saat ini.`);
                    onClose();
                  }}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#003399] hover:bg-[#002266] transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Konsultasi AI tentang {selectedGuru.author}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: FINANCIAL UNIVERSITY CURRICULUM (8 SEMESTERS) ────────── */}
        {activeMainTab === "curriculum" && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
            <div className="max-w-3xl">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Financial University — Roadmap Belajar Mandiri
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                Kurikulum 8 Semester Membangun Sistem Keuangan Keluarga
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Jangan membaca 10 buku sekaligus! Ikuti urutan semester ini agar pemahaman finansial Anda terstruktur dari mindset, sistem, proteksi, hingga kebebasan finansial.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {financialUniversityCurriculum.map((sem) => (
                <div
                  key={sem.semester}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 uppercase">
                      Semester {sem.semester} • {sem.category}
                    </span>
                    {sem.sourceUrl && (
                      <a href={sem.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:underline flex items-center">
                        <ExternalLink className="w-2.5 h-2.5 mr-0.5" /> Sumber
                      </a>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{sem.bookTitle}</h4>
                    <span className="text-[11px] text-slate-500">Karya: {sem.author}</span>
                  </div>

                  <p className="text-xs text-purple-950 dark:text-purple-200 font-semibold">
                    ❓ Pertanyaan: "{sem.keyQuestion}"
                  </p>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                    <strong>Fokus Bab:</strong> {sem.readingAdvice}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 3: 10 ATURAN KEUANGAN KELUARGA (MANIFESTO) ─────────────── */}
        {activeMainTab === "manifesto" && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
            <div className="max-w-3xl">
              <span className="text-xs font-bold text-[#003399] dark:text-blue-400 uppercase tracking-wider">
                Financial Manifesto
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                10 Aturan Keuangan Keluarga (Yusuf Family Rules)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Prinsip perilaku abadi yang menyatukan filosofi Buffett, Housel, Collins, Graham, dan OJK untuk menjaga ketahanan kekayaan keluarga.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {tenFamilyFinancialRules.map((rule) => (
                <div
                  key={rule.ruleNumber}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#003399] text-white">
                      RULE #{rule.ruleNumber}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">{rule.guruInfluence}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{rule.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{rule.principle}"</p>
                  <div className="pt-1 text-[11px] text-[#003399] dark:text-blue-300 font-medium">
                    ✓ Tindakan: {rule.practicalAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 4: ARTIKEL LITERASI OJK & BI ────────────────────────────── */}
        {activeMainTab === "articles" && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            {/* Left Article List (5 cols) */}
            <div className="md:col-span-5 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full overflow-hidden bg-slate-50/30 dark:bg-slate-850/30">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari topik finansial..."
                    className="w-full pl-9 pr-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveCategory(c)}
                      className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
                        activeCategory === c
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200/80 dark:border-slate-700"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredArticles.map((art) => {
                  const isSelected = selectedArticle?.id === art.id;
                  return (
                    <button
                      key={art.id}
                      onClick={() => setSelectedArticle(art)}
                      className={`w-full text-left p-3.5 rounded-2xl transition flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 shadow-xs"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {art.category}
                        </span>
                        <span className="text-[10px] text-slate-400">{art.readTime}</span>
                      </div>
                      <h3
                        className={`text-xs font-bold line-clamp-2 ${
                          isSelected ? "text-blue-900 dark:text-blue-200" : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {art.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {art.summary}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Article Viewer (7 cols) */}
            <div className="md:col-span-7 flex flex-col h-full overflow-y-auto p-6 sm:p-8 space-y-6">
              {selectedArticle ? (
                <div className="space-y-5">
                  <div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {selectedArticle.category} • {selectedArticle.readTime}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {selectedArticle.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium leading-relaxed">
                      {selectedArticle.summary}
                    </p>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-2.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Poin Kunci (Key Takeaways):
                    </span>
                    <ul className="space-y-2">
                      {selectedArticle.keyTakeaways.map((k, i) => (
                        <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{k}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedArticle.content.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <button
                      onClick={() => {
                        onAskAI(`Saya sedang membaca tentang "${selectedArticle.title}". Tolong jelaskan bagaimana cara menerapkannya dalam kondisi keuangan saya.`);
                        onClose();
                      }}
                      className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-[#0B5DA7] hover:bg-[#074580] shadow-md shadow-blue-950/20 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tanya Coach AI tentang Topik Ini</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Pilih salah satu artikel di sebelah kiri untuk membaca.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 5: DAFTAR RUJUKAN & SUMBER KNOWLEDGE RESMI ──────────────── */}
        {activeMainTab === "references" && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-[#0B5DA7] dark:text-blue-400 uppercase tracking-wider block">
                  Transparansi & Legalitas Knowledge
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Daftar Rujukan & Sumber Resmi FinPlan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Seluruh formula, batasan rasio, dan kurikulum dalam FinPlan merujuk langsung pada literatur resmi otoritas finansial dan pakar dunia.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
                {["Semua", "Regulasi & OJK", "Buku & Pakar Global", "Pasar & Makro"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setRefCategory(cat)}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer ${
                      refCategory === cat
                        ? "bg-[#0B5DA7] text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List of References */}
            <div className="space-y-3.5">
              {filteredReferences.map((ref, idx) => (
                <div
                  key={ref.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-[#0B5DA7]/50 shadow-xs transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start sm:items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0B5DA7] dark:text-blue-400 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              ref.category === "Regulasi & OJK"
                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                                : ref.category === "Buku & Pakar Global"
                                ? "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300"
                                : "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300"
                            }`}
                          >
                            {ref.badge}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            {ref.sourceOrg}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-1">
                          {ref.title}
                        </h4>
                      </div>
                    </div>

                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-[#0B5DA7] text-[#0B5DA7] hover:text-white dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shrink-0 border border-blue-200 dark:border-blue-800"
                    >
                      <span>Buka Sumber Resmi</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ref.description}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-750 text-xs flex items-start space-x-2">
                    <span className="text-[#0B5DA7] dark:text-blue-400 font-bold shrink-0">
                      ⚡ Penerapan di FinPlan:
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {ref.implementedInFinPlan}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
