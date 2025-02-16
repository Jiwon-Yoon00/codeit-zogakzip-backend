import prisma from '../config/prisma.js';



// 모든 그룹 조회
async function getAllGroups() {
  return await prisma.group.findMany();
}

// 모든 뱃지 기준 조회
async function getAllBadgeCriteria() {
  return await prisma.badgeCriteria.findMany({
    include: { badge: true },
  });
}

// 특정 그룹이 특정 뱃지를 보유하고 있는지 확인
async function getGroupBadge(groupId, badgeId) {
  return await prisma.groupBadge.findFirst({
    where: { groupId, badgeId },
  });
}

// 그룹에게 뱃지 지급
async function assignBadgeToGroup(groupId, badgeId) {
  console.log("뱃지 지급")
  return await prisma.groupBadge.create({
    data: { groupId, badgeId },
  });
}

// 그룹의 badgeCount를 1 증가시키기
async function incrementGroupBadgeCount(groupId) {
  console.log("뱃지 갯수 증가")
  return await prisma.group.update({
    where: { id: groupId },
    data: {
      badgeCount: { increment: 1 }, // 기존 값에서 +1 증가
    },
  });
}

export default{
  getAllGroups,
  getAllBadgeCriteria,
  getGroupBadge,
  assignBadgeToGroup,
  incrementGroupBadgeCount,
}
