import logger from "node-color-log";
import type { Transaction } from "./transactions";
import { newTransaction } from "./transactions";
import { $ } from "bun";
import "node-color-log"

try {
  await $`cd db_server/ && sudo docker compose up -d`.quiet();
} catch (e) {
  logger.error(e)
  process.exit();
}

try {
  let transactions: Array<Transaction> = [
    newTransaction(350, "Bacon", new Date("2026-09-01"), "food"),
  ];

  let daysTotal: Dict<number> = {};
  transactions.forEach((transaction: Transaction) => {
    const day = transaction.date.toDateString();
    daysTotal[day] = (daysTotal[day] ?? 0) + transaction.amount;
  });

  Object.entries(daysTotal).forEach(([day, total]) => {
    logger.color('black').debug(`On ${day}, £${(total || 0) / 100} was spent.`);
  });

  logger.color('black').debug(transactions);
} finally {
  try{
  await $`cd db_server/ && sudo docker compose down`.quiet();
  }catch(e){
    console.log(e)
    console.log("DB Server May Not Have Closed")
  }
}
