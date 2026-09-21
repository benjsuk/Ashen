import { $, SQL } from "bun";
import { utils } from "./utils";
const util = new utils();

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
  const startTime = new Date().getTime();
  const result = await mysql.unsafe(statement);
  const endTime = new Date().getTime();
  return [result, endTime - startTime];
}

export { startDB, stopDB, callDB };
