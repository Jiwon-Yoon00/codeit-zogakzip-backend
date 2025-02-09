const express = require('express');
const router = express.Router();
const { addComment, getComments, updateComment, deleteComment} = require('../controllers/commentController');

// 📌 1. 댓글 등록
router.post('/', addComment);

// 📌 4. 댓글 목록 조회 (페이지네이션)
router.get('/', getComments);

// 📌 댓글 수정 라우트 추가
router.put('/:commentId', updateComment);  // PUT 요청을 통해 댓글 수정

// 📌 댓글 삭제
router.delete('/:commentId', deleteComment); // DELETE 요청을 통해 댓글 삭제


module.exports = router;
