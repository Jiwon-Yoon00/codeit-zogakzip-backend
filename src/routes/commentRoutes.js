const express = require('express');
const router = express.Router();
const { addComment, getComments } = require('../controllers/commentController');

// 📌 1. 댓글 등록
router.post('/', addComment);

// 📌 4. 댓글 목록 조회 (페이지네이션)
router.get('/', getComments);

module.exports = router;
