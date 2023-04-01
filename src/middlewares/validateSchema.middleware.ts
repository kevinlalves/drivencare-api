import { NextFunction, Request, Response } from 'express';
import { Schema } from 'zod';
import errors from '../errors/index.js';
import sanitizeObject from '../utils/functions/sanitizeObject.js';
import formatErrorMessages from '../utils/functions/formatErrorMessages.js';

const validateSchemaMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.locals = sanitizeObject({ ...req.params, ...req.body, ...req.query });
    const result = schema.safeParse(res.locals);

    if (!result.success) {
      throw errors.unprocessableEntityError(formatErrorMessages(result.error.issues));
    }

    next();
  };
};

export default validateSchemaMiddleware;
