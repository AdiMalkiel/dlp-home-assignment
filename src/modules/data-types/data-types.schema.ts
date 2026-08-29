import { z } from 'zod';

export const dataTypeTypeSchema = z.enum(['keywords']);

export const createDataTypeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: dataTypeTypeSchema,
  content: z.array(z.string().min(1)).min(1),
  threshold: z.number().int().positive().optional(),
});

export type CreateDataTypeInput = z.infer<typeof createDataTypeSchema>;

export const updateDataTypeSchema = createDataTypeSchema.partial().extend({
  description: z.string().nullable().optional(),
});

export type UpdateDataTypeInput = z.infer<typeof updateDataTypeSchema>;

export const dataTypeParamsSchema = z.object({
  id: z.uuid(),
});

export type DataTypeParams = z.infer<typeof dataTypeParamsSchema>;
