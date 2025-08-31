import { ArkErrors, Type } from 'arktype';

function typeWithParse<T extends Type>(arkType: T) {
  return {
    parse: (data: unknown): T['infer'] => {
      const result = arkType(data);
      if (result instanceof ArkErrors) {
        throw new Error(`Validation failed: ${JSON.stringify(result)}`);
      }
      return result;
    },
  };
}

export default typeWithParse;
