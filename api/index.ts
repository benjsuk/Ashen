import type { Transaction } from "./transactions";

let transactions: Array<Transaction> = [ {   amount: 350,   description: "bacon",   date: new Date("2026-09-01"),   category: "food", }, {   amount: 799,   description: "KFC",   date: new Date("2026-09-01"),   category: "food", }, {   amount: 4000,   description: "savings",   date: new Date("2026-09-02"),   category: "savings", },
];

let daysTotal: Dict<number> = {};
transactions.forEach((transaction: Transaction) => { const day = transaction.date.toDateString(); daysTotal[day] = (daysTotal[day] ?? 0) + transaction.amount;
});

Object.entries(daysTotal).forEach(([day, total]) => { console.log(`On ${day}, £${(total || 0) / 100} was spent.`);
});
