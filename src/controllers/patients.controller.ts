import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import patientSchemas from '../schemas/patient.schemas.js';
import patientServices from '../services/patient.services.js';

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patients = await patientServices.findAll({});

    res.send(patients);
  } catch (err) {
    next(err);
  }
};

const findAllAppointments = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = res.locals as { userId: string };

  try {
    const appointments = await patientServices.findAllAppointments({ userId });

    res.send(appointments);
  } catch (err) {
    next(err);
  }
};

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    email,
    password,
    document,
    phone,
    emergencyContactName,
    emergencyContactPhone,
    insuranceNumber,
    insuranceProvider,
    allergies,
  } = res.locals as z.infer<typeof patientSchemas.signUp>;

  try {
    await patientServices.signUp({
      name,
      email,
      password,
      document,
      phone,
      emergencyContactName,
      emergencyContactPhone,
      insuranceNumber,
      insuranceProvider,
      allergies,
    });

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, weeklyScheduleId, date } = res.locals as z.infer<typeof patientSchemas.createAppointment> & {
    userId: string;
  };

  try {
    await patientServices.createAppointment({ userId, weeklyScheduleId, date });

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

export default { findAll, findAllAppointments, signUp, createAppointment };
