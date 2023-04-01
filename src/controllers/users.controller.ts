import { NextFunction, Request, Response } from 'express';
import userSchemas from '../schemas/user.schemas.js';
import { z } from 'zod';
import userServices from '../services/user.services.js';
import { jwtTokenDuration } from '../utils/constants/jwt.js';

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = res.locals as z.infer<typeof userSchemas.signIn>;

  try {
    const token = await userServices.signIn({ email, password });

    res
      .cookie('drivencare_session', token, {
        httpOnly: true,
        maxAge: jwtTokenDuration * 1000,
        path: '/',
      })
      .sendStatus(200);
  } catch (err) {
    next(err);
  }
};

export default { signIn };
