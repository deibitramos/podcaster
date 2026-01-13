import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useDebounce from './useDebounce';

describe('useDebounce hook', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial'));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'first' } },
    );

    expect(result.current).toBe('first');

    // Update value
    rerender({ value: 'second' });

    // Should still have old value immediately
    expect(result.current).toBe('first');

    // After delay, should have new value
    await waitFor(
      () => {
        expect(result.current).toBe('second');
      },
      { timeout: 600 },
    );
  });

  it('should cancel previous timeout on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'first' } },
    );

    // Rapidly change values
    rerender({ value: 'second' });
    await new Promise(resolve => setTimeout(resolve, 100));
    rerender({ value: 'third' });
    await new Promise(resolve => setTimeout(resolve, 100));
    rerender({ value: 'fourth' });

    // Should still have initial value
    expect(result.current).toBe('first');

    // After full delay, should have latest value only
    await waitFor(
      () => {
        expect(result.current).toBe('fourth');
      },
      { timeout: 600 },
    );
  });

  it('should work with different value types', async () => {
    // Number
    const { result: numResult, rerender: numRerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 1 } },
    );
    numRerender({ value: 2 });
    await waitFor(() => {
      expect(numResult.current).toBe(2);
    }, { timeout: 600 });

    // Boolean
    const { result: boolResult, rerender: boolRerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: true } },
    );
    boolRerender({ value: false });
    await waitFor(() => {
      expect(boolResult.current).toBe(false);
    }, { timeout: 600 });

    // Object
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const { result: objResult, rerender: objRerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: obj1 } },
    );
    objRerender({ value: obj2 });
    await waitFor(() => {
      expect(objResult.current).toBe(obj2);
    }, { timeout: 600 });
  });

  it('should cleanup timeout on unmount', () => {
    const { unmount } = renderHook(() => useDebounce('value'));
    // Should not throw or cause issues
    unmount();
  });
});
