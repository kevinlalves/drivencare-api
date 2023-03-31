const unprocessableEntityError = (message: string | string[]) => {
  return {
    name: 'UnprocessableEntityError',
    message,
  };
};

const unauthorizedError = () => {
  return {
    name: 'UnauthorizedError',
    message: 'You must be signed in to continue',
  };
};

export default { unprocessableEntityError, unauthorizedError };
