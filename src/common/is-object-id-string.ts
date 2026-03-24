const OBJECT_ID_HEX_REGEX = /^[a-fA-F0-9]{24}$/;

/**
 * Strict MongoDB ObjectId string check (24 hex chars).
 * Prefer over Types.ObjectId.isValid(), which accepts some invalid 12-byte strings.
 */
export function isObjectIdHexString(value: string): boolean {
  return OBJECT_ID_HEX_REGEX.test(value);
}
