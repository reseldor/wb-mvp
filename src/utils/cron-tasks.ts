import cron from 'node-cron';
import { WarehouseService } from 'src/services/WarehouseService';

cron.schedule('0 * * * *', async () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    await WarehouseService.saveOrUpdateTariffData(currentDate);
});
