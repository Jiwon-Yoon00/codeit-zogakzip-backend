import express from "express";
import {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    verifyPostPassword,
    likePost,
    getPostDetails,
    getPostPublicStatus,
  } from "../controllers/postController.js"; // ? 확장자 .js 추가

const router = express.Router();

// POST /api/groups/:groupId/posts - 게시글 등록
router.post("/:groupId/posts", createPost);

// GET /api/groups/:groupId/posts - 게시글 목록 조회
router.get("/:groupId/posts", getPosts);

// PUT /api/posts/:postId - 게시글 수정
router.put("/:postId", updatePost);

// DELETE /api/posts/:postId - 게시글 삭제
router.delete("/:postId", deletePost);

// GET /api/posts/:postId - 게시글 상세 정보 조회
router.get("/:postId", getPostDetails);

// POST /api/posts/:postId/verify-password - 게시글 비밀번호 확인
router.post("/:postId/verify-password", verifyPostPassword);

// POST /api/posts/:postId/like - 게시글 공감하기
router.post("/:postId/like", likePost);

// GET /api/posts/:postId/is-public - 게시글 공개 여부 확인
router.get("/:postId/is-public", getPostPublicStatus);

export default router; // ? ESM 방식으로 내보내기