import express from "express";
import { uploadImage } from "../controllers/imageController.js"; // .js Ȯ���� �߰�

const router = express.Router();

// POST /api/image - �̹��� ���ε�
router.post("/", uploadImage);

export default router; // ? ESM ������� ��������