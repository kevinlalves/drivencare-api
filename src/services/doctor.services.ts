import { z } from 'zod';
import doctorSchemas from '../schemas/doctor.schemas.js';
import usersRepository from '../repositories/users.repository.js';
import errors from '../errors/index.js';
import doctorsRepository from '../repositories/doctors.repository.js';
import userRolesRepository from '../repositories/userRoles.repository.js';

const signUp = async ({
  name,
  email,
  password,
  document,
  phone,
  license_number,
  specialties,
}: z.infer<typeof doctorSchemas.signUp>) => {
  const {
    rows: [user],
  } = await usersRepository.findByEmail(email);

  if (user) throw errors.conflictError('Email is already in use');

  const {
    rows: [doctorRole],
  } = await userRolesRepository.findByName('doctor');

  await doctorsRepository.create({
    name,
    roleId: doctorRole.id,
    email,
    password,
    document,
    phone,
    license_number,
    specialties,
  });
};

export default { signUp };
