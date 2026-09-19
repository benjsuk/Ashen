import type { Transaction } from "./transactions"

let transactions: Array<Transaction> = [{
    amount: 5,
    description: "bacon",
    date: new Date("2026-09-01"),
    category: "food"
}, {
    amount: 7.99,
    description: "KFC",
    date: new Date("2026-09-01"),
    category: "food"
}, {
    amount: 40,
    description: "savings",
    date: new Date("2026-09-02"),
    category: "savings"
}];

let daysTotal: Dict<number> = {};
transactions.forEach((transaction: Transaction) => {
    const day = transaction.date.toDateString();
    daysTotal[day] = (daysTotal[day] ?? 0) + transaction.amount;
})

console.log(daysTotal)