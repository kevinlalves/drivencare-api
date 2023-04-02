import { z } from 'zod';
import userSchemas from './user.schemas.js';
import { lowerCaseLettersUnderscores, timeRegex, validMedicalLicense } from '../utils/constants/regex.js';
import { week_day } from '../utils/constants/enums.js';
import { invalidTimeFormat } from '../utils/constants/errors.js';

const findAll = z.object({
  per: z.number().int().nonnegative().optional(),
  page: z.number().int().positive().optional(),
});

const findAllAppointments = z.object({
  per: z.number().int().nonnegative().optional(),
  page: z.number().int().positive().optional(),
});

const findAllWeeklySchedules = z.object({
  per: z.number().int().nonnegative().optional(),
  page: z.number().int().positive().optional(),
});

const findByLicenseNumber = z.object({
  licenseNumber: z.string().regex(validMedicalLicense),
});

const registerSpecialty = z.object({
  specialtyId: z.string().uuid(),
  monthsOfExperience: z.number().int().nonnegative(),
});

const createWeeklySchedule = z.object({
  specialtyId: z.string().uuid(),
  dayOfWeek: z.enum(week_day),
  startTime: z.string().refine((time) => timeRegex.test(time), invalidTimeFormat),
  endTime: z.string().refine((time) => timeRegex.test(time), invalidTimeFormat),
});

const signUp = z
  .object({
    licenseNumber: z.string().regex(validMedicalLicense),
    specialties: z
      .array(
        z.object({
          id: z.string().uuid().optional(),
          slug: z.string().regex(lowerCaseLettersUnderscores),
          monthsOfExperience: z.number().int().nonnegative(),
        })
      )
      .nonempty()
      .max(4),
  })
  .merge(userSchemas.signUp);

export default {
  findAll,
  findAllAppointments,
  findAllWeeklySchedules,
  findByLicenseNumber,
  registerSpecialty,
  createWeeklySchedule,
  signUp,
};
