import { db } from '../../db/database';
import type { ScanDataType, ScanInput } from './scan.schema';

const countKeywordMatches = (text: string, keywords: string[]): number => {
  const normalizedText = text.toLowerCase();

  return keywords.reduce((total, keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    const matches = normalizedText.match(regex);

    return total + (matches?.length ?? 0);
  }, 0);
};

const checkDataType = (text: string, dataType: ScanDataType) => {
  const matchCount = countKeywordMatches(text, dataType.content);

  return {
    match: matchCount >= dataType.threshold,
    matchCount,
  };
};

export const scan = async (input: ScanInput) => {
  const dataSet = await db
    .selectFrom('data_sets')
    .selectAll()
    .where('id', '=', input.dataSetId)
    .executeTakeFirst();

  if (!dataSet) {
    return undefined;
  }

  const dataTypes: ScanDataType[] = await db
    .selectFrom('data_set_data_types')
    .innerJoin(
      'data_types',
      'data_types.id',
      'data_set_data_types.data_type_id',
    )
    .select([
      'data_types.id',
      'data_types.name',
      'data_types.content',
      'data_types.threshold',
    ])
    .where('data_set_data_types.data_set_id', '=', input.dataSetId)
    .execute();

  const detectedObjects = dataTypes
    .map((dataType) => {
      const result = checkDataType(input.text, dataType);

      if (!result.match) {
        return null;
      }

      return {
        id: dataType.id,
        name: dataType.name,
        match_count: result.matchCount,
      };
    })
    .filter((result) => result !== null);

  if (detectedObjects.length === 0) {
    return {
      status: 'not matched' as const,
    };
  }

  return {
    status: 'match' as const,
    detected_objects: detectedObjects,
  };
};
