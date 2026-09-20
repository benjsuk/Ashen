import { v7 as uuid, NIL as nil } from "uuid";

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

function getTransactions() {}

function logTransaction(transaction: Transaction) {}

export type { Transaction };
export { getTransactions, logTransaction, newTransaction };
