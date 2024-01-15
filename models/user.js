const Sequelize = require('sequelize')

// represents a table in the database
// Instances of this class represent a database row.
class User extends Sequelize.Model {
    // sequelize 인스턴스를 인자에 대입하여 초기화
    static initiate(sequelize) {
        // Initialize a model, representing a table in the DB, with attributes and options.
        User.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.ENUM('local', 'kakao'),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize, // 새 모델에 첨부할 sequelize 인스턴스 정의. 미 제공시 Error
            timestamps: true, // Adds createdAt and updatedAt timestamps to the model.
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true, // Calling destroy will not delete the model, but instead set a deletedAt timestamp if this is true. Needs timestamps=true to work
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.User.hasMany(db.Post); // oneToMany
        // Follower로서 외래 키를 통해 following 하는 대상의 id 정의
        db.User.belongsToMany(db.User, {
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow',
        });
        // Following로서 외래 키를 통해 나를 following 하는 Follower의 id 정의
        db.User.belongsToMany(db.User, {
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        });
        // junction model named good is created
        db.User.belongsToMany(db.Post, {
            through: 'good',
            as: 'oneUser'
        })
    }
}

module.exports = User;