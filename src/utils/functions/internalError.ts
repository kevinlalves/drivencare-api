import { Response } from 'express';
import { ErrnoException } from '../../types/error.js';

const internalError = (error: ErrnoException, res: Response): void => {
  console.log(error);

  res.status(500).send("We're having server side problems, try again in a moment");
};

export default internalError;
