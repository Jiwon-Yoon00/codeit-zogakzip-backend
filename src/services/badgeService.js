import badgeRepository from "../respoistories/badgeRepository.js";


// ✔️ 이미 가지고 있는 뱃지라면 건너뛰기
// ✔️가지고 있지 않는 뱃지라면 조건에 충족되는 지 알아보기
// ✔️ 전체 기준과 충족 되는 기준 갯수 확인하고 충족된다면 뱃지를 수여한다

const badgeService = {
  async processBadgeAssignments() {
    console.log('[BadgeService] Checking badge criteria...');

    // 모든 그룹 & 뱃지 기준 가져오기
    const groups = await badgeRepository.getAllGroups();
    const badgeCriteria = await badgeRepository.getAllBadgeCriteria();

    for (const group of groups) {
      
      let newBadgeAssigned = false; // 새로운 뱃지가 지급되었는지 체크

      for (const criteria of badgeCriteria) {
        const { standardType, standardValue, badgeId } = criteria;

        // 그룹 데이터에서 해당 기준값 가져오기
        let groupValue;
        if (standardType === '그룹 공감 1만 개 이상 받기') groupValue = group.likeCount;
        else if (standardType === '추억 수 20개 이상 등록') groupValue = group.postCount;
        else if (standardType === '그룹 생성 후 1년 달성') {
          const createdAt = new Date(group.createdAt);
          const currentDate = new Date();
          const daysSinceCreation = Math.floor((currentDate - createdAt) / (1000 * 60 * 60 * 24)); // 일 단위 변환
          groupValue = daysSinceCreation;
        }
        else continue;

        // 기준을 충족하는 경우 뱃지 지급
        if (groupValue >= standardValue) {
          const existingBadge = await badgeRepository.getGroupBadge(group.id, badgeId);
          if (!existingBadge) {
            await badgeRepository.assignBadgeToGroup(group.id, badgeId);
            newBadgeAssigned = true;
            console.log(`[BadgeService] Badge "${criteria.badge.name}" assigned to group "${group.name}"`);
          }
        }
      }

       // 새로운 뱃지가 지급되었다면 그룹의 badgeCount 업데이트
      if (newBadgeAssigned) {
        await badgeRepository.incrementGroupBadgeCount(group.id);
        console.log(`[BadgeService] Updated badge count for group "${group.name}".`);
      }
    }
    console.log('[BadgeService] Badge assignment completed.');
  }
};

export default badgeService;
