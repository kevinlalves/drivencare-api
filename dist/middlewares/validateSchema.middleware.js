import errors from '../errors/index.js';
import sanitizeObject from '../utils/functions/sanitizeObject.js';
const validateSchemaMiddleware = (schema) => {
    return (req, res, next) => {
        res.locals = sanitizeObject(Object.assign(Object.assign(Object.assign({}, req.params), req.body), req.query));
        const result = schema.safeParse(res.locals);
        if (!result.success) {
            throw errors.unprocessableEntityError(result.error.issues.map((issue) => issue.message));
        }
        next();
    };
};
export default validateSchemaMiddleware;
