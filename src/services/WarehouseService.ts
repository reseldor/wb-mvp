import { WildberriesService } from 'src/services/WildberriesService';
import { GoogleSheetService } from 'src/services/GoogleSheetService';
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

    private static async fetchDataFromDB(): Promise<string[][]> {
        try {
            const headers = [
                'Warehouse Name',
                'Box Delivery and Storage Expr',
                'Box Delivery Base',
                'Box Delivery Liter',
                'Box Storage Base',
                'Box Storage Liter',
              ];
            const rows = await this.knex('tariff_data')
              .join('warehouse', 'tariff_data.warehouse_id', '=', 'warehouse.id')
              .select(
                'warehouse.warehouse_name',
                'tariff_data.box_delivery_and_storage_expr',
                'tariff_data.box_delivery_base',
                'tariff_data.box_delivery_liter',
                'tariff_data.box_storage_base',
                'tariff_data.box_storage_liter'
              )
              .orderBy('tariff_data.box_delivery_and_storage_expr', 'asc');
      
            const data = rows.map(row => [
              row.warehouse_name,
              row.box_delivery_and_storage_expr?.toString() || '-',
              row.box_delivery_base?.toString() || '-',
              row.box_delivery_liter?.toString() || '-',
              row.box_storage_base?.toString() || '-',
              row.box_storage_liter?.toString() || '-',
            ]);
            return [headers, ...data];
          } catch (error) {
            console.error('Error fetching data from the database:', error);
            return [];
          }
    }

    public static async uploadToGoogleSheet(title: string): Promise<{ id: any; url: any; } | undefined> {
        const today = new Date().toISOString().split('T')[0];
        await WarehouseService.saveOrUpdateTariffData(today);
        const googleSheetService = new GoogleSheetService();
        const spreadsheet = await googleSheetService.createNewSpreadsheet(title);
        const data = await this.fetchDataFromDB()
        await googleSheetService.writeDataToSpreadsheet(spreadsheet?.id, data);
        return {
            id: spreadsheet?.id || '-',
            url: spreadsheet?.url || '-',
        };
    }
}

