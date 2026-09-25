import { callDB } from "./db";
import { getTransactionsByDay } from "./transactions";

type Day = {
  date: Date; // PK
  balance: number;
};

async function getDay(date: Date, user: string) {
  const day = await callDB("SELECT * FROM days WHERE date = ? AND userID = ?", [
    date.toISOString().split("T")[0],
    user,
  ]);
  const transactions = await getTransactionsByDay(date, user);
  var income = 0;
  var expense = 0;
  for (let i = 0; i < transactions[0].length; i++) {
    const transaction = transactions[0][i];
    if (transaction.direction == "income") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  }

  return {
    date: date.toISOString().split("T")[0],
    balance: day[0][0]?.balance ?? null,
    income: income,
    expense: expense,
  };
}

async function setDay(date: Date, user: string, balance: number) {
  await callDB(
    "INSERT INTO days (date, userID, balance) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE balance = VALUES(balance)",
    [date.toISOString().split("T")[0], user, balance],
  );
}

export { getDay, setDay };
export type { Day };
