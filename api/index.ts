import type { Transaction } from "./transactions";
import { newTransaction } from "./transactions";

let transactions: Array<Transaction> = [
  newTransaction(350, "Bacon", new Date("2026-09-01"), "food"),
];

let daysTotal: Dict<number> = {};
transactions.forEach((transaction: Transaction) => {
  const day = transaction.date.toDateString();
  daysTotal[day] = (daysTotal[day] ?? 0) + transaction.amount;
});

Object.entries(daysTotal).forEach(([day, total]) => {
  console.log(`On ${day}, £${(total || 0) / 100} was spent.`);
});

console.log(transactions);
