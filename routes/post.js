const express = require('express');
const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');

const { afterUploadImage, uploadPost, pushLikeBtn, pushUnLikeBtn } = require('../controllers/post');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();


try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('make uploads Folder!')
}

const upload = multer({
    // 파일을 디스크에 저장하기 위한 설정
    dest: multer.diskStorage({
        // 업로드 한 파일을 저장할 폴더 설정
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        // 폴더 내에 저장되는 파일명 결정
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize : 5 * 1024 * 1024 },
});

// POST /post/img
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

// POST /post
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost);

// POST /post/:id/like
router.post('/:id/like', isLoggedIn, pushLikeBtn)

// POST /post/:id/unlike
router.post('/:id/unlike', isLoggedIn, pushUnLikeBtn)

module.exports = router;