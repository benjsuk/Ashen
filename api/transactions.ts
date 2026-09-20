import { v7 as uuid } from "uuid";

type Transaction = {
  id: string;
  amount: number;
  description: string;
  date: Date;
  category?: string;
};



function newTransaction(
  amount: number,
  description: string,
  date: Date,
  category?: string,
) {
  return <Transaction>{ id: uuid(), amount, description, date, category };
}

function getTransactions() {}

function logTransaction(transaction: Transaction) {}

export type { Transaction };
export { getTransactions, logTransaction, newTransaction };
