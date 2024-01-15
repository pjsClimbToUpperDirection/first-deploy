const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
    static initiate(sequelize) {
        Post.init({
            content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Post.belongsTo(db.User); // Many To One
        // Since a string was given in the through option of the belongsToMany call,
        // Sequelize will automatically create the "PostHashtag" model which will act as the junction model.(접합 모델로서 기능)
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' })

        // junction model named good is created
        db.Post.belongsToMany(db.User, {
            through: 'good',
            as: 'like'
        })
    }
}

module.exports = Post