import { describe, expect, it } from 'vitest';

import { checkDataType, countKeywordMatches, escapeRegex } from './scan.utils';

describe('escapeRegex', () => {
  it('escapes regex special characters', () => {
    expect(escapeRegex('C++')).toBe('C\\+\\+');
  });
});

describe('countKeywordMatches', () => {
  it('counts keyword matches case-insensitively', () => {
    expect(countKeywordMatches('Visa VISA visa', ['visa'])).toBe(3);
  });

  it('matches whole words only', () => {
    expect(countKeywordMatches('visa visacard', ['visa'])).toBe(1);
  });

  it('counts matches for multiple keywords', () => {
    expect(
      countKeywordMatches('visa mastercard visa', ['visa', 'mastercard']),
    ).toBe(3);
  });

  it('returns zero when there are no matches', () => {
    expect(countKeywordMatches('hello world', ['visa'])).toBe(0);
  });

  it('returns zero for an empty keyword list', () => {
    expect(countKeywordMatches('visa mastercard', [])).toBe(0);
  });
});

describe('checkDataType', () => {
  const dataType = {
    id: '123',
    name: 'Credit Card',
    content: ['visa', 'mastercard'],
    threshold: 2,
  };

  it('matches when keyword count reaches the threshold', () => {
    expect(checkDataType('Visa and Mastercard', dataType)).toEqual({
      match: true,
      matchCount: 2,
    });
  });

  it('does not match when keyword count is below the threshold', () => {
    expect(checkDataType('Visa', dataType)).toEqual({
      match: false,
      matchCount: 1,
    });
  });

  it('reports the actual count when it exceeds the threshold', () => {
    expect(checkDataType('visa visa mastercard visa', dataType)).toEqual({
      match: true,
      matchCount: 4,
    });
  });

  it('returns matchCount 0 when there are no keyword hits', () => {
    expect(checkDataType('no relevant content here', dataType)).toEqual({
      match: false,
      matchCount: 0,
    });
  });
});
