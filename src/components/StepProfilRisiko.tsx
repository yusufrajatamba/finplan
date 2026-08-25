import React, { useState } from "react";
import { RiskProfileData, RiskType } from "../types";
import {
  ShieldAlert,
  TrendingUp,
  PieChart,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Award,
  AlertCircle,
} from "lucide-react";

interface StepProfilRisikoProps {
  riskData: RiskProfileData;
  onChange: (updated: RiskProfileData) => void;
  onNext: () => void;
  onPrev: () => void;
}

const RISK_QUESTIONS = [
  {
    id: "q1",
    question: "Bagaimana reaksi Anda jika nilai investasi Anda turun 15-20% dalam 2 bulan karena gejolak pasar global?",
    options: [
      { text: "Sangat panik dan langsung mencairkan seluruh dana untuk mencegah rugi bertambah.", score: 1 },
      { text: "Khawatir dan memindahkan sebagian besar ke instrumen deposito / pasar uang yang aman.", score: 2 },
      { text: "Cukup tenang dan menunggu pemulihan pasar karena tujuan investasi masih jangka menengah.", score: 3 },
      { text: "Melihatnya sebagai peluang diskon emas dan justru menambah investasi secara bertahap.", score: 4 },
    ],
  },
  {
    id: "q2",
    question: "Berapa lama horizon waktu rata-rata investasi utama yang Anda rencanakan?",
    options: [
      { text: "Kurang dari 1 tahun (sangat likuid, kebutuhan mendesak).", score: 1 },
      { text: "1 sampai 3 tahun (jangka pendek - menengah).", score: 2 },
      { text: "3 sampai 7 tahun (jangka menengah untuk DP rumah / sekolah anak).", score: 3 },
      { text: "Lebih dari 7 sampai 15+ tahun (jangka panjang untuk dana pensiun / warisan).", score: 4 },
    ],
  },
  {
    id: "q3",
    question: "Apa prioritas utama Anda dalam berinvestasi saat ini?",
    options: [
      { text: "Keamanan modal 100% (pokok modal tidak boleh berkurang sama sekali).", score: 1 },
      { text: "Pendapatan stabil dengan risiko penurunan yang sangat terukur (mengalahkan inflasi sedikit).", score: 2 },
      { text: "Pertumbuhan modal seimbang dengan pembagian antara aset stabil dan aset bertumbuh.", score: 3 },
      { text: "Memaksimalkan pertumbuhan modal jangka panjang meski siap menghadapi volatilitas tinggi.", score: 4 },
    ],
  },
  {
    id: "q4",
    question: "Berapa tingkat pemahaman dan pengalaman Anda dalam instrumen pasar modal (Saham, Reksadana, SBN, Kripto)?",
    options: [
      { text: "Belum pernah berinvestasi, hanya menaruh uang di tabungan bank.", score: 1 },
      { text: "Pernah berinvestasi di Deposito, Emas Fisik, atau Reksadana Pasar Uang.", score: 2 },
      { text: "Paham cara kerja Obligasi Negara (SBN/ORI) dan Reksadana Campuran/Saham.", score: 3 },
      { text: "Aktif menganalisis saham individual, ETF indeks, atau instrumen alternatif lainnya.", score: 4 },
    ],
  },
];

