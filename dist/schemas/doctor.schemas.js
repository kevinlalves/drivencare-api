import { z } from 'zod';
import userSchemas from './user.schemas.js';
import { lowerCaseLettersUnderscores, validMedicalLicense } from '../utils/constants/regex.js';
const signUp = z
    .object({
    licenseNumber: z.string().regex(validMedicalLicense),
    specialties: z
        .array(z.object({
        id: z.string().uuid().optional(),
        slug: z.string().regex(lowerCaseLettersUnderscores),
        monthsOfExperience: z.number().int().nonnegative(),
    }))
        .nonempty()
        .max(4),
})
    .merge(userSchemas.signUp);
export default { signUp };
