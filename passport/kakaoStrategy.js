const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user')

module.exports = () => {
    passport.use(new kakaoStrategy({
        clientID: process.env.KAKAO_ID, // 카카오에서 서비스 제공자에게 발급해주는 아이디 (노출을 피하기 위해 환경변수 값으로 지정)
        callbackURL: '/auth/kakao/callback', // 인증 결과를 받을 라우터 주소
    }, async  (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao' },
            });
            if (exUser) {
                done(null, exUser)
            } else {
                const newUser = await User.create({
                    email: profile._json?.kako_account?.email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};