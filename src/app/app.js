import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { StatusCodes } from 'http-status-codes';
import cors from 'cors';
import passport from 'passport';
import { Logger } from '../util/logger.js';
import { userRouter } from './user/routes/user.route.js';
import '../config/jwt.js';
import '../config/database.js';
import { corsOptions } from '../config/cors.js';
import { throttle } from '../config/throttle.js';
import { APP_NAME, BASE_URL } from '../config/index.js';
import { ErrorConstants } from '../config/error_constants.js';
import { SuccessConstants } from '../config/success_constants.js';

const { urlencoded, json } = bodyParser;

export function init(app) {
    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(cookieParser());
    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(passport.initialize());
    app.use(throttle);
    
    app.get('/', (req, res) => {
        return res.json({ data: SuccessConstants.HELLO_WORLD });
    });
    
    app.use(`${BASE_URL}/users`, userRouter);
    
    app.get('*', (req, res) => {
        return res.status(StatusCodes.NOT_FOUND).json({ errors: ErrorConstants.RESOURCE_NOT_FOUND });
    });
    
    app.use((err, req, res, next) => {
        if (res.headersSent) {
            return next(err);
        }
        Logger.error(err, 'EXCEPTION');
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: err.message || err || String(err) || ErrorConstants.INTERNAL_SERVER_ERROR });
    });
}
