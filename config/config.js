require('dotenv').config(); // 환경 변수

module.exports = {
    development: {
        username: process.env.SEQUELIZE_USERID,
        password: process.env.SEQUELIZE_PASSWORD,
        database: 'nodebird',
        host: '127.0.0.1',
        dialect: 'mysql',
    },
    test: {
        username: process.env.SEQUELIZE_USERID,
        password: process.env.SEQUELIZE_PASSWORD,
        database: 'nodebird_test',
        host: '127.0.0.1',
        dialect: 'mysql',
    },
    production: {
        username: process.env.SEQUELIZE_USERID,
        password: process.env.SEQUELIZE_PASSWORD,
        database: 'nodebird',
        host: '127.0.0.1',
        dialect: 'mysql',
        logging: false,
    }
}