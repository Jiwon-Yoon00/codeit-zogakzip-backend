import bcrypt from 'bcrypt';
import groupRespository from "../respoistories/groupRespository.js"

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


export default{
  createGroup,
  getAllGroups,
  updateGroup,
  deleteGroup,
}