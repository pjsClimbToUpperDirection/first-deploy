const { User, Post, Hashtag } = require('../models');
const db = require('../models')

exports.renderProfile = (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird' })
};

exports.renderJoin = (req, res) => {
    res.render('join', { title: '회원 가입 - NodeBird' });
};

exports.renderMain = async (req, res, next) => {
    try {
        const Good = db.sequelize.models.good;
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'DESC']],
        });
        if(req.user) {
            let likes = (await Good.findAll({where: { UserId: req.user?.id }})).map(f => f.PostId) || []; // 사용자가 '좋아요' 를 누른 댓글들의 PostId
            res.render('main', {
                title: 'NodeBird',
                twits: posts,
                likes: likes,
            });
        }
        else {
            res.render('main', {
                title: 'NodeBird',
                twits: posts,
                likes: [],
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
};

exports.renderHashtag = async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        // 쿼리를 사용해서 해당하는 해시태그 모델 조회
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({ include: [{ model: User }] });
        }

        return res.render('main', {
            title: `${query} | NodeBird`,
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};