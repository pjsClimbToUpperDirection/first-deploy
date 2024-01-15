const User = require('../models/user');
const db = require("../models");

exports.follow = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user) { // req.user.id가 followerId, req.params.id가 followingId
            await user.addFollowing(parseInt(req.params.id, 10));
            res.status(200).send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// models 에 의존하지 않고 Disconnect 구현할것
exports.followDisconnect = async (req, res, next) => {
    try {
        // 특정 팔로워를 팔로잉 취소하고자 하는 사용자(요청을 한 사용자)
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user) { // req.user.id가 followerId, req.params.id가 followingId
            // sequelize가 관계를 파악해 생성한 Follow 모델에 직접 접근하여(441p) 조건을 적용한 destroy 메서드 호출
            await db.sequelize.models.Follow.destroy({
                where: {
                    followerId: req.user.id,
                    followingId: req.params.id
                }
            })
            res.status(200).send('Delete was successful');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};