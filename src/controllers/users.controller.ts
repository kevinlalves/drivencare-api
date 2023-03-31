import { NextFunction, Request, Response } from 'express';

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = res.locals;

  try {
  } catch (err) {
    next(err);
  }
};

export default { signIn };
