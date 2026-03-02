const {
  SavingsProto,
  CheckingProto,
  createAccountObject,
} = require("./accounts");

/**
 * Module exporting an account factory function
 */
function createAccount({ type, id, initialBalance, lowBalanceThreshold }) {
  const upperType = String(type || "").toUpperCase();

  if (!id) {
    throw new Error("id is required");
  }

  // Create base object with private balance closures
  const base = createAccountObject({
    id,
    type: upperType,
    initialBalance,
    lowBalanceThreshold,
  });

  // Attach the correct prototype (inheritance)
  if (upperType === "SAVINGS") {
    Object.setPrototypeOf(base, SavingsProto);
    return base;
  }

  if (upperType === "CHECKING") {
    Object.setPrototypeOf(base, CheckingProto);
    return base;
  }

  throw new Error("type must be SAVINGS or CHECKING");
}

module.exports = { createAccount };