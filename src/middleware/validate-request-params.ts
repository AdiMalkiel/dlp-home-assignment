import type { ZodType } from 'zod';
import type { NextFunction, Request, Response } from 'express';

export const validateRequestParams =
  <T extends Record<string, string>>(schema: ZodType<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    req.params = schema.parse(req.params);

    next();
  };
