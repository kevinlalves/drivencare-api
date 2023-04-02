import errors from '../errors/index.js';
import sanitizeObject from '../utils/functions/sanitizeObject.js';
import formatErrorMessages from '../utils/functions/formatErrorMessages.js';
const validateSchemaMiddleware = (schema) => {
    return (req, res, next) => {
        res.locals = sanitizeObject(Object.assign(Object.assign(Object.assign({}, req.params), req.body), req.query));
        const result = schema.safeParse(res.locals);
        if (!result.success) {
            throw errors.unprocessableEntityError(formatErrorMessages(result.error.issues));
        }
        next();
    };
};
export default validateSchemaMiddleware;
