const Group = require('../models/Group'); // Group 모델 가져오기

// 📌 그룹 공감하기 (좋아요 증가)
const likeGroup = async (req, res) => {
    try {
        const { groupId } = req.params; // URL에서 groupId 가져오기

        // 해당 그룹 찾기
        const group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({ message: "존재하지 않습니다" });
        }

        // 공감(좋아요) 수 증가
        group.likeCount += 1;
        await group.save();

        res.status(200).json({ message: "그룹 공감하기 성공", likeCount: group.likeCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류 발생", error });
    }
};

module.exports = { likeGroup };
