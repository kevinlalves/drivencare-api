import { z } from 'zod';
import patientSchemas from '../schemas/patient.schemas.js';
import usersRepository from '../repositories/users.repository.js';
import errors from '../errors/index.js';
import bcrypt from 'bcrypt';
import { saltRounds } from '../utils/constants/bcrypt.js';
import patientsRepository from '../repositories/patients.repository.js';

const findAll = async ({}) => {
  const { rows: patients } = await patientsRepository.findAll({});

  return patients;
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

export default { findAll, signUp };
