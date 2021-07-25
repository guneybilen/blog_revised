const request = require('supertest');
// const path = require('path');
const app = require('../app');
// const sign = require('jsonwebtoken/sign');
const signIn = require('./helpers/helper');
const UserModel = require('../module/auth/user');
const mongoose = require('mongoose');
var nf = require('node-fetch');
require('jasmine-spec-reporter');

mongoose.connect('mongodb://127.0.0.1:27017/yetenek', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
user = {
  email: 'ccc@ccc.com',
  password: 'zaq12345',
};

describe('Server', () => {
  describe('REST API v1', () => {
    var originalTimeout;

    beforeEach(function () {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    });

    afterEach(function () {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    it('returns a JSON payload', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .end((error) => (error ? done.fail(error) : done()));
    });

    it('signIn functionality', (done) => {
      let result = new Promise((resolve, reject) => {
        resolve(signIn(user));
        reject();
      }); //.catch((e) => console.log('e.messsage ', e.message));

      result.then(
        async function (value) {
          const dbuser = await UserModel.emailExist(user.email);
          const comparePassword = await dbuser.comparePassword(user.password);
          if (!comparePassword) {
            console.log('password is incorrect');
          }
          expect(dbuser.refreshToken).toBe(value.refreshToken);
          // console.log('value ', value.refreshToken);
          done();
        },
        function (error) {
          console.log('error ', error);
          done();
        }
      );
    });
    it('returns statusCode toBe 200', function (done) {
      nf('http://localhost:3000').then((body) => {
        // console.log(body);
        expect(body.status).toBe(200);
      });
      done();
    });
    it('html body returns yetenek.club', function (done) {
      nf('http://localhost:3000')
        .then((res) => res.text())
        .then((body) => {
          expect(body).toContain('yetenek.club');
        });
      done();
    });
  });
});
