import { v7 as uuid, NIL as nil } from "uuid";
import { callDB } from "./db";
import { timeUtils } from "./timeUtils";

type Direction = "income" | "expense";

type Transaction = {
  id: string; // PK
  amount: number;
  description: string;
  date: Date;
  category?: string;
  user: string;
  direction?: Direction;
};

function newTransaction(
  amount: number,
  description: string,
  date: Date,
  category?: string,
  user?: string,
  direction?: Direction,
) {
  if (!user) user = nil;
  return <Transaction>{
    id: uuid(),
    amount,
    description,
    date,
    category,
    user,
    direction,
  };
}

async function getTransactions(user?: string) {
  if (!user) {
    return await callDB("SELECT * FROM transactions");
  } else {
    return await callDB("SELECT * FROM transactions WHERE userID = ?", [user]);
  }
}

async function getTransactionsByDay(date: Date, user: string) {
  if (!user) {
    return await callDB("SELECT * FROM transactions WHERE date = ?", [
      timeUtils.dateUK(date),
    ]);
  } else {
    return await callDB(
      "SELECT * FROM transactions WHERE date = ? AND userID = ?",
      [timeUtils.dateUK(date), user],
    );
  }
}

async function getTransactionsByDays(from: Date, to: Date, user: string) {
  return await callDB(
    "SELECT * FROM transactions WHERE date BETWEEN ? AND ? AND userID = ?",
    [timeUtils.dateUK(from), timeUtils.dateUK(to), user],
  );
}

async function getTransaction(id: string) {
  return await callDB("SELECT * FROM transactions WHERE transactionID = ?", [
    id,
  ]);
}

async function logTransaction(transaction: Transaction) {
  await callDB(
    "INSERT INTO transactions (transactionID, amount, description, date, category, userID, direction) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      transaction.id,
      transaction.amount,
      transaction.description,
      timeUtils.dateUK(transaction.date),
      transaction.category || null,
      transaction.user,
      transaction.direction || "expense",
    ],
  );
}

export type { Transaction };
export {
  getTransactions,
  logTransaction,
  newTransaction,
  getTransaction,
  getTransactionsByDay,
  getTransactionsByDays,
};
