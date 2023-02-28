import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

/**
 * Validate the given schema with data
 * @param schema any
 */
export function validate(schema) {
    return function (req, res, next) {
        const data = req.method === 'GET' ? req.query : req.body;
        const { error, value } = schema.validate(data, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: getErrorObject(error) });
        } else {
            if (req.method === 'GET') {
                req.query = value;
            } else {
                req.body = value;
            }
            return next();
        }
    };
}

/**
 * Return the modified error object
 * @param error any
 */
function getErrorObject(error) {
    let errorObject = {};
    if (error.details && error.details.length) {
        error.details.forEach((element) => {
            if (!_.has(errorObject, element.path)) {
                _.set(errorObject, element.path, element.message);
            }
        });
    }
    return errorObject;
}
