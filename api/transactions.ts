import { v7 as uuid, NIL as nil } from "uuid";
import { callDB } from "./db";

type Transaction = {
  id: string; // PK
  amount: number;
  description: string;
  date: Date;
  category?: string;
  user: string;
};

function newTransaction(
  amount: number,
  description: string,
  date: Date,
  category?: string,
  user?: string,
) {
  if (!user) user = nil;
  return <Transaction>{ id: uuid(), amount, description, date, category, user };
}

async function getTransactions(user?: string) {
  if (!user) {
    return await callDB("SELECT * FROM transactions");
  } else {
    return await callDB("SELECT * FROM transactions WHERE userID = ?", [user]);
  }
}

async function getTransaction(id: string) {
  return await callDB("SELECT * FROM transactions WHERE transactionID = ?", [
    id,
  ]);
}

async function logTransaction(transaction: Transaction) {
  await callDB(
    "INSERT INTO transactions (transactionID, amount, description, date, category, userID) VALUES (?, ?, ?, ?, ?, ?)",
    [
      transaction.id,
      transaction.amount,
      transaction.description,
      transaction.date.toISOString().split("T")[0],
      transaction.category || "NONE",
      transaction.user,
    ],
  );
}

export type { Transaction };
export { getTransactions, logTransaction, newTransaction, getTransaction };
