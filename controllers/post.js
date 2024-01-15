const { Post, Hashtag } = require('../models');
const db = require("../models")
const User = require("../models/user");

exports.afterUploadImage = (req, res) => {
    console.log(req.file);
    res.json({ url: `img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        // 게시긓 내용에서 해시태그를 정규표현식 (/#[^\s#]*/g) 으로 추출
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if (hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    // findOrCreate 메서드를 이용하여 DB에 해시태그가 존재하지 않을 시 생성 후 가져옴
                    return Hashtag.findOrCreate({
                        // 해시태그의 가장 앞에 있는 #을 떼어내고 소문자로 변환
                        where: { title: tag.slice(1).toLowerCase() },
                    })
                }),
            );
            // 반환값이 [모델, 생성 여부] 이므로 아래 식을 통해 모델만 추출, 해시태그 모델들을 아래 메서드로 게시글과 연결
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.pushLikeBtn = async (req, res, next) => {
    try {
        const Good = db.sequelize.models.good;
        // '좋아요' 버튼을 누른 사용자
        const user = await User.findOne({
            where: { id: req.user.id }
        });
        if (user) {
            await Good.create({
                UserId: req.user.id,
                // 댓글의 id
                PostId: req.params.id
            })
            res.locals.userSlikelist = (await Good.findAll({
                where: {UserId: req.user.id}
            })).map(f => f.PostId)
            console.log(res.locals.userSlikelist)
        }
        res.status(200).send('Like it');
    } catch (err) {
        console.error(err);
        next(err)
    }
}

exports.pushUnLikeBtn = async (req, res, next) => {
    try {
        const Good = db.sequelize.models.good;
        // '좋아요' 를 철회하려는 사용자
        // 세션 내에서 로그인한 사용자 정보는 req.user에 저장(446p)
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user) {
            await Good.destroy({
                where: {
                    UserId: req.user.id,
                    // 댓글의 id
                    PostId: req.params.id
                }
            })
            res.locals.userSlikelist = (await Good.findAll({
                where: {UserId: req.user.id}
            })).map(f => f.PostId)
            console.log(res.locals.userSlikelist)
        }
        res.status(200).send('not Like it');
    } catch (err) {
        console.error(err);
        next(err)
    }
}