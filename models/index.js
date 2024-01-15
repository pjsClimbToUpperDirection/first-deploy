const Sequelize = require('sequelize');
const fs = require("node:fs");
const env = process.env.NODE_ENV || 'development' // dotenv를 사용하여 .env 파일에서 환경변수 로드
const config = require('../config/config')[env];
const path = require('node:path')

const db = {};
// This is the main class, the entry point to sequelize.
const sequelize = new Sequelize(
    // Instantiate sequelize with name of database, username and password(last prop is options: object)
    config.database, config.username, config.password, config,
)

db.sequelize = sequelize;

const basename = path.basename(__filename); //  returns the last portion of a path
fs
    // Reads the contents of the directory. -> 현재 폴더의 모든 파일을 조회
    .readdirSync(__dirname)
    // 조건에 해당하는 파일만 추림
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js') && !file.includes('test');
    }).forEach(file => {
        const model = require(path.join(__dirname, file)); // 절대 경로로 호출
        // db 배열에 모델의 이름을 인덱스로 하는 객체 할당
        db[model.name] = model;
        // 초기화 메서드로 모델의 인스턴스 생성
        model.initiate(sequelize);
});

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        console.log(db.sequelize.models)
        // 해당하는 이름을 갖는 모델의 associate 정적 메서드 호출
        db[modelName].associate(db); // 타 모델들과의 관계 정의
    }
});

//console.log(db)
module.exports = db