import { isDuplicateKeyErrorOnField } from './mongo-duplicate-key';

describe('isDuplicateKeyErrorOnField', () => {
  it('returns true for duplicate key on field via keyPattern', () => {
    // given
    const err = { code: 11000, keyPattern: { code: 1 } };

    // when / then
    expect(isDuplicateKeyErrorOnField(err, 'code')).toBe(true);
  });

  it('returns true for duplicate key on field via keyValue', () => {
    // given
    const err = { code: 11000, keyValue: { code: 'DUP' } };

    // when / then
    expect(isDuplicateKeyErrorOnField(err, 'code')).toBe(true);
  });

  it('returns false when code is not 11000', () => {
    // given
    const err = { code: 11001, keyPattern: { code: 1 } };

    // when / then
    expect(isDuplicateKeyErrorOnField(err, 'code')).toBe(false);
  });
});
