export type WizardStep =
  | "data_diri"
  | "arus_kas"
  | "profile_keuangan"
  | "karier"
  | "profile_karier"
  | "goals"
  | "teori"
  | "teori_keuangan"
  | "profil_risiko"
  | "profiling_risiko"
  | "rencana"
  | "step_by_step"
  | "finish_history"
  | "hasil_rencana"
  | "loading_plan";

export type EmploymentStatus =
  | "karyawan_swasta"
  | "pns_bumn"
  | "wiraswasta"
  | "freelancer"
  | "freshgrad_mencari_kerja"
  | "ibu_rumah_tangga"
  | "mahasiswa"
  | "profesional_medis_hukum";

export type HousingStatus =
  | "rumah_sendiri"
  | "sewa_kontrakan"
  | "kos"
  | "tinggal_bersama_ortu"
  | "kpr_berjalan";

export type KnowledgeLevel = "pemula" | "menengah" | "mahir";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  isLoggedIn: boolean;
}

export interface UserProfile {
  fullName: string;
  gender: "Laki-laki" | "Perempuan";
  age: number;
  maritalStatus: "Lajang" | "Menikah" | "Pernah Menikah";
  dependents: number; // Jumlah tanggungan
  currentCity: string;
  domicilePlan: string; // Rencana domisili ke depan
  housingStatus: HousingStatus;
  housingPlan: string; // Rencana tempat tinggal ke depan (beli KPR, renovasi, tetap)
  skillsAndTalents: string[]; // Kemampuan & keahlian utama
  interestsAndHobbies: string[]; // Bakat & minat
  healthCondition: "Prima (Sangat Sehat)" | "Sehat dengan Catatan Ringan" | "Ada Riwayat Penyakit Tertentu";
  bpjsStatus: "Aktif (Kelas 1 / Standar)" | "Aktif (Kelas 2 / 3)" | "Belum Aktif";
  hasPrivateInsurance: boolean;
  financialKnowledge: KnowledgeLevel;
  // Partner data if married
  hasPartnerData?: boolean;
  partnerName?: string;
  partnerAge?: number;
  partnerHealthCondition?: string;
  partnerSkills?: string[];
  isLDM?: boolean; // Long Distance Marriage (beda kota dengan pasangan)
}

export interface UpcomingExpenseEvent {
  id: string;
  title: string;
  estimatedAmount: number;
  targetTime: string;
  category: "Pendidikan" | "Keluarga & Lahiran" | "Renovasi Rumah" | "Kendaraan" | "Liburan / Ibadah" | "Lainnya";
}

export interface DebtItem {
  id: string;
  name: string;
  type: "kpr" | "kendaraan" | "kartu_kredit" | "pinjol_paylater" | "kta" | "lainnya";
  totalRemaining: number;
  monthlyPayment: number;
  interestRatePerYear?: number;
  remainingTenorMonths?: number;
}

export interface CashflowData {
  // Pemasukan Pribadi & Pasangan
  monthlyMainIncome: number;
  monthlySideIncome: number;
  partnerMainIncome: number;
  partnerSideIncome: number;

  // Passive Income
  businessPassiveIncome: number;
  investmentPassiveIncome: number;

  // Detail Pengeluaran Bulanan
  monthlyNeeds: number;
  housingExpense: number;
  utilitiesExpense: number;
  transportationExpense: number;
  monthlyWants: number;
  familySupportExpense: number;
  educationCurrentExpense: number;
  monthlyExistingInsurance: number;
  debts: DebtItem[];

  // Potensi Pengeluaran Kedepan
  upcomingExpenses: UpcomingExpenseEvent[];

  // Total Dana & Aset Yang Sudah Tersedia Saat Ini
  cashEmergencyFund: number;
  bankSavings: number;
  deposits: number;
  stocks: number;
  mutualFunds: number;
  gold: number;
  cryptoAssets: number;
  propertyValue: number;
  vehicleValue: number;
  otherAssets: number;
}

