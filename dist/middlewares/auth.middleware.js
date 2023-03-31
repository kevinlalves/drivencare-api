import jwt from 'jsonwebtoken';
import errors from '../errors/index.js';
import { jwtSecret } from '../utils/constants/jwt';
const authMiddleware = (req, res, next) => {
    const drivencareSessionCookie = req.cookies.drivencare_session;
    if (!drivencareSessionCookie)
        throw errors.unauthorizedError();
    try {
        const { userId } = jwt.verify(drivencareSessionCookie, jwtSecret);
        res.locals = Object.assign({ userId }, res.locals);
    }
    catch (_a) {
        throw errors.unauthorizedError();
    }
    next();
};
export default authMiddleware;
