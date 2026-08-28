import type { ErrorRequestHandler } from 'express';

import { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Invalid request',
      errors: error.issues,
    });
    return;
  }

  if (isPostgresError(error) && error.code === '23503') {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Referenced resource does not exist',
    });
    return;
  }

  console.error(error);

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'Internal server error',
  });
};

const isPostgresError = (error: unknown): error is { code: string } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  );
};
