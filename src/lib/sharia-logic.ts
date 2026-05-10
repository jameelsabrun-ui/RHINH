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
