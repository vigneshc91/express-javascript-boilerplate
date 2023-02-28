import { StatusCodes } from 'http-status-codes';
import { hash, verify } from 'argon2';
import _ from 'lodash';
import { User, status, type } from '../models/user.model.js';
import { ErrorConstants } from '../../../config/error_constants.js';
import { getJwtToken } from '../../../util/jwt_token.js';

export class UserService {
    /**
     * Get list of all users
     */
    async getAllUser() {
        try {
            const user = await User.find({ status: { $ne: status.DELETED } });

            return {
                success: true,
                data: user,
                statusCode: StatusCodes.OK,
            };
        } catch (error) {
            return {
                success: false,
                errors: error,
                exception: error,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            };
        }
    }

    /**
     * Get the user by its email
     * @param email string
     * @param field string
     */
    async getUserByEmail(email, field) {
        try {
            let user = User.findOne({ email: email });

            if (field) {
                user.select(`+${field}`);
            }

            user = await user.exec();

            if (!user) {
                return {
                    success: false,
                    errors: ErrorConstants.USER_NOT_FOUND,
                    statusCode: StatusCodes.NOT_FOUND,
                };
            }

            return {
                success: true,
                data: user,
                statusCode: StatusCodes.OK,
            };
        } catch (error) {
            return {
                success: false,
                errors: error,
                exception: error,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            };
        }
    }

    /**
     * Create a new user
     * @param data any
     */
    async createUser(data) {
        try {
            const isEmailAlreadyExist = await this.getUserByEmail(data.email);
            if (isEmailAlreadyExist.success) {
                return {
                    success: false,
                    errors: ErrorConstants.EMAIL_ALREADY_EXIST,
                    statusCode: StatusCodes.BAD_REQUEST,
                };
            }
            data.type = type.USER;
            data.password = await hash(data.password);
            const user = await User.create(data);

            let userData = user.toObject();
            delete userData.password;

            return {
                success: true,
                data: userData,
                statusCode: StatusCodes.CREATED,
            };
        } catch (error) {
            return {
                success: false,
                errors: error,
                exception: error,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            };
        }
    }

    /**
     * Check user credentials and provide access and refresh token if valid
     * @param data any
     */
    async login(data) {
        try {
            let user = await this.getUserByEmail(data.email, 'password');
            if (!user.success) {
                return user;
            }
            let userData = user.data;

            if (!(await verify(userData.password, data.password))) {
                return {
                    success: false,
                    errors: ErrorConstants.INVALID_CREDENTIALS,
                    statusCode: StatusCodes.UNAUTHORIZED,
                };
            }

            userData = { ...userData.toObject(), ...getJwtToken(_.pick(userData, ['_id', 'firstName', 'lastName', 'email'])) };
            delete userData.password;

            return {
                success: true,
                data: userData,
                statusCode: StatusCodes.OK,
            };
        } catch (error) {
            return {
                success: false,
                errors: error,
                exception: error,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            };
        }
    }

    /**
     * Generate new access and refresh token from the provided refresh token
     * @param email string
     */
    async refresh(email) {
        try {
            let user = await this.getUserByEmail(email);
            if (!user.success) {
                return user;
            }
            let userData = user.data;

            userData = { ...userData.toObject(), ...getJwtToken(_.pick(userData, ['_id', 'firstName', 'lastName', 'email'])) };

            return {
                success: true,
                data: userData,
                statusCode: StatusCodes.OK,
            };
        } catch (error) {
            return {
                success: false,
                errors: error,
                exception: error,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            };
        }
    }

    /**
     * Get the user info by its id
     * @param id string
     */
    async getUserById(id) {
        try {
            const user = await User.findOne({
                _id: id,
                status: { $ne: status.DELETED },
            });

            if (!user) {
                return {
                    success: false,
                    errors: ErrorConstants.USER_NOT_FOUND,
                    statusCode: StatusCodes.NOT_FOUND,
                };
            }

            return {
                success: true,
                data: user,
                statusCode: StatusCodes.OK,
            };
        } catch (error) {
            return {
                success: false,
                errors: error,
                exception: error,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            };
        }
    }

    /**
     * Update the given data of the user
     * @param data any
     * @param id string
     */
    async updateProfile(data, id) {
        try {
            let user = await this.getUserById(id);
            if (!user.success) {
                return user;
            }
            user = user.data;

            for (const key in data) {
                user[key] = data[key];
            }

            await user.save();

            return {
                success: true,
                data: user,
                statusCode: StatusCodes.OK,
            };
        } catch (error) {
            return {
                success: false,
                errors: error,
                exception: error,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            };
        }
    }

    /**
     * Update the given password of the user
     * @param data any
     * @param email string
     */
    async changePassword(data, email) {
        try {
            let user = await this.getUserByEmail(email, 'password');
            if (!user.success) {
                return user;
            }
            user = user.data;

            if (data.oldPassword && !(await verify(user.password, data.oldPassword))) {
                return {
                    success: false,
                    errors: ErrorConstants.INVALID_OLD_PASSWORD,
                    statusCode: StatusCodes.BAD_REQUEST,
                };
            }

            user.password = await hash(data.password);
            user.save();
            user = user.toObject();
            delete user.password;

            return {
                success: true,
                data: user,
                statusCode: StatusCodes.OK,
            };
        } catch (error) {
            return {
                success: false,
                errors: error,
                exception: error,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
