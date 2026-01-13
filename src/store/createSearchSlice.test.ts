import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppStore } from './index';

describe('createSearchSlice', () => {
  it('should have initial filter as empty string', () => {
    const { result } = renderHook(() => useAppStore());
    expect(result.current.filter).toBe('');
  });

  it('should update filter when setFilter is called', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setFilter('javascript');
    });

    expect(result.current.filter).toBe('javascript');
  });

  it('should update filter multiple times', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setFilter('first');
    });
    expect(result.current.filter).toBe('first');

    act(() => {
      result.current.setFilter('second');
    });
    expect(result.current.filter).toBe('second');

    act(() => {
      result.current.setFilter('third');
    });
    expect(result.current.filter).toBe('third');
  });

  it('should clear filter', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.setFilter('test');
    });
    expect(result.current.filter).toBe('test');

    act(() => {
      result.current.setFilter('');
    });
    expect(result.current.filter).toBe('');
  });
});
