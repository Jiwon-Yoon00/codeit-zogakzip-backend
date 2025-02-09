const Comment = require('../models/Comment'); // Comment 모델 가져오기

// 📌 댓글 등록
const addComment = async (req, res) => {
    try {
        const { groupId, nickname, content, password } = req.body;  // 요청 본문에서 값 가져오기

        // 요청 필드가 모두 존재하는지 확인
        if (!nickname || !content || !password || !groupId) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        // 새로운 댓글 생성
        const newComment = await Comment.create({
            groupId,        // 그룹 ID
            nickname,       // 사용자 닉네임
            content,        // 댓글 내용
            password       // 댓글 비밀번호
        });

        // 성공적인 댓글 등록 후 응답 반환
        res.status(200).json({
            id: newComment.id,
            nickname: newComment.nickname,
            content: newComment.content,
            createdAt: newComment.createdAt
        });
    } catch (error) {
        console.error("❌ 댓글 등록 오류:", error);
        res.status(500).json({ message: "서버 오류 발생", error: error.message });
    }
};

// ✅ 함수 내보내기
module.exports = { addComment };
