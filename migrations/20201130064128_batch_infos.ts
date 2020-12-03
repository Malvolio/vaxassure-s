import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("batch_infos", (table) => {
    table
      .uuid("uid")
      .primary()
      .notNullable()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("vaccine").notNullable();
    table.string("batch_id").notNullable();
    table.integer("doses").notNullable();
    table.integer("doses_remaining").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.unique(["vaccine", "batch_id"]);
  });

  await knex.schema.createTable("batch_tokens", (table) => {
    table
      .uuid("uid")
      .primary()
      .notNullable()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("batch_info_uid").notNullable().references("batch_infos.uid");
    table.string("ip").notNullable();
    table.string("phone");
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("activations", (table) => {
    table
      .uuid("uid")
      .primary()
      .notNullable()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("batch_info_uid").notNullable().references("batch_infos.uid");
    table.uuid("batch_token_uid").notNullable().references("batch_tokens.uid");
    table.string("passport_id").notNullable();
    table.string("ip").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("activations");
  await knex.schema.dropTable("batch_tokens");
  await knex.schema.dropTable("batch_infos");
}
