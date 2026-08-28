import { z } from 'zod';

export const scanSchema = z.object({
  dataSetId: z.uuid(),
  text: z.string().min(1),
});

export type ScanInput = z.infer<typeof scanSchema>;

export type ScanDataType = {
  id: string;
  name: string;
  content: string[];
  threshold: number;
};
