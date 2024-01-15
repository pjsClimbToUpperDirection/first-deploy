const express = require('express');

const { isLoggedIn } = require('../middlewares');
const { follow } = require('../controllers/user')
const { followDisconnect } = require('../controllers/user')

const router = express.Router();

// POST /user/:id/follow
// id 파라미터가 req.params.id 값으로 지정됨
router.post('/:id/follow', isLoggedIn, follow);

router.post('/:id/followDisconnect', isLoggedIn, followDisconnect);

module.exports = router;