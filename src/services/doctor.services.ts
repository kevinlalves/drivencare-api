import { z } from 'zod';
import doctorSchemas from '../schemas/doctor.schemas.js';
import usersRepository from '../repositories/users.repository.js';
import errors from '../errors/index.js';
import doctorsRepository from '../repositories/doctors.repository.js';
import specialtiesRepository from '../repositories/specialties.repository.js';
import bcrypt from 'bcrypt';
import { saltRounds } from '../utils/constants/bcrypt.js';
import userServices from './user.services.js';

const findAll = async ({ per, page }: z.infer<typeof doctorSchemas.findAll>) => {
  const { rows: doctors } = await doctorsRepository.findAll({});

  return doctors;
};

const findAllAppointments = async ({
  userId,
  per,
  page,
}: z.infer<typeof doctorSchemas.findAllAppointments> & { userId: string }) => {
  await userServices.checkRoleAuthorization({ userId, role: 'doctor' });

  const { rows: appointments } = await doctorsRepository.findAllAppointments({ userId });

  return appointments;
};

const findAllWeeklySchedules = async ({
  userId,
  per,
  page,
}: z.infer<typeof doctorSchemas.findAllWeeklySchedules> & { userId: string }) => {
  await userServices.checkRoleAuthorization({ userId, role: 'doctor' });

  const { rows: weeklySchedules } = await doctorsRepository.findAllWeeklySchedules({ userId });

  return weeklySchedules;
};

const findByLicenseNumber = async ({ licenseNumber }: z.infer<typeof doctorSchemas.findByLicenseNumber>) => {
  const {
    rows: [doctor],
  } = await doctorsRepository.findByLicenseNumber({ licenseNumber });

  return doctor;
};

const registerSpecialty = async ({
  specialtyId,
  monthsOfExperience,
  userId,
}: z.infer<typeof doctorSchemas.registerSpecialty> & { userId: string }) => {
  await userServices.checkRoleAuthorization({ userId, role: 'doctor' });

  const {
    rows: [{ doctorId }],
  } = await usersRepository.findDoctorId({ userId });

  return doctorsRepository.registerSpecialty({ doctorId, specialtyId, monthsOfExperience });
};

const createWeeklySchedule = async ({
  userId,
  specialtyId,
  dayOfWeek,
  startTime,
  endTime,
}: z.infer<typeof doctorSchemas.createWeeklySchedule> & { userId: string }) => {
  await userServices.checkRoleAuthorization({ userId, role: 'doctor' });

  const {
    rows: [doctorSpecialty],
  } = await usersRepository.findDoctorSpecialtyId({ userId, specialtyId });
  if (!doctorSpecialty) throw errors.notFoundError('This specialty does not exists or belongs to the doctor');

  const { rowCount } = await doctorsRepository.findOverlappingSchedules({
    doctorSpecialtyId: doctorSpecialty.id,
    dayOfWeek,
    startTime,
    endTime,
  });
  if (rowCount) throw errors.conflictError('The time interval overlaps with an existing one');

  return doctorsRepository.createWeeklySchedule({
    doctorSpecialtyId: doctorSpecialty.id,
    dayOfWeek,
    startTime,
    endTime,
  });
};

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
  } = await usersRepository.findByUniqueInfo({ email, document, phone });
  if (user) throw errors.conflictError('Either email, cpf or phone is already in use');

  const doctor = await findByLicenseNumber({ licenseNumber });
  if (doctor) throw errors.conflictError('License number is already in use');

  const { rows: dbSpecialties } = await specialtiesRepository.findBySlugs(
    specialties.map((specialty) => specialty.slug)
  );
  if (dbSpecialties.length !== specialties.length) {
    throw errors.unprocessableEntityError('One or more specialties are not valid');
  }
  for (let i = 0; i < specialties.length; i++) specialties[i].id = dbSpecialties[i].id;

  const encryptedPassword = await bcrypt.hash(password, saltRounds);

  return doctorsRepository.create({
    name,
    roleSlug: 'doctor',
    email,
    password: encryptedPassword,
    document,
    phone,
    licenseNumber,
    specialties,
  });
};

export default {
  findAll,
  findAllAppointments,
  findAllWeeklySchedules,
  registerSpecialty,
  createWeeklySchedule,
  signUp,
};
