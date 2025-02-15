import prisma from "../config/prisma.js"; // ✅ Prisma 클라이언트 가져오기

// 📌 그룹 공감하기 (좋아요 증가)
export const likeGroup = async (req, res) => {
    try {
        const { groupId } = req.params; // URL에서 groupId 가져오기
        const numericGroupId = Number(groupId); // ✅ 문자열을 숫자로 변환

        // ✅ groupId가 유효한 숫자인지 확인
        if (isNaN(numericGroupId)) {
            return res.status(400).json({ message: "잘못된 groupId 값입니다." });
        }

        // ✅ 해당 그룹 찾기
        const group = await prisma.group.findUnique({
            where: { id: numericGroupId }
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않는 그룹입니다." });
        }

        // ✅ 공감(좋아요) 수 증가
        const updatedGroup = await prisma.group.update({
            where: { id: numericGroupId },
            data: { likeCount: { increment: 1 } }
        });

        res.status(200).json({ message: "그룹 공감하기 성공", likeCount: updatedGroup.likeCount });
    } catch (error) {
        console.error("❌ 서버 오류 발생:", error);
        res.status(500).json({ message: "서버 오류 발생", error: error.message });
    }
};


// 📌 그룹 공개 여부 확인 API
export const isGroupPublic = async (req, res) => {
    try {
        const { groupId } = req.params; // URL에서 groupId 가져오기

        // 해당 그룹 찾기
        const group = await prisma.group.findUnique({
            where: { id: Number(groupId) },
            select: { id: true, isPublic: true }
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않는 그룹입니다." });
        }

        // 📌 API 명세에 맞게 응답 데이터 형식 수정
        res.status(200).json(group);
    } catch (error) {
        console.error("❌ 서버 오류 발생:", error);
        res.status(500).json({ message: "서버 오류 발생", error: error.message });
    }
};
