const express = require('express');
const router = express.Router();
const { likeGroup, isGroupPublic } = require('../controllers/groupController');

// 📌 그룹 공감하기 (좋아요 증가)
router.post('/:groupId/like', likeGroup);

// 📌 그룹 공개 여부 확인 API (올바른 경로 적용)
router.get('/:groupId/is-public', isGroupPublic);

module.exports = router;
