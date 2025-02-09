const Group = require('../models/Group'); // ✅ Group 모델 가져오기

// 📌 그룹 공감하기 (좋아요 증가)
const likeGroup = async (req, res) => {
    try {
        const { groupId } = req.params; // URL에서 groupId 가져오기

        // 해당 그룹 찾기
        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({ message: "존재하지 않는 그룹입니다" });
        }

        // 공감(좋아요) 수 증가
        group.likeCount += 1;
        await group.save();

        res.status(200).json({ message: "그룹 공감하기 성공", likeCount: group.likeCount });
    } catch (error) {
        console.error("❌ 서버 오류 발생:", error);
        res.status(500).json({ message: "서버 오류 발생", error: error.message });
    }
};

// 📌 그룹 공개 여부 확인 API
const isGroupPublic = async (req, res) => {
    try {
        const { groupId } = req.params; // URL에서 groupId 가져오기

        // 해당 그룹 찾기
        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({ message: "존재하지 않는 그룹입니다" });
        }

        // 📌 API 명세에 맞게 응답 데이터 형식 수정
        res.status(200).json({ 
            id: group.id,
            isPublic: group.isPublic 
        });
    } catch (error) {
        console.error("❌ 서버 오류 발생:", error);
        res.status(500).json({ message: "서버 오류 발생", error: error.message });
    }
};

// 두 개의 API 함수 내보내기
module.exports = { likeGroup, isGroupPublic };
