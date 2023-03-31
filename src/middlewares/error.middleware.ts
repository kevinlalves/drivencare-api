import { NextFunction, Request, Response } from 'express';

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnprocessableEntityError') return res.status(422).send({ message: err.message });
};

export default errorMiddleware;
