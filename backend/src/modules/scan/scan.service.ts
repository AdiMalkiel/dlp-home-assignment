import { db } from '../../db/database';
import type { ScanInput, ScanResult } from './scan.schema';
import { checkDataType, type ScanDataType } from './scan.utils';

export const scan = async (
  input: ScanInput,
): Promise<ScanResult | undefined> => {
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
