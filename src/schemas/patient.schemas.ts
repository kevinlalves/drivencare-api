import { z } from 'zod';
import { validPhone } from '../utils/constants/regex.js';
import userSchemas from './user.schemas.js';

const findAll = z.object({
  per: z.number().int().nonnegative().optional(),
  page: z.number().int().positive().optional(),
});

const signUp = z
  .object({
    emergencyContactName: z.string().min(2),
    emergencyContactPhone: z.string().regex(validPhone),
    insuranceProvider: z.string().min(2).optional(),
    insuranceNumber: z.string().optional(),
    allergies: z.string().min(4),
  })
  .merge(userSchemas.signUp);

export default { findAll, signUp };
