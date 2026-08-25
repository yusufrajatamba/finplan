import React, { useEffect, useState } from "react";
import { TrendingUp, ShieldCheck, Activity, Coins, Sparkles, RefreshCw } from "lucide-react";

export const MarketInsightsBanner: React.FC = () => {
  const [insights, setInsights] = useState<any>({
    biRate: "6.00% - 6.25%",
    inflationYearly: "2.8%",
    sbnYield: "6.4% - 6.75% p.a.",
    rdpuAverageReturn: "5.2% - 6.0% p.a.",
    depositoAverage: "3.75% - 4.5% p.a.",
    goldPricePerGram: "Rp 1.500.000",
    updateDate: "Agustus 2026",
  });
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/market-insights");
      if (res.ok) {
        const data = await res.json();
        if (data.benchmarks) {
          setInsights(data.benchmarks);
        }
      }
    } catch (err) {
      console.warn("Using offline benchmark cache");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="bg-slate-900 text-slate-100 py-2.5 px-4 border-b border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-blue-400 font-semibold tracking-wide flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Indikator Pasar Indonesia ({insights.updateDate || "Terkini"}):</span>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-6 overflow-x-auto w-full md:w-auto py-0.5 scrollbar-none justify-start md:justify-end text-slate-300">
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">BI Rate:</span>
            <span className="font-semibold text-white">{insights.biRate}</span>
          </div>

          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">SBN Ritel Yield:</span>
            <span className="font-semibold text-white">{insights.sbnYield}</span>
          </div>

          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">RDPU Return:</span>
            <span className="font-semibold text-white">{insights.rdpuAverageReturn}</span>
          </div>

          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Emas:</span>
            <span className="font-semibold text-white">{insights.goldPricePerGram}</span>
          </div>

          <button
            onClick={fetchInsights}
            disabled={loading}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-800"
            title="Perbarui Data Acuan Pasar"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin text-blue-400" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
