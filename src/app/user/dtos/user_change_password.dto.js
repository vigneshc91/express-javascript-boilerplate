import Joi from 'joi';

export const userChangePasswordDto = Joi.object({
    oldPassword: Joi.string().optional(),
    password: Joi.string().required(),
});
