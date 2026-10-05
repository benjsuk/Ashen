import { v7 as uuid } from "uuid";
import { callDB } from "./db";
import { timeUtils } from "./timeUtils";

type Direction = "income" | "expense";

type Transaction = {
  id: string; // PK
  amount: number;
  description: string;
  date: Date;
  category: string;
  user: string;
  direction: Direction;
};

function newTransaction(
  amount: number,
  description: string,
  date: Date,
  category: string,
  user: string,
  direction: Direction,
  id?: any,
) {
  return <Transaction>{
    id: id || uuid(),
    amount,
    description,
    date,
    category,
    user,
    direction,
  };
}

async function getTransactions(user: string) {
  return await callDB("SELECT * FROM transactions WHERE userID = ?", [user]);
}

async function getTransactionsByDay(date: Date, user: string) {
  return await callDB(
    "SELECT * FROM transactions WHERE date = ? AND userID = ?",
    [timeUtils.dateUK(date), user],
  );
}

async function getTransactionsByDays(from: Date, to: Date, user: string) {
  return await callDB(
    "SELECT * FROM transactions WHERE date BETWEEN ? AND ? AND userID = ?",
    [timeUtils.dateUK(from), timeUtils.dateUK(to), user],
  );
}

async function getTransaction(id: string, user: string) {
  return await callDB(
    "SELECT * FROM transactions WHERE transactionID = ? AND userID = ?",
    [id, user],
  );
}

async function logTransaction(transaction: Transaction) {
  await callDB(
    `INSERT INTO transactions (transactionID, amount, description, date, category, userID, direction)
     VALUES (?, ?, ?, ?, ?, ?, ?) AS new
     ON DUPLICATE KEY UPDATE
     amount      = new.amount,
     description = new.description,
     date        = new.date,
     category    = new.category,
     userID      = new.userID,
     direction   = new.direction`,
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

async function deleteTransaction(id: string, user: string) {
  await callDB(
    `DELETE FROM transactions WHERE transactionID = ? AND userID = ?`,
    [id, user],
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
  deleteTransaction,
};
