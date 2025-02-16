import cron from "node-cron";
import badgeService from "./badgeService.js"


cron.schedule('0 0 * * * * *',async ()=>{
  try {   
    await badgeService.processBadgeAssignments();
    console.log("[배지 지급 스케줄러] 배지 지급 완료");
    
  } catch (error) {
    console.error("[배지 지급 스케줄러] 오류 발생:", error);
  }
});