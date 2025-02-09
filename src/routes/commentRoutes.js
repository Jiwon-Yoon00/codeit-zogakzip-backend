const express = require('express');
const router = express.Router();
const { addComment } = require('../controllers/commentController');  // 댓글 등록 함수 불러오기

// 📌 1. 댓글 등록
router.post('/', addComment);

module.exports = router;
