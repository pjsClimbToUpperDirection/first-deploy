const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

beforeAll(async () => {
    // 본 메서드를 호출함으로 인해 데이터베이스와 모델이 동기화될 수 있다.
    await sequelize.sync();
});

describe('POST /join', () => {
    test('if login wasnt done, do for register', (done) => {
        request(app)
            .post('/auth/join')
            .send({
                email: '3.7@naver.com',
                nick: 'parkForMock',
                password: 'nodejsbook',
            })
            .expect('Location', '/')
            .expect(302, done);
    })
})

describe('POST /join', () => {
    // superTest의 request() 로 요청할 시 매번 모든 요청이 새롭게 생성
    // 요청을 지속시키는 것이 가능
    const agent = request.agent(app);
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email: '3.7@naver.com',
                password: 'nodejsbook',
            })
            .end(done); // 본 beforeEach 함수가 마무리되었음을 명시
    });
    test('if login already has been done, redirect to /', (done) => {
        const message = encodeURIComponent('is on Login');
        agent
            .post('/auth/join')
            .send({
                email: '3.7@naver.com',
                nick: 'parkForMock',
                password: 'nodejsbook',
            })
            .expect('Location', `/?error=${message}`)
            .expect(302, done)
    });
});

describe('POST /login', () => {
    test('가입되지 않은 회원', (done) => {
        const message = encodeURIComponent("was not registered");
        request(app)
            .post('/auth/login')
            .send({
                email: '3.9@naver.com',
                password: 'nodejsbook',
            })
            .expect('Location', `/?error=${message}`)
            .expect(302, done);
    });
    
    test('로그인 수행', (done) => {
        request(app)
            .post('/auth/login')
            .send({
                email: '3.7@naver.com',
                password: 'nodejsbook',
            })
            .expect('Location', '/')
            .expect(302, done);
    });

    test('password is not correct', (done) => {
        const message = encodeURIComponent('password is not correct');
        request(app)
            .post('/auth/login')
            .send({
                email: '3.7@naver.com',
                password: 'wrong',
            })
            .expect('Location', `/?error=${message}`)
            .expect(302, done)
    });
});

describe('GET /logout', () => {
    test('if is not being logged in, 403', (done) => {
        request(app)
            .get('/auth/logout')
            .expect(403, done)
    });

    const agent = request.agent(app)
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email: '3.7@naver.com',
                password: 'nodejsbook'
            })
            .end(done)
    });

    test('logout is executed', (done) => {
        agent
            .get('/auth/logout')
            .expect(302, done)
    });
});

afterAll(async () => {
    // force 옵션을 true로 설정함으로서 이미 존재하는 테이블을 drop 하고 새로 생성
    await sequelize.sync({ force: true });
});