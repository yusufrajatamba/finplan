import React, { useState } from "react";
import { financialArticles, EducationArticle } from "../data/financialEducation";
import { BookOpen, X, ChevronRight, CheckCircle2, Search, Sparkles } from "lucide-react";

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
  const [selectedArticle, setSelectedArticle] = useState<EducationArticle | null>(
    financialArticles[0]
  );
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
    const matchCategory =
      activeCategory === "Semua" || art.category === activeCategory;
    const matchSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full h-[90vh] max-h-[750px] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Akademi & Kamus Belajar Keuangan Mandiri
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pahami fondasi finansial Indonesia secara sistematis & obyektif
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Article List (5 cols) */}
          <div className="md:col-span-5 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full overflow-hidden bg-slate-50/30 dark:bg-slate-850/30">
            {/* Search & Category Filter */}
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
                    className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap transition ${
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

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredArticles.map((art) => {
                const isSelected = selectedArticle?.id === art.id;
                return (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    className={`w-full text-left p-3.5 rounded-2xl transition flex flex-col justify-between ${
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
          <div className="md:col-span-7 flex-col h-full overflow-y-auto p-6 sm:p-8 space-y-6 flex">
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

                {/* Ask Coach AI Button for this topic */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <button
                    onClick={() => {
                      onAskAI(`Saya sedang membaca tentang "${selectedArticle.title}". Tolong jelaskan bagaimana cara menerapkannya dalam kondisi keuangan saya.`);
                      onClose();
                    }}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition"
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
      </div>
    </div>
  );
};
