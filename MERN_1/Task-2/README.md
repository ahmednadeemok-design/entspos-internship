# Task 02 — Bank Account Simulator (JavaScript)

## Features
- Closure-based **private balance** (balance is not directly accessible)
- Prototypal inheritance: `Savings` and `Checking` inherit shared methods
- Operations: `deposit`, `withdraw`, `transfer`
- Curried fee calculators for withdraw/transfer fees
- Demonstrates `this` behavior (functions, methods, arrow functions)
- Demonstrates `call`, `apply`, `bind` + function borrowing
- Event-like callbacks for low-balance alerts

## Run
```bash
npm install
node src/index.js