import { ShariaAkad, CalculationResult } from "../types";

/**
 * Kalkulasi Akad Murabahah (Jual Beli)
 * Rumus: (Harga Beli + Margin) / Tenor
 */
export function calculateMurabahah(
  basePrice: number,
  downPayment: number,
  marginRatePercent: number,
  tenorYears: number
): CalculationResult {
  const financingAmount = basePrice - downPayment;
  const totalMargin = financingAmount * (marginRatePercent / 100) * tenorYears;
  const totalPayment = financingAmount + totalMargin;
  const tenorMonths = tenorYears * 12;
  const monthlyInstallment = Math.ceil(totalPayment / tenorMonths);

  return {
    monthlyInstallment,
    totalPayment: totalPayment + downPayment,
    totalMargin,
    tenorMonths,
  };
}

/**
 * Kalkulasi Musyarakah Mutanaqisah (MMq)
 * Sederhananya dihitung sebagai pembiayaan dengan bagi hasil proporsional
 * Di MVP ini kita simulasikan sebagai cicilan tetap untuk kemudahan user.
 */
export function calculateMMq(
  basePrice: number,
  downPayment: number,
  expectedYieldPercent: number,
  tenorYears: number
): CalculationResult {
  // Simulasi perhitungan anuitas syariah
  const financingAmount = basePrice - downPayment;
  const monthlyRate = (expectedYieldPercent / 100) / 12;
  const tenorMonths = tenorYears * 12;

  const monthlyInstallment = Math.ceil(
    (financingAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -tenorMonths))
  );

  const totalPayment = monthlyInstallment * tenorMonths;
  const totalMargin = totalPayment - financingAmount;

  return {
    monthlyInstallment,
    totalPayment: totalPayment + downPayment,
    totalMargin,
    tenorMonths,
  };
}

/**
 * Kalkulasi Pelunasan Dipercepat
 * Dalam syariah, pelunasan dipercepat biasanya diberikan 'Muqasah' (potongan)
 * Potongan ini biasanya berasal dari margin yang belum berjalan.
 */
export function calculateEarlyPayoff(
  originalResult: CalculationResult,
  monthsPaid: number,
  financingAmount: number,
  akad: "Murabahah" | "MMq"
): {
  remainingDebt: number;
  estimatedMuqasah: number;
  totalToPay: number;
} {
  const monthsRemaining = Math.max(0, originalResult.tenorMonths - monthsPaid);
  
  if (monthsRemaining <= 0) {
    return { remainingDebt: 0, estimatedMuqasah: 0, totalToPay: 0 };
  }

  if (akad === "Murabahah") {
    // Murabahah: Total Hutang = Cicilan * Sisa Bulan
    const remainingDebt = originalResult.monthlyInstallment * monthsRemaining;
    const marginPerMonth = originalResult.totalMargin / originalResult.tenorMonths;
    const estimatedMuqasah = marginPerMonth * monthsRemaining;
    
    return {
      remainingDebt,
      estimatedMuqasah,
      totalToPay: Math.round(remainingDebt - estimatedMuqasah)
    };
  } else {
    // MMq: Estimasi sisa pokok menggunakan bunga efektif bulanan
    // Suku bunga efektif tahunan diestimasikan dari total margin yang dibayar selama tenor
    const annualRate = (originalResult.totalMargin / financingAmount) / (originalResult.tenorMonths / 12);
    const monthlyRate = annualRate / 12;
    
    if (monthlyRate === 0 || isNaN(monthlyRate)) {
      const remainingDebt = originalResult.monthlyInstallment * monthsRemaining;
      return {
        remainingDebt,
        estimatedMuqasah: 0,
        totalToPay: remainingDebt
      };
    }

    // Sisa pokok anuitas
    const remainingPrincipal = Math.ceil(
      originalResult.monthlyInstallment * 
      (1 - Math.pow(1 + monthlyRate, -monthsRemaining)) / 
      monthlyRate
    );

    const totalContractualRemaining = originalResult.monthlyInstallment * monthsRemaining;

    return {
      remainingDebt: totalContractualRemaining,
      estimatedMuqasah: Math.max(0, Math.round(totalContractualRemaining - remainingPrincipal)),
      totalToPay: remainingPrincipal
    };
  }
}
