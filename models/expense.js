class Expense {
    constructor(id, description, amount, date) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.date = date;
    }

    printInfo() {
        console.log(`ID: ${this.id}`);
        console.log(`Description: ${this.description}`);
        console.log(`Date: ${this.date}`);
        console.log(`Amount: ${this.amount}`);
        console.log("--------------------------");
    }

    getInfo() {
        return `ID: ${this.id}\nDescription: ${this.description}\nDate: ${this.date}\nAmount: ${this.amount}\n--------------------------`;
    }
}

export default Expense;