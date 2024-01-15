const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('node:path');
const session = require('express-session');
const nunjucks = require("nunjucks");
const dotenv = require('dotenv');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');

const redis = require('redis');
const RedisStore = require('connect-redis').default; // (session) 대신 .default 사용


dotenv.config();
// 'redis' 라이브러리를 사용한 본 모듈은 실 사용시 작동 여부 별도로 확인할 것
const redisClient = redis.createClient({
    //url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    host: `${process.env.REDIS_HOST}`,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    legacyMode: true,
});
redisClient.connect().catch(console.error);
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const { sequelize } = require('./models');
const passportConfig = require('./passport');
const logger = require('./logger');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

// 본 모델을 DB에 동기화(sync)하여 테이블을 생성
// Sync this Model to the DB, that is create the table.
sequelize.sync({ force: false })
    .then(() => {
        console.log('connection was successful');
    })
    .catch((err) => {
        console.error(err);
    });

if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(
        helmet({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
            crossOriginResourcePolicy: false,
        }),
    );
    app.use(hpp());
} else {
    app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET))
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    store: new RedisStore({ client: redisClient }),
};

if (process.env.NODE_ENV === 'production') {
    sessionOption.proxy = true;
    // sessionOption.cookie.secure = true;
}
app.use(session(sessionOption))
app.use(passport.initialize());
app.use(passport.session());


app.use('/', pageRouter);
app.use('/auth', authRouter); // /auth/...
app.use('/post', postRouter);
app.use('/user', userRouter);


// 위 미들웨어에서 정적 요소를 리턴하지 않을 시 본 미들웨어가 404 반환 후 에러 처리 미들웨어로 역할을 넘김
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} Router does not exist`);
    error.status = 404
    logger.info('hello');
    logger.error(error.message);
    next(error);
});

app.use((err, req, res, next) => {
    console.error(err);
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error')
});

module.exports = app;

