import express from "express";
import { addComment, getComments, updateComment, deleteComment } from "../controllers/commentController.js";

const router = express.Router();

// 📌 1. 댓글 등록
router.post("/:postId/comments", addComment);

// 📌 4. 댓글 목록 조회 (페이지네이션)
router.get("/:postId/comments", getComments);

// 📌 3. 댓글 수정 & 삭제는 `/api/comments/:commentId` 경로로 따로 분리해야 함!
export const commentEditRouter = express.Router();
commentEditRouter.put("/:commentId", updateComment);
commentEditRouter.delete("/:commentId", deleteComment);


export default router; // ✅ ESM 방식으로 export
