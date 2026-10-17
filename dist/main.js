"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs/promises"));
const readline = __importStar(require("readline"));
// This class manages all of the tasks.
class TaskManager {
    tasks = [];
    // Add a new task.
    addTask(name) {
        if (name.trim() === "") {
            throw new Error("Task name cannot be empty.");
        }
        const id = this.tasks.length === 0
            ? 1
            : Math.max(...this.tasks.map(task => task.id)) + 1;
        this.tasks.push({
            id: id,
            name: name,
            completed: false
        });
        console.log("Task added!");
    }
    // Show all tasks.
    viewTasks() {
        if (this.tasks.length === 0) {
            console.log("No tasks available.");
            return;
        }
        for (const task of this.tasks) {
            const status = task.completed ? "Done" : "Not Done";
            console.log(`${task.id}. ${task.name} - ${status}`);
        }
    }
    // Mark a task as completed.
    completeTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (!task) {
            throw new Error("Task not found.");
        }
        task.completed = true;
        console.log("Task completed!");
    }
    // Remove a task.
    removeTask(id) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index === -1) {
            throw new Error("Task not found.");
        }
        this.tasks.splice(index, 1);
        console.log("Task removed!");
    }
    // Search for a task using recursion.
    searchTask(name, index = 0) {
        if (index >= this.tasks.length) {
            console.log("Task not found.");
            return;
        }
        if (this.tasks[index].name.toLowerCase() === name.toLowerCase()) {
            console.log("Found: " + this.tasks[index].name);
            return;
        }
        this.searchTask(name, index + 1);
    }
    // Save tasks to a file asynchronously.
    async saveTasks() {
        const data = JSON.stringify(this.tasks, null, 2);
        await fs.writeFile("tasks.json", data);
        console.log("Tasks saved!");
    }
    // Load tasks from a file asynchronously.
    async loadTasks() {
        try {
            const data = await fs.readFile("tasks.json", "utf-8");
            this.tasks = JSON.parse(data);
            console.log("Tasks loaded!");
        }
        catch (error) {
            // Start empty if there is no saved file.
            console.log("Starting with an empty task list.");
        }
    }
}
// Set up terminal input.
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Ask the user a question.
function ask(question) {
    return new Promise(resolve => {
        rl.question(question, answer => resolve(answer));
    });
}
// Main program.
async function main() {
    const manager = new TaskManager();
    await manager.loadTasks();
    let running = true;
    while (running) {
        console.log("\n===== TASK MANAGER =====");
        console.log("1. Add Task");
        console.log("2. View Tasks");
        console.log("3. Complete Task");
        console.log("4. Remove Task");
        console.log("5. Search Task");
        console.log("6. Save Tasks");
        console.log("7. Exit");
        const choice = await ask("Choose an option: ");
        try {
            if (choice === "1") {
                const name = await ask("Enter task name: ");
                manager.addTask(name);
            }
            else if (choice === "2") {
                manager.viewTasks();
            }
            else if (choice === "3") {
                const id = Number(await ask("Enter task ID: "));
                manager.completeTask(id);
            }
            else if (choice === "4") {
                const id = Number(await ask("Enter task ID: "));
                manager.removeTask(id);
            }
            else if (choice === "5") {
                const name = await ask("Enter task name: ");
                manager.searchTask(name);
            }
            else if (choice === "6") {
                await manager.saveTasks();
            }
            else if (choice === "7") {
                await manager.saveTasks();
                console.log("Goodbye!");
                running = false;
            }
            else {
                console.log("Invalid option.");
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.log("Error: " + error.message);
            }
        }
    }
    rl.close();
}
main();
