import chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnprocessableEntityError') return res.status(422).send({ message: err.message });

  if (err.name === 'UnauthorizedError' || err.name === 'InvalidCredentialsError') {
    return res.status(401).send({ message: err.message });
  }

  if (err.name === 'ConflictError') return res.status(409).send({ message: err.message });

  if (err.name === 'NotFoundError') return res.status(404).send({ message: err.message });

  console.log(chalk.red(err));
  return res.status(500).send({ message: 'There was an unexpected error, try again in a few minutes' });
};

export default errorMiddleware;
