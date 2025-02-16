import badgeRepository from "../respoistories/badgeRepository.js";
import groupRespository from "../respoistories/groupRespository.js";

// ✔️ 이미 가지고 있는 뱃지라면 건너뛰기
// ✔️가지고 있지 않는 뱃지라면 조건에 충족되는 지 알아보기
// ✔️ 전체 기준과 충족 되는 기준 갯수 확인하고 충족된다면 뱃지를 수여한다

async function checkAndAssignBadges(groupId) {
  const group = await groupRespository.findById(groupId);
  if (!group) {
    throw new Error("존재하지 않는 그룹입니다.");
  }

  const ownedBadges = await badgeRepository.getBadgesByGroupId(groupId);
  const ownedBadgeNames = ownedBadges.map(b => b.badge.name); // 이미 보유한 배지 이름 목록

  console.log(ownedBadges);
  
  const badgesToAssign = [];

  // 배지 조건 검사 (보유한 배지가 아니라면 추가)
  if (!ownedBadgeNames.includes("추억 수 20개 이상") && group.memoryCount >= 20) {
    badgesToAssign.push("추억 수 20개 이상");
  }

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  if (!ownedBadgeNames.includes("그룹 생성 후 1년 달성") && new Date(group.createdAt) <= oneYearAgo) {
    badgesToAssign.push("그룹 생성 후 1년 달성");
  }

  if (!ownedBadgeNames.includes("그룹 공감 1만 개 이상") && group.likeCount >= 10000) {
    badgesToAssign.push("그룹 공감 1만 개 이상");
    console.log("그룹 공감 수");
  }

  // 새로운 배지가 있으면 추가
  if (badgesToAssign.length > 0) {
    await badgeRepository.assignBadges(groupId, badgesToAssign);
  }

  console.log(badgesToAssign);
  return badgesToAssign;

}

async function getGroupBadges(groupId) {
  return await badgeRepository.getBadgesByGroupId(groupId);
}

export default {
  checkAndAssignBadges,
  getGroupBadges,
};