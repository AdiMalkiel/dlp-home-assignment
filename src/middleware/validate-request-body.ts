import type { ZodType } from 'zod';
import type { NextFunction, Request, Response } from 'express';

export const validateRequestBody =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);

    next();
  };
