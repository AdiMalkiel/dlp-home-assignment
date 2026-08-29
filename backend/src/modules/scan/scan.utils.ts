export type ScanDataType = {
  id: string;
  name: string;
  content: string[];
  threshold: number;
};

export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const countKeywordMatches = (
  text: string,
  keywords: string[],
): number => {
  const normalizedText = text.toLowerCase();

  return keywords.reduce((total, keyword) => {
    const safeKeyword = escapeRegex(keyword.toLowerCase());
    const regex = new RegExp(`\\b${safeKeyword}\\b`, 'g');
    const matches = normalizedText.match(regex);

    return total + (matches?.length ?? 0);
  }, 0);
};

export const checkDataType = (text: string, dataType: ScanDataType) => {
  const matchCount = countKeywordMatches(text, dataType.content);

  return {
    match: matchCount >= dataType.threshold,
    matchCount,
  };
};
