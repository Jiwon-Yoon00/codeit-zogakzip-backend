import bcrypt, { compare } from 'bcrypt';
import groupRespository from "../respoistories/groupRespository.js"
import e from 'express';

async function hashingPassword(password){
  return bcrypt.hash(password,10);
}

// 그룸 생성
async function createGroup(group) {
  const existName = await groupRespository.findByName(group.name);
  if(existName){
    const error = new Error('Name already exists');
    error.code = 422;
    error.data = {name: group.name};
    throw error;
  }

  const hashedPassword = await hashingPassword(group.password)
  const createdGroup =  await groupRespository.save({...group, password: hashedPassword});


  const updatedGroup  = await groupRespository.findById(createdGroup.id);


  return filterSensitiveGroupData(updatedGroup );
}

async function filterSensitiveGroupData(group) {
  if(Array.isArray(group)){
    console.log("array")
    return group.map(({password, ...rest})=> rest);
  }
  const {password, ...rest} = group;
  return rest;
}

// 비밀번호 확인하기 
async function verifyPassword(inputPassword, savedPassword){
  const isValid = await bcrypt.compare(inputPassword, savedPassword);
  return isValid;
}

// 그룹 목록 조회하기
async function getAllGroups({ page = 1, pageSize = 10, sortBy = 'latest', keyword = "", isPublic }) {
  const data = await groupRespository.getAll({ page, pageSize, sortBy, keyword, isPublic });
  return filterSensitiveGroupData(data);
}

// 그룹 수정하기
async function updateGroup(password, groupData) {
  const existingGroup = await groupRespository.findPasswordById(groupData.id);
  
  if(!existingGroup){
    throw new Error("존재하지 않습니다");
  }
  const isValid = await verifyPassword(password, existingGroup.password);
  
  if(!isValid){
    throw new Error("비밀번호가 틀렸습니다");
  }

  await groupRespository.update(groupData);
  const updatedGroup = await groupRespository.findById(groupData.id);
  return filterSensitiveGroupData(updatedGroup);
}

// 그룹 삭제하기
async function deleteGroup(groupId, password) {
  const existingGroup = await groupRespository.findPasswordById(groupId);

  if(!existingGroup){
    throw new Error("존재하지 않습니다");
  }

  const isValid = await verifyPassword(password, existingGroup.password);

  if(!isValid){
    throw new Error("비밀번호가 틀렸습니다");
  }

  await groupRespository.deleteGroup(groupId);
  return { message: "그룹이 삭제되었습니다." };
}

// 그룹 상세 정보 조회
async function getGroup(groupId, password) {
  const existingGroup = await groupRespository.findById(groupId);

  if(!existingGroup){
    throw new Error("존재하지 않습니다");
  }

  if(!existingGroup.isPublic){
    const isValid = await verifyPassword(password, existingGroup.password);
    
    if (!isValid) {
      throw new Error("비밀번호가 틀렸습니다");
    }
  }
  // post 상세 조회 추가하기
  
  const filteredGroup = await filterSensitiveGroupData(existingGroup);
  filteredGroup.badges = await transformBadgeNames(existingGroup.badges);
  console.log(filteredGroup.badges)
  return filteredGroup;
}

async function verifyGroupAccess(groupId, password) {
  const existingGroup = await groupRespository.findById(groupId);

  if(!existingGroup){
    throw new Error("존재하지 않습니다");
  }

  if(!existingGroup.isPublic){
    const isValid = await verifyPassword(password, existingGroup.password);

    if(!isValid){
      throw new Error("비밀번호가 틀렸습니다");
    }
  }

  return {message: "비밀번호가 확인되었습니다."};
}


async function transformBadgeNames(badges){
  return badges.map((b) => b.badge.name);
}


export default{
  createGroup,
  getAllGroups,
  updateGroup,
  deleteGroup,
  getGroup,
  verifyGroupAccess,
}