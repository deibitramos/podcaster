export class UnreachableError extends Error {
  constructor(message: string, context?: Record<string, unknown>) {
    super(`Unreachable code: ${message}`);
    this.name = 'UnreachableError';

    if (context) {
      console.error('UnreachableError context:', context);
    }
  }
}

export function assertUnreachable(value: never, message?: string): never {
  const msg = message ?? `Unexpected value: ${JSON.stringify(value)}`;
  throw new UnreachableError(msg, { value });
}

export function assertExists<T>(value: T | null | undefined, name?: string): asserts value is T {
  if (value == null) {
    throw new UnreachableError(`Expected value to exist${name ? ` (name: ${name})` : ''}.`);
  }
}

export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  AUDIO_PLAYBACK = 'AUDIO_PLAYBACK',
  UNKNOWN = 'UNKNOWN',
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;

    if (context) {
      console.error('Error context:', context);
    }
  }

  static network(message: string, context?: Record<string, unknown>) {
    return new AppError(message, ErrorType.NETWORK, context);
  }

  static validation(message: string, context?: Record<string, unknown>) {
    return new AppError(message, ErrorType.VALIDATION, context);
  }

  static notFound(resource: string, id?: string | number) {
    const message = `${resource} not found${id ? ` (id: ${id})` : ''}`;
    return new AppError(message, ErrorType.NOT_FOUND, { resource, id });
  }

  static audioPlayback(message: string, context?: Record<string, unknown>) {
    return new AppError(message, ErrorType.AUDIO_PLAYBACK, context);
  }
}
