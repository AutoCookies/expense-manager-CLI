import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import Expense from '../models/expense.js';
import { stdin } from 'process';


const TASK_FILE = "expense.csv";

// Hàm loadExpense: load danh sách các đối tượng Expense từ file CSV
export function loadCSVFile() {
    // Nếu file không tồn tại, tạo file mới với header
    if (!fs.existsSync(TASK_FILE)) {
        console.log(`File ${TASK_FILE} không tồn tại. Đang tạo file mới...`);
        const header = "id,description,amount,date\n";
        fs.writeFileSync(TASK_FILE, header, "utf8");
        return [];
    }

    // Đọc nội dung file CSV
    const raw = fs.readFileSync(TASK_FILE, "utf8");
    const lines = raw.split("\n").filter(line => line.trim() !== "");

    // Giả sử dòng đầu tiên là header
    const headers = lines[0].split(",").map(header => header.trim());

    // Chuyển các dòng còn lại thành đối tượng Expense
    const expenses = lines.slice(1).map(line => {
        const values = line.split(",").map(value => value.trim());
        const expenseObj = {};
        headers.forEach((header, index) => {
            expenseObj[header] = values[index];
        });
        // Chuyển đổi kiểu dữ liệu cho các thuộc tính
        const id = Number(expenseObj.id);
        const description = expenseObj.description;
        const amount = Number(expenseObj.amount);
        const date = expenseObj.date;
        return new Expense(id, description, amount, date);
    });

    return expenses;
}

// Save the expenses array to the CSV file.
export function saveExpenses(expenses) {
    const header = "id,description,amount,date";
    const rows = expenses.map(expense =>
        `${expense.id},${expense.description},${expense.amount},${expense.date}`
    );
    const csvData = [header, ...rows].join("\n");
    fs.writeFileSync(TASK_FILE, csvData);
    // console.log(`Saved ${expenses.length} expenses to ${TASK_FILE}`);
}

// Get the next available Expense ID by reading the CSV file.
export function getNextExpenseId() {
    const expenses = loadCSVFile();
    if (expenses.length === 0) return 1;
  
    // Tạo tập hợp chứa các id hiện có
    const idSet = new Set(expenses.map(exp => exp.id));
  
    // Tìm số nguyên dương nhỏ nhất chưa có trong tập
    let candidate = 1;
    while (idSet.has(candidate)) {
      candidate++;
    }
    return candidate;
  }

// Add a new expense. If the CSV file doesn't exist, it will be created.
export function addExpense(description, amount) {
    const expenses = loadCSVFile();
    const id = getNextExpenseId();

    // Validate fields (convert amount to string for trim check)
    if (!description.trim() || !amount.toString().trim()) {
        console.log("All fields must be filled.");
        return;
    }

    const current = new Date().toISOString();
    const expense = new Expense(id, description, Number(amount), current);

    // Push the new expense into the expenses array and save
    expenses.push(expense);
    saveExpenses(expenses);

    console.log(`Save expense with id: ${id} completed.`);
}

export function showExpenses() {
    let expenses = loadCSVFile();
  
    if (!expenses || expenses.length === 0) {
      console.log("No expenses exist.");
      return;
    }
  
    // Define column widths
    const idWidth = 5;
    const descWidth = 30;
    const dateWidth = 25;
    const amountWidth = 10;
  
    // Print header row
    console.log(
      "ID".padEnd(idWidth) + " " +
      "Description".padEnd(descWidth) + " " +
      "Date".padEnd(dateWidth) + " " +
      "Amount".padEnd(amountWidth)
    );
  
    // Print a separator line
    console.log(
      "-".repeat(idWidth) + " " +
      "-".repeat(descWidth) + " " +
      "-".repeat(dateWidth) + " " +
      "-".repeat(amountWidth)
    );
  
    // Loop over each expense and print as columns
    for (let exp of expenses) {
      // Convert plain object to an instance of Expense if necessary
      if (typeof exp.printInfo !== 'function') {
        exp = new Expense(exp.id, exp.description, exp.amount, exp.date);
      }
      console.log(
        String(exp.id).padEnd(idWidth) + " " +
        String(exp.description).padEnd(descWidth) + " " +
        String(exp.date).padEnd(dateWidth) + " " +
        String(exp.amount).padEnd(amountWidth)
      );
    }
}  

export function deleteExpense(id) {
    const expenses = loadCSVFile();
    
    if (!expenses || expenses.length === 0) {
      console.log("There are no expenses to delete.");
      return;
    }
    
    // Filter out the expense with the given ID
    const updatedExpenses = expenses.filter(exp => exp.id !== Number(id));
    
    if (updatedExpenses.length === expenses.length) {
      console.log(`Expense with ID ${id} not found.`);
      return;
    }
    
    saveExpenses(updatedExpenses);
    console.log(`Expense with ID ${id} has been deleted.`);
  }
  

export function sumAmmountOfExpense () {
    const expenses = loadCSVFile();
    if (!expenses || expenses.length === 0) {
        console.log("There are no expenses.");
        console.log("Sum of expense: 0")
        return;
    } 

    let sum = 0
    for (let ex of expenses) {
        sum += ex.amount;
    }

    console.log(`Sum of expeenses: ${sum}`)
}

export function sumAmmountOfExpenseSpecificMonth(month) {

    if (month > 12 || month <= 0) {
        console.log("Month must between (1-12)")
        return;
    }
    // Lấy năm hiện tại
    const currentYear = new Date().getFullYear();
    
    // Load danh sách expense từ CSV
    const expenses = loadCSVFile();
    
    // Biến tích lũy tổng số tiền
    let sum = 0;
    
    // Duyệt qua từng expense
    expenses.forEach(exp => {
      // Chuyển đổi chuỗi date sang đối tượng Date
      const expDate = new Date(exp.date);
      // Lấy tháng (0-indexed nên cần cộng 1) và năm của expense
      const expMonth = expDate.getMonth() + 1;
      const expYear = expDate.getFullYear();
      
      // Nếu expense thuộc tháng truyền vào và năm hiện tại thì cộng dồn
      if(expYear === currentYear && expMonth === Number(month)) {
        sum += exp.amount;
      }
    });
    
    console.log(`Sum of expenses for month ${month} in ${currentYear}: ${sum}`);
    return sum;
  }
  