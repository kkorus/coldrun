import { isObjectIdHexString } from './is-object-id-string';

describe('isObjectIdHexString', () => {
  it('returns true for 24 hex chars', () => {
    // given
    const id = '507f1f77bcf86cd799439011';

    // when / then
    expect(isObjectIdHexString(id)).toBe(true);
  });

  it('returns false for wrong length', () => {
    // given
    const id = '507f1f77bcf86cd79943901';

    // when / then
    expect(isObjectIdHexString(id)).toBe(false);
  });

  it('returns false for non-hex characters', () => {
    // given
    const id = '507f1f77bcf86cd79943901g';

    // when / then
    expect(isObjectIdHexString(id)).toBe(false);
  });
});
