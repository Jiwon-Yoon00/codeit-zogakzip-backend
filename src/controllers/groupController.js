import express from 'express'
import groupService from '../services/groupService.js'

const groupController = express.Router();

groupController.post('/api/groups', async(req, res,next)=> {
  try{
    const group = await groupService.createGroup(req.body);
    return res.status(201).json(group);
  }catch(error){
    next(error);
  }
});

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


export default groupController;