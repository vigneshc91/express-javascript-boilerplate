import passport from 'passport';
import { StatusCodes } from 'http-status-codes';

/**
 * Check the given jwt token is valid or not
 * @param req Request
 * @param res Response
 * @param next NextFunction
 */
export function authenticate(req, res, next) {
    return passport.authenticate('jwt', { session: false }, (err, decodedToken, info) => {
        if (err) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ errors: info.message || 'Unauthorized request' });
        }
        if (!decodedToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ errors: info.message || 'Unauthorized request' });
        }
        if (req.path.indexOf('refresh') === -1 && decodedToken.type !== 'accessToken') {
            return res.status(StatusCodes.UNAUTHORIZED).json({ errors: 'Only access token allowed' });
        } else if (req.path.indexOf('refresh') > -1 && decodedToken.type !== 'refreshToken') {
            return res.status(StatusCodes.UNAUTHORIZED).json({ errors: 'Only refresh token allowed' });
        }
        req.decodedToken = decodedToken;
        return next();
    })(req, res, next);
}
