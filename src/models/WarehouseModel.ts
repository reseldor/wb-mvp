import { DateType, Model } from 'src/models/Model';

export type WarehouseType = {
  id: number;
  warehouse_name: string;
};

export class WarehouseModel extends Model {
  static tableName = 'warehouse';

  public static async create<Payload>(data: Payload): Promise<WarehouseType & DateType> {
    return super.insert<Payload, WarehouseType>(data);
  }

  public static findByName(warehouseName: string): Promise<WarehouseType | null> {
    return this.findBy<
      {
        warehouse_name: string;
      },
      WarehouseType
    >({ warehouse_name: warehouseName });
  }
}
