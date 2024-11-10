import type { Knex } from "knex";

const tableName = 'warehouse';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(tableName, table => {
        table.increments('id').primary();
        table.string('warehouse_name').unique().notNullable();
        table.timestamps(true, true);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(tableName);
}

