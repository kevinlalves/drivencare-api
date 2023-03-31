import { NextFunction, Request, Response } from 'express';
import { Schema } from 'zod';
import errors from '../errors/index.js';
import sanitizeObject from '../utils/functions/sanitizeObject.js';

const validateSchemaMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.locals = sanitizeObject({ ...req.params, ...req.body, ...req.query });
    const result = schema.safeParse(res.locals);

    if (!result.success) {
      throw errors.unprocessableEntityError(result.error.issues.map((issue) => issue.message));
    }

    next();
  };
};

export default validateSchemaMiddleware;
