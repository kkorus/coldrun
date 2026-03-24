export function isDuplicateKeyErrorOnField(
  error: unknown,
  fieldName: string,
): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const e = error as {
    code?: number;
    keyPattern?: Record<string, number>;
    keyValue?: Record<string, unknown>;
  };
  if (e.code !== 11000) {
    return false;
  }
  if (
    e.keyPattern &&
    Object.prototype.hasOwnProperty.call(e.keyPattern, fieldName)
  ) {
    return true;
  }
  if (
    e.keyValue &&
    Object.prototype.hasOwnProperty.call(e.keyValue, fieldName)
  ) {
    return true;
  }
  return false;
}
