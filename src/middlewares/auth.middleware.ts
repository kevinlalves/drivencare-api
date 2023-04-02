import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import errors from '../errors/index.js';
import { jwtSecret } from '../utils/constants/jwt.js';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const drivencareSessionCookie = req.cookies.drivencare_session;

  if (!drivencareSessionCookie) throw errors.unauthorizedError();

  try {
    const { userId } = jwt.verify(drivencareSessionCookie, jwtSecret) as { userId: string };
    res.locals = { userId, ...res.locals };
  } catch {
    throw errors.unauthorizedError();
  }

  next();
};

export default authMiddleware;
