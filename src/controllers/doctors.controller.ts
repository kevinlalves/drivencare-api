import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import doctorSchemas from '../schemas/doctor.schemas.js';
import doctorServices from '../services/doctor.services.js';

const singUp = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, document, phone, licenseNumber, specialties } = res.locals as z.infer<
    typeof doctorSchemas.signUp
  >;

  try {
    await doctorServices.signUp({ name, email, password, document, phone, licenseNumber, specialties });

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

export default { singUp };
