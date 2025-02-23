#!/usr/bin/env node
process.title = "expense-manager-cli";  // Set the process title

import { Command } from "commander";
import figlet from "figlet";
import { addExpense, deleteExpense, showExpenses, sumAmmountOfExpense, sumAmmountOfExpenseSpecificMonth } from "./utils/func.utils.js";

console.log(figlet.textSync("Expenses Manager"));

const program = new Command();

program
  .name("expense-manager-cli")
  .description("A simple tool for expense management")
  .version("1.0.0-beta");

// Add expense command
program
  .command("add-expense")
  .description("Add a new expense")
  .requiredOption("--description <description>", "Description of the expense")
  .requiredOption("--amount <amount>", "Amount of the expense")
  .action((options) => {
    addExpense(options.description, options.amount);
  });

// List expenses command
program
  .command("list")
  .description("List all the expenses")
  .action(() => {
    showExpenses();
  });

// Delete expense command
program
  .command("delete")
  .alias("del")
  .description("Delete an expense by id")
  .requiredOption("--id <id>", "ID of the expense to delete")
  .action((options) => {
    deleteExpense(options.id);
  });

// Summary of all expenses command
program
  .command("summary")
  .alias("sum")
  .description("Summary of all expenses")
  .action(() => {
    sumAmmountOfExpense();
  });

// Summary of expenses for a specific month
program
  .command("summary_month")
  .alias("sum_mon")
  .description("Sum of all expenses of a month")
  .requiredOption("--month <month>", "Month of the year (1-12)")
  .action((options) => {
    sumAmmountOfExpenseSpecificMonth(options.month);
  });

// If no command is provided, show help.
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);