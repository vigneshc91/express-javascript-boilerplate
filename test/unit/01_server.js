import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import { ROOT_URL, BASE_URL } from '../helper/config.js';

chai.should();
chai.use(chaiHttp);

describe('Server', () => {
    it('Up and Running', (done) => {
        chai.request(ROOT_URL)
            .get('')
            .end((err, res) => {
                res.should.have.status(StatusCodes.OK);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                done();
            });
    });

    it('404 Error', (done) => {
        chai.request(BASE_URL)
            .get('')
            .end((err, res) => {
                res.should.have.status(StatusCodes.NOT_FOUND);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                done();
            });
    });
});
