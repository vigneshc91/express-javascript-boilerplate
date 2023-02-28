import { UserService } from '../services/user.service.js';
import { ResponseHandler } from '../../../util/response_handler.js';

export class UserController extends ResponseHandler {
    service;

    constructor() {
        super();
        this.service = new UserService();
    }

    getAllUsers = async(req, res, next) => {
        try {
            const data = await this.service.getAllUser();
            return this.handle(res, data);
        } catch (error) {
            return next(error);
        }
    }

    getProfile = async(req, res, next) => {
        try {
            const data = await this.service.getUserByEmail(req.decodedToken.data.email);
            return this.handle(res, data);
        } catch (error) {
            return next(error);
        }
    }

    createUser = async(req, res, next) => {
        try {
            const data = await this.service.createUser(req.body);
            return this.handle(res, data);
        } catch (error) {
            return next(error);
        }
    }

    loginUser = async(req, res, next) => {
        try {
            const data = await this.service.login(req.body);
            return this.handle(res, data);
        } catch (error) {
            return next(error);
        }
    }

    refresh = async(req, res, next) => {
        try {
            const data = await this.service.refresh(req.decodedToken.data.email);
            return this.handle(res, data);
        } catch (error) {
            return next(error);
        }
    }

    updateProfile = async(req, res, next) => {
        try {
            const data = await this.service.updateProfile(req.body, req.decodedToken.subject);
            return this.handle(res, data);
        } catch (error) {
            return next(error);
        }
    }

    changePassword = async(req, res, next) => {
        try {
            const data = await this.service.changePassword(req.body, req.decodedToken.data.email);
            return this.handle(res, data);
        } catch (error) {
            return next(error);
        }
    }
}
