import React, { useState } from "react";
import { financialArticles, EducationArticle } from "../data/financialEducation";
import {
  financialGurusTheories,
  financialUniversityCurriculum,
  tenFamilyFinancialRules,
  FinancialGuruTheory,
} from "../data/financialTheoryData";
import {
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Search,
  Sparkles,
  Award,
  GraduationCap,
  Bookmark,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Compass,
} from "lucide-react";

interface EducationPageProps {
  onStartPlanning: () => void;
  onBack?: () => void;
  onAskAI: (question: string) => void;
  onOpenCalculators?: () => void;
}

export const EducationPage: React.FC<EducationPageProps> = ({
  onStartPlanning,
  onBack,
  onAskAI,
  onOpenCalculators,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<
    "gurus" | "curriculum" | "manifesto" | "articles" | "references"
  >("gurus");
  const [selectedGuru, setSelectedGuru] = useState<FinancialGuruTheory>(financialGurusTheories[0]);
  const [selectedArticle, setSelectedArticle] = useState<EducationArticle | null>(financialArticles[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [refCategory, setRefCategory] = useState<string>("Semua");

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
      implementedInFinPlan: "Rekomendasi alokasi obligasi negara aman di Langkah 7 bagi profil risiko moderat dan konservatif.",
      url: "https://www.kemenkeu.go.id/sbn",
      badge: "DJPPR Kemenkeu",
    },
    {
      id: "lps-rate",
      category: "Pasar & Makro",
      title: "Tingkat Bunga Penjaminan Lembaga Penjamin Simpanan (LPS)",
      sourceOrg: "Lembaga Penjamin Simpanan (LPS)",
      description: "Batas maksimal suku bunga deposito perbankan yang dijamin penuh negara hingga Rp 2 Miliar per nasabah per bank.",
      implementedInFinPlan: "Kriteria pemilihan pos simpanan dana darurat yang aman dan likuid.",
      url: "https://www.lps.go.id",
      badge: "LPS Resmi",
    },
    {
      id: "housel-psychology",
      category: "Buku & Pakar Global",
      title: "The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness",
      sourceOrg: "Morgan Housel",
      description: "Prinsip bahwa kesuksesan finansial ditentukan 80% oleh perilaku dan emosi manusia, bukan sekadar kecerdasan rumus.",
      implementedInFinPlan: "Guru Finansial #1, Konsep 'Enough', dan panduan kontrol gaya hidup.",
      url: "https://www.morganhousel.com/",
      badge: "Buku & Pakar",
    },
    {
      id: "sethi-rich",
      category: "Buku & Pakar Global",
      title: "I Will Teach You to Be Rich & Conscious Spending Plan",
      sourceOrg: "Ramit Sethi",
      description: "Sistem otomatisasi alokasi keuangan, Conscious Spending (belanja tanpa rasa bersalah pada hal yang disukai), dan 5-Layer Hierarchy.",
      implementedInFinPlan: "Guru Finansial #2, modul Conscious Spending dan 5-Layer Financial Framework.",
      url: "https://www.iwillteachyoutoberich.com/",
      badge: "Buku & Pakar",
    },
    {
      id: "collins-path",
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* ─── Hero Section: Master Knowledge Base ─── */}
      <div className="bg-gradient-to-r from-[#0B5DA7] via-[#0047BA] to-[#003399] rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-48 h-48 rounded-full bg-[#E8701A]/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Standar Resmi OJK & Kurikulum Certified Financial Planner (CFP®)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-heading">
              Edukatips Finansial & Master Knowledge Base
            </h1>

            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
              Pusat literasi keuangan keluarga terlengkap: intisari filosofi 10 guru finansial dunia, kurikulum belajar 8 semester, 10 manifesto aturan keluarga, dan referensi kebijakan resmi OJK & Bank Indonesia.
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-semibold">
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-white flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-300" /> 10 Guru Dunia
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-white flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-300" /> 8 Semester Roadmap
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-white flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-emerald-300" /> 10 Aturan Keluarga
              </span>
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 text-white flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-300" /> Rujukan OJK & BI
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={onStartPlanning}
              className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-[#E8701A] hover:bg-[#D6610E] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Mulai Rencana Finansial</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenCalculators && (
              <button
                onClick={onOpenCalculators}
                className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-bold border border-white/25 transition-all cursor-pointer"
              >
                <span>Buka Kalkulator Finansial</span>
                <Compass className="w-4 h-4" />
              </button>
            )}

            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-blue-100 text-xs font-semibold transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Navigation Tabs Bar ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 sm:p-2.5 shadow-sm border border-slate-200 dark:border-slate-800 sticky top-16 sm:top-20 z-30">
        <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto scrollbar-none py-1 px-1">
          {[
            { id: "gurus", label: "10 Guru Finansial Dunia", icon: Award, count: 10 },
            { id: "curriculum", label: "Kurikulum 8 Semester", icon: GraduationCap, count: 8 },
            { id: "manifesto", label: "10 Aturan Keluarga", icon: Bookmark, count: 10 },
            { id: "articles", label: "Artikel Literasi OJK & BI", icon: BookOpen, count: financialArticles.length },
            { id: "references", label: "Sumber & Rujukan Resmi", icon: ExternalLink, count: financialReferencesList.length },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeMainTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveMainTab(t.id as any)}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center space-x-2 cursor-pointer ${
                  isActive
                    ? "bg-[#0B5DA7] text-white shadow-md shadow-blue-900/20"
                    : "bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{t.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── TAB CONTENT ─── */}
      <div className="space-y-6">
        {/* ─── TAB 1: 10 GURU FINANSIAL DUNIA ──────────────────────────────── */}
        {activeMainTab === "gurus" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
              {/* Left Column: Guru Directory (4 cols) */}
              <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
                    Daftar Master Finansial
                  </span>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cari nama guru atau topik..."
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                    />
                  </div>
                </div>

                <div className="p-3 space-y-2 max-h-[620px] overflow-y-auto">
                  {filteredGurus.map((g) => {
                    const isSelected = selectedGuru.id === g.id;
                    return (
                      <button
                        key={g.id}
                        onClick={() => setSelectedGuru(g)}
                        className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-950/50 border-2 border-[#0B5DA7] shadow-sm"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent"
                        }`}
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md font-black ${
                                g.rank === 1
                                  ? "bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300"
                                  : g.rank === 2
                                  ? "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                                  : g.rank === 3
                                  ? "bg-orange-100 text-orange-900 dark:bg-orange-950/80 dark:text-orange-300"
                                  : "bg-blue-100 text-[#0B5DA7] dark:bg-blue-950 dark:text-blue-300"
                              }`}
                            >
                              #{g.rank}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide truncate">
                              {g.categoryTag || "Pakar"}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {g.author}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {g.coreRule}
                          </p>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isSelected ? "text-[#0B5DA7] dark:text-blue-400 translate-x-0.5" : "text-slate-400"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Guru Comprehensive Reader (8 cols) */}
              <div className="lg:col-span-8 p-6 sm:p-8 md:p-10 space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Author Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800 gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#0B5DA7] dark:text-blue-300 font-black text-xl flex items-center justify-center shadow-inner">
                        #{selectedGuru.rank}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#0B5DA7] dark:text-blue-400 uppercase tracking-wider block">
                          {selectedGuru.role}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5 font-heading">
                          {selectedGuru.author}
                        </h2>
                      </div>
                    </div>

                    {selectedGuru.categoryTag && (
                      <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 self-start sm:self-auto border border-slate-200 dark:border-slate-700">
                        {selectedGuru.categoryTag}
                      </span>
                    )}
                  </div>

                  {/* Quote Banner */}
                  <blockquote className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-[#0B5DA7] text-xs sm:text-sm italic text-slate-800 dark:text-slate-200 leading-relaxed shadow-xs">
                    "{selectedGuru.quote}"
                  </blockquote>

                  {/* Core Rule & Explanation */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#0B5DA7] text-white text-[11px] font-bold">
                        Inti Formula
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {selectedGuru.coreRule}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {selectedGuru.explanation}
                    </p>
                  </div>

                  {/* Key Takeaways */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Poin Kunci & Tindakan Finansial:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedGuru.keyTakeaways.map((pt, i) => (
                        <div
                          key={i}
                          className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Indonesia Applicability */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-950 dark:text-amber-200 leading-relaxed space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                      <span>🇮🇩 Penerapan Konkret di Indonesia:</span>
                    </span>
                    <p>{selectedGuru.applicabilityIndonesia}</p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ingin mendiskusikan penerapan filosofi {selectedGuru.author} pada kondisi Anda?
                  </p>
                  <button
                    onClick={() => {
                      onAskAI(
                        `Tolong jelaskan secara mendalam bagaimana saya bisa menerapkan filosofi ${selectedGuru.author} (${selectedGuru.coreRule}) ke dalam kondisi keuangan keluarga saya saat ini.`
                      );
                    }}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0B5DA7] hover:bg-[#0047BA] transition shadow-md cursor-pointer shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Konsultasi AI tentang {selectedGuru.author}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: FINANCIAL UNIVERSITY CURRICULUM (8 SEMESTERS) ────────── */}
        {activeMainTab === "curriculum" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="max-w-3xl space-y-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-bold">
                  <GraduationCap className="w-4 h-4" />
                  <span>Financial University • Roadmap Belajar Mandiri</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  Kurikulum 8 Semester Membangun Fondasi & Kebebasan Finansial
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Hindari membaca 10 buku acak sekaligus! Pelajari tahap demi tahap secara runut dari dasar pola pikir, budgeting otomatis, proteksi keluarga, hingga investasi pasif jangka panjang.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                {financialUniversityCurriculum.map((sem) => (
                  <div
                    key={sem.semester}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-purple-300 dark:hover:border-purple-700 transition-all flex flex-col justify-between space-y-4 shadow-xs"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-purple-600 text-white uppercase tracking-wider">
                          Semester {sem.semester}
                        </span>
                        {sem.sourceUrl && (
                          <a
                            href={sem.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline flex items-center"
                          >
                            <ExternalLink className="w-3 h-3 mr-0.5" /> Buku
                          </a>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">
                          {sem.category}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-0.5 line-clamp-2">
                          {sem.bookTitle}
                        </h4>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Karya: {sem.author}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30 text-xs text-purple-950 dark:text-purple-200 font-medium">
                        ❓ <em>"{sem.keyQuestion}"</em>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                      <strong className="text-slate-900 dark:text-white block font-bold">Fokus Bab:</strong>
                      <p className="line-clamp-3">{sem.readingAdvice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: 10 ATURAN KEUANGAN KELUARGA (MANIFESTO) ─────────────── */}
        {activeMainTab === "manifesto" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="max-w-3xl space-y-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0B5DA7] dark:text-blue-300 text-xs font-bold">
                  <Bookmark className="w-4 h-4" />
                  <span>Financial Manifesto • Standar Ketahanan Keluarga</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  10 Aturan Keuangan Keluarga FinPlan (Golden Manifesto)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Prinsip perilaku abadi yang mengintegrasikan panduan OJK dengan filosofi Warren Buffett, Morgan Housel, JL Collins, dan Benjamin Graham untuk menjaga keluarga Anda tetap aman dalam segala badai ekonomi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                {tenFamilyFinancialRules.map((rule) => (
                  <div
                    key={rule.ruleNumber}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-[#0B5DA7] transition-all space-y-3 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black px-2.5 py-1 rounded-md bg-[#0B5DA7] text-white">
                          RULE #{rule.ruleNumber}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                          {rule.guruInfluence}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {rule.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 italic border-l-2 border-[#0B5DA7] pl-3 py-0.5">
                        "{rule.principle}"
                      </p>
                    </div>

                    <div className="pt-2">
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-[#0B5DA7] dark:text-blue-300 font-semibold flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Tindakan: {rule.practicalAction}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: ARTIKEL LITERASI OJK & BI ────────────────────────────── */}
        {activeMainTab === "articles" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
              {/* Left Column: Article Directory (4 cols) */}
              <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cari topik artikel literasi..."
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                    />
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setActiveCategory(c)}
                        className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer ${
                          activeCategory === c
                            ? "bg-[#0B5DA7] text-white shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 space-y-2 max-h-[620px] overflow-y-auto">
                  {filteredArticles.map((art) => {
                    const isSelected = selectedArticle?.id === art.id;
                    return (
                      <button
                        key={art.id}
                        onClick={() => setSelectedArticle(art)}
                        className={`w-full text-left p-4 rounded-2xl transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-950/50 border-2 border-[#0B5DA7] shadow-sm"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {art.category}
                          </span>
                          <span className="text-[10px] text-slate-400">{art.readTime}</span>
                        </div>
                        <h3
                          className={`text-xs sm:text-sm font-bold line-clamp-2 ${
                            isSelected ? "text-[#0B5DA7] dark:text-blue-300" : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {art.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {art.summary}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Article Reader (8 cols) */}
              <div className="lg:col-span-8 p-6 sm:p-8 md:p-10 space-y-6">
                {selectedArticle ? (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-bold text-[#0B5DA7] dark:text-blue-400 uppercase tracking-wider">
                        <span>{selectedArticle.category}</span>
                        <span>•</span>
                        <span>{selectedArticle.readTime}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 font-heading">
                        {selectedArticle.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium leading-relaxed">
                        {selectedArticle.summary}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-3">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block uppercase tracking-wider">
                        Poin Kunci (Key Takeaways):
                      </span>
                      <ul className="space-y-2">
                        {selectedArticle.keyTakeaways.map((k, i) => (
                          <li key={i} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start">
                            <CheckCircle2 className="w-4 h-4 text-[#0B5DA7] mr-2.5 flex-shrink-0 mt-0.5" />
                            <span>{k}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedArticle.content.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-xs text-slate-500">
                        Punya pertanyaan seputar artikel literasi ini?
                      </p>
                      <button
                        onClick={() => {
                          onAskAI(
                            `Saya sedang membaca artikel "${selectedArticle.title}". Tolong jelaskan bagaimana cara menerapkannya dalam perencanaan keuangan keluarga saya.`
                          );
                        }}
                        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0B5DA7] hover:bg-[#0047BA] shadow-md transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
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
          </div>
        )}

        {/* ─── TAB 5: DAFTAR RUJUKAN & SUMBER KNOWLEDGE RESMI ──────────────── */}
        {activeMainTab === "references" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div>
                <span className="text-xs font-bold text-[#0B5DA7] dark:text-blue-400 uppercase tracking-wider block">
                  Transparansi & Legalitas Knowledge
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5 font-heading">
                  Daftar Rujukan & Sumber Resmi FinPlan
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Seluruh formula, batasan rasio, dan kurikulum dalam FinPlan merujuk langsung pada literatur resmi otoritas finansial dan pakar dunia.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
                {["Semua", "Regulasi & OJK", "Buku & Pakar Global", "Pasar & Makro"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setRefCategory(cat)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer ${
                      refCategory === cat
                        ? "bg-[#0B5DA7] text-white shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List of References */}
            <div className="space-y-4">
              {filteredReferences.map((ref, idx) => (
                <div
                  key={ref.id}
                  className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-[#0B5DA7] shadow-xs transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center space-x-3">
                      <span className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0B5DA7] dark:text-blue-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              ref.category === "Regulasi & OJK"
                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                                : ref.category === "Buku & Pakar Global"
                                ? "bg-blue-100 dark:bg-blue-950 text-[#0B5DA7] dark:text-blue-300"
                                : "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300"
                            }`}
                          >
                            {ref.badge}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">
                            {ref.sourceOrg}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-1">
                          {ref.title}
                        </h4>
                      </div>
                    </div>

                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-[#0B5DA7] text-[#0B5DA7] hover:text-white dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto shrink-0 border border-blue-200 dark:border-blue-800"
                    >
                      <span>Buka Sumber Resmi</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ref.description}
                  </p>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-750 text-xs flex items-start space-x-2.5">
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

      {/* ─── Bottom Call to Action Banner ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-lg">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg sm:text-xl font-bold font-heading">
            Siap Mempraktikkan Teori Ini ke Keuangan Riil Anda?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Terapkan seluruh formula rasio OJK, dana darurat, dan alokasi aset CFP® secara otomatis melalui alur Perencanaan Finansial 7 Langkah FinPlan.
          </p>
        </div>

        <button
          onClick={onStartPlanning}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-[#E8701A] hover:bg-[#D6610E] text-white text-xs sm:text-sm font-bold shadow-xl transition-all cursor-pointer shrink-0"
        >
          <span>Mulai Buat Rencana Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
