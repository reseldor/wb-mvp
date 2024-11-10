import { Router } from 'express';
import { WildberriesService } from 'src/services/WildberriesService';
import { WarehouseService } from 'src/services/WarehouseService';
import type { Request, Response } from 'express';

export const router = Router();

//route for testing
router.get('/wb-data', async (req: Request, res: Response) => {
  try {
    await WarehouseService.saveOrUpdateTariffData('2024-11-10');
    res.status(200).send('Data added and updated successfully');
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

router.get('/health', (req: Request, res: Response) => {
  res.status(200).send('ok');
});

router.get('/check-wb-data', async (req: Request, res: Response) => {
  try {
    const result = await WildberriesService.fetchData('2024-11-10')
    res.json({
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});