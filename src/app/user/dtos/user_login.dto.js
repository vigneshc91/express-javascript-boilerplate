import Joi from 'joi';

export const userLoginDto = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
