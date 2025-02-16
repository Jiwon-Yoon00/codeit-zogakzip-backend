// cronJobs.js
import cron from 'node-cron';
import { checkBadgesForAllGroups } from './services/badgeService.js'; // badgeService ������ ��ο� �°� ����

// �� 10�ʸ��� �۾��� ����
cron.schedule('*/10 * * * * *', async () => {
    console.log('���� Ȯ�� �� �ο� �۾� ����');
    try {
        await checkBadgesForAllGroups();
        console.log('���� Ȯ�� �� �ο� �۾� �Ϸ�');
    } catch (error) {
        console.error('���� �۾� �� ���� �߻�:', error);
    }
});
