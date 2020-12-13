import Knex from "knex";

const getKnex = () =>
  Knex({
    client: "postgresql",
    connection:
      "postgresql://lambdadbuser:clump-wrathful-MOSQUITO-soldiery@vaxassure-test-db2.cqo6r4ncya8n.us-east-1.rds.amazonaws.com:5432/testmain",
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  });

export default getKnex;