export const StepProfilRisiko: React.FC<StepProfilRisikoProps> = ({
  riskData,
  onChange,
  onNext,
  onPrev,
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>({
    q1: 3,
    q2: 3,
    q3: 3,
    q4: 3,
  });

  const handleSelectOption = (qId: string, score: number) => {
    const newAnswers = {
      ...answers,
      [qId]: score,
    };
    setAnswers(newAnswers);

    // Calculate total score
    const scores = Object.values(newAnswers) as number[];
    const totalScore: number = scores.reduce((acc: number, curr: number) => acc + Number(curr), 0);

    // Determine category and asset allocation
    let profileType: RiskType = "Moderat";
    let desc = "";
    let horizon = "3 - 5 Tahun";
    let tolerance = "Siap menerima fluktuasi moderat.";
    let pasarUang = 20;
    let obligasi = 40;
    let saham = 30;
    let emas = 10;
    let instruments = [
      "Reksadana Pendapatan Tetap",
      "Obligasi Negara Ritel (ORI/SR)",
      "Reksadana Indeks IDX30",
      "Emas Logam Mulia",
    ];

    if (totalScore <= 6) {
      profileType = "Konservatif";
      desc = "Anda memprioritaskan keamanan modal pokok di atas segalanya dan menghindari fluktuasi harga.";
      horizon = "< 2 Tahun";
      tolerance = "Tidak siap menghadapi penurunan nilai modal.";
      pasarUang = 50;
      obligasi = 40;
      saham = 5;
      emas = 5;
      instruments = ["Reksadana Pasar Uang", "Deposito Bank BUKU IV", "SBN Syariah Sukuk"];
    } else if (totalScore <= 9) {
      profileType = "Moderat";
      desc = "Anda mencari keseimbangan antara pertumbuhan modal dan stabilitas portofolio.";
      horizon = "2 - 5 Tahun";
      tolerance = "Toleransi penurunan nilai sementara hingga 5-10%.";
      pasarUang = 30;
      obligasi = 40;
      saham = 20;
      emas = 10;
      instruments = ["Reksadana Pasar Uang", "SBN Ritel", "Reksadana Saham Dividen", "Emas"];
    } else if (totalScore <= 13) {
      profileType = "Moderat-Agresif";
      desc = "Anda siap menerima fluktuasi jangka pendek demi pertumbuhan nilai aset yang optimal di atas inflasi.";
      horizon = "5 - 10 Tahun";
      tolerance = "Toleransi penurunan nilai hingga 15-20% untuk pertumbuhan jangka panjang.";
      pasarUang = 15;
      obligasi = 30;
      saham = 45;
      emas = 10;
      instruments = ["Reksadana Saham", "Saham Bluechip BEI", "SBN Ritel Tenor Panjang", "Emas"];
    } else {
      profileType = "Agresif";
      desc = "Anda berfokus pada maksimalisasi imbal hasil jangka panjang dan sangat toleran terhadap volatilitas pasar.";
      horizon = "> 10 Tahun";
      tolerance = "Siap menerima volatilitas tinggi demi imbal hasil maksimal.";
      pasarUang = 10;
      obligasi = 20;
      saham = 55;
      emas = 15;
      instruments = ["Saham Mid & Small Cap", "ETF Indeks Global/US", "Reksadana Saham Agresif"];
    }

    onChange({
      profileType,
      totalScore,
      maxScore: 16,
      summaryDescription: desc,
      investmentHorizon: horizon,
      toleranceToLoss: tolerance,
      recommendedAssetAllocation: {
        pasarUangDeposito: pasarUang,
        obligasiSBN: obligasi,
        sahamEquity: saham,
        emasAsetAlternatif: emas,
      },
      suitableInstruments: instruments,
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#003399] via-[#0047BA] to-[#0055B8] rounded-2xl p-5 sm:p-6 text-white shadow-md border border-blue-800/40 space-y-1.5">
        <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-xs font-bold border border-white/20">
          <ShieldAlert className="w-3.5 h-3.5 text-blue-200" />
          <span>Langkah 5 dari 7 • Profil Risiko Investasi</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Profil Risiko & Toleransi Investasi
        </h1>
        <p className="text-blue-100/90 text-xs sm:text-sm leading-relaxed max-w-4xl">
          Asesmen psikologi dan toleransi risiko untuk memetakan alokasi aset yang proporsional antara instrumen likuid, pendapatan tetap, dan pertumbuhan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions Column */}
        <div className="lg:col-span-2 space-y-4">
          {RISK_QUESTIONS.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
            >
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {idx + 1}. {q.question}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.score;
                  return (
                    <button
                      key={opt.score}
                      onClick={() => handleSelectOption(q.id, opt.score)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/50 border-[#003399] text-[#003399] dark:text-blue-200 font-semibold shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? "border-[#003399] bg-[#003399] text-white"
                              : "border-slate-400"
                          }`}
                        >
                          {isSelected && <span className="text-[10px] font-bold">✓</span>}
                        </div>
                        <span>{opt.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Live Result Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5 sticky top-20">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Award className="w-5 h-5 text-[#003399] dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Hasil Profil Risiko Anda
              </h3>
            </div>

            <div className="text-center p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Kategori Profil
              </span>
              <span className="text-xl font-black text-[#003399] dark:text-blue-400 block mt-1">
                {riskData.profileType}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">
                Skor: {riskData.totalScore} / {riskData.maxScore}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {riskData.summaryDescription}
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Alokasi Aset Rekomendasi:
              </h4>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Pasar Uang / Deposito</span>
                    <span className="text-[#003399] dark:text-blue-400">{riskData.recommendedAssetAllocation?.pasarUangDeposito}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${riskData.recommendedAssetAllocation?.pasarUangDeposito}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Obligasi / SBN Ritel</span>
                    <span className="text-emerald-600">{riskData.recommendedAssetAllocation?.obligasiSBN}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${riskData.recommendedAssetAllocation?.obligasiSBN}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Saham / Ekuitas</span>
                    <span className="text-amber-600">{riskData.recommendedAssetAllocation?.sahamEquity}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${riskData.recommendedAssetAllocation?.sahamEquity}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Emas / Alternatif</span>
                    <span className="text-purple-600">{riskData.recommendedAssetAllocation?.emasAsetAlternatif}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${riskData.recommendedAssetAllocation?.emasAsetAlternatif}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onPrev}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Target Finansial</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-[#003399] hover:bg-[#002266] text-white font-bold text-sm shadow-md hover:scale-[1.01] transition-all cursor-pointer"
        >
          <span>Lanjut ke Langkah 6: Evaluasi Rasio & Standar OJK</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
