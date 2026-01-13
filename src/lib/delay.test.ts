import { describe, it, expect } from 'vitest';
import delay from './delay';

describe('delay utility', () => {
  it('should resolve after specified time', async () => {
    const start = Date.now();
    await delay(100);
    const elapsed = Date.now() - start;

    // Allow for some timing variance (±50ms)
    expect(elapsed).toBeGreaterThanOrEqual(90);
    expect(elapsed).toBeLessThan(200);
  });

  it('should resolve immediately for 0ms', async () => {
    const start = Date.now();
    await delay(0);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(50);
  });

  it('should return a promise', () => {
    const result = delay(10);
    expect(result).toBeInstanceOf(Promise);
  });

  it('should work with async/await', async () => {
    let executed = false;

    await delay(50);
    executed = true;

    expect(executed).toBe(true);
  });
});
