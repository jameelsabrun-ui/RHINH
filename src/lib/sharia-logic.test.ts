import { describe, it, expect } from 'vitest';
import { calculateMurabahah, calculateMMq } from './sharia-logic';

describe('Sharia Calculator Logic', () => {
  describe('calculateMurabahah', () => {
    it('should calculate correct installment for a standard scenario', () => {
      // Base: 100M, DP: 20M, Margin: 5% per year, Tenor: 5 years
      // Financing: 80M
      // Total Margin: 80M * 0.05 * 5 = 20M
      // Total Payment: 80M + 20M = 100M
      // Monthly: 100M / 60 months = 1,666,666.67 -> ceil 1,666,667
      const result = calculateMurabahah(100_000_000, 20_000_000, 5, 5);
      
      expect(result.monthlyInstallment).toBe(1_666_667);
      expect(result.totalMargin).toBe(20_000_000);
      expect(result.tenorMonths).toBe(60);
      expect(result.totalPayment).toBe(120_000_000); // 100M (financing+margin) + 20M (DP)
    });

    it('should handle zero interest (margin) correctly', () => {
      const result = calculateMurabahah(60_000_000, 0, 0, 5);
      expect(result.monthlyInstallment).toBe(1_000_000);
      expect(result.totalMargin).toBe(0);
    });

    it('should handle full down payment correctly', () => {
      // Base: 100M, DP: 100M, Margin: 5%, Tenor: 5 years
      // Financing: 0
      const result = calculateMurabahah(100_000_000, 100_000_000, 5, 5);
      expect(result.monthlyInstallment).toBe(0);
      expect(result.totalMargin).toBe(0);
      expect(result.totalPayment).toBe(100_000_000);
    });
  });

  describe('calculateMMq', () => {
    it('should calculate correct installment using annuity formula', () => {
      // Base: 100M, DP: 20M, Yield: 12% per year, Tenor: 10 years (120 months)
      // Financing: 80M
      // Monthly yield: 1%
      // Formula: (80M * 0.01) / (1 - (1.01)^-120)
      // (800,000) / (1 - 0.302994) = 800,000 / 0.697005 = 1,147,767.57 -> 1,147,768
      const result = calculateMMq(100_000_000, 20_000_000, 12, 10);
      
      expect(result.monthlyInstallment).toBe(1_147_768);
      expect(result.tenorMonths).toBe(120);
    });

    it('should handle full down payment for MMq', () => {
      const result = calculateMMq(50_000_000, 50_000_000, 10, 5);
      expect(result.monthlyInstallment).toBe(0);
      expect(result.totalPayment).toBe(50_000_000);
    });

    it('should handle small financing amounts', () => {
      const result = calculateMMq(1_000_000, 900_000, 10, 1);
      expect(result.monthlyInstallment).toBeGreaterThan(0);
      expect(result.totalMargin).toBeGreaterThan(0);
    });
  });
});
