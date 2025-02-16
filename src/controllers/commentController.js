import prisma from "../config/prisma.js"; // ✅ Prisma 클라이언트 가져오기

// 📌 댓글 등록
export const addComment = async (req, res) => {
    try {

        const { nickname, content, password } = req.body;
        const { postId } = req.params;  // ✅ `postId`를 `req.params`에서 가져오기

        // 요청 필드 검증
        if (!nickname || !content || !password || !postId) {
            console.error("❌ [ERROR] 요청 데이터가 누락됨! 받은 데이터:", req.body);
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        // 새로운 댓글 생성
        const newComment = await prisma.comment.create({
            data: { 
                postId: Number(postId), 
                nickname, 
                content, 
                password 
            }
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error("❌ [ERROR] 댓글 등록 오류:", error);
        res.status(500).json({ message: "서버 오류 발생", error: error.message });
    }
};


// 📌 댓글 목록 조회 (페이지네이션)
export const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const { page = 1, pageSize = 10 } = req.query;
        const skip = (page - 1) * pageSize;
        const take = parseInt(pageSize);

        // 댓글 조회
        const comments = await prisma.comment.findMany({
            where: { postId: Number(postId) },
            skip,
            take,
            orderBy: { createdAt: "desc" }
        });

        // 전체 댓글 개수 조회
        const totalItemCount = await prisma.comment.count({
            where: { postId: Number(postId) }
        });

        // 전체 페이지 수 계산
        const totalPages = Math.ceil(totalItemCount / pageSize);

        res.status(200).json({
            currentPage: parseInt(page),
            totalPages,
            totalItemCount,
            data: comments
        });
    } catch (error) {
        console.error("❌ 댓글 목록 조회 오류:", error);
        res.status(500).json({ message: "서버 오류 발생", error: error.message });
    }
};

// 📌 댓글 수정
export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content, password } = req.body;

        // 요청 필드 검증
        if (!content || !password) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        // 댓글 찾기
        const comment = await prisma.comment.findUnique({
            where: { id: Number(commentId) }
        });

        if (!comment) {
            return res.status(404).json({ message: "존재하지 않는 댓글입니다" });
        }

        // 비밀번호 확인
        if (comment.password !== password) {
            return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

        // 댓글 업데이트
        const updatedComment = await prisma.comment.update({
            where: { id: Number(commentId) },
            data: { content }
        });

        res.status(200).json(updatedComment);
    } catch (error) {
        console.error("❌ 댓글 수정 오류:", error);
        res.status(500).json({ message: "서버 오류 발생", error: error.message });
    }
};

// 📌 댓글 삭제
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { password } = req.body;

        // 비밀번호 검증
        if (!password) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        // 댓글 찾기
        const comment = await prisma.comment.findUnique({
            where: { id: Number(commentId) }
        });

        if (!comment) {
            return res.status(404).json({ message: "존재하지 않는 댓글입니다" });
        }

        // 비밀번호 확인
        if (comment.password !== password) {
            return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

        // 댓글 삭제
        await prisma.comment.delete({
            where: { id: Number(commentId) }
        });

        res.status(200).json({ message: "댓글이 삭제되었습니다" });
    } catch (error) {
        console.error("❌ 댓글 삭제 오류:", error);
        res.status(500).json({ message: "서버 오류 발생", error: error.message });
    }
};
