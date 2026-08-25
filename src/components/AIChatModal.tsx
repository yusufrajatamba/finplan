import React, { useState, useRef, useEffect } from "react";
import { AIChatMessage, UserProfile, CashflowData, TargetGoalsData, RiskProfileData, FinancialPlanResult } from "../types";
import {
  X,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  CreditCard,
  Home,
  TrendingUp,
  ShieldCheck,
  Compass,
  ArrowRight,
  Info,
} from "lucide-react";
import { generateMasterFinancialPrompt, openInChatGPT, openInGemini, openInClaude } from "../utils/aiPromptExporter";

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  cashflow: CashflowData;
  goals: TargetGoalsData;
  risk: RiskProfileData;
  plan: FinancialPlanResult | null;
}

interface QuestionCategory {
  id: string;
  name: string;
  icon: any;
  questions: string[];
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  profile,
  cashflow,
  goals,
  risk,
  plan,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("utang");
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Halo **${profile.fullName || "Sobat FinPlan"}**! 👋 Saya adalah **Coach FinPlan Bot** bersertifikasi CFP & OJK.\n\nSeluruh data keuangan, cicilan, dan target Anda telah tersambung. **Pilih topik pertanyaan di bawah** untuk mendapatkan analisis dan rekomendasi langkah aksi finansial yang tepat untuk Anda.`,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const QUESTION_CATEGORIES: QuestionCategory[] = [
    {
      id: "utang",
      name: "Utang & DSR",
      icon: CreditCard,
      questions: [
        "Apakah rasio cicilan utang (DSR) saya saat ini sudah aman menurut OJK?",
        "Bagaimana strategi pelunasan utang tercepat (Snowball vs Avalanche) untuk saya?",
        "Kapan saya boleh menambah cicilan utang baru?",
      ],
    },
    {
      id: "rumah",
      name: "Rumah & KPR",
      icon: Home,
      questions: [
        "Bagaimana strategi terbaik untuk mengumpulkan DP rumah dalam 3 tahun?",
        "Berapa batas angsuran cicilan KPR yang sehat untuk penghasilan bulanan saya?",
        "Berapa biaya legalitas & akad (BPHTB, Notaris) yang harus disiapkan sebelum beli rumah?",
      ],
    },
    {
      id: "investasi",
      name: "Investasi & Portofolio",
      icon: TrendingUp,
      questions: [
        `Berapa alokasi investasi bulanan yang cocok untuk profil risiko ${risk.profileType || "Moderat"}?`,
        "Kapan sebaiknya memilih SBN Ritel vs Reksadana vs Saham Dividen IDX30?",
        "Bagaimana cara eksekusi Dollar Cost Averaging (DCA) agar investasi konsisten?",
      ],
    },
    {
      id: "proteksi",
      name: "Darurat & Asuransi",
      icon: ShieldCheck,
      questions: [
        "Berapa target dana darurat ideal untuk keluarga saya dan harus disimpan di mana?",
        "Berapa kebutuhan Uang Pertanggungan (UP) asuransi jiwa & batas maksimal premi bulanan?",
        "Apakah cukup hanya mengandalkan BPJS Kesehatan atau perlu asuransi swasta tambahan?",
      ],
    },
    {
      id: "pensiun",
      name: "Pensiun & FIRE",
      icon: Compass,
      questions: [
        "Berapa modal yang dibutuhkan untuk pensiun aman dengan aturan SWR 4% Trinity Study?",
        "Bagaimana membagi 11 pos anggaran agar tidak ada uang yang bocor halus?",
      ],
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopyMasterPrompt = () => {
    const prompt = generateMasterFinancialPrompt(profile, cashflow, goals, risk, plan);
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    showToast("📋 Master Prompt Keuangan Lengkap Berhasil Disalin!");
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  const handleOpenChatGPT = () => {
    const prompt = generateMasterFinancialPrompt(profile, cashflow, goals, risk, plan);
    openInChatGPT(prompt);
    showToast("🚀 Membuka ChatGPT dengan data keuangan lengkap Anda...");
  };

  const handleOpenGemini = () => {
    const prompt = generateMasterFinancialPrompt(profile, cashflow, goals, risk, plan);
    openInGemini(prompt);
    showToast("📋 Data Keuangan Disalin! Tekan Paste (Ctrl+V) di jendela Gemini.");
  };

  const handleOpenClaude = () => {
    const prompt = generateMasterFinancialPrompt(profile, cashflow, goals, risk, plan);
    openInClaude(prompt);
    showToast("📋 Data Keuangan Disalin! Tekan Paste (Ctrl+V) di jendela Claude.");
  };

  if (!isOpen) return null;

  const handleSelectQuestion = async (questionText: string) => {
    if (isLoading) return;

    const userMsg: AIChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: questionText,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: questionText,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          userContext: {
            profile,
            cashflow,
            goals,
            risk,
            plan,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg: AIChatMessage = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: data.reply || "Maaf, data tidak dapat dihitung saat ini.",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Bot response error:", err);
      // Fallback
      const assistantMsg: AIChatMessage = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: `Evaluasi CFP untuk ${profile.fullName || "Klien"}: Berdasarkan total pemasukan Rp ${((cashflow.monthlyMainIncome || 0) + (cashflow.monthlySideIncome || 0)).toLocaleString("id-ID")}/bln, pastikan dana darurat minimal 6x pengeluaran pokok telah aman di RDPU dan batas total cicilan tidak melampaui 30% pendapatan bulanan.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestions = QUESTION_CATEGORIES.find((c) => c.id === activeCategory)?.questions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full h-[90vh] max-h-[850px] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-60 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-white/20 flex items-center space-x-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-xs">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-base">CFP Financial Bot & Konsultan AI</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/30 text-emerald-100 text-[10px] font-bold">
                  Data Terverifikasi
                </span>
              </div>
              <p className="text-xs text-purple-200">Panduan terstruktur berbasis data riil keuangan Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI External Connect Bar (Konsultasi Akun Sendiri) */}
        <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-200 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Bawa Data ke AI Sendiri (Bebas Tanya):</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleOpenChatGPT}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center space-x-1 transition-all shadow-xs cursor-pointer"
              title="Buka langsung di ChatGPT dengan prompt data keuangan lengkap"
            >
              <span>ChatGPT</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={handleOpenGemini}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center space-x-1 transition-all shadow-xs cursor-pointer"
              title="Buka di Google Gemini (Prompt otomatis tersalin)"
            >
              <span>Gemini</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={handleOpenClaude}
              className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold flex items-center space-x-1 transition-all shadow-xs cursor-pointer"
              title="Buka di Claude (Prompt otomatis tersalin)"
            >
              <span>Claude</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={handleCopyMasterPrompt}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold flex items-center space-x-1 transition-all border border-slate-300 dark:border-slate-600 cursor-pointer"
              title="Salin Master Prompt Finansial ke Clipboard"
            >
              {copiedPrompt ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPrompt ? "Tersalin!" : "Salin Prompt"}</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50/50 dark:bg-slate-900/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "user"
                    ? "bg-slate-900 dark:bg-slate-700 text-white"
                    : "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl max-w-[88%] text-xs sm:text-sm leading-relaxed space-y-1 ${
                  msg.role === "user"
                    ? "bg-slate-900 dark:bg-slate-800 text-white rounded-tr-none shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-tl-none whitespace-pre-wrap shadow-sm"
                }`}
              >
                <div>{msg.content}</div>
                <div className={`text-[10px] text-right ${msg.role === "user" ? "text-slate-400" : "text-slate-400"}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400 text-xs pl-2 py-2">
              <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
              <span>Coach FinPlan sedang menghitung formula & menganalisis profil Anda...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ─── INTERACTIVE QUESTION MENU (NO FREE-TEXT CONFUSION) ─── */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Topik:
            </span>
            {QUESTION_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Clickable Question Pills */}
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {currentQuestions.map((q, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSelectQuestion(q)}
                className="w-full text-left p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-300 dark:hover:border-purple-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 transition-all flex items-center justify-between group cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-medium group-hover:text-purple-700 dark:group-hover:text-purple-300">
                    {q}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-purple-500" />
              <span>Klik pertanyaan di atas untuk kalkulasi instan.</span>
            </div>
            <span>Ingin tanya bebas? Gunakan tombol AI di atas.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
