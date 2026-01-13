import { describe, it, expect } from 'vitest';
import { calculateDuration, formatDateToNow } from './dates';

describe('dates utilities', () => {
  describe('calculateDuration', () => {
    it('should return empty string for undefined', () => {
      expect(calculateDuration(undefined)).toBe('');
    });

    it('should format seconds only', () => {
      expect(calculateDuration(0)).toBe('00:00');
      expect(calculateDuration(30)).toBe('00:30');
      expect(calculateDuration(59)).toBe('00:59');
    });

    it('should format minutes and seconds', () => {
      expect(calculateDuration(60)).toBe('01:00');
      expect(calculateDuration(90)).toBe('01:30');
      expect(calculateDuration(3599)).toBe('59:59');
    });

    it('should format hours, minutes and seconds', () => {
      expect(calculateDuration(3600)).toBe('01:00:00');
      expect(calculateDuration(3665)).toBe('01:01:05');
      expect(calculateDuration(7265)).toBe('02:01:05');
    });

    it('should handle large durations', () => {
      expect(calculateDuration(86399)).toBe('23:59:59');
    });

    it('should pad single digits with zeros', () => {
      expect(calculateDuration(65)).toBe('01:05');
      expect(calculateDuration(3605)).toBe('01:00:05');
    });
  });

  describe('formatDateToNow', () => {
    it('should format recent dates as relative time', () => {
      const today = new Date();
      const recentDate = new Date(today);
      recentDate.setDate(today.getDate() - 5);
      const dateStr = recentDate.toISOString().split('T')[0];

      const result = formatDateToNow(dateStr);
      // Should contain "days ago" or similar
      expect(result).toMatch(/days?/);
    });

    it('should format old dates as dd/MM/yyyy', () => {
      const today = new Date();
      const oldDate = new Date(today);
      oldDate.setDate(today.getDate() - 60);
      const dateStr = oldDate.toISOString().split('T')[0];

      const result = formatDateToNow(dateStr);
      // Should be in dd/MM/yyyy format
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should handle dates exactly 30 days ago', () => {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      const dateStr = thirtyDaysAgo.toISOString().split('T')[0];

      const result = formatDateToNow(dateStr);
      // Should be formatted (edge case)
      expect(result).toBeTruthy();
    });
  });
});
