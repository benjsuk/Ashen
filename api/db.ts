import { $, SQL } from "bun";

const mysql = new SQL({
  url: `mysql://root:${process.env.MYSQL_ROOT_PASSWORD}@127.0.0.1:${process.env.MYSQL_PORT}/ashen`,
  allowPublicKeyRetrieval: true,
});

async function startDB() {
  await $`cd db_server/ && sudo docker compose up -d --wait`.quiet();
}

async function stopDB() {
  await $`cd db_server/ && sudo docker compose down`.quiet();
}

async function callDB(statement: string) {
  return await mysql.unsafe(statement);
}

export { startDB, stopDB, callDB };
