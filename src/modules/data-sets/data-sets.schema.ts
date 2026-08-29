import { z } from 'zod';

export const createDataSetSchema = z.object({
  name: z.string().min(1),
  dataTypeIds: z.array(z.uuid()),
});

export type CreateDataSetInput = z.infer<typeof createDataSetSchema>;

export const updateDataSetSchema = createDataSetSchema.partial();

export type UpdateDataSetInput = z.infer<typeof updateDataSetSchema>;

export const dataSetParamsSchema = z.object({
  id: z.uuid(),
});

export type DataSetParams = z.infer<typeof dataSetParamsSchema>;
