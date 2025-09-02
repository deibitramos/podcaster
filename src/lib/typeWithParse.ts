import { ArkErrors, Type } from 'arktype';
import { AppError } from './errors';

function typeWithParse<T extends Type>(arkType: T) {
  return {
    parse: (data: unknown): T['infer'] => {
      const result = arkType(data);
      if (result instanceof ArkErrors) {
        const firstError = result[0];
        const field = String(firstError.path[0]) || 'parameter';
        const value = String(firstError.actual || data);
        const message = `Invalid ${field}: ${value}`;
        throw AppError.validation(message, { field, value, originalError: result });
      }
      return result;
    },
  };
}

export default typeWithParse;
