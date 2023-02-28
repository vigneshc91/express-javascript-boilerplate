import chai from 'chai';
import chaiHttp from 'chai-http';
import { step } from "mocha-steps";
import { StatusCodes } from 'http-status-codes';
import { faker } from '@faker-js/faker';
import { BASE_URL , Global} from '../helper/config.js';
import { getSHA512Hash } from '../../src/util/helper.js';

chai.should();
chai.use(chaiHttp);

describe('User', () => {

    step('Register with empty data', (done) => {
        const data = {};
        chai.request(BASE_URL)
            .post('/users')
            .send()
            .end((err, res) => {
                res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                done();
            });
    });

    step('Register with valid data', (done) => {
        Global.USER.EMAIL = faker.internet.email();
        Global.USER.PASSWORD = getSHA512Hash(faker.internet.password(8));
        const data = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: Global.USER.EMAIL,
            password: Global.USER.PASSWORD
        };
        chai.request(BASE_URL)
            .post('/users')
            .send(data)
            .end((err, res) => {
                res.should.have.status(StatusCodes.CREATED);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                done();
            });
    });

    step('Login user with empty data', (done) => {
        const data = {};
        chai.request(BASE_URL)
            .post('/users/login')
            .send(data)
            .end((err, res) => {
                res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                done();
            });
    });

    step('Login user with invalid email', (done) => {
        const data = {
            email: faker.internet.email(),
            password: Global.USER.PASSWORD
        };
        chai.request(BASE_URL)
            .post('/users/login')
            .send(data)
            .end((err, res) => {
                res.should.have.status(StatusCodes.NOT_FOUND);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                done();
            });
    });

    step('Login user with invalid password', (done) => {
        const data = {
            email: Global.USER.EMAIL,
            password: getSHA512Hash(faker.internet.password(8))
        };
        chai.request(BASE_URL)
            .post('/users/login')
            .send(data)
            .end((err, res) => {
                res.should.have.status(StatusCodes.UNAUTHORIZED);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                done();
            });
    });

    step('Login user with correct credentials', (done) => {
        const data = {
            email: Global.USER.EMAIL,
            password: Global.USER.PASSWORD
        };
        chai.request(BASE_URL)
            .post('/users/login')
            .send(data)
            .end((err, res) => {
                res.should.have.status(StatusCodes.OK);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                Global.USER.ACCESS_TOKEN = res.body.data.accessToken;
                Global.USER.REFRESH_TOKEN = res.body.data.refreshToken;
                done();
            });
    });

    step('Get profile details without token', (done) => {
        chai.request(BASE_URL)
            .get('/users/me')
            .end((err, res) => {
                res.should.have.status(StatusCodes.UNAUTHORIZED);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                done();
            });
    });

    step('Get profile details with valid token', (done) => {
        chai.request(BASE_URL)
            .get('/users/me')
            .set('Authorization', `Bearer ${Global.USER.ACCESS_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(StatusCodes.OK);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                done();
            });
    });

    step('Get users list without token', (done) => {
        chai.request(BASE_URL)
            .get('/users')
            .end((err, res) => {
                res.should.have.status(StatusCodes.UNAUTHORIZED);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                done();
            });
    });

    step('Get users list', (done) => {
        chai.request(BASE_URL)
            .get('/users')
            .set('Authorization', `Bearer ${Global.USER.ACCESS_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(StatusCodes.OK);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                done();
            });
    });

    step('Update profile details with empty data', (done) => {
        const data = {};
        chai.request(BASE_URL)
            .put('/users/me')
            .send(data)
            .set('Authorization', `Bearer ${Global.USER.ACCESS_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                done();
            });
    });

    step('Update profile details with valid data', (done) => {
        const data = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
        };
        chai.request(BASE_URL)
            .put('/users/me')
            .send(data)
            .set('Authorization', `Bearer ${Global.USER.ACCESS_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(StatusCodes.OK);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                done();
            });
    });

    step('Change password with empty data', (done) => {
        const data = {};
        chai.request(BASE_URL)
            .patch('/users/change-password')
            .send(data)
            .set('Authorization', `Bearer ${Global.USER.ACCESS_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(StatusCodes.UNPROCESSABLE_ENTITY);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                done();
            });
    });

    step('Change password with valid data', (done) => {
        Global.USER.PASSWORD = getSHA512Hash(faker.internet.password(8));
        const data = {
            password: Global.USER.PASSWORD
        };
        chai.request(BASE_URL)
            .patch('/users/change-password')
            .send(data)
            .set('Authorization', `Bearer ${Global.USER.ACCESS_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(StatusCodes.OK);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                done();
            });
    });

    step('Refresh access and refresh token', (done) => {
        Global.USER.PASSWORD = getSHA512Hash(faker.internet.password(8));
        const data = {
            password: Global.USER.PASSWORD
        };
        chai.request(BASE_URL)
            .post('/users/refresh')
            .send(data)
            .set('Authorization', `Bearer ${Global.USER.REFRESH_TOKEN}`)
            .end((err, res) => {
                res.should.have.status(StatusCodes.OK);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                done();
            });
    });

});
