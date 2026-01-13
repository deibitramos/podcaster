import { describe, it, expect } from 'vitest';
import {
  UnreachableError,
  assertUnreachable,
  assertExists,
  AppError,
  ErrorType,
} from './errors';

describe('errors utilities', () => {
  describe('UnreachableError', () => {
    it('should create error with message', () => {
      const error = new UnreachableError('test message');
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('UnreachableError');
      expect(error.message).toBe('Unreachable code: test message');
    });

    it('should create error with context', () => {
      const context = { foo: 'bar', num: 42 };
      const error = new UnreachableError('test', context);
      expect(error.message).toBe('Unreachable code: test');
    });
  });

  describe('assertUnreachable', () => {
    it('should throw UnreachableError', () => {
      expect(() => assertUnreachable('value' as never)).toThrow(UnreachableError);
    });

    it('should use custom message if provided', () => {
      expect(() => assertUnreachable('value' as never, 'Custom message'))
        .toThrow('Custom message');
    });

    it('should use default message with value', () => {
      expect(() => assertUnreachable('test' as never))
        .toThrow('Unexpected value: "test"');
    });
  });

  describe('assertExists', () => {
    it('should not throw for valid values', () => {
      expect(() => {
        assertExists('value');
      }).not.toThrow();
      expect(() => {
        assertExists(0);
      }).not.toThrow();
      expect(() => {
        assertExists(false);
      }).not.toThrow();
      expect(() => {
        assertExists([]);
      }).not.toThrow();
      expect(() => {
        assertExists({});
      }).not.toThrow();
    });

    it('should throw for null', () => {
      expect(() => {
        assertExists(null);
      }).toThrow(UnreachableError);
      expect(() => {
        assertExists(null);
      }).toThrow('Expected value to exist');
    });

    it('should throw for undefined', () => {
      expect(() => {
        assertExists(undefined);
      }).toThrow(UnreachableError);
      expect(() => {
        assertExists(undefined);
      }).toThrow('Expected value to exist');
    });

    it('should include name in error message', () => {
      expect(() => {
        assertExists(null, 'user');
      }).toThrow('Expected value to exist (name: user)');
    });
  });

  describe('AppError', () => {
    it('should create error with default type', () => {
      const error = new AppError('test message');
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('AppError');
      expect(error.message).toBe('test message');
      expect(error.type).toBe(ErrorType.UNKNOWN);
    });

    it('should create error with specific type', () => {
      const error = new AppError('test', ErrorType.NETWORK);
      expect(error.type).toBe(ErrorType.NETWORK);
    });

    it('should create error with context', () => {
      const context = { url: 'https://api.example.com' };
      const error = new AppError('test', ErrorType.NETWORK, context);
      // Context is logged but not stored as a property in the implementation
      expect(error.type).toBe(ErrorType.NETWORK);
      expect(error.message).toBe('test');
    });

    describe('static factory methods', () => {
      it('should create network error', () => {
        const error = AppError.network('Connection failed');
        expect(error.type).toBe(ErrorType.NETWORK);
        expect(error.message).toBe('Connection failed');
      });

      it('should create validation error', () => {
        const error = AppError.validation('Invalid input');
        expect(error.type).toBe(ErrorType.VALIDATION);
        expect(error.message).toBe('Invalid input');
      });

      it('should create not found error with resource', () => {
        const error = AppError.notFound('User');
        expect(error.type).toBe(ErrorType.NOT_FOUND);
        expect(error.message).toBe('User not found');
      });

      it('should create not found error with resource and id', () => {
        const error = AppError.notFound('Podcast', 123);
        expect(error.type).toBe(ErrorType.NOT_FOUND);
        expect(error.message).toBe('Podcast not found (id: 123)');
        // Context is logged but not stored in the implementation
      });

      it('should create audio playback error', () => {
        const error = AppError.audioPlayback('Cannot play audio');
        expect(error.type).toBe(ErrorType.AUDIO_PLAYBACK);
        expect(error.message).toBe('Cannot play audio');
      });
    });
  });
});
