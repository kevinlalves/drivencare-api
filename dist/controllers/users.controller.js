import userServices from '../services/user.services.js';
import { jwtTokenDuration } from '../utils/constants/jwt.js';
const signIn = async (req, res, next) => {
    const { email, password } = res.locals;
    try {
        const token = await userServices.signIn({ email, password });
        res
            .cookie('drivencare_session', token, {
            httpOnly: true,
            maxAge: jwtTokenDuration * 1000,
            path: '/',
        })
            .sendStatus(200);
    }
    catch (err) {
        next(err);
    }
};
export default { signIn };
