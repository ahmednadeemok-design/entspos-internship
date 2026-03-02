const { createAccount } = require("./factory");

console.log("=== Bank Account Simulator (JS) ===\n");

// Step 1: Create two accounts using factory
const savings = createAccount({
  type: "savings",
  id: "S-100",
  initialBalance: 500,
  lowBalanceThreshold: 100,
});

const checking = createAccount({
  type: "checking",
  id: "C-200",
  initialBalance: 200,
  lowBalanceThreshold: 80,
});

// Step 2: Register low-balance callbacks (event-like)
savings.onLowBalance((info) => {
  console.log(
    `⚠️ LOW BALANCE ALERT [${info.type} ${info.id}] balance=${info.balance.toFixed(
      2
    )} threshold=${info.threshold}`
  );
});

checking.onLowBalance((info) => {
  console.log(
    `⚠️ LOW BALANCE ALERT [${info.type} ${info.id}] balance=${info.balance.toFixed(
      2
    )} threshold=${info.threshold}`
  );
});

// Step 3: Normal method calls (this in methods)
console.log("Savings balance:", savings.getBalance());
console.log("Checking balance:", checking.getBalance());

console.log("\n--- Deposit 100 into checking ---");
checking.deposit(100);
console.log("Checking balance:", checking.getBalance());

console.log("\n--- Withdraw 50 from savings (fee applies) ---");
savings.withdraw(50);
console.log("Savings balance:", savings.getBalance());

// Step 4: Transfer with fee (currying fee policy)
console.log("\n--- Transfer 150 from savings to checking (transfer fee applies) ---");
const result = savings.transfer(checking, 150);
console.log("Transfer result:", result);
console.log("Savings balance:", savings.getBalance());
console.log("Checking balance:", checking.getBalance());

// Step 5: Trigger low balance alert by withdrawing
console.log("\n--- Withdraw to trigger low-balance alert ---");
checking.withdraw(250); // likely to drop below threshold
console.log("Checking balance:", checking.getBalance());

// --------------------
// this in normal function vs arrow
// --------------------
console.log("\n=== this Keyword Demo ===");

// Normal function: "this" depends on how it's called
function showThisNormal() {
  // In Node (non-strict), this may be global object; in strict it can be undefined
  console.log("Normal function this:", this);
}

// Arrow function: "this" is lexical (taken from surrounding scope)
const showThisArrow = () => {
  console.log("Arrow function this:", this);
};

showThisNormal();
showThisArrow();

// --------------------
// call / apply / bind + function borrowing
// --------------------
console.log("\n=== call/apply/bind + Function Borrowing ===");

// Borrow savings.deposit to use on checking
const borrowedDeposit = savings.deposit;

// If we call borrowedDeposit(10) directly, "this" is wrong -> error
try {
  borrowedDeposit(10);
} catch (e) {
  console.log("Borrowed deposit without binding failed:", e.message);
}

// Use call: set "this" explicitly
borrowedDeposit.call(checking, 10);
console.log("Checking balance after call:", checking.getBalance());

// Use apply: same but args as array
borrowedDeposit.apply(checking, [15]);
console.log("Checking balance after apply:", checking.getBalance());

// Use bind: create a new function with fixed this
const boundDepositToSavings = borrowedDeposit.bind(savings);
boundDepositToSavings(25);
console.log("Savings balance after bind:", savings.getBalance());

console.log("\n=== Done ===");