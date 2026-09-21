import logger from "node-color-log";
import { utils } from "./utils";
import type { Transaction } from "./transactions";
import { newTransaction } from "./transactions";
import { startDB, stopDB, callDB } from "./db";
import "node-color-log";

const util = new utils();

try {
  util.debug("Starting DB Server...");
  await startDB();
} catch (e) {
  util.error(e);
  process.exit();
}

try {
  util.log("DB Server Started.");
  util.debug("Connecting to DB...");

  const mysqlResults = await callDB(`SHOW TABLES;`);
  util.debug(mysqlResults[0]);

  let transactions: Array<Transaction> = [
    newTransaction(350, "Bacon", new Date("2026-09-01"), "food"),
  ];

  let daysTotal: Dict<number> = {};
  transactions.forEach((transaction: Transaction) => {
    const day = transaction.date.toDateString();
    daysTotal[day] = (daysTotal[day] ?? 0) + transaction.amount;
  });

  Object.entries(daysTotal).forEach(([day, total]) => {
    util.debug(`On ${day}, £${(total || 0) / 100} was spent.`);
  });

  util.debug(transactions);
} finally {
  try {
    util.debug("Stopping DB Server...");
    await stopDB();
    util.log("DB Server Stopped.");
  } catch (e) {
    util.error(e);
    util.error("DB Server May Not Have Closed!");
  }
}
