const bcrypt = require('bcrypt');
const passport = require('passport')
const User = require('../models/user');

exports.join = async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        // 리다이렉션으로 인하여 특정 사용자의 암호를 추측할수 없도록 할것
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        // email, nick ,암호화된 password를 인자로 하여 사용자 생성
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/')
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

exports.login = (req, res, next) => {
    // local 전략 사용
    // 로그인 성공 시 user 에 값이 할당됨, 전략에 따른 내부적 작동은 passport/localStrategy 참조
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError); // 에러 처리 미들웨어로...
        }
        if (!user) {
            return res.redirect(`/?error=${info.message}`);
        }
        // req.login은 passport.serializeUser 를 호출, 제공된 user 객체가 serializeUser 로 넘어감
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙임
};

exports.logout = (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
};