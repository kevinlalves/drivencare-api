import { z } from 'zod';
import userSchemas from '../schemas/user.schemas';
import usersRepository from '../repositories/users.repository.js';
import errors from '../errors/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtSecret, jwtTokenDuration } from '../utils/constants/jwt';

const signIn = async ({ email, password }: z.infer<typeof userSchemas.signIn>) => {
  const {
    rows: [user],
  } = await usersRepository.findByEmail(email);

  if (!user) throw errors.invalidCredentialsError();

  const isPasswordValid = await bcrypt.compare(user.password, password);
  if (!isPasswordValid) throw errors.invalidCredentialsError();

  return jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: jwtTokenDuration });
};

export default { signIn };
