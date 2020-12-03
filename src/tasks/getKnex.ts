import Knex from "knex";

const getKnex = () =>
  Knex({
    client: "postgresql",
    connection: {
      host: "vaxassure-test-db2.cqo6r4ncya8n.us-east-1.rds.amazonaws.com",
      user: "lambdadbuser",
      password: "clump-wrathful-MOSQUITO-soldiery",
      database: "testmain",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  });

export default getKnex;
