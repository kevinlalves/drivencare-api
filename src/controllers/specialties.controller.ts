import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import specialtySchemas from '../schemas/specialty.schemas.js';
import specialtyServices from '../services/specialty.services.js';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const specialties = await specialtyServices.findAll();

    res.send(specialties);
  } catch (err) {
    next(err);
  }
};

const findBySlug = async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = res.locals as z.infer<typeof specialtySchemas.findBySlug>;

  try {
    const specialty = await specialtyServices.findBySlug({ slug });

    res.send(specialty);
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { slug, name } = res.locals as z.infer<typeof specialtySchemas.create>;

  try {
    await specialtyServices.create({ slug, name });

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

export default { findAll, findBySlug, create };
