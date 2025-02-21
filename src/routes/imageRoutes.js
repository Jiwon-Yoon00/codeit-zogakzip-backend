import express from "express";
import { uploadImageController } from "../controllers/imageController.js"; 
const router = express.Router();

// POST /api/image - 이미지 업로드
router.post("/", uploadImageController);

export default router; //
