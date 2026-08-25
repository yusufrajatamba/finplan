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
      instruments = ["Saham Blue Chip IHSG", "Reksadana Saham", "Obligasi ORI/SR", "Emas"];
    } else {
      profileType = "Agresif";
      desc = "Anda memiliki horizon investasi jangka panjang dan memaksimalkan potensi imbal hasil saham/ekuitas tinggi.";
      horizon = "> 10 Tahun";
      tolerance = "Siap menghadapi volatilitas pasar tinggi demi akumulasi aset masif.";
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
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Langkah 6 dari 8 • Analisis Toleransi Risiko</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Kuesioner Profil Risiko & Alokasi Portofolio
          </h1>
          <p className="text-amber-100 text-sm sm:text-base mt-2 leading-relaxed">
            Menjawab 4 pertanyaan ini membantu AI menentukan porsi instrumen investasi (Pasar Uang, SBN/Obligasi, Saham, Emas) yang tepat agar rencana finansial tidak membebani ketenangan pikiran Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions Column */}
        <div className="lg:col-span-2 space-y-5">
          {RISK_QUESTIONS.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex items-start space-x-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                  {q.question}
                </h3>
              </div>

              <div className="space-y-2.5 pt-1 pl-9">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.score;
                  return (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => handleSelectOption(q.id, opt.score)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-950 dark:text-amber-200 shadow-xs"
                          : "bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <span className="pr-3">{opt.text}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-amber-600 bg-amber-600 text-white"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Result & Recommendation Summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5 sticky top-20">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
                <PieChart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Hasil Profil Risiko</h3>
                <p className="text-xs text-slate-500">Skor Total: {riskData.totalScore || 12}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-center space-y-1.5">
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                Kategori Profil Investor
              </span>
              <div className="text-2xl font-extrabold text-amber-950 dark:text-amber-100">
                {riskData.profileType}
              </div>
              <p className="text-xs text-amber-900/80 dark:text-amber-200/80 pt-1 leading-relaxed">
                {riskData.summaryDescription}
              </p>
            </div>

            {/* Asset Allocation Bars */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Rekomendasi Alokasi Portofolio:
              </h4>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Pasar Uang & Kas Likuid</span>
                    <span className="text-blue-600">{riskData.recommendedAssetAllocation?.pasarUangDeposito}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full"
                      style={{ width: `${riskData.recommendedAssetAllocation?.pasarUangDeposito}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">Obligasi Negara & SBN</span>
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
                    <span className="text-slate-700 dark:text-slate-300">Saham & Reksadana Saham</span>
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
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Teori Keuangan</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-500/20 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <span>Buat Rencana Finansial (Langkah 7 & 8)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
