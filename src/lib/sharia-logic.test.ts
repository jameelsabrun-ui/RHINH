import { describe, it, expect } from 'vitest';
import { calculateMurabahah, calculateMMq, calculateEarlyPayoff } from './sharia-logic';

describe('Sharia Calculator Logic', () => {
  describe('calculateMurabahah', () => {
    it('should calculate correct installment for a standard scenario', () => {
      const result = calculateMurabahah(100_000_000, 20_000_000, 5, 5);
      expect(result.monthlyInstallment).toBe(1_666_667);
      expect(result.totalMargin).toBe(20_000_000);
      expect(result.tenorMonths).toBe(60);
      expect(result.totalPayment).toBe(120_000_000);
    });

    it('should handle zero interest (margin) correctly', () => {
      const result = calculateMurabahah(60_000_000, 0, 0, 5);
      expect(result.monthlyInstallment).toBe(1_000_000);
      expect(result.totalMargin).toBe(0);
    });

    it('should handle full down payment correctly', () => {
      const result = calculateMurabahah(100_000_000, 100_000_000, 5, 5);
      expect(result.monthlyInstallment).toBe(0);
      expect(result.totalMargin).toBe(0);
      expect(result.totalPayment).toBe(100_000_000);
    });
  });

  describe('calculateMMq', () => {
    it('should calculate correct installment using annuity formula', () => {
      const result = calculateMMq(100_000_000, 20_000_000, 12, 10);
      expect(result.monthlyInstallment).toBe(1_147_768);
      expect(result.tenorMonths).toBe(120);
    });

    it('should handle full down payment for MMq', () => {
      const result = calculateMMq(50_000_000, 50_000_000, 10, 5);
      expect(result.monthlyInstallment).toBe(0);
      expect(result.totalPayment).toBe(50_000_000);
    });
  });

  describe('calculateEarlyPayoff', () => {
    it('should calculate correct muqasah for Murabahah (linear)', () => {
      const original = calculateMurabahah(100_000_000, 20_000_000, 5, 5);
      const result = calculateEarlyPayoff(original, 30, 80_000_000, 'Murabahah');
      expect(result.estimatedMuqasah).toBeCloseTo(10_000_000, -1);
      expect(result.totalToPay).toBeLessThan(50_000_000);
    });

    it('should calculate correct principal for MMq (annuity style)', () => {
      const financing = 80_000_000;
      const original = calculateMMq(100_000_000, 20_000_000, 12, 10);
      const result = calculateEarlyPayoff(original, 60, financing, 'MMq');
      expect(result.totalToPay).toBeGreaterThan(40_000_000);
      expect(result.totalToPay).toBeLessThan(60_000_000);
      expect(result.estimatedMuqasah).toBeGreaterThan(0);
    });

    it('should return zeros when already paid in full', () => {
      const original = calculateMurabahah(100_000_000, 0, 5, 5);
      const result = calculateEarlyPayoff(original, 60, 100_000_000, 'Murabahah');
      expect(result.totalToPay).toBe(0);
      expect(result.remainingDebt).toBe(0);
    });
  });
});
