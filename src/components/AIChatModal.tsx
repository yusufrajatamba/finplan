import React, { useState, useRef, useEffect } from "react";
import { AIChatMessage, UserProfile, CashflowData, TargetGoalsData, RiskProfileData, FinancialPlanResult } from "../types";
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  Lightbulb,
  MessageSquare,
} from "lucide-react";

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  cashflow: CashflowData;
  goals: TargetGoalsData;
  risk: RiskProfileData;
  plan: FinancialPlanResult | null;
}

const QUICK_PROMPTS = [
  "Bagaimana strategi terbaik untuk mengumpulkan DP rumah dalam 3 tahun?",
  "Apakah rasio utang dan pengeluaran saya saat ini sudah aman menurut OJK?",
  "Berapa alokasi investasi yang cocok untuk profil risiko saya?",
  "Bagaimana cara mempercepat pengumpulan dana darurat keluarga?",
];

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  profile,
  cashflow,
  goals,
  risk,
  plan,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Halo ${profile.fullName || "Sobat Finansial"}! Saya AI Financial Planner Anda. Saya siap membantu Anda menganalisis cashflow, strategi pelunasan utang, rekomendasi portofolio investasi, hingga perencanaan dana rumah & pendidikan anak. Apa yang ingin Anda diskusikan?`,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
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
        content: data.reply || "Maaf, saya tidak dapat memproses jawaban saat ini.",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("AI Chat error:", err);
      // Helpful fallback response
      const fallbackMsg: AIChatMessage = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: `Berdasarkan data keuangan Anda (Pemasukan Rp ${((cashflow.monthlyMainIncome || 0) + (cashflow.monthlySideIncome || 0)).toLocaleString("id-ID")}/bln dengan Profil Risiko ${risk.profileType}): Disarankan mengutamakan pemenuhan Dana Darurat minimal 6x pengeluaran pokok di Reksadana Pasar Uang sebelum mengeksekusi investasi saham agresif. Jaga cicilan utang maksimal 30% dari total pendapatan bulanan Anda.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-xs">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-base">CFP AI Advisor & Konsultan Finansial</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/30 text-emerald-100 text-[10px] font-bold">
                  Gemini Online
                </span>
              </div>
              <p className="text-xs text-purple-100">Didukung pemahaman penuh profil keuangan Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
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
                className={`p-4 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed space-y-1 ${
                  msg.role === "user"
                    ? "bg-slate-900 dark:bg-slate-800 text-white rounded-tr-none"
                    : "bg-slate-100 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 rounded-tl-none whitespace-pre-wrap"
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
            <div className="flex items-center space-x-3 text-slate-400 text-xs pl-2">
              <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
              <span>AI Advisor sedang menganalisis data keuangan Anda...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 shrink-0 flex items-center space-x-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Saran:</span>
          </span>
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 whitespace-nowrap hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all shrink-0 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanyakan apapun seputar keuangan, cicilan, KPR, investasi..."
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl transition-all disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
