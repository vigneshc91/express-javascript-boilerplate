import { ErrorConstants } from "./error_constants.js";

const CORS_WHITE_LIST = process.env.CORS_WHITE_LIST ? process.env.CORS_WHITE_LIST.split(',') : undefined;

export const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        if (!CORS_WHITE_LIST || CORS_WHITE_LIST.indexOf(origin) === -1) {
            return callback(new Error(ErrorConstants.CORS_NOT_ALLOWED), false)
        }
        return callback(null, true);
    },
    credentials: true
};