jest.mock('../models/user');
const User = require('../models/user');
const { follow } = require('./user');

describe('follow', () => {
    const req = {
        user: { id: 1 },
        params: { id: 2 },
    };
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
    };
    const next = jest.fn();

    test('사용자를 찾아 팔로잉 추가, success 응답', async () => {
        // Mocking(모킹) 여부 확인
        User.findOne.mockReturnValue({
            addFollowing(id) {
                return Promise.resolve(true);
            }
        });
        await follow(req, res, next);
        expect(res.send).toBeCalledWith('success');
    });

    test('사용자를 못 찾으면 res.status(404).send(no user) 호출', async () => {
        User.findOne.mockReturnValue(null);
        await follow(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');
    })

    test('서버 내 에러(500) 발생 시 next(error) 호출', async () => {
        const message = 'innerERROR';
        User.findOne.mockReturnValue(Promise.reject(message));
        await follow(req, res, next);
        expect(next).toBeCalledWith(message)
    });
});