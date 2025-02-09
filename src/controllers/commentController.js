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

// 📌 댓글 목록 조회
const getComments = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query; // 페이지 번호와 페이지 크기 (쿼리 파라미터에서 가져오기)
        const offset = (page - 1) * pageSize; // 시작 인덱스 계산
        const limit = parseInt(pageSize); // 페이지 크기 설정

        // 페이지네이션을 위한 댓글 조회
        const comments = await Comment.findAll({
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']], // 최신 댓글부터 조회
        });

        // 전체 댓글 수 조회
        const totalItemCount = await Comment.count();

        // 전체 페이지 수 계산
        const totalPages = Math.ceil(totalItemCount / pageSize);

        // 응답 데이터 반환
        res.status(200).json({
            currentPage: parseInt(page),
            totalPages: totalPages,
            totalItemCount: totalItemCount,
            data: comments.map(comment => ({
                id: comment.id,
                nickname: comment.nickname,
                content: comment.content,
                createdAt: comment.createdAt
            }))
        });
    } catch (error) {
        console.error("❌ 댓글 목록 조회 오류:", error);
        res.status(500).json({ message: "서버 오류 발생", error: error.message });
    }
};


// 📌 댓글 수정
const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params; // URL에서 commentId 가져오기
        const { nickname, content, password } = req.body; // 요청 본문에서 nickname, content, password 가져오기

        // 요청 필드가 모두 존재하는지 확인
        if (!nickname || !content || !password) {
            return res.status(400).json({ message: "잘못된 요청입니다" });
        }

        // 댓글 찾기
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        // 비밀번호 확인
        if (comment.password !== password) {
            return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
        }

        // 댓글 내용 수정
        comment.nickname = nickname;
        comment.content = content;
        await comment.save();

        // 수정된 댓글 반환
        res.status(200).json({
            id: comment.id,
            nickname: comment.nickname,
            content: comment.content,
            createdAt: comment.createdAt
        });
    } catch (error) {
        console.error("❌ 댓글 수정 오류:", error);
        res.status(500).json({ message: "서버 오류 발생", error: error.message });
    }
};


// ✅ 함수 내보내기
module.exports = { addComment, getComments, updateComment };
