import { z } from 'zod';
import userSchemas from './user.schemas.js';

const signUp = z
  .object({
    license_number: z.string(),
    specialties: z.array(
      z.object({
        id: z.string().uuid(),
        months_of_experience: z.number().int().nonnegative(),
      })
    ),
  })
  .merge(userSchemas.signUp);

export default { signUp };
