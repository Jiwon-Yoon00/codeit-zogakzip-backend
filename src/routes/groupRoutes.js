import express from "express";
import { createGroup, getAllGroup, updateGroup, 
  deleteGroup, getDetailGroup, likeGroup, verifyGroupAccess, isGroupPublic } from "../controllers/groupController.js";

const router = express.Router();


router.post("", createGroup);


router.get("", getAllGroup);


router.put("/:groupId", updateGroup);


router.delete("/:groupId", deleteGroup);


router.get("/:groupId", getDetailGroup);


router.post("/:groupId/verify-password",verifyGroupAccess);


// 📌 그룹 공감하기 (좋아요 증가)
router.post("/:groupId/like", likeGroup);

// 📌 그룹 공개 여부 확인 API (올바른 경로 적용)
router.get("/:groupId/is-public", isGroupPublic);


export default router; // ✅ ESM 방식으로 export
