import { callDB } from "./db";
import { getTransactionsByDay } from "./transactions";

type Day = {
  date: Date; // PK
  balance: number;
};

/**
 * @returns `[day, totals]` - Balance for the day, total transaction diff
 */
async function getDay(date: Date, user: string) {
  const day = await callDB("SELECT * FROM days WHERE date = ? AND userID = ?", [
    date.toISOString().split("T")[0],
    user,
  ]);
  const totals = getTransactionsByDay(date, user);
  return [day, totals];
}

async function setDay(date: Date, user: string, balance: number) {
  await callDB("INSERT INTO days (date, userID, balance) VALUES (?, ?, ?)", [
    date.toISOString().split("T")[0],
    user,
    balance,
  ]);
}

export { getDay, setDay };
export type { Day };
