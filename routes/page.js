const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares')
const { renderProfile, renderJoin, renderMain, renderHashtag, } = require('../controllers/page');

const router = express.Router(); // 소형 애플리케이션처럼 미들웨어와 라우트의 독립된 인스턴스

// MiddleWare
// 본 미들웨어 사용해서 res 객체에 지정한 값을 템플릿 엔진에서 사용
router.use((req, res, next) => {
    res.locals.user = req.user; // 템플릿 엔진에서 user 객체를 통해 사용자 정보에 접근하는 것이 가능해짐
    res.locals.userId = req.user?.id
    res.locals.followerCount = req.user?.Followers?.length || 0;
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
    next();
});

// ./profile get 요청이 들어올 시 실행
// 로그인이 되어 있을 시 다음 미들웨어(여기서는 마지막 인수)로 넘어감
router.get('/profile', isLoggedIn, renderProfile);

// 로그인이 되어 있지 않을 시 다음 미들웨어(여기서는 마지막 인수)로 넘어감
router.get('/join', isNotLoggedIn, renderJoin);

router.get('/', renderMain);

router.get('/hashtag', renderHashtag);

module.exports = router;