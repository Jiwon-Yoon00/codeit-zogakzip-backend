
import prisma from "../config/prisma.js"; // ✅ Prisma 클라이언트 가져오기
import express from 'express'
import groupService from '../services/groupService.js'

const groupController = express.Router();

// 그룹 등록하기
export const createGroup = async(req, res, next)=> {
  try{
    const group = await groupService.createGroup(req.body);
    return res.status(201).json(group);
  }catch(error){

    if(error.message === '이미 존재하는 이름입니다'){
      return res.status(403).json({ message: '이미 존재하는 이름입니다' });
    }

    next(error);
  }
};


// 그룹 목록 조회
export const getAllGroup = async(req, res, next) => {
  try{
  const { page = 1, pageSize = 10 , sortBy , keyword , isPublic} = req.query;
  const groupData = await groupService.getAllGroups({
    page: parseInt(page),
    pageSize: parseInt(pageSize),
    sortBy: sortBy,
    keyword: keyword,
    isPublic: isPublic,
  });

  console.log(sortBy);
  return res.status(200).json(groupData);
  }
  catch(error){
    next(error);
  }
};

// 그룹 수정하기
export const updateGroup = async(req, res , next) => {
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
};

// 그룹 삭제하기
export const deleteGroup = async(req, res , next) => {
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
};

// 그룹 상세 정보 조회하기
export const getDetailGroup = async(req, res, next) => {
  try {
    const { groupId } = req.params;

    const detailGroupData = await groupService.getGroup(groupId);

    return res.status(200).json(detailGroupData);
  } catch (error) {
    
    if (error.message === "잘못된 요청입니다") {
      return res.status(401).json({ message: "잘못된 요청입니다" });
    }

    if (error.message === "존재하지 않습니다") {
      return res.status(404).json({ message: "존재하지 않습니다" });
    }
    next(error)
  }
};

// 📌 그룹 조회 권한 확인
export const verifyGroupAccess = async (req,res, next) => {
  try {
    const { groupId } = req.params;
    const { password } = req.body;

    const response  = await groupService.verifyGroupAccess(groupId,password);

    return res.status(200).json(response);
  } catch (error) {
    
    if (error.message === "비밀번호가 틀렸습니다") {
      return res.status(401).json({ message: "비밀번호가 틀렸습니다" });
    }

    if (error.message === "존재하지 않습니다") {
      return res.status(401).json({ message: "존재하지 않습니다" });
    }
    next(error);
  }  
};

// 📌 그룹 공감하기 (좋아요 증가)
export const likeGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const numericGroupId = Number(groupId); // ✅ 문자열을 숫자로 변환

        if (isNaN(numericGroupId)) {
            return res.status(400).json({ message: "잘못된 groupId 값입니다." });
        }

        const group = await prisma.group.findUnique({
            where: { id: numericGroupId }
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않는 그룹입니다." });
        }

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
        const { groupId } = req.params;
        const group = await prisma.group.findUnique({
            where: { id: Number(groupId) },
            select: { id: true, isPublic: true }
        });

        if (!group) {
            return res.status(404).json({ message: "존재하지 않는 그룹입니다." });
        }

        res.status(200).json(group);
    } catch (error) {
        console.error("❌ 서버 오류 발생:", error);
        res.status(500).json({ message: "서버 오류 발생", error: error.message });
    }
};

export default groupController;
