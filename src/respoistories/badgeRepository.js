import prisma from '../config/prisma';

// ✔️ 이미 가지고 있는 뱃지라면 건너뛰기
// ✔️가지고 있지 않는 뱃지라면 조건에 충족되는 지 알아보기
// ✔️ 전체 기준과 충족 되는 기준 갯수 확인하고 충족된다면 뱃지를 수여한다

async function assignBadges(groupId, badges) {
  let assignedBadgeCount = 0; // 지급된 배지 개수 카운트

  for (const badgeName of badges) {
    const badge = await prisma.badge.findFirst({
      where: { name: badgeName },
    });

    if (!badge) {
      continue;
    }

    // 배지가 이미 할당되어 있는지 확인
    const existingBadge = await prisma.groupBadge.findFirst({
      where: { groupId: Number(groupId), badgeId: badge.id },
    });

    if (!existingBadge) {
      await prisma.groupBadge.create({
        data: {
          groupId: Number(groupId),
          badgeId: badge.id,
        },
      });
      assignedBadgeCount++;
    }
  }

  // 지급된 배지가 있으면 badgeCount 업데이트
  if (assignedBadgeCount > 0) {
    await prisma.group.update({
      where: { id: Number(groupId) },
      data: {
        badgeCount: {
          increment: assignedBadgeCount, // 배지 개수 증가
        },
      },
    });
  }
}

async function getBadgesByGroupId(groupId) {
  return await prisma.groupBadge.findMany({
    where: { groupId: Number(groupId) },
    include: {
      badge: {
        select: { name: true },
      },
    },
  });
}

export default {
  assignBadges,
  getBadgesByGroupId,
};
