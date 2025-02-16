import express from "express";
import { uploadImage } from "../controllers/imageController.js"; // .js 확장자 추가

const router = express.Router();

// POST /api/image - 이미지 업로드
router.post("/", uploadImage);

export default router; // ? ESM 방식으로 내보내기