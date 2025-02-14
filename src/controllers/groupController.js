import express from 'express'
import groupService from '../services/groupService.js'

const groupController = express.Router();

// 그룹 등록하기
groupController.post('/api/groups', async(req, res,next)=> {
  try{
    const group = await groupService.createGroup(req.body);
    return res.status(201).json(group);
  }catch(error){
    next(error);
  }
});


// 그룹 목록 조회
groupController.get('/api/groups', async(req, res, next) => {
  try{
  const { page = 1, pageSize = 10 , sortBy = 'latest', keyword= "", isPublic} = req.query;
  const groupData = await groupService.getAllGroups({
    page: parseInt(page),
    pageSize: parseInt(pageSize),
    sortBy: sortBy,
    keyword: keyword,
    isPublic: isPublic,
  });
  return res.status(200).json(groupData);
  }
  catch(error){
    next(error);
  }
})

// 그룹 수정하기
groupController.put('/api/groups/:groupId', async(req, res , next) => {
  try {
    const { groupId } = req.params;
    const { password, ...groupData } = req.body;

    // 요청 양식 오류 (password가 없거나 데이터가 부족한 경우)
    if (!password || !groupData.name || !groupData.imageUrl || !groupData.introduction || groupData.isPublic === undefined) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }
    
    const group = await groupService.updateGroup(password, { id: groupId, ...groupData });
    
    return res.status(200).json(group);
  } catch (error) {
    if (error.message === "존재하지 않습니다") {
      return res.status(404).json({ message: "존재하지 않습니다" });
    }
    if(error.message === "비밀번호가 틀렸습니다"){
      return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
    }
    next(error); // Express 에러 핸들러로 전달
  }
})

// 그룹 삭제하기
groupController.delete('/api/groups/:groupId', async(req, res , next) => {
  try {
    const { groupId } = req.params;
    const { password } = req.body;

    // 요청 양식 오류 (password가 없거나 데이터가 부족한 경우)
    if (!password) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }
  
    const response = await groupService.deleteGroup(groupId, password);
    return res.status(200).json(response);
  } catch (error) {
    if (error.message === "존재하지 않습니다") {
      return res.status(404).json({ message: "존재하지 않습니다" });
    }
    if(error.message === "비밀번호가 틀렸습니다"){
      return res.status(403).json({ message: "비밀번호가 틀렸습니다" });
    }
    next(error); // Express 에러 핸들러로 전달
  }
})


export default groupController;