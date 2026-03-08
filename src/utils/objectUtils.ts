/**
 * Remove campos undefined do objeto
 * Útil para limpar payloads antes de enviar ao backend
 */
export const removeUndefinedFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Partial<T>);
};

/**
 * Remove campos null e undefined do objeto
 */
export const removeNullishFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== undefined && obj[key] !== null) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Partial<T>);
};
