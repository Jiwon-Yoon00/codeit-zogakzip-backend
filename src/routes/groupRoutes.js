const express = require('express');
const router = express.Router();
const { likeGroup } = require('../controllers/groupController');

// 📌 그룹 공감하기 (좋아요 증가)
router.post('/:groupId/like', likeGroup);

module.exports = router;
