import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import userRoleSchemas from '../schemas/userRole.schemas.js';
import userRoleServices from '../services/userRole.services.js';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRoles = await userRoleServices.findAll();

    res.send(userRoles);
  } catch (err) {
    next(err);
  }
};

const findBySlug = async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = res.locals as z.infer<typeof userRoleSchemas.findBySlug>;

  try {
    const userRole = await userRoleServices.findBySlug({ slug });

    res.send(userRole);
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { slug, name } = res.locals as z.infer<typeof userRoleSchemas.create>;

  try {
    await userRoleServices.create({ slug, name });

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

export default { findAll, findBySlug, create };