export interface SingleCareerProfile {
  jobType: string;
  companyField: string;
  officeLocation: string;
  careerGoal: string;
  layoffRisk: "Rendah" | "Sedang" | "Tinggi";
  layoffMitigation: string;
  salaryGrowthRatePercent: number;
  promotionPotential: "Tinggi (1-2 tahun)" | "Sedang (3-5 tahun)" | "Stabil / Terbatas";
}

export interface CareerProfile {
  personal: SingleCareerProfile;
  partner?: SingleCareerProfile;
  hasPartnerCareer: boolean;
}

export type GoalCategory =
  | "dana_darurat"
  | "tempat_tinggal"
  | "pendidikan_anak"
  | "kendaraan"
  | "income_growth"
  | "dana_pensiun"
  | "modal_bisnis"
  | "liburan_ibadah"
  | "bebas_hutang"
  | "custom";

export interface ChildEducationLevel {
  id: string;
  childName: string;
  level: "TK" | "SD" | "SMP" | "SMA" | "Kuliah S1";
  targetYear: number;
  estimatedCostToday: number;
  targetSchoolName?: string;
}

export interface TargetGoalsData {
  targetSavingsMonthly: number;
  emergencyFund: {
    autoCalculate: boolean;
    multiplierMonths: number;
    customTargetAmount: number;
  };
  housingTarget: {
    hasTarget: boolean;
    location: string;
    estimatedPrice: number;
    paymentMethod: "Cash Keras" | "Cash Bertahap" | "Cicilan KPR";
    targetYears: number;
    downPaymentPercent: number;
    currentFund?: number;
  };
  incomeTarget: {
    targetActiveIncomeMonthly: number;
    targetPassiveIncomeMonthly: number;
    targetYearsToAchieve: number;
  };
  vehicleTarget: {
    hasTarget: boolean;
    vehicleType: string;
    estimatedPrice: number;
    paymentMethod: "Cash" | "Kredit DP 30%";
    targetYears: number;
    currentFund?: number;
  };
  childrenEducation: {
    plannedChildrenCount: number;
    educationLevels: ChildEducationLevel[];
  };
  customGoals: FinancialGoal[];
}

export interface FinancialGoal {
  id: string;
  category: GoalCategory;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadlineMonths: number;
  priority: "Tinggi" | "Sedang" | "Rendah";
  notes?: string;
}

export type RiskType = "Konservatif" | "Moderat" | "Moderat-Agresif" | "Agresif" | "Sangat Agresif";

export interface RiskProfileData {
  profileType: RiskType;
  totalScore: number;
  maxScore: number;
  summaryDescription: string;
  investmentHorizon: string;
  toleranceToLoss: string;
  recommendedAssetAllocation: {
    pasarUangDeposito: number; // %
    obligasiSBN: number; // %
    sahamEquity: number; // %
    emasAsetAlternatif: number; // %
  };
  suitableInstruments: string[];
}

export interface OJKRatiosPlan {
  savingsRatio: number;
  debtServiceRatio: number;
  emergencyFundMonths: number;
  solvencyRatio: number;
}

export interface MonthlyBudgetRecommendation {
  livingNeeds: number;
  debtRepayment: number;
  insurancePremiums: number;
  savingsAndInvestment: number;
  lifestyleWants: number;
}

export interface MultiYearProjection {
  year: number;
  projectedNetWorth: number;
  emergencyFundTotal: number;
  estimatedMonthlyPassiveIncome: number;
  goalsStatus: string;
}

export interface StrategicMilestone {
  timeframe: string;
  title: string;
  description: string;
  targetAllocation?: string;
}

export interface FinancialPlanResult {
  executiveSummary: string;
  healthScore: number;
  ojkRatios: OJKRatiosPlan;
  monthlyBudgetRecommendation: MonthlyBudgetRecommendation;
  multiYearProjections: MultiYearProjection[];
  strategicMilestones: StrategicMilestone[];
}

// Financial Tracker (Pencatatan Keuangan)
export type TransactionType = "income" | "expense" | "investment" | "debt_payment";

export interface FinancialTransaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
}

// Profiling History Record
export interface ProfilingHistoryRecord {
  id: string;
  date: string;
  title: string;
  profile: UserProfile;
  cashflow: CashflowData;
  career: CareerProfile;
  goals: TargetGoalsData;
  risk: RiskProfileData;
  planResult: FinancialPlanResult;
}

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export type ChatMessage = AIChatMessage;

// Legacy and Backward Compatibility Types
export interface RiskQuestionOption {
  text: string;
  points: number;
  description?: string;
}

export interface RiskQuestion {
  id: string;
  question: string;
  category?: string;
  subtitle?: string;
  options: RiskQuestionOption[];
}

export interface RiskProfileCategory {
  id: string;
  title: string;
  minScore: number;
  maxScore: number;
  description: string;
  allocation: {
    pasarUang: number;
    obligasi: number;
    saham: number;
    emas: number;
  };
}

export type RiskProfileResult = RiskProfileData;
export type GeneratedFinancialPlan = FinancialPlanResult;

// ─── Insurance ────────────────────────────────────────────────────────────────

export type InsuranceType = "jiwa" | "kesehatan" | "kendaraan" | "properti" | "jiwa_term_life" | "pendidikan";

export interface InsuranceItem {
  id: string;
  type: InsuranceType;
  provider: string;
  coverageAmount: number; // Uang Pertanggungan (UP)
  monthlyPremium: number;
  annualPremium: number;
  policyNumber?: string;
  expiryYear?: number;
  beneficiary?: string;
}

export interface InsuranceRecommendation {
  type: InsuranceType;
  label: string;
  status: "cukup" | "kurang" | "tidak_ada" | "berlebih";
  currentCoverage: number;
  recommendedCoverage: number;
  gap: number;
  estimatedMonthlyPremium: number;
  reasoning: string;
  urgency: "tinggi" | "sedang" | "rendah";
  productSuggestions: string[];
}

export interface InsuranceAnalysisResult {
  overallProtectionScore: number; // 0-100
  summary: string;
  recommendations: InsuranceRecommendation[];
  totalMonthlyPremiumRecommended: number;
  protectionGapTotal: number;
  adviceText: string;
}

// ─── Financial Advice ─────────────────────────────────────────────────────────

export interface FinancialAdviceItem {
  category: "tambah_pemasukan" | "kurangi_pengeluaran" | "optimasi_investasi" | "proteksi" | "pelunasan_hutang";
  title: string;
  description: string;
  estimatedImpact: string; // "Rp 2-5 Jt/bulan" atau "+15% net worth"
  timeframe: string; // "1-3 bulan", "6-12 bulan"
  difficulty: "mudah" | "sedang" | "sulit";
  actionSteps: string[];
}

export interface RealFinancialAdvice {
  summary: string;
  urgentActions: string[];
  adviceItems: FinancialAdviceItem[];
  sideHustleIdeas: string[]; // Berdasarkan skills user
  investmentOpportunities: string[];
}

// ─── 10-Year Future Projection ────────────────────────────────────────────────

export interface YearlyGoalStatus {
  goalName: string;
  targetAmount: number;
  achievedAmount: number;
  isAchieved: boolean;
  percentageComplete: number;
}

export interface FutureYearProjection {
  year: number; // Tahun ke-1, 2, 3, ...10
  calendarYear: number; // Tahun kalender
  projectedNetWorth: number;
  projectedSavings: number;
  projectedInvestmentValue: number;
  projectedPassiveIncome: number;
  goalsStatus: YearlyGoalStatus[];
  keyMilestone: string;
  recommendedActions: string[];
}

export interface FutureGoalProjectionResult {
  summary: string;
  yearlyProjections: FutureYearProjection[];
  financialFreedomYear?: number; // Tahun prediksi financial freedom
  totalProjectedWealth10Yr: number;
}

// ─── Extended FinancialPlanResult ─────────────────────────────────────────────

declare module "./types" {
  interface FinancialPlanResult {
    aiThinkingNotes?: string;
    realFinancialAdvice?: RealFinancialAdvice;
    futureProjection?: FutureGoalProjectionResult;
  }
}

