import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import doctorSchemas from '../schemas/doctor.schemas.js';
import doctorServices from '../services/doctor.services.js';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctors = await doctorServices.findAll({});

    res.send(doctors);
  } catch (err) {
    next(err);
  }
};

const findAllWeeklySchedules = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = res.locals as { userId: string };

  try {
    const weeklySchedules = await doctorServices.findAllWeeklySchedules({ userId });

    res.send(weeklySchedules);
  } catch (err) {
    next(err);
  }
};

const registerSpecialty = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, specialtyId, monthsOfExperience } = res.locals as z.infer<typeof doctorSchemas.registerSpecialty> & {
    userId: string;
  };

  try {
    await doctorServices.registerSpecialty({ userId, specialtyId, monthsOfExperience });

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

const createWeeklySchedule = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, specialtyId, dayOfWeek, startTime, endTime } = res.locals as z.infer<
    typeof doctorSchemas.createWeeklySchedule
  > & { userId: string };

  try {
    await doctorServices.createWeeklySchedule({ userId, specialtyId, dayOfWeek, startTime, endTime });

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

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

export default { findAll, findAllWeeklySchedules, registerSpecialty, createWeeklySchedule, singUp };
