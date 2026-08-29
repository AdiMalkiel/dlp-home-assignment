import type {
  CreateDataSetInput,
  UpdateDataSetInput,
} from './data-sets.schema';
import { db } from '../../db/database';

export const createDataSet = async (data: CreateDataSetInput) => {
  return db.transaction().execute(async (trx) => {
    const dataSet = await trx
      .insertInto('data_sets')
      .values({
        name: data.name,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    if (data.dataTypeIds.length > 0) {
      await trx
        .insertInto('data_set_data_types')
        .values(
          data.dataTypeIds.map((dataTypeId) => ({
            data_set_id: dataSet.id,
            data_type_id: dataTypeId,
          })),
        )
        .execute();
    }

    return dataSet;
  });
};

export const getDataSets = async () => {
  return db.selectFrom('data_sets').selectAll().execute();
};

export const getDataSetById = async (id: string) => {
  const dataSet = await db
    .selectFrom('data_sets')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();

  if (!dataSet) {
    return undefined;
  }

  const dataTypes = await db
    .selectFrom('data_set_data_types')
    .innerJoin(
      'data_types',
      'data_types.id',
      'data_set_data_types.data_type_id',
    )
    .select([
      'data_types.id',
      'data_types.name',
      'data_types.description',
      'data_types.type',
      'data_types.content',
      'data_types.threshold',
    ])
    .where('data_set_data_types.data_set_id', '=', id)
    .execute();

  return {
    ...dataSet,
    dataTypes,
  };
};

export const updateDataSet = async (id: string, data: UpdateDataSetInput) => {
  return db.transaction().execute(async (trx) => {
    const existingDataSet = await trx
      .selectFrom('data_sets')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!existingDataSet) {
      return undefined;
    }

    const dataSet =
      data.name !== undefined
        ? await trx
            .updateTable('data_sets')
            .set({ name: data.name })
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirstOrThrow()
        : existingDataSet;

    if (data.dataTypeIds !== undefined) {
      await trx
        .deleteFrom('data_set_data_types')
        .where('data_set_id', '=', id)
        .execute();

      if (data.dataTypeIds.length > 0) {
        await trx
          .insertInto('data_set_data_types')
          .values(
            data.dataTypeIds.map((dataTypeId) => ({
              data_set_id: id,
              data_type_id: dataTypeId,
            })),
          )
          .execute();
      }
    }

    return dataSet;
  });
};

export const deleteDataSet = async (id: string) => {
  return db.deleteFrom('data_sets').where('id', '=', id).executeTakeFirst();
};
