const express = require('express')
const passport = require('passport')

const { isLoggedIn, isNotLoggedIn } = require('../middlewares')
const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

// localStrategy
// POST /auth/join
router.post('/join', isNotLoggedIn, join);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout', isLoggedIn, logout);

// kakaoStrategy
// GET /auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

// GET /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/?error=kakaoLoginIsFailed', // 로그인 실패 시 다음 값을 URI에 첨부하여 redirect
}), (req, res) => {
    res.redirect('/'); // 성공 시 메인 페이지로...
});

module.exports = router;