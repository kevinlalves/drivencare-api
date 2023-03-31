const errorMiddleware = (err, req, res, next) => {
    if (err.name === 'UnprocessableEntityError')
        return res.status(422).send({ message: err.message });
};
export default errorMiddleware;
