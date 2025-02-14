import prisma from '../config/prisma';

async function findByName(name){
  return await prisma.group.findFirst({
    where:{
      name,
    },
  });
}


async function findById(id) {
  return await prisma.group.findUnique({
    where: { id: Number(id) },
    include: {
      badges: {
        select: {
          badge: {
            select: { name: true },
          },
        },
      },
    },
  });
}

// 비밀번호만 조회하는 함수 추가
async function findPasswordById(id) {
  return await prisma.group.findUnique({
    where: { id: Number(id) },
    select: { password: true },
  });
}


async function save(group){
  return await prisma.group.create({
    data:{
      name: group.name,
      imageUrl: group.imageUrl,
      introduction: group.introduction,
      isPublic: group.isPublic,
      password: group.password,
    },
  });
}

async function getAll({ page = 1, pageSize = 10, sortBy = 'latest', keyword = "", isPublic }) {
  const offset = (page-1)*pageSize;
  let orderBy;
  switch (sortBy) {
    case 'latest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'mostPosted':
      orderBy = { postCount: 'desc'};
      break;
    case 'mostLiked':
      orderBy = { likeCount: 'desc'};
      break;
    case 'mostBadge':
      orderBy = { badgeCount: 'desc'};
      break;
  }
  
  const groups =  await prisma.group.findMany({
    where: {
      name: { contains: keyword},
      ...(isPublic !== undefined ? { isPublic } : {})
    },
    orderBy,
    take: parseInt(pageSize),
    skip: offset,
  });

    // 전체 아이템 개수 조회 (페이지네이션을 위해 필요)
    const totalItemCount = await prisma.group.count({
      where: {
        ...(keyword ? { name: { contains: keyword, mode: "insensitive" } } : {}),
        ...(isPublic !== undefined ? { isPublic } : {})
      }
    });

  return {
    currentPage: page,
    totalPages: Math.ceil(totalItemCount/pageSize),
    totalItemCount,
    groups
  }
}

async function update(group) {
  return await prisma.group.update({
    where: {
      id: Number(group.id),
    },
    data: {
      name: group.name,
      imageUrl: group.imageUrl,
      introduction: group.introduction,
      isPublic: group.isPublic,
      password: group.password,
    },
  });
}

export default{
  findByName,
  findById,
  findPasswordById,
  save,
  getAll,
  update,
}