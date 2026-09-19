type Transaction = {
    amount: number,
    description: string,
    date: Date,
    category?: string,
}

function getTransactions(){

}

function addTransaction(transaction: Transaction){

}

const testTransaction: Transaction = {
    amount: 5,
    description: "bacon",
    date: new Date(),
    category: "food"
}

console.log(testTransaction.amount)