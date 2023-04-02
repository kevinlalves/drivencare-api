import usersRepository from '../repositories/users.repository.js';
import errors from '../errors/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtSecret, jwtTokenDuration } from '../utils/constants/jwt.js';
const signIn = async ({ email, password }) => {
    const { rows: [user], } = await usersRepository.findByEmail(email);
    if (!user)
        throw errors.invalidCredentialsError();
    const isPasswordValid = await bcrypt.compare(user.password, password);
    if (!isPasswordValid)
        throw errors.invalidCredentialsError();
    return jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: jwtTokenDuration });
};
export default { signIn };
