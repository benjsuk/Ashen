import { callDB } from "./db";
import { getTransactionsByDay, getTransactionsByDays } from "./transactions";

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

function dayKey(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value).slice(0, 10);
}

async function getDays(from: Date, to: Date, user: string) {
  const fromStr = from.toISOString().split("T")[0];
  const toStr = to.toISOString().split("T")[0];

  const day = await callDB(
    "SELECT * FROM days WHERE date BETWEEN ? AND ? AND userID = ?",
    [fromStr, toStr, user],
  );
  const transactions = await getTransactionsByDays(from, to, user);

  const balances = new Map<string, number>();
  for (const row of day[0]) {
    balances.set(dayKey(row.date), row.balance);
  }

  const totals = new Map<string, { income: number; expense: number }>();
  for (const row of transactions[0]) {
    const key = dayKey(row.date);
    const entry = totals.get(key) ?? { income: 0, expense: 0 };
    if (row.direction === "income") {
      entry.income += row.amount;
    } else {
      entry.expense += row.amount;
    }
    totals.set(key, entry);
  }

  const dates: Date[] = [];
  const cursor = new Date(from);
  while (cursor <= to) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates.map((date) => {
    const key = date.toISOString().slice(0, 10);
    const dayTotals = totals.get(key);
    return {
      date: key,
      balance: balances.get(key) ?? null,
      income: dayTotals?.income ?? 0,
      expense: dayTotals?.expense ?? 0,
    };
  });
}

async function setDay(date: Date, user: string, balance: number) {
  await callDB(
    "INSERT INTO days (date, userID, balance) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE balance = VALUES(balance)",
    [date.toISOString().split("T")[0], user, balance],
  );
}

export { getDay, getDays, setDay };
export type { Day };
