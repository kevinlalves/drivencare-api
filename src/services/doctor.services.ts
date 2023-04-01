import { z } from 'zod';
import doctorSchemas from '../schemas/doctor.schemas.js';
import usersRepository from '../repositories/users.repository.js';
import errors from '../errors/index.js';
import doctorsRepository from '../repositories/doctors.repository.js';
import userRolesRepository from '../repositories/userRoles.repository.js';
import specialtiesRepository from '../repositories/specialties.repository.js';

const signUp = async ({
  name,
  email,
  password,
  document,
  phone,
  licenseNumber,
  specialties,
}: z.infer<typeof doctorSchemas.signUp>) => {
  const {
    rows: [user],
  } = await usersRepository.findByEmail(email);

  if (user) throw errors.conflictError('Email is already in use');

  const {
    rows: [doctorRole],
  } = await userRolesRepository.findBySlug({ slug: 'doctor' });

  const { rows: dbSpecialties } = await specialtiesRepository.findBySlugs(
    specialties.map((specialty) => specialty.slug)
  );

  for (let i = 0; i < specialties.length; i++) specialties[i].id = dbSpecialties[i].id;

  doctorsRepository.create({
    name,
    roleId: doctorRole.id,
    email,
    password,
    document,
    phone,
    licenseNumber,
    specialties,
  });
};

export default { signUp };
