import React, { useState, useRef, useEffect } from "react";
import { UserProfile, CashflowData, GeneratedFinancialPlan } from "../types";
import { MessageSquareText, Send, X, Bot, User, Sparkles, Loader2, ArrowUpRight } from "lucide-react";

interface AdvisorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  cashflow: CashflowData;
  plan: GeneratedFinancialPlan | null;
  initialMessage?: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export const AdvisorChatModal: React.FC<AdvisorChatModalProps> = ({
  isOpen,
  onClose,
  profile,
  cashflow,
  plan,
  initialMessage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_welcome",
      sender: "ai",
      text: `Halo ${profile.fullName || "Sobat Finansial"}! Saya Coach Finansial AI bersertifikasi CFP. Saya siap membantu menjawab pertanyaan seputar alokasi dana darurat, pemilihan asuransi murni vs unit link, instrumen SBN/Reksadana, hingga strategi pelunasan cicilan Anda. Ada yang ingin Anda diskusikan?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (initialMessage && isOpen) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, isOpen]);

  const presetQuestions = [
    "Bagaimana cara membedakan kebutuhan (Needs) vs keinginan (Wants)?",
    "Kapan saya harus mulai membeli asuransi jiwa?",
    "Apa keuntungan SBN Ritel ORI/SR dibandingkan Deposito Bank?",
    "Bagaimana strategi melunasi hutang paylater tanpa terjerat denda?",
  ];

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: "usr_" + Date.now(),
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          userContext: {
            profile,
            cashflow,
            planSummary: plan ? {
              healthScore: plan.healthScore.overall,
              budgetBlueprint: plan.budgetPlan,
              recommendedAllocation: plan.investmentPortfolio,
            } : null,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menghubungi Advisor AI");
      }

      const data = await response.json();
      const aiReply: ChatMessage = {
        id: "ai_" + Date.now(),
        sender: "ai",
        text: data.reply || "Maaf, saya tidak dapat merespons saat ini.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      const errorReply: ChatMessage = {
        id: "err_" + Date.now(),
        sender: "ai",
        text: "Maaf, terjadi kendala saat memproses konsultasi Anda. Pastikan koneksi internet stabil atau coba tanyakan topik lain.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full h-[90vh] max-h-[750px] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Coach Finansial AI Mandiri
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  CFP Persona
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Didukung model Gemini AI & Konteks Keuangan Personal Anda
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

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isAI = m.sender === "ai";
            return (
              <div
                key={m.id}
                className={`flex items-start space-x-2.5 ${
                  isAI ? "justify-start" : "justify-end"
                }`}
              >
                {isAI && (
                  <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-3xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isAI
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-750 whitespace-pre-line"
                      : "bg-blue-600 text-white shadow-xs"
                  }`}
                >
                  {m.text}
                  <span
                    className={`block text-[9px] mt-1.5 ${
                      isAI ? "text-slate-400" : "text-blue-100 text-right"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                {!isAI && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Coach AI sedang memikirkan rekomendasi terbaik...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="px-4 sm:px-6 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {presetQuestions.map((pq, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(pq)}
                className="text-[11px] px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap transition flex items-center space-x-1 flex-shrink-0 shadow-2xs font-medium"
              >
                <span>{pq}</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tanyakan apa saja seputar keuangan, asuransi, atau investasi..."
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`p-2.5 rounded-2xl transition ${
                inputValue.trim() && !isLoading
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
