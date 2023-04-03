const errorFactory = (name: string, message: string | Array<string>) => {
  return { name, message };
};

const unprocessableEntityError = (message: string | Array<string>) => errorFactory('UnprocessableEntityError', message);

const unauthorizedError = () => errorFactory('UnauthorizedError', 'You do not have access permission');

const invalidCredentialsError = () => errorFactory('InvalidCredentialsError', 'Invalid email and/or password');

const conflictError = (message: string) => errorFactory('ConflictError', message);

const notFoundError = (message: string) => errorFactory('NotFoundError', message);

export default { unprocessableEntityError, unauthorizedError, invalidCredentialsError, conflictError, notFoundError };
