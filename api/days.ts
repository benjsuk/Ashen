import { callDB } from "./db";
import { getTransactionsByDay } from "./transactions";

type Day = {
  date: Date; // PK
  balance: number;
};

async function getDay(date?: Date, user?: string) {
  if (!date) {
    date = new Date();
  }
  if (!user) {
    const day = await callDB("SELECT * FROM days WHERE date = ?", [
      date.toISOString().split("T")[0],
    ]);
    const totals = getTransactionsByDay(date);
    return [day, totals];
  } else {
    const day = await callDB(
      "SELECT * FROM days WHERE date = ? AND userID = ?",
      [date.toISOString().split("T")[0], user],
    );
    const totals = getTransactionsByDay(date, user);
    return [day, totals];
  }
}

export { getDay };
export type { Day };
