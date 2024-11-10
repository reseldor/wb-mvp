import { DateType, Model } from 'src/models/Model';

export type TariffDataType = {
  id: number;
  date: Date;
  warehouse_id: number;
  box_delivery_and_storage_expr: string;
  box_delivery_base: string;
  box_delivery_liter: string;
  box_storage_base: string;
  box_storage_liter: string;
};

export class TariffDataModel extends Model {
  static tableName = 'tariff_data';

  public static async create<Payload>(data: Payload): Promise<TariffDataType & DateType> {
    return super.insert<Payload, TariffDataType>(data);
  }

  public static async findByWarehouseAndDate(
    warehouseId: number,
    date: Date
  ): Promise<TariffDataType | null> {
    return this.findBy<
      {
        warehouse_id: number;
        date: Date;
      },
      TariffDataType
    >({ warehouse_id: warehouseId, date });
  }
}
