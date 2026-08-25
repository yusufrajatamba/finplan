import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import {
  financialGurusTheories,
  ojkStandards,
  localFinancialTheories,
  financialFormulas,
} from "./src/data/financialTheoryData";
import {
  topInsuranceProviders,
  insuranceCalculationGuide,
  ojkInsuranceRegulations,
  insuranceEducation,
} from "./src/data/insuranceData";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// ─── Gemini Client ─────────────────────────────────────────────────────────────

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "MY_GEMINI_API_KEY") return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } },
  });
}

// Model priority: use stable models first
const GEMINI_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"];

async function tryGenerateWithModels(
  ai: GoogleGenAI,
  contents: any,
  config: any
): Promise<string | null> {
  for (const modelName of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config,
      });
      if (response.text) return response.text;
    } catch (err: any) {
      if (
        err?.status === "RESOURCE_EXHAUSTED" ||
        err?.code === 429 ||
        err?.message?.includes("429") ||
        err?.message?.includes("quota")
      ) {
        break; // Stop on quota error
      }
      // Continue trying next model for other errors
    }
  }
  return null;
}

// ─── Vercel AI Gateway Client ──────────────────────────────────────────────────

async function tryGenerateWithAIGateway(
  messages: Array<{ role: string; content: string }>,
  systemInstruction?: string
): Promise<string | null> {
  const gatewayKey = process.env.AI_GATEWAY_KEY || process.env.VERCEL_AI_GATEWAY_KEY;
  if (!gatewayKey || gatewayKey.trim() === "") return null;

  const formattedMessages: Array<{ role: string; content: string }> = [];
  if (systemInstruction) {
    formattedMessages.push({ role: "system", content: systemInstruction });
  }
  for (const m of messages) {
    formattedMessages.push({
      role: m.role === "model" || m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    });
  }

  const endpoints = [
    {
      url: "https://ai-gateway.vercel.sh/v1/chat/completions",
      models: ["google/gemini-2.0-flash", "google/gemini-1.5-flash", "openai/gpt-4o-mini"],
    },
    {
      url: "https://gateway.ai.cloudflare.com/v1/chat/completions",
      models: ["google/gemini-2.0-flash", "openai/gpt-4o-mini"],
    },
  ];

  for (const ep of endpoints) {
    for (const model of ep.models) {
      try {
        const res = await fetch(ep.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${gatewayKey}`,
          },
          body: JSON.stringify({
            model,
            messages: formattedMessages,
            temperature: 0.7,
          }),
        });

        if (res.ok) {
          const data = (await res.json()) as any;
          const reply = data?.choices?.[0]?.message?.content;
          if (reply && typeof reply === "string") return reply;
        }
      } catch {
        // Try next endpoint/model
      }
    }
  }
  return null;
}

// ─── Deterministic CFP Financial Plan Engine ──────────────────────────────────

function generateDeterministicFinancialPlan(data: any) {
  const profile = data.profile || {};
  const cashflow = data.cashflow || {};
  const career = data.career || { personal: {} };
  const goals = data.goals || {};
  const risk = data.risk || { profileType: "Moderat" };

  const monthlyIncome =
    (cashflow.monthlyMainIncome || 0) +
    (cashflow.monthlySideIncome || 0) +
    (cashflow.partnerMainIncome || 0) +
    (cashflow.partnerSideIncome || 0) +
    (cashflow.businessPassiveIncome || 0) +
    (cashflow.investmentPassiveIncome || 0);

  const livingCost =
    (cashflow.monthlyNeeds || 0) +
    (cashflow.housingExpense || 0) +
    (cashflow.utilitiesExpense || 0) +
    (cashflow.transportationExpense || 0) +
    (cashflow.familySupportExpense || 0) +
    (cashflow.educationCurrentExpense || 0);

  const debtsList: any[] = cashflow.debts || [];
  const totalDebtsMonthly = debtsList.reduce((acc, d) => acc + (d.monthlyPayment || 0), 0);
  const totalDebtsRemaining = debtsList.reduce((acc, d) => acc + (d.totalRemaining || 0), 0);

  const existingInsurance = cashflow.monthlyExistingInsurance || 0;
  const currentWants = cashflow.monthlyWants || 0;

  const liquidCash = (cashflow.cashEmergencyFund || 0) + (cashflow.bankSavings || 0) + (cashflow.deposits || 0);
  const investmentAssets = (cashflow.stocks || 0) + (cashflow.mutualFunds || 0) + (cashflow.gold || 0) + (cashflow.cryptoAssets || 0);
  const physicalAssets = (cashflow.propertyValue || 0) + (cashflow.vehicleValue || 0) + (cashflow.otherAssets || 0);
  const totalAssets = liquidCash + investmentAssets + physicalAssets;
  const currentNetWorth = totalAssets - totalDebtsRemaining;

  const recNeeds = livingCost > 0 ? livingCost : Math.round(monthlyIncome * 0.5);
  const recDebt = totalDebtsMonthly;
  const isMarriedOrDeps = profile.maritalStatus === "Menikah" || (profile.dependents || 0) > 0;
  const recInsurance = existingInsurance > 0
    ? existingInsurance
    : isMarriedOrDeps ? Math.round(monthlyIncome * 0.05) : Math.round(monthlyIncome * 0.03);
  const recSavings = Math.max(0, monthlyIncome - recNeeds - recDebt - recInsurance - Math.round(monthlyIncome * 0.15));
  const recWants = Math.max(0, monthlyIncome - recNeeds - recDebt - recInsurance - recSavings);

  const isFreelance = career.personal?.jobType === "Freelancer / Profesional" || career.personal?.jobType === "Wirausaha / Bisnis";
  const emergencyMultiplier = isFreelance ? (isMarriedOrDeps ? 12 : 9) : (isMarriedOrDeps ? 9 : 6);
  const baseLivingCostForEmergency = livingCost > 0 ? livingCost : Math.round(monthlyIncome * 0.5);
  const targetEmergencyFund = Math.max(25000000, baseLivingCostForEmergency * emergencyMultiplier);
  const currentEmergencyFund = (cashflow.cashEmergencyFund || 0) + (cashflow.bankSavings || 0);

  // Health Score
  const dti = monthlyIncome > 0 ? (totalDebtsMonthly / monthlyIncome) * 100 : 0;
  const debtScore = dti === 0 ? 100 : dti <= 15 ? 95 : dti <= 30 ? 80 : dti <= 40 ? 55 : 25;
  const emergencyCoverageMonths = baseLivingCostForEmergency > 0 ? currentEmergencyFund / baseLivingCostForEmergency : 0;
  const liquidityScore = emergencyCoverageMonths >= emergencyMultiplier ? 100 : Math.min(95, Math.round((emergencyCoverageMonths / emergencyMultiplier) * 100));
  const savingsRate = monthlyIncome > 0 ? (recSavings / monthlyIncome) * 100 : 0;
  const savingsScore = savingsRate >= 25 ? 100 : savingsRate >= 20 ? 85 : savingsRate >= 10 ? 65 : 40;
  const protectionScore = profile.hasPrivateInsurance ? 95 : profile.bpjsStatus?.includes("Aktif") ? 80 : 50;
  const solvencyScore = totalAssets > 0 ? Math.min(100, Math.max(10, Math.round(((totalAssets - totalDebtsRemaining) / totalAssets) * 100))) : 60;
  const healthScore = Math.min(100, Math.max(20, Math.round((liquidityScore * 0.25) + (debtScore * 0.25) + (savingsScore * 0.25) + (protectionScore * 0.15) + (solvencyScore * 0.1))));

  // Multi-Year Projections
  const expectedReturn = risk.profileType === "Agresif" || risk.profileType === "Sangat Agresif" ? 0.11 : risk.profileType === "Moderat" || risk.profileType === "Moderat-Agresif" ? 0.09 : 0.065;
  const multiYearProjections = [1, 3, 5, 10, 15].map((yr) => {
    const monthlyRate = expectedReturn / 12;
    const totalMonths = yr * 12;
    const fvLumpSum = totalAssets * Math.pow(1 + expectedReturn, yr);
    const fvAnnuity = monthlyRate > 0 ? recSavings * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) : recSavings * totalMonths;
    const projNetWorth = Math.round(fvLumpSum + fvAnnuity);
    const projEmergency = Math.min(targetEmergencyFund, Math.round(currentEmergencyFund + (recSavings * 0.4 * Math.min(totalMonths, 24))));
    const monthlyPassive = Math.round((projNetWorth * 0.05) / 12);
    let goalsStatus = "Fondasi dana darurat dan proteksi keluarga diperkuat.";
    if (yr === 3) goalsStatus = "Target DP Rumah / kendaraan terpenuhi, dana darurat 100% aman.";
    else if (yr === 5) goalsStatus = "Portofolio bertumbuh, persiapan dana pendidikan jenjang lanjut.";
    else if (yr === 10) goalsStatus = "Akumulasi aset mapan, pasif income mulai menopang kebutuhan rutin.";
    else if (yr === 15) goalsStatus = "Kemerdekaan finansial (Financial Freedom) & persiapan pensiun mandiri.";
    return { year: yr, projectedNetWorth: projNetWorth, emergencyFundTotal: projEmergency, estimatedMonthlyPassiveIncome: monthlyPassive, goalsStatus };
  });

  const isMarried = profile.maritalStatus === "Menikah" || (profile.dependents || 0) > 0;
  const partnerInfo = profile.partnerName ? ` bersama pasangan (${profile.partnerName})` : profile.maritalStatus === "Menikah" ? " bersama pasangan" : "";

  const strategicMilestones = [
    {
      timeframe: "Bulan 1-3",
      title: isMarried ? "Otomasi Arus Kas Keluarga & Dana Darurat" : "Otomasi Autodebet & Dana Darurat",
      description: isMarried
        ? `Pisahkan rekening operasional rumah tangga dari tabungan. Setup autodebet dana darurat keluarga (${emergencyMultiplier}x pengeluaran) ke instrumen likuid (RDPU/SBN).`
        : "Pisahkan rekening operasional dari rekening tabungan. Setup autodebet tabungan pada tanggal gajian ke RDPU.",
      targetAllocation: `Rp ${Math.round(recSavings * 0.5).toLocaleString("id-ID")}/bulan ke RDPU/SBN`,
    },
    {
      timeframe: "Bulan 4-6",
      title: isMarried ? "Audit Pengeluaran & Proteksi Polis Keluarga" : "Audit Pengeluaran & Proteksi Polis",
      description: isMarried
        ? `Amankan asuransi jiwa pencari nafkah keluarga (UP tunai 10x biaya hidup keluarga) dan pastikan kepesertaan BPJS/asuransi kesehatan seluruh anggota keluarga aktif.`
        : "Pastikan kepesertaan BPJS Kesehatan aktif dan amankan polis asuransi jiwa murni (Term-Life) jika memiliki tanggungan.",
      targetAllocation: "Premi hemat terjangkau (Maks 5% - 10% income)",
    },
    {
      timeframe: "Tahun 1-2",
      title: isMarried ? "Investasi Rutin DCA & Dana Pendidikan / Rumah" : "Investasi Rutin DCA & Target DP Rumah",
      description: isMarried
        ? `Rutin Dollar-Cost Averaging portofolio keluarga ke SBN Ritel, RDPT, dan Indeks Saham IDX30 untuk persiapan DP rumah keluarga dan dana pendidikan anak.`
        : "Rutin Dollar-Cost Averaging ke instrumen SBN Ritel, RDPT, dan Indeks Saham IDX30 sesuai profil risiko.",
      targetAllocation: `${risk.profileType || "Moderat"} Portofolio Keluarga`,
    },
    {
      timeframe: "Tahun 3-5",
      title: isMarried ? "Akselerasi Kekayaan Bersih Keluarga & Pensiun Bersama" : "Eksekusi Goals Properti & Akselerasi Aset",
      description: isMarried
        ? "Realisasikan kepemilikan aset riil keluarga, optimalisasi pendapatan pasif rumah tangga, dan review berkala roadmap kemerdekaan finansial masa tua bersama pasangan."
        : "Realisasikan target kepemilikan aset riil, optimalisasi pendapatan pasif, dan review berkala kenaikan nilai portofolio.",
      targetAllocation: "Pertumbuhan Aset Jangka Panjang Rumah Tangga",
    },
  ];

  const executiveSummary = isMarried
    ? `Berdasarkan analisis perencana keuangan (CFP) untuk ${profile.fullName || "Klien"}${partnerInfo} (status menikah dengan ${profile.dependents || 0} tanggungan), kondisi finansial rumah tangga Anda memiliki indeks kesehatan ${healthScore}/100 dengan profil risiko ${risk.profileType || "Moderat"}. Rasio cicilan utang tercatat ${dti.toFixed(1)}% (batas aman OJK ≤30%) dan kapasitas tabungan keluarga mencapai Rp ${recSavings.toLocaleString("id-ID")}/bulan. Rencana keuangan komprehensif ini mengintegrasikan dana darurat keluarga sebesar ${emergencyMultiplier}x pengeluaran pokok (Rp ${targetEmergencyFund.toLocaleString("id-ID")}), proteksi asuransi jiwa pencari nafkah, dan investasi terstruktur demi kemakmuran masa depan keluarga.`
    : `Berdasarkan analisis perencana keuangan (CFP) untuk ${profile.fullName || "Klien"}, kondisi finansial Anda memiliki indeks kesehatan ${healthScore}/100 dengan profil risiko ${risk.profileType || "Moderat"}. Rasio beban cicilan saat ini tercatat ${dti.toFixed(1)}% (batas aman OJK ≤30%) dan kapasitas tabungan bulanan mencapai Rp ${recSavings.toLocaleString("id-ID")}/bulan. Dengan mendisiplinkan alokasi dana darurat ${emergencyMultiplier}x pengeluaran dan investasi rutin pada instrumen legal berizin OJK, target kemerdekaan finansial Anda diproyeksikan tercapai sesuai jadwal.`;

  return {
    executiveSummary,
    healthScore,
    ojkRatios: {
      savingsRatio: parseFloat(savingsRate.toFixed(1)),
      debtServiceRatio: parseFloat(dti.toFixed(1)),
      emergencyFundMonths: parseFloat(emergencyCoverageMonths.toFixed(1)),
      solvencyRatio: parseFloat(solvencyScore.toFixed(1)),
    },
    monthlyBudgetRecommendation: {
      livingNeeds: recNeeds,
      debtRepayment: recDebt,
      insurancePremiums: recInsurance,
      savingsAndInvestment: recSavings,
      lifestyleWants: recWants,
    },
    multiYearProjections,
    strategicMilestones,
  };
}

// ─── AI-Powered Plan Generator ────────────────────────────────────────────────

async function generatePlanWithAI(userPayload: any) {
  const ai = getGeminiClient();

  const prompt = `
Anda adalah Perencana Keuangan Independen Bersertifikasi (Certified Financial Planner / CFP) di Indonesia.
Tugas Anda adalah menganalisis data klien dan merancang Rencana Keuangan Komprehensif (Financial Plan Result) sesuai standar OJK dan kondisi pasar keuangan Indonesia.

DATA LENGKAP KLIEN:
${JSON.stringify(userPayload, null, 2)}

PERHATIAN KHUSUS STATUS PERNIKAHAN & KELUARGA:
- Jika klien berstatus 'Menikah' atau memiliki tanggungan (dependents > 0):
  * Rancang rencana keuangan berbasis RUMAH TANGGA / KELUARGA (Household Financial Plan), bukan hanya individu terpisah.
  * Masukkan peran pasangan (usia pasangan, penghasilan pasangan) dalam sinergi arus kas keluarga.
  * Tentukan target dana darurat keluarga yang memadai (minimal 9x hingga 12x pengeluaran bulanan).
  * Prioritaskan proteksi asuransi jiwa bagi pencari nafkah utama (UP tunai 10-15x biaya hidup tahunan keluarga) dan asuransi kesehatan seluruh anggota keluarga.
  * Rancang alokasi tabungan untuk tujuan bersama (pendidikan anak, DP rumah keluarga, dan dana pensiun hari tua bersama).

INSTRUKSI PERHITUNGAN:
1. Hitung skor kesehatan finansial keseluruhan (0-100).
2. Hitung rasio OJK:
   - savingsRatio: (Porsi menabung/investasi bulanan / Total income) * 100
   - debtServiceRatio: (Total cicilan utang bulanan / Total income) * 100 (Batas aman OJK <= 30%)
   - emergencyFundMonths: Total kas likuid / Total pengeluaran bulanan pokok
   - solvencyRatio: ((Total Aset - Total Utang) / Total Aset) * 100
3. Buat alokasi anggaran bulanan (monthlyBudgetRecommendation):
   - livingNeeds: Kebutuhan pokok harian/keluarga
   - debtRepayment: Cicilan utang
   - insurancePremiums: Premi proteksi/asuransi
   - savingsAndInvestment: Porsi tabungan dana darurat & investasi
   - lifestyleWants: Hiburan/gaya hidup
4. Buat proyeksi 1 - 15 tahun (multiYearProjections):
   - year: 1, 3, 5, 10, 15
   - projectedNetWorth: perkiraan kekayaan bersih
   - emergencyFundTotal: perkiraan dana darurat terkumpul
   - estimatedMonthlyPassiveIncome: potensi passive income bulanan
   - goalsStatus: status target finansial (DP rumah keluarga, pendidikan anak, dll)
5. Buat strategicMilestones (langkah aksi bertahap):
   - timeframe: "Bulan 1-3", "Bulan 4-6", "Tahun 1-2", "Tahun 3-5"
   - title, description, targetAllocation
6. Buat executiveSummary berupa paragraf ulasan profesional yang kontekstual dengan status pernikahan dan keluarga klien.

Hasilkan respons dalam format JSON sesuai schema yang ditentukan.`;

  const schemaConfig = {
    type: Type.OBJECT,
    properties: {
      executiveSummary: { type: Type.STRING },
      healthScore: { type: Type.NUMBER },
      ojkRatios: {
        type: Type.OBJECT,
        properties: {
          savingsRatio: { type: Type.NUMBER },
          debtServiceRatio: { type: Type.NUMBER },
          emergencyFundMonths: { type: Type.NUMBER },
          solvencyRatio: { type: Type.NUMBER },
        },
        required: ["savingsRatio", "debtServiceRatio", "emergencyFundMonths", "solvencyRatio"],
      },
      monthlyBudgetRecommendation: {
        type: Type.OBJECT,
        properties: {
          livingNeeds: { type: Type.NUMBER },
          debtRepayment: { type: Type.NUMBER },
          insurancePremiums: { type: Type.NUMBER },
          savingsAndInvestment: { type: Type.NUMBER },
          lifestyleWants: { type: Type.NUMBER },
        },
        required: ["livingNeeds", "debtRepayment", "insurancePremiums", "savingsAndInvestment", "lifestyleWants"],
      },
      multiYearProjections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            year: { type: Type.NUMBER },
            projectedNetWorth: { type: Type.NUMBER },
            emergencyFundTotal: { type: Type.NUMBER },
            estimatedMonthlyPassiveIncome: { type: Type.NUMBER },
            goalsStatus: { type: Type.STRING },
          },
          required: ["year", "projectedNetWorth", "emergencyFundTotal", "estimatedMonthlyPassiveIncome", "goalsStatus"],
        },
      },
      strategicMilestones: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            timeframe: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            targetAllocation: { type: Type.STRING },
          },
          required: ["timeframe", "title", "description"],
        },
      },
    },
    required: ["executiveSummary", "healthScore", "ojkRatios", "monthlyBudgetRecommendation", "multiYearProjections", "strategicMilestones"],
  };

  if (ai) {
    const text = await tryGenerateWithModels(ai, prompt, {
      responseMimeType: "application/json",
      responseSchema: schemaConfig,
    });

    if (text) {
      try {
        const parsed = JSON.parse(text);
        if (parsed?.healthScore && parsed?.monthlyBudgetRecommendation && parsed?.ojkRatios) {
          return parsed;
        }
      } catch {}
    }
  }

  // Try Vercel AI Gateway fallback
  const gatewayText = await tryGenerateWithAIGateway(
    [{ role: "user", content: prompt }],
    "You are a Certified Financial Planner (CFP) in Indonesia. You must respond in valid JSON matching the exact schema."
  );

  if (gatewayText) {
    try {
      const cleaned = gatewayText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed?.healthScore && parsed?.monthlyBudgetRecommendation && parsed?.ojkRatios) {
        return parsed;
      }
    } catch {}
  }

  return generateDeterministicFinancialPlan(userPayload);
}

// ─── API Endpoints ─────────────────────────────────────────────────────────────

// POST /api/financial-plan/generate
app.post("/api/financial-plan/generate", async (req, res) => {
  try {
    const payload = req.body;
    const plan = await generatePlanWithAI(payload);
    res.json({ success: true, plan });
  } catch (error: any) {
    console.error("Error generating financial plan:", error);
    const fallbackPlan = generateDeterministicFinancialPlan(req.body);
    res.json({ success: true, plan: fallbackPlan });
  }
});

// POST /api/chat/advisor
app.post("/api/chat/advisor", async (req, res) => {
  try {
    const { message, messages, history, userContext } = req.body;
    const ai = getGeminiClient();

    const currentMessage = message || (Array.isArray(messages) && messages.length > 0 ? (messages[messages.length - 1].content || messages[messages.length - 1].text) : "") || "";
    const conversationHistory = history || messages || [];

    const profile = userContext?.profile || {};
    const cashflow = userContext?.cashflow || {};
    const goals = userContext?.goals || {};
    const risk = userContext?.risk || {};
    const plan = userContext?.plan || {};

    const totalIncome =
      (cashflow.monthlyMainIncome || 0) +
      (cashflow.monthlySideIncome || 0) +
      (cashflow.partnerMainIncome || 0) +
      (cashflow.partnerSideIncome || 0) +
      (cashflow.businessPassiveIncome || 0) +
      (cashflow.investmentPassiveIncome || 0);

    const totalDebtsMonthly = (cashflow.debts || []).reduce((acc: number, d: any) => acc + (d.monthlyPayment || 0), 0);
    const dsr = totalIncome > 0 ? ((totalDebtsMonthly / totalIncome) * 100).toFixed(1) : "0";

    const systemInstruction = `
Anda adalah "Coach FinPlan AI", Perencana Keuangan Independen Bersertifikasi CFP (Certified Financial Planner) & Berlisensi OJK di Indonesia.
Anda mendampingi klien bernama "${profile.fullName || "Klien"}" (${profile.age || 30} tahun, status: ${profile.maritalStatus || "Lajang"}, tanggungan: ${profile.dependents || 0} orang).

RINGKASAN DATA KEUANGAN KLIEN:
- Total Pemasukan: Rp ${totalIncome.toLocaleString("id-ID")}/bulan
- Total Cicilan Utang: Rp ${totalDebtsMonthly.toLocaleString("id-ID")}/bulan (Rasio DSR: ${dsr}%, batas aman OJK <= 30%)
- Financial Health Score: ${plan.healthScore ?? "Belum dihitung"}/100
- Profil Risiko Investasi: ${risk.profileType || "Moderat"}
- Target Utama: ${goals.housingTarget?.hasTarget ? `Beli Rumah (Rp ${goals.housingTarget?.estimatedPrice?.toLocaleString("id-ID")})` : "Pensiun & Investasi"} ${goals.vehicleTarget?.hasTarget ? `• Beli Kendaraan (Rp ${goals.vehicleTarget?.estimatedPrice?.toLocaleString("id-ID")})` : ""}

PANDUAN MENJAWAB SEBAGAI CFP PROFESIONAL:
1. Berikan jawaban yang ramah, solutif, empatik, berbasis angka konkret, dan mudah dipahami orang awam.
2. Selalu rujuk instrumen legal berizin OJK/Bank Indonesia: RDPU (Reksadana Pasar Uang) untuk dana darurat, SBN Ritel (ORI/SR/ST/SBR) & RDPT untuk pendapatan tetap, serta Indeks Saham IDX30 / Saham Blue Chip untuk jangka panjang.
3. Jika rasio utang klien tinggi (DSR > 30%), prioritaskan strategi restrukturisasi / snowball method sebelum menganjurkan investasi agresif.
4. Gunakan format markdown yang rapi dengan bullet point dan penekanan tebal (bold) untuk poin penting.`;

    // Construct valid Gemini contents array
    const geminiContents: Array<{ role: "user" | "model"; parts: [{ text: string }] }> = [];

    for (const h of conversationHistory) {
      if (h.id === "welcome" || h.id === "welcome_msg") continue;
      const role = (h.role === "assistant" || h.sender === "ai" || h.role === "model") ? "model" : "user";
      const text = h.content || h.text;
      if (text && typeof text === "string" && text.trim()) {
        geminiContents.push({
          role,
          parts: [{ text: text.trim() }],
        });
      }
    }

    if (currentMessage && (geminiContents.length === 0 || geminiContents[geminiContents.length - 1].role !== "user" || geminiContents[geminiContents.length - 1].parts[0].text !== currentMessage)) {
      geminiContents.push({
        role: "user",
        parts: [{ text: currentMessage.trim() }],
      });
    }

    let replyText = "";
    if (ai && geminiContents.length > 0) {
      const text = await tryGenerateWithModels(ai, geminiContents, {
        systemInstruction,
        temperature: 0.7,
      });
      if (text) replyText = text;
    }

    if (!replyText && geminiContents.length > 0) {
      const text = await tryGenerateWithAIGateway(
        geminiContents.map((g) => ({ role: g.role, content: g.parts[0].text })),
        systemInstruction
      );
      if (text) replyText = text;
    }

    // Intelligent CFP Rule-Based Fallback if AI offline or key unconfigured
    if (!replyText) {
      const query = currentMessage.toLowerCase();

      // 1. Syarat Tambah Utang Baru
      if (query.includes("tambah") && (query.includes("utang") || query.includes("cicilan"))) {
        replyText = `💳 **Kriteria Kelayakan Menambah Cicilan Utang Baru (Kaidah OJK & CFP):**\n\n` +
          `1. **Evaluasi DSR Saat Ini (${dsr}%):** Batas maksimal total seluruh cicilan adalah **30% dari total pendapatan** (Maksimal: Rp ${Math.round(totalIncome * 0.3).toLocaleString("id-ID")}/bln).\n` +
          `2. **Plafon Cicilan Tambahan yang Boleh Diambil:** ${
            Number(dsr) < 30
              ? `Anda masih memiliki ruang cicilan aman sebesar **Rp ${Math.max(0, Math.round(totalIncome * 0.3 - totalDebtsMonthly)).toLocaleString("id-ID")}/bulan**.`
              : `⚠️ **TIDAK DISARANKAN MENAMBAH UTANG!** DSR Anda saat ini (${dsr}%) sudah berada di atas 30%. Selesaikan utang berjalan terlebih dahulu.`
          }\n` +
          `3. **Syarat Ketahanan Kas:** Dana darurat minimal 3–6 bulan sudah terisi penuh di RDPU dan arus kas bulanan surplus positif.`;
      }
      // 2. Evaluasi Utang & DSR Umum
      else if (query.includes("utang") || query.includes("cicilan") || query.includes("pinjol") || query.includes("kartu kredit") || query.includes("dsr")) {
        replyText = `Halo **${profile.fullName || "Sobat FinPlan"}**, berdasarkan analisis rasio utang riil Anda (Total Cicilan: Rp ${totalDebtsMonthly.toLocaleString("id-ID")}/bln • DSR saat ini: **${dsr}%**):\n\n` +
          `1. **Evaluasi Standar OJK (Batas Aman ≤ 30%):**\n   ${Number(dsr) <= 30 ? `✅ Rasio utang Anda saat ini (${dsr}%) masih berada dalam batas aman OJK (≤ 30%).` : `⚠️ Rasio utang Anda (${dsr}%) melebihi batas aman OJK 30%. Batas cicilan maksimal yang sehat untuk penghasilan Anda adalah **Rp ${Math.round(totalIncome * 0.3).toLocaleString("id-ID")}/bulan**.`}\n\n` +
          `2. **Langkah Aksi Pelunasan Tercepat:**\n` +
          `   • **Metode Debt Snowball:** Fokuskan surplus kas untuk melunasi utang dengan nominal terkecil lebih dahulu agar beban mental berkurang.\n` +
          `   • **Metode Debt Avalanche:** Prioritaskan pinjaman dengan bunga tertinggi (seperti kartu kredit/pinjol) untuk menghentikan akumulasi bunga.\n\n` +
          `3. **Rekomendasi CFP:** ${Number(dsr) > 30 ? "Segera hubungi bank kreditur untuk meminta restrukturisasi atau perpanjangan tenor cicilan guna menurunkan angsuran bulanan ke bawah 30%." : "Pertahankan kedisiplinan pembayaran tepat waktu dan hindari menambah kewajiban utang baru."}`;
      }
      // 3. Biaya Legalitas & Akad Rumah (BPHTB/Notaris)
      else if (query.includes("akad") || query.includes("legalitas") || query.includes("bphtb") || query.includes("notaris")) {
        const estPrice = goals.housingTarget?.estimatedPrice || 650000000;
        replyText = `📑 **Rincian Biaya Akad & Legalitas Properti (Estimasi Rumah Rp ${estPrice.toLocaleString("id-ID")}):**\n\n` +
          `1. **BPHTB (Bea Perolehan Hak atas Tanah & Bangunan):** ~5% dari (Harga Rumah - NPOPTKP) $\\approx$ **Rp ${Math.round((estPrice - 80000000) * 0.05).toLocaleString("id-ID")}**.\n` +
          `2. **Biaya Notaris & PPAT:** Akta Jual Beli (AJB), Balik Nama Sertifikat (SHM), dan SKMHT/APHT $\\approx$ **Rp ${Math.round(estPrice * 0.015).toLocaleString("id-ID")}**.\n` +
          `3. **Biaya Provisi & Administrasi Bank:** $\\approx$ 1% dari plafon kredit KPR.\n` +
          `4. **Asuransi Jiwa & Kebakaran KPR:** $\\approx$ 1.5% - 2% dari plafon kredit.\n\n` +
          `💡 **Total Cadangan Cash Ekstra:** Siapkan dana cash cair terpisah sebesar **5% - 7% dari harga properti (~Rp ${Math.round(estPrice * 0.06).toLocaleString("id-ID")})** di luar DP murni.`;
      }
      // 4. Rumah & KPR Umum
      else if (query.includes("rumah") || query.includes("kpr") || query.includes("dp") || query.includes("properti")) {
        const estPrice = goals.housingTarget?.estimatedPrice || 650000000;
        const dp20 = Math.round(estPrice * 0.2);
        replyText = `🏠 **Strategi Mempersiapkan Rumah Pertama (Target: Rp ${estPrice.toLocaleString("id-ID")}):**\n\n` +
          `1. **Target DP Murni (20%):** Rp ${dp20.toLocaleString("id-ID")}.\n` +
          `2. **Cadangan Biaya Legalitas & Akad (5-7%):** Siapkan tambahan cash ~Rp ${Math.round(estPrice * 0.06).toLocaleString("id-ID")} untuk BPHTB, appraisal, provisi bank, dan notaris.\n` +
          `3. **Tempat Simpan Tabungan DP:** Simpan di instrumen likuid berimbal hasil stabil seperti **Reksadana Pendapatan Tetap (RDPT)** atau **SBN Ritel (SR/ORI)** agar nilainya tidak tergerus inflasi properti tahunan (+5-7%).\n` +
          `4. **Batas Cicilan KPR:** Pastikan angsuran bulanan nantinya tidak melebihi Rp ${Math.round(totalIncome * 0.25).toLocaleString("id-ID")}/bln (25% gaji).`;
      }
      // 5. BPJS Kesehatan vs Asuransi Swasta
      else if (query.includes("bpjs") || (query.includes("swasta") && (query.includes("asuransi") || query.includes("kesehatan")))) {
        replyText = `🛡️ **Analisis Kebutuhan: BPJS Kesehatan vs Asuransi Swasta:**\n\n` +
          `1. **BPJS Kesehatan (Wajib Fondasi Utama):**\n` +
          `   • **Kelebihan:** Meng-cover penyakit tanpa limit tahunan (bahkan cuci darah, kemoterapi, dan operasi besar seumur hidup).\n` +
          `   • **Kelemahan:** Mengikuti sistem rujukan berjenjang (Faskes 1 $\\rightarrow$ RS) dan antrean kamar rawat inap.\n\n` +
          `2. **Asuransi Rawat Inap Swasta (Pelengkap / Upgrade):**\n` +
          `   • **Direkomendasikan Jika:** Ingin kamar private *1 Bed Cashless On-Bill*, akses langsung ke RS rekanan tanpa rujukan, dan fasilitas dokter spesialis cepat.\n\n` +
          `3. **Kaidah Budget CFP:** Jika arus kas Anda masih ketat (DSR > 30% atau belum ada dana darurat), **cukup gunakan BPJS Kesehatan dahulu**. Jangan memaksakan asuransi swasta mahal yang berisiko *lapse* (mati di tengah jalan).`;
      }
      // 6. Asuransi Jiwa & UP (Uang Pertanggungan)
      else if (query.includes("uang pertanggungan") || query.includes("up") || query.includes("jiwa") || (query.includes("premi") && query.includes("asuransi"))) {
        const annualLiving = (totalIncome * 0.6) * 12;
        const targetUP = annualLiving * 10;
        replyText = `🛡️ **Perhitungan Kebutuhan Asuransi Jiwa & Batas Premi (Kaidah CFP):**\n\n` +
          `1. **Kriteria Wajib Asuransi Jiwa:** Hanya wajib bagi **Pencari Nafkah Utama** yang memiliki tanggungan (istri/anak/orang tua). Jika belum punya tanggungan, fokus pada asuransi kesehatan.\n` +
          `2. **Formula Uang Pertanggungan (UP) Ideal:**\n` +
          `   • $UP = 10 \\times \\text{Pengeluaran Tahunan Keluarga}$\n` +
          `   • **Target UP untuk Anda:** Minimal **Rp ${Math.round(targetUP).toLocaleString("id-ID")}**.\n` +
          `3. **Pilihan Produk Paling Efisien:** Pilih **Asuransi Jiwa Murni (Term Life)** tanpa unsur investasi, karena preminya sangat murah (Rp 300rb - 800rb/bulan) untuk UP Miliaran Rupiah.\n` +
          `4. **Batas Maksimal Premi:** Total premi seluruh asuransi maksimal **5% - 10% dari gaji** (Rp ${Math.round(totalIncome * 0.1).toLocaleString("id-ID")}/bln).`;
      }
      // 7. Asuransi & Proteksi Umum
      else if (query.includes("asuransi") || query.includes("proteksi")) {
        replyText = `🛡️ **Panduan Proteksi Asuransi Keluarga (Kaidah CFP & OJK):**\n\n` +
          `1. **Tingkat 1 - Kesehatan:** BPJS Kesehatan aktif untuk seluruh anggota keluarga + Asuransi Kesehatan Cashless.\n` +
          `2. **Tingkat 2 - Jiwa (Term Life):** Uang Pertanggungan 10x biaya hidup tahunan khusus pencari nafkah.\n` +
          `3. **Tingkat 3 - Penyakit Kritis (Critical Illness):** Menyiapkan santunan tunai cair jika terkena sakit kritis agar biaya hidup keluarga tetap aman.\n` +
          `4. **Batas Beban Premi:** Jaga total premi maksimal **10% dari penghasilan bulanan** (Maksimal: Rp ${Math.round(totalIncome * 0.1).toLocaleString("id-ID")}/bln).`;
      }
      // 8. Dollar Cost Averaging (DCA)
      else if (query.includes("dca") || query.includes("averaging") || query.includes("autodebet") || query.includes("konsisten")) {
        replyText = `💡 **Panduan Eksekusi Dollar Cost Averaging (DCA) FinPlan:**\n\n` +
          `1. **Prinsip DCA:** Membeli aset investasi secara rutin dengan nominal rupiah yang sama setiap bulan, tanpa memusingkan timing harga naik atau turun.\n` +
          `2. **Otomasi H+1 Gajian:** Pasang fitur **Autodebet / Auto-Invest** pada tanggal 26 atau 1 hari setelah gajian masuk rekening.\n` +
          `3. **Aset Terbaik untuk DCA:**\n` +
          `   • **Reksadana Indeks IDX30 / LQ45:** Mendapatkan harga rata-rata historis IHSG.\n` +
          `   • **SBN Ritel Pemerintah (ORI/SR):** Kupon bulanan langsung masuk ke rekening.\n` +
          `   • **Emas Digital Terdaftar Bappebti:** Buffer aset lindung nilai inflasi.`;
      }
      // 9. Investasi, Saham, SBN, Reksadana
      else if (query.includes("investasi") || query.includes("saham") || query.includes("reksadana") || query.includes("portofolio") || query.includes("sbn") || query.includes("emas")) {
        replyText = `📈 **Rekomendasi Portofolio Sesuai Profil Risiko ${risk.profileType || "Moderat"}:**\n\n` +
          `1. **Fondasi Likuiditas (10-20%):** Reksadana Pasar Uang (RDPU) sebagai buffer kas dan dana siaga.\n` +
          `2. **Pertumbuhan Stabil (40-50%):** SBN Ritel Pemerintah (ORI/SR) & Obligasi Korporasi Rating AAA.\n` +
          `3. **Akselerasi Jangka Panjang (>5 Tahun, 30-40%):** Reksadana Indeks Saham IDX30, Saham Blue Chip Dividen, atau Emas Batangan.\n\n` +
          `💡 **Tips Eksekusi:** Gunakan metode *Dollar Cost Averaging (DCA)* secara autodebet pada H+1 setelah gajian agar investasi berjalan otomatis dan konsisten.`;
      }
      // 10. Dana Darurat & Kas
      else if (query.includes("darurat") || query.includes("emergency") || query.includes("tabungan")) {
        const targetMonths = profile.maritalStatus === "Menikah" ? 9 : 6;
        replyText = `🛡️ **Panduan Dana Darurat Keluarga:**\n\n` +
          `1. **Target Ketahanan Kas:** Untuk status **${profile.maritalStatus || "Lajang"}** dengan ${profile.dependents || 0} tanggungan, target ideal adalah **${targetMonths}x pengeluaran bulanan**.\n` +
          `2. **Pemisahan Rekening:** Jangan campur dana darurat dengan rekening belanja harian. Buka rekening terpisah khusus darurat di **Reksadana Pasar Uang (RDPU)** bebas biaya admin.\n` +
          `3. **Kriteria Penggunaan:** Hanya boleh ditarik untuk 3 kondisi: (1) Kehilangan sumber penghasilan/PHK, (2) Sakit mendadak di luar cover asuransi, (3) Kerusakan hunian/kendaraan esensial kerja.`;
      }
      // 11. Pensiun & FIRE SWR 4%
      else if (query.includes("pensiun") || query.includes("fire") || query.includes("hari tua") || query.includes("swr")) {
        const annualLiving = (totalIncome * 0.6) * 12;
        const targetPortfolio = annualLiving * 25;
        replyText = `🌅 **Perencanaan Kemerdekaan Finansial (Aturan 4% Safe Withdrawal Rate - Trinity Study):**\n\n` +
          `1. **Target Portofolio Pensiun:** Butuh modal akumulasi sebesar **25x pengeluaran tahunan** (Estimasi: ~Rp ${Math.round(targetPortfolio).toLocaleString("id-ID")}).\n` +
          `2. **Skema Penarikan Aman (4% SWR):** Dengan menarik 4% dari modal per tahun, pokok investasi tidak akan habis tergerus inflasi selama masa pensiun.\n` +
          `3. **Instrumen Penempatan Pensiun:** SBN Ritel seri kupon bulanan (ORI/SR) dan Saham Dividen Blue Chip (IDX High Dividend 20).`;
      }
      // 12. 11 Pos Anggaran Dinamis
      else if (query.includes("pos") || query.includes("anggaran") || query.includes("bocor")) {
        replyText = `⚖️ **Blueprint 11 Pos Anggaran (100% Zero-Based Budgeting):**\n\n` +
          `1. **Pos Wajib Prioritas:** Living Pangan/Operasional, Cicilan Utang Berjalan (${dsr}%), Proteksi BPJS/Asuransi, dan Dana Darurat Kas.\n` +
          `2. **Pos Kondisional:** Upgrade Asuransi Swasta, Sinking Fund Hari Raya (THR), Tabungan DP Properti, dan Dana Pendidikan Anak.\n` +
          `3. **Pos Akselerasi:** Investasi Pensiun DCA, Self-Development/Karier, dan Hiburan/Wants.\n\n` +
          `💡 **Tips Anti-Bocor:** Gunakan bank digital multi-kantong (seperti Bank Jago / BCA Pocket) dan pisahkan saldo belanja dari saldo tabungan.`;
      }
      // Fallback Umum
      else {
        replyText = `Halo **${profile.fullName || "Sobat FinPlan"}**! Berdasarkan profil keuangan Anda (Pemasukan Rp ${totalIncome.toLocaleString("id-ID")}/bln, DSR ${dsr}%, Profil ${risk.profileType || "Moderat"}):\n\n` +
          `Saya siap memandu simulasi dan strategi finansial Anda:\n` +
          `• 💡 *Perhitungan percepatan pelunasan cicilan utang*\n` +
          `• 🏠 *Simulasi DP dan kemampuan angsuran KPR Rumah*\n` +
          `• 📈 *Alokasi investasi bulanan di SBN, Saham IDX30, & Reksadana*\n` +
          `• 🛡️ *Optimasi dana darurat dan proteksi asuransi keluarga*\n\n` +
          `Silakan pilih pertanyaan pada menu di bawah!`;
      }
    }

    res.json({ success: true, reply: replyText });
  } catch (error: any) {
    console.error("Error in /api/chat/advisor:", error);
    res.json({
      success: true,
      reply: "Halo! Saya siap membantu menjawab pertanyaan seputar strategi keuangan pribadi, perencanaan DP rumah, investasi SBN/RDPU/Saham, dan alokasi anggaran bulanan Anda. Silakan sampaikan pertanyaan Anda!",
    });
  }
});

// POST /api/insurance/analyze — NEW
app.post("/api/insurance/analyze", async (req, res) => {
  try {
    const { profile, cashflow, existingInsurances = [] } = req.body;
    const ai = getGeminiClient();

    const monthlyIncome =
      (cashflow.monthlyMainIncome || 0) +
      (cashflow.monthlySideIncome || 0) +
      (cashflow.partnerMainIncome || 0) +
      (cashflow.partnerSideIncome || 0) +
      (cashflow.businessPassiveIncome || 0) +
      (cashflow.investmentPassiveIncome || 0);

    const annualIncome = monthlyIncome * 12;
    const totalDebts = (cashflow.debts || []).reduce((a: number, d: any) => a + (d.totalRemaining || 0), 0);
    const hasDependents = (profile.dependents || 0) > 0;
    const isMarried = profile.maritalStatus === "Menikah";

    // Build recommendations deterministically
    const recommendations: any[] = [];

    // Life Insurance
    if (hasDependents || isMarried) {
      const recommendedUP = annualIncome * 10 + totalDebts;
      const currentLife = existingInsurances.filter((i: any) => i.type === "jiwa" || i.type === "jiwa_term_life").reduce((a: number, i: any) => a + (i.coverageAmount || 0), 0);
      recommendations.push({
        type: "jiwa_term_life",
        label: "Asuransi Jiwa Term Life",
        status: currentLife === 0 ? "tidak_ada" : currentLife < recommendedUP ? "kurang" : "cukup",
        currentCoverage: currentLife,
        recommendedCoverage: recommendedUP,
        gap: Math.max(0, recommendedUP - currentLife),
        estimatedMonthlyPremium: Math.round((recommendedUP * 0.001) / 12),
        reasoning: `UP ideal = 10× income tahunan (Rp ${(annualIncome * 10 / 1_000_000).toFixed(0)} Jt) + utang (Rp ${(totalDebts / 1_000_000).toFixed(0)} Jt)`,
        urgency: currentLife === 0 ? "tinggi" : "sedang",
        productSuggestions: ["Zurich Term Life", "Prudential PRUlink", "Allianz Term Life", "BRI Life Term Life"],
      });
    }

    // Health Insurance
    const hasHealth = existingInsurances.some((i: any) => i.type === "kesehatan") || profile.hasPrivateInsurance;
    const hasBPJS = profile.bpjsStatus?.includes("Aktif");
    recommendations.push({
      type: "kesehatan",
      label: "Asuransi Kesehatan",
      status: hasHealth ? "cukup" : hasBPJS ? "kurang" : "tidak_ada",
      currentCoverage: hasHealth ? 500_000_000 : hasBPJS ? 200_000_000 : 0,
      recommendedCoverage: 500_000_000,
      gap: hasHealth ? 0 : hasBPJS ? 300_000_000 : 500_000_000,
      estimatedMonthlyPremium: hasBPJS ? 150_000 : 350_000,
      reasoning: hasBPJS ? "BPJS aktif sebagai proteksi dasar. Pertimbangkan asuransi swasta untuk rawat inap kelas 1." : "Asuransi kesehatan adalah prioritas utama untuk melindungi aset dari biaya medis darurat.",
      urgency: hasBPJS ? "rendah" : "tinggi",
      productSuggestions: ["Cigna Health", "Allianz Health", "Mandiri In Health", "Sequis Health"],
    });

    // Property Insurance
    if ((cashflow.propertyValue || 0) > 0) {
      const hasPropertyIns = existingInsurances.some((i: any) => i.type === "properti");
      recommendations.push({
        type: "properti",
        label: "Asuransi Properti (All Risk)",
        status: hasPropertyIns ? "cukup" : "tidak_ada",
        currentCoverage: hasPropertyIns ? cashflow.propertyValue : 0,
        recommendedCoverage: cashflow.propertyValue,
        gap: hasPropertyIns ? 0 : cashflow.propertyValue,
        estimatedMonthlyPremium: Math.round((cashflow.propertyValue * 0.002) / 12),
        reasoning: `Properti senilai Rp ${(cashflow.propertyValue / 1_000_000).toFixed(0)} Jt perlu dilindungi dari risiko kebakaran, banjir, dan bencana alam.`,
        urgency: hasPropertyIns ? "rendah" : "sedang",
        productSuggestions: ["Asuransi Astra", "Jasindo All Risk", "Adira Insurance"],
      });
    }

    const notCovered = recommendations.filter((r) => r.status !== "cukup").length;
    const overallScore = Math.round(((recommendations.length - notCovered) / Math.max(1, recommendations.length)) * 100);
    const totalPremiumRec = recommendations.filter((r) => r.status !== "cukup").reduce((a, r) => a + r.estimatedMonthlyPremium, 0);

    // Try to enhance with AI
    if (ai) {
      const aiPrompt = `Analisis kebutuhan asuransi ini untuk ${profile.fullName || "Klien"} (${profile.maritalStatus}, ${profile.dependents} tanggungan, income Rp ${monthlyIncome.toLocaleString("id-ID")}/bln). Berikan saran singkat dalam 2-3 kalimat dalam bahasa Indonesia.

Rekomendasi yang sudah dihitung: ${JSON.stringify(recommendations.map(r => ({ type: r.type, status: r.status, gap: r.gap })))}`;

      const aiAdvice = await tryGenerateWithModels(ai, aiPrompt, { temperature: 0.7 });
      if (aiAdvice) {
        return res.json({
          success: true,
          analysis: {
            overallProtectionScore: overallScore,
            summary: overallScore >= 70 ? "Proteksi Anda sudah cukup baik." : "Ada gap proteksi yang perlu segera diisi.",
            recommendations,
            totalMonthlyPremiumRecommended: totalPremiumRec,
            adviceText: aiAdvice,
          },
        });
      }
    }

    res.json({
      success: true,
      analysis: {
        overallProtectionScore: overallScore,
        summary: overallScore >= 80 ? "Proteksi Anda sudah cukup baik. Pertahankan dan review berkala setiap 2 tahun." : overallScore >= 50 ? "Ada beberapa gap proteksi yang perlu segera diisi sebelum risiko terwujud." : "Proteksi finansial Anda masih sangat minim. Prioritaskan BPJS dan Term Life segera.",
        recommendations,
        totalMonthlyPremiumRecommended: totalPremiumRec,
        adviceText: `Sebaiknya alokasikan maksimal 5-10% dari pendapatan untuk premi asuransi (Rp ${Math.round(monthlyIncome * 0.07).toLocaleString("id-ID")}/bulan). Prioritaskan: (1) BPJS Kesehatan aktif, (2) Term Life jika ada tanggungan, (3) Asuransi Kesehatan swasta, (4) Asuransi Properti.`,
      },
    });
  } catch (error: any) {
    console.error("Error in /api/insurance/analyze:", error);
    res.status(500).json({ success: false, error: "Gagal menganalisis kebutuhan asuransi." });
  }
});

// POST /api/financial-advice/realtime — NEW
app.post("/api/financial-advice/realtime", async (req, res) => {
  try {
    const { profile, cashflow, career, risk } = req.body;
    const ai = getGeminiClient();

    const monthlyIncome =
      (cashflow.monthlyMainIncome || 0) + (cashflow.monthlySideIncome || 0) +
      (cashflow.partnerMainIncome || 0) + (cashflow.partnerSideIncome || 0) +
      (cashflow.businessPassiveIncome || 0) + (cashflow.investmentPassiveIncome || 0);
    const totalExpenses = (cashflow.monthlyNeeds || 0) + (cashflow.housingExpense || 0) + (cashflow.utilitiesExpense || 0) + (cashflow.transportationExpense || 0) + (cashflow.monthlyWants || 0) + (cashflow.familySupportExpense || 0) + (cashflow.educationCurrentExpense || 0) + (cashflow.monthlyExistingInsurance || 0) + (cashflow.debts || []).reduce((a: number, d: any) => a + (d.monthlyPayment || 0), 0);
    const surplus = monthlyIncome - totalExpenses;
    const skills = profile.skillsAndTalents || [];

    // Build deterministic advice
    const adviceItems: any[] = [];
    const sideHustleIdeas: string[] = [];
    const investmentOpportunities: string[] = [];
    const urgentActions: string[] = [];

    if (surplus < 0) urgentActions.push(`⚠️ Arus kas defisit Rp ${Math.abs(surplus).toLocaleString("id-ID")}/bulan! Kurangi pengeluaran atau cari income tambahan segera.`);

    const dsr = monthlyIncome > 0 ? (((cashflow.debts || []).reduce((a: number, d: any) => a + (d.monthlyPayment || 0), 0)) / monthlyIncome) * 100 : 0;
    if (dsr > 30) urgentActions.push(`🚨 DSR ${dsr.toFixed(1)}% melebihi batas OJK 30%. Prioritaskan pelunasan utang berbunga tinggi.`);

    // Side hustles based on skills
    const skillToHustle: Record<string, string[]> = {
      "Software Engineering": ["Freelance development via Upwork/Toptal", "Buat SaaS produk digital"],
      "Digital Marketing": ["Kelola ads UMKM, fee Rp 3-10 Jt/klien", "Konten kreator YouTube/TikTok"],
      "UI/UX Design": ["Freelance design via 99designs/Fiverr", "Jual template/asset desain"],
      "Finance & Accounting": ["Konsultasi pajak UMKM (PKP freelance)", "Bookkeeping online"],
      "Data Analytics": ["Freelance data analyst", "Kursus online data di Udemy"],
      "Pendidikan & Training": ["Les privat/bimbel online", "Buat kursus e-learning"],
      "Medis & Kesehatan": ["Konsultasi kesehatan online", "Content creator edukasi kesehatan"],
      "Sales & Negosiasi": ["Reseller produk premium", "Business development freelance"],
    };

    skills.forEach((skill: string) => {
      const hustles = skillToHustle[skill] || [];
      hustles.forEach((h) => { if (!sideHustleIdeas.includes(h)) sideHustleIdeas.push(h); });
    });

    if (sideHustleIdeas.length === 0) {
      sideHustleIdeas.push("Jual produk via Tokopedia/Shopee sebagai reseller", "Driver ojol part-time untuk income tambahan", "Bergabung platform gig economy (TaskRabbit, GoWork)");
    }

    // Investment opportunities by risk profile
    const profileType = risk?.profileType || "Moderat";
    if (profileType === "Konservatif") {
      investmentOpportunities.push("Reksadana Pasar Uang (RDPU) — likuid, return 4-5%/tahun", "SBN Syariah Sukuk Tabungan ST — dijamin pemerintah", "Deposito bank BUKU IV berbunga kompetitif");
    } else if (profileType === "Moderat" || profileType === "Moderat-Agresif") {
      investmentOpportunities.push("Reksadana Indeks IDX30 via Bibit/Bareksa (DCA bulanan)", "Obligasi Negara Ritel ORI/SR — kupon tetap 6-7%/tahun", "Emas digital di Tokopedia/Pegadaian Digital");
    } else {
      investmentOpportunities.push("Saham Blue Chip IHSG (BBCA, BBRI, TLKM) — DCA", "REITs/DIRE untuk passive income rental", "Reksadana Saham Indeks LQ45/IDX80");
    }

    if (surplus > 0) {
      adviceItems.push({
        category: "optimasi_investasi",
        title: "Mulai DCA dengan Surplus Bulanan",
        description: `Surplus Rp ${surplus.toLocaleString("id-ID")}/bulan bisa diinvestasikan secara DCA otomatis.`,
        estimatedImpact: `+Rp ${Math.round(surplus * 12 * 5 * 1.09).toLocaleString("id-ID")} dalam 5 tahun (return 9%/tahun)`,
        timeframe: "Mulai bulan ini",
        difficulty: "mudah",
        actionSteps: ["Buka rekening investasi di Bibit/Bareksa", "Setup autodebet DCA tiap tanggal gajian", "Pilih instrumen sesuai profil risiko"],
      });
    }

    // Try AI enhancement
    if (ai) {
      const aiPrompt = `Berikan saran keuangan riil yang actionable untuk ${profile.fullName || "Klien"} (income Rp ${monthlyIncome.toLocaleString("id-ID")}/bln, surplus Rp ${surplus.toLocaleString("id-ID")}/bln, DSR ${dsr.toFixed(1)}%, skills: ${skills.join(", ")}). Bahasa Indonesia, 3-5 poin konkret.`;
      const aiAdvice = await tryGenerateWithModels(ai, aiPrompt, { temperature: 0.8 });
      if (aiAdvice) {
        return res.json({
          success: true,
          advice: {
            summary: surplus >= 0 ? `Kondisi keuangan ${profile.fullName || "Anda"} menunjukkan surplus Rp ${surplus.toLocaleString("id-ID")}/bulan.` : `Perhatian: arus kas defisit Rp ${Math.abs(surplus).toLocaleString("id-ID")}/bulan.`,
            urgentActions,
            adviceItems,
            sideHustleIdeas,
            investmentOpportunities,
            aiEnhancedAdvice: aiAdvice,
          },
        });
      }
    }

    res.json({
      success: true,
      advice: {
        summary: surplus >= 0 ? `Kondisi keuangan ${profile.fullName || "Anda"} menunjukkan surplus Rp ${surplus.toLocaleString("id-ID")}/bulan yang bisa dioptimalkan.` : `Perhatian: arus kas defisit Rp ${Math.abs(surplus).toLocaleString("id-ID")}/bulan. Perlu tindakan segera.`,
        urgentActions,
        adviceItems,
        sideHustleIdeas,
        investmentOpportunities,
      },
    });
  } catch (error: any) {
    console.error("Error in /api/financial-advice/realtime:", error);
    res.status(500).json({ success: false, error: "Gagal menganalisis saran keuangan." });
  }
});

// POST /api/projection/future-goals — NEW
app.post("/api/projection/future-goals", async (req, res) => {
  try {
    const { profile, cashflow, career, goals, risk } = req.body;
    const currentYear = new Date().getFullYear();

    const monthlyIncome =
      (cashflow.monthlyMainIncome || 0) + (cashflow.monthlySideIncome || 0) +
      (cashflow.partnerMainIncome || 0) + (cashflow.partnerSideIncome || 0) +
      (cashflow.businessPassiveIncome || 0) + (cashflow.investmentPassiveIncome || 0);

    const totalExpenses = (cashflow.monthlyNeeds || 0) + (cashflow.housingExpense || 0) + (cashflow.utilitiesExpense || 0) + (cashflow.transportationExpense || 0) + (cashflow.monthlyWants || 0) + (cashflow.familySupportExpense || 0) + (cashflow.educationCurrentExpense || 0) + (cashflow.monthlyExistingInsurance || 0) + (cashflow.debts || []).reduce((a: number, d: any) => a + (d.monthlyPayment || 0), 0);

    const surplus = Math.max(0, monthlyIncome - totalExpenses);
    const totalAssets = (cashflow.cashEmergencyFund || 0) + (cashflow.bankSavings || 0) + (cashflow.deposits || 0) + (cashflow.stocks || 0) + (cashflow.mutualFunds || 0) + (cashflow.gold || 0) + (cashflow.cryptoAssets || 0) + (cashflow.propertyValue || 0) + (cashflow.vehicleValue || 0) + (cashflow.otherAssets || 0);
    const totalDebts = (cashflow.debts || []).reduce((a: number, d: any) => a + (d.totalRemaining || 0), 0);

    const expectedReturn = risk?.profileType === "Agresif" ? 0.11 : risk?.profileType === "Moderat" || risk?.profileType === "Moderat-Agresif" ? 0.09 : 0.065;
    const salaryGrowth = (career?.personal?.salaryGrowthRatePercent || 7) / 100;

    const yearlyProjections = [];
    let runningAssets = totalAssets;
    let runningDebts = totalDebts;
    let runningMonthlySavings = surplus;

    for (let yr = 1; yr <= 10; yr++) {
      runningMonthlySavings *= 1 + salaryGrowth / 12;
      runningAssets += runningAssets * expectedReturn + runningMonthlySavings * 12;
      runningDebts = Math.max(0, runningDebts - runningMonthlySavings * 3);
      const netWorth = runningAssets - runningDebts;
      const passiveIncome = Math.round((netWorth * 0.05) / 12);

      const milestones: Record<number, string> = {
        1: "Bangun dana darurat & pondasi proteksi asuransi",
        2: "Mulai investasi rutin DCA, optimalkan arus kas",
        3: "Dana darurat penuh, fokus akselerasi aset",
        4: "Pertimbangkan properti investasi / KPR pertama",
        5: "Review portofolio besar, rebalancing & diversifikasi",
        6: "Persiapkan dana pendidikan anak",
        7: "Akselerasi passive income (REITs, dividen, sewa)",
        8: "Evaluasi target financial freedom",
        9: "Optimalkan pajak & estate planning",
        10: "Financial freedom horizon — passive income ≥ living cost",
      };

      yearlyProjections.push({
        year: yr,
        calendarYear: currentYear + yr,
        projectedNetWorth: Math.round(netWorth),
        projectedSavings: Math.round(runningMonthlySavings * 12),
        projectedInvestmentValue: Math.round(runningAssets * 0.6),
        projectedPassiveIncome: passiveIncome,
        keyMilestone: milestones[yr] || "Konsisten menjalankan rencana keuangan",
        recommendedActions: ["Lanjutkan DCA", "Review dan rebalancing portofolio"],
        goalsStatus: [],
      });
    }

    const freedomYear = yearlyProjections.find(p => p.projectedPassiveIncome >= totalExpenses);

    res.json({
      success: true,
      projection: {
        summary: `Proyeksi 10 tahun menunjukkan kekayaan bersih berpotensi mencapai Rp ${(yearlyProjections[9]?.projectedNetWorth / 1_000_000_000 || 0).toFixed(1)} Miliar pada tahun ${currentYear + 10}.`,
        yearlyProjections,
        financialFreedomYear: freedomYear ? currentYear + freedomYear.year : null,
        totalProjectedWealth10Yr: yearlyProjections[9]?.projectedNetWorth || 0,
      },
    });
  } catch (error: any) {
    console.error("Error in /api/projection/future-goals:", error);
    res.status(500).json({ success: false, error: "Gagal menghitung proyeksi." });
  }
});

// GET /api/financial-knowledge
app.get("/api/financial-knowledge", (_req, res) => {
  res.json({
    success: true,
    data: {
      gurus: financialGurusTheories,
      ojkStandards,
      localTheories: localFinancialTheories,
      formulas: financialFormulas,
      insuranceProviders: topInsuranceProviders,
      insuranceRegulations: ojkInsuranceRegulations,
      insuranceEducation,
      insuranceCalculationGuide,
    },
  });
});

// ─── Vite / Static Server ─────────────────────────────────────────────────────

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FinPlan Server running on http://localhost:${PORT}`);
  });
}

startServer();
