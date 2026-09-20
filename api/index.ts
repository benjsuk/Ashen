import logger from "node-color-log";
import type { Transaction } from "./transactions";
import { newTransaction } from "./transactions";
import { $, env, sql, SQL } from "bun";
import "node-color-log";

try {
  logger.color('black').debug('Starting DB Server...')
  await $`cd db_server/ && sudo docker compose up -d --wait`.quiet();
} catch (e) {
  logger.error(e);
  process.exit();
}

try {
  logger.color('black').debug('DB Server Started.')
  const mysql = new SQL(
    `mysql://root:${process.env.MYSQL_ROOT_PASSWORD}@127.0.0.1:5905/ashen`,
  );
  const mysqlResults = await mysql`
  SHOW TABLES;
`;
  logger.color('black').debug(mysqlResults);

  let transactions: Array<Transaction> = [
    newTransaction(350, "Bacon", new Date("2026-09-01"), "food"),
  ];

  let daysTotal: Dict<number> = {};
  transactions.forEach((transaction: Transaction) => {
    const day = transaction.date.toDateString();
    daysTotal[day] = (daysTotal[day] ?? 0) + transaction.amount;
  });

  Object.entries(daysTotal).forEach(([day, total]) => {
    logger.color("black").debug(`On ${day}, £${(total || 0) / 100} was spent.`);
  });

  logger.color("black").debug(transactions);
} finally {
  try {
    await $`cd db_server/ && sudo docker compose down`.quiet();
  } catch (e) {
    logger.error(e);
    logger.error("DB Server May Not Have Closed!");
  }
}
