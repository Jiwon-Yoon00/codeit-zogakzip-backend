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
  } from "../controllers/postController.js"; // ? Ȯ���� .js �߰�

const router = express.Router();

// POST /api/groups/:groupId/posts - �Խñ� ���
router.post("/:groupId/posts", createPost);

// GET /api/groups/:groupId/posts - �Խñ� ��� ��ȸ
router.get("/:groupId/posts", getPosts);

// PUT /api/posts/:postId - �Խñ� ����
router.put("/:postId", updatePost);

// DELETE /api/posts/:postId - �Խñ� ����
router.delete("/:postId", deletePost);

// GET /api/posts/:postId - �Խñ� �� ���� ��ȸ
router.get("/:postId", getPostDetails);

// POST /api/posts/:postId/verify-password - �Խñ� ��й�ȣ Ȯ��
router.post("/:postId/verify-password", verifyPostPassword);

// POST /api/posts/:postId/like - �Խñ� �����ϱ�
router.post("/:postId/like", likePost);

// GET /api/posts/:postId/is-public - �Խñ� ���� ���� Ȯ��
router.get("/:postId/is-public", getPostPublicStatus);

export default router; // ? ESM ������� ��������