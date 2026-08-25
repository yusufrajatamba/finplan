/**
 * Helper utilities for currency, percentage, and financial calculations
 */

export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRupiahShort(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "Rp 0";
  if (Math.abs(amount) >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1)} M`;
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)} Jt`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)} Rb`;
  }
  return `Rp ${amount}`;
}

export function parseRupiahInput(value: string): number {
  const clean = value.replace(/[^0-9]/g, "");
  return clean ? parseInt(clean, 10) : 0;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

// Calculate compound interest
export function calculateCompoundInterest(
  initialPrincipal: number,
  monthlyAddition: number,
  annualInterestRate: number,
  years: number
) {
  const months = years * 12;
  const monthlyRate = annualInterestRate / 100 / 12;
  let totalBalance = initialPrincipal;
  let totalDeposited = initialPrincipal;

  const yearlyBreakdown: Array<{
    year: number;
    deposited: number;
    interestEarned: number;
    totalBalance: number;
  }> = [];

  for (let m = 1; m <= months; m++) {
    totalBalance = (totalBalance + monthlyAddition) * (1 + monthlyRate);
    totalDeposited += monthlyAddition;

    if (m % 12 === 0) {
      const year = m / 12;
      yearlyBreakdown.push({
        year,
        deposited: Math.round(totalDeposited),
        interestEarned: Math.round(totalBalance - totalDeposited),
        totalBalance: Math.round(totalBalance),
      });
    }
  }

  return {
    futureValue: Math.round(totalBalance),
    totalDeposited: Math.round(totalDeposited),
    totalInterest: Math.round(totalBalance - totalDeposited),
    yearlyBreakdown,
  };
}

// Calculate ideal emergency fund target in Indonesia
export function calculateIdealEmergencyFundTarget(
  monthlyExpenses: number,
  dependents: number,
  employmentStatus: string
): { months: number; amount: number; reason: string } {
  let months = 3;
  let reason = "Single & Karyawan Tetap (3x pengeluaran bulanan)";

  if (employmentStatus === "freelancer" || employmentStatus === "wiraswasta") {
    if (dependents === 0) {
      months = 6;
      reason = "Freelancer / Wiraswasta lajang (6x pengeluaran bulanan karena arus kas fluktuatif)";
    } else {
      months = 12;
      reason = "Freelancer / Wiraswasta dengan tanggungan (12x pengeluaran bulanan untuk ketahanan maksimal)";
    }
  } else {
    if (dependents === 0) {
      months = 3;
      reason = "Lajang tanpa tanggungan (3-6x pengeluaran bulanan)";
    } else if (dependents === 1) {
      months = 6;
      reason = "Menikah / 1 tanggungan (6x pengeluaran bulanan)";
    } else {
      months = 9;
      reason = "Keluarga dengan >1 tanggungan (9-12x pengeluaran bulanan)";
    }
  }

  return {
    months,
    amount: monthlyExpenses * months,
    reason,
  };
}

// Calculate Debt-to-Income (DTI) ratio
export function calculateDTI(monthlyDebtPayments: number, totalMonthlyIncome: number): {
  dtiPercent: number;
  status: "Sehat" | "Waspada" | "Bahaya";
  colorClass: string;
  advice: string;
} {
  if (totalMonthlyIncome <= 0) {
    return {
      dtiPercent: 0,
      status: "Sehat",
      colorClass: "text-emerald-600 dark:text-emerald-400",
      advice: "Belum ada data pendapatan.",
    };
  }

  const dti = (monthlyDebtPayments / totalMonthlyIncome) * 100;

  if (dti <= 30) {
    return {
      dtiPercent: Math.round(dti),
      status: "Sehat",
      colorClass: "text-emerald-600 dark:text-emerald-400",
      advice: "Beban cicilan utang Anda di bawah 30%, sangat aman dan sehat.",
    };
  } else if (dti <= 40) {
    return {
      dtiPercent: Math.round(dti),
      status: "Waspada",
      colorClass: "text-amber-600 dark:text-amber-400",
      advice: "Cicilan mencapai 30-40% pendapatan. Hindari menambah utang konsumtif baru.",
    };
  } else {
    return {
      dtiPercent: Math.round(dti),
      status: "Bahaya",
      colorClass: "text-rose-600 dark:text-rose-400",
      advice: "Cicilan melebihi 40% pendapatan! Perlu strategi pelunasan utang prioritas (Snowball/Avalanche).",
    };
  }
}
