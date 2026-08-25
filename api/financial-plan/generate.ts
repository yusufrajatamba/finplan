import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateDeterministicFinancialPlan } from "../../src/utils/financialCalculations";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(200).json({ success: true, message: "FinPlan API is active" });
  }

  try {
    const userPayload = req.body || {};
    const plan = generateDeterministicFinancialPlan(userPayload);

    return res.status(200).json({
      success: true,
      plan,
      provider: "CFP Deterministic Engine",
    });
  } catch (error: any) {
    console.error("Error in serverless /api/financial-plan/generate:", error);
    return res.status(500).json({
      success: false,
      error: "Gagal memproses data keuangan di serverless function.",
    });
  }
}
