import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';
import { ErrorConstants } from './error_constants.js';

export const throttle = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60,
    handler: (req, res) => {
        return res.status(StatusCodes.TOO_MANY_REQUESTS).json({ errors: ErrorConstants.TOO_MANY_REQUESTS });
    }
});
