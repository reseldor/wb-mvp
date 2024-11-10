import { WildberriesService } from 'src/services/WildberriesService';
import { database } from 'src/database';

interface WarehouseData {
    boxDeliveryAndStorageExpr: string;
    boxDeliveryBase: string;
    boxDeliveryLiter: string;
    boxStorageBase: string;
    boxStorageLiter: string;
    warehouseName: string;
}

export class WarehouseService {
    static knex = database;

    private static async fetchTariffs(date: string): Promise<WarehouseData[]> {
        const response = await WildberriesService.fetchData(date);
        return response.data.response.data.warehouseList;
    }

    public static async saveOrUpdateTariffData(date: string): Promise<void> {
        const warehouseData = await this.fetchTariffs(date);
        const trx = await this.knex.transaction();

        try {
            for (const data of warehouseData) {
                const wrHouseExist = await trx('warehouse')
                .where({ warehouse_name: data.warehouseName })
                .first();
                let wrHouseId = wrHouseExist ? wrHouseExist.id : undefined;
                if (!wrHouseId) {
                    const [newWrHouse] = await trx('warehouse')
                        .insert({ warehouse_name: data.warehouseName })
                        .returning('id');
                    wrHouseId = newWrHouse.id;
                }
                await trx('tariff_data')
                    .insert({
                        date,
                        warehouse_id: wrHouseId,
                        box_delivery_and_storage_expr: data.boxDeliveryAndStorageExpr,
                        box_delivery_base: data.boxDeliveryBase,
                        box_delivery_liter: data.boxDeliveryLiter,
                        box_storage_base: data.boxStorageBase,
                        box_storage_liter: data.boxStorageLiter,
                    })
                    .onConflict(['date', 'warehouse_id'])
                    .merge();
            }
            await trx.commit();
        } catch (error) {
            await trx.rollback();
            console.error('Failed to save/update tariff data:', error);
        }
    }
}

