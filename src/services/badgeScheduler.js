import cron from "node-cron";
import badgeService from "./badgeService.js";
import groupRepository from '../respoistories/groupRespository.js';


cron.schedule('* * * * * *',async ()=>{
  console.log('running a task every minute');
  try {

    // 모든 그룹 id 조회
    const groups = await groupRepository.getAllId();
    console.log(groups);

    for (const group of groups) {
      
      const newBadges = await badgeService.checkAndAssignBadges(group.id);
      
      if (newBadges.length > 0) {
        console.log(`[배지 지급] 그룹 ID ${group.id}: ${newBadges.join(", ")}`);
      }
    }

    console.log("[배지 지급 스케줄러] 배지 지급 완료");
    
  } catch (error) {
    console.error("[배지 지급 스케줄러] 오류 발생:", error);
  }
});