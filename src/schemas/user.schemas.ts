import { z } from 'zod';
import { validCpf, validPhone } from '../utils/constants/regex.js';

const signIn = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signUp = z.object({
  name: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(8),
  document: z.string().regex(validCpf),
  phone: z.string().regex(validPhone),
});

export default { signIn, signUp };
