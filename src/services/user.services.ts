import { z } from 'zod';
import userSchemas from '../schemas/user.schemas.js';
import usersRepository from '../repositories/users.repository.js';
import errors from '../errors/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtSecret, jwtTokenDuration } from '../utils/constants/jwt.js';

const signIn = async ({ email, password }: z.infer<typeof userSchemas.signIn>) => {
  const {
    rows: [user],
  } = await usersRepository.findByEmail({ email });
  if (!user) throw errors.invalidCredentialsError();

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw errors.invalidCredentialsError();

  return jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: jwtTokenDuration });
};

const findCurrent = async ({ userId }: { userId: string }) => {
  const {
    rows: [user],
  } = await usersRepository.findById({ id: userId });

  return user;
};

const checkRoleAuthorization = async ({ userId, role }: { [key: string]: string }) => {
  const {
    rows: [{ roleSlug }],
  } = await usersRepository.findById({ id: userId });

  if (roleSlug !== role) throw errors.unauthorizedError();
};

export default { signIn, findCurrent, checkRoleAuthorization };
