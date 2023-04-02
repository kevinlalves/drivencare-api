import { z } from 'zod';
import patientSchemas from '../schemas/patient.schemas.js';
import usersRepository from '../repositories/users.repository.js';
import errors from '../errors/index.js';
import bcrypt from 'bcrypt';
import { saltRounds } from '../utils/constants/bcrypt.js';
import patientsRepository from '../repositories/patients.repository.js';
import userServices from './user.services.js';
import appointmentsRepository from '../repositories/appointments.repository.js';

const findAll = async ({}) => {
  const { rows: patients } = await patientsRepository.findAll({});

  return patients;
};

const findAllAppointments = async ({ userId }: { userId: string }) => {
  await userServices.checkRoleAuthorization({ userId, role: 'patient' });

  const { rows: appointments } = await patientsRepository.findAllAppointments({ userId });

  return appointments;
};

const signUp = async ({
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
}: z.infer<typeof patientSchemas.signUp>) => {
  const {
    rows: [user],
  } = await usersRepository.findByUniqueInfo({ email, document, phone });
  if (user) throw errors.conflictError('Either email, cpf or phone is already in use');

  const encryptedPassword = await bcrypt.hash(password, saltRounds);

  return patientsRepository.create({
    name,
    email,
    password: encryptedPassword,
    document,
    phone,
    roleSlug: 'patient',
    emergencyContactName,
    emergencyContactPhone,
    insuranceNumber,
    insuranceProvider,
    allergies,
  });
};

const createAppointment = async ({
  userId,
  weeklyScheduleId,
  date,
}: z.infer<typeof patientSchemas.createAppointment> & { userId: string }) => {
  const {
    rows: [patient],
  } = await usersRepository.findPatientId({ userId });
  if (!patient) throw errors.unauthorizedError();

  const {
    rows: [appointment],
  } = await appointmentsRepository.findByUniqueInfo({ weeklyScheduleId, date });
  if (appointment) throw errors.conflictError('An appointment for the same timeslot already exists');

  return patientsRepository.createAppointment({ patientId: patient.id, weeklyScheduleId, date });
};

export default { findAll, findAllAppointments, signUp, createAppointment };
