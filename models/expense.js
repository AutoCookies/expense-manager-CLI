class Expense {
    constructor (id, description, ammount, date) {
        this.id = id;
        this.description = description;
        this.ammount = ammount;
        this.date = date;
    }

    printInfo () {
        console.log(`ID: ${this.id}`);
        console.log(`Description: ${this.description}`);
        console.log(`Date: ${this.date}`);
        console.log(`Ammount: ${this.ammount}`);
        console.log("--------------------------");
    }
}