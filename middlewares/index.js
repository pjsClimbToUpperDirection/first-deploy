exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next(); // 인증되어 있을 시 다음 미들웨어로
    } else {
        res.status(403).send('Login is required'); // 403 Forbidden
    }
};

// 미들웨어를 만든 후 내보냄
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('is on Login');
        res.redirect(`/?error=${message}`); // redirect 형식으로 URI 에 에러 메세지를 추가
    }
};