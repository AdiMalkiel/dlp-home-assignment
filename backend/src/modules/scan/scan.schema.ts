import { z } from 'zod';

export const scanSchema = z.object({
  dataSetId: z.uuid(),
  text: z.string().min(1),
});

export type ScanInput = z.infer<typeof scanSchema>;

export interface DetectedObject {
  id: string;
  name: string;
  match_count: number;
}

export type ScanResult =
  | {
      status: 'match';
      detected_objects: DetectedObject[];
    }
  | {
      status: 'not matched';
    };
