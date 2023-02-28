import Joi from 'joi';

export const userUdateProfileDto = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
});
