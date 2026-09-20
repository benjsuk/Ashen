import logger from "node-color-log";
import type { Transaction } from "./transactions";
import { newTransaction } from "./transactions";
import { startDB, stopDB, callDB } from "./db";
import { $, env, sql, SQL } from "bun";
import "node-color-log";

try {
  logger.color("black").debug("Starting DB Server...");
  await startDB();
} catch (e) {
  logger.error(e);
  process.exit();
}

try {
  logger.color("black").debug("DB Server Started.");
  logger.color("black").debug("Connecting to DB...");

  const mysqlResults = await callDB(`SHOW TABLES;`);
  logger.color("black").debug(mysqlResults[0]);

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
    logger.color("black").debug("Stopping DB Server...");
    await stopDB();
    logger.color("black").debug("DB Server Stopped.");
  } catch (e) {
    logger.error(e);
    logger.error("DB Server May Not Have Closed!");
  }
}
