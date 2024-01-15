const { isLoggedIn, isNotLoggedIn } = require('./');

describe('isLoggedIn', function () {
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
    };
    const next = jest.fn();

    test('if it is being logged in, isLoggedIn must call next()', () => {
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        isLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });
    test('if it is not being logged in, isLoggedIn must response some error' ,() => {
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        isLoggedIn(req, res, next);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('Login is required')
    });
});

describe('isNotLoggedIn', function () {
    const res = {
        redirect: jest.fn(),
    };
    const next = jest.fn();

    test('if it is being logged in, isLoggedIn must response some error', () => {
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        isNotLoggedIn(req, res, next);
        const message = encodeURIComponent('is on Login');
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);
    });
    test('if it is not being logged in, isLoggedIn must call next()' ,() => {
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        isNotLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });
});