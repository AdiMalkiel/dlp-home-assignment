import type { ZodType } from 'zod';
import type { NextFunction, Request, Response } from 'express';

export const validateRequestParams =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.params);

    next();
  };
