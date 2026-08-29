import type {
  CreateDataTypeInput,
  UpdateDataTypeInput,
} from './data-types.schema';
import { db } from '../../db/database';

export const createDataType = async (data: CreateDataTypeInput) => {
  return db
    .insertInto('data_types')
    .values(data)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const getDataTypes = async () => {
  return db.selectFrom('data_types').selectAll().execute();
};

export const getDataTypeById = async (id: string) => {
  return db
    .selectFrom('data_types')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
};

export const updateDataType = async (id: string, data: UpdateDataTypeInput) => {
  return db
    .updateTable('data_types')
    .set(data)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst();
};

export const deleteDataType = async (id: string) => {
  return db.deleteFrom('data_types').where('id', '=', id).executeTakeFirst();
};
