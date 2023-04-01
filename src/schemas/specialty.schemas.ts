import { z } from 'zod';
import { lowerCaseLettersUnderscores } from '../utils/constants/regex.js';

const create = z.object({
  name: z.string().min(2),
  slug: z.string().regex(lowerCaseLettersUnderscores),
});

const findBySlug = z.object({
  slug: z.string().regex(lowerCaseLettersUnderscores),
});

export default { create, findBySlug };
