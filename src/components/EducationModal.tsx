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
  const [activeMainTab, setActiveMainTab] = useState<"gurus" | "curriculum" | "manifesto" | "articles">("gurus");
  const [selectedGuru, setSelectedGuru] = useState<FinancialGuruTheory>(financialGurusTheories[0]);
  const [selectedArticle, setSelectedArticle] = useState<EducationArticle | null>(financialArticles[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");

  if (!isOpen) return null;

  const categories = [
    "Semua",
    "Piramida Keuangan",
    "Instrumen Investasi",
    "Aturan Budgeting",
    "Asuransi & Proteksi",
    "Bebas Utang",
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full h-[92vh] max-h-[780px] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-blue-900/60 flex items-center justify-between bg-[#002266] text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0055B8] text-white flex items-center justify-center border border-blue-400/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Edukatips Finansial & Master Knowledge Base
              </h2>
              <p className="text-xs text-blue-200">
                10 Guru Finansial Dunia, Kurikulum 8 Semester, 10 Aturan Keluarga, dan Standar Resmi OJK
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
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveMainTab(t.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap shrink-0 flex items-center space-x-1.5 cursor-pointer ${
                activeMainTab === t.id
                  ? "bg-[#003399] text-white shadow-xs"
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
                      className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition cursor-pointer"
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
      </div>
    </div>
  );
};
