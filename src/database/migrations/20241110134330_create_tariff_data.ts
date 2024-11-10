import { Knex } from 'knex';

const tableName = 'tariff_data';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, table => {
    table.increments('id').primary();
    table.date('date').notNullable();
    table.integer('warehouse_id').references('id').inTable('warehouse').onDelete('CASCADE');
    table.string('box_delivery_and_storage_expr').nullable();
    table.string('box_delivery_base');
    table.string('box_delivery_liter');
    table.string('box_storage_base');
    table.string('box_storage_liter');
    table.unique(['date', 'warehouse_id']);
    table.timestamps(true, true);
});
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}