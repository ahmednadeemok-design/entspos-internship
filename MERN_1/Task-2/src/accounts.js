const {
  transferFee,
  withdrawFeeChecking,
  withdrawFeeSavings,
} = require("./fees");

/**
 * Prototypal "base" object for shared methods.
 * We'll attach methods here so Savings/Checking can inherit them.
 */
const AccountProto = {
  // method: uses "this"
  getId: function () {
    return this.id;
  },

  // method: uses "this"
  getType: function () {
    return this.type;
  },

  // IMPORTANT: balance is PRIVATE via closure, so we expose a getter
  getBalance: function () {
    return this._getBalance(); // closure function
  },

  deposit: function (amount) {
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Deposit amount must be > 0");
    }

    this._setBalance(this._getBalance() + amount);
    return this._getBalance();
  },

  withdraw: function (amount) {
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Withdraw amount must be > 0");
    }

    // apply fee based on account type (checking vs savings)
    const feeFn =
      this.type === "CHECKING" ? withdrawFeeChecking : withdrawFeeSavings;

    const feeAmount = feeFn(amount);
    const total = amount + feeAmount;

    const current = this._getBalance();
    if (current < total) {
      throw new Error(
        `Insufficient funds. Need ${total.toFixed(2)}, have ${current.toFixed(2)}`
      );
    }

    this._setBalance(current - total);

    // event-like callback if balance low
    this._maybeLowBalance();

    return this._getBalance();
  },

  transfer: function (toAccount, amount) {
    if (!toAccount || typeof toAccount._getBalance !== "function") {
      throw new Error("transfer requires a valid destination account");
    }

    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Transfer amount must be > 0");
    }

    // Transfer fee uses currying too
    const feeAmount = transferFee(amount);
    const total = amount + feeAmount;

    const fromBal = this._getBalance();
    if (fromBal < total) {
      throw new Error(
        `Insufficient funds for transfer. Need ${total.toFixed(
          2
        )}, have ${fromBal.toFixed(2)}`
      );
    }

    // decrease sender
    this._setBalance(fromBal - total);
    this._maybeLowBalance();

    // increase receiver
    toAccount._setBalance(toAccount._getBalance() + amount);
    toAccount._maybeLowBalance();

    return {
      fromBalance: this._getBalance(),
      toBalance: toAccount._getBalance(),
      feeCharged: feeAmount,
    };
  },

  // Register a callback like an "event listener"
  onLowBalance: function (cb) {
    if (typeof cb !== "function") {
      throw new Error("onLowBalance expects a function callback");
    }
    this._lowBalanceHandlers.push(cb);
  },

  _maybeLowBalance: function () {
    const bal = this._getBalance();
    if (bal < this.lowBalanceThreshold) {
      // fire event-like callbacks
      for (const handler of this._lowBalanceHandlers) {
        handler({
          id: this.id,
          type: this.type,
          balance: bal,
          threshold: this.lowBalanceThreshold,
        });
      }
    }
  },
};

/**
 * Savings prototype inherits from AccountProto
 */
const SavingsProto = Object.create(AccountProto);
SavingsProto.type = "SAVINGS";

/**
 * Checking prototype inherits from AccountProto
 */
const CheckingProto = Object.create(AccountProto);
CheckingProto.type = "CHECKING";

/**
 * Closure-based private balance:
 * balance is NOT stored as object.balance publicly.
 * We store _getBalance and _setBalance closures on the object.
 */
function createAccountObject({ id, type, initialBalance, lowBalanceThreshold }) {
  if (typeof initialBalance !== "number" || initialBalance < 0) {
    throw new Error("initialBalance must be a number >= 0");
  }

  let balance = initialBalance; // PRIVATE VARIABLE (CLOSURE)

  const account = {
    id,
    type,
    lowBalanceThreshold: typeof lowBalanceThreshold === "number" ? lowBalanceThreshold : 50,
    _lowBalanceHandlers: [],

    // closures:
    _getBalance: function () {
      return balance;
    },
    _setBalance: function (newBal) {
      balance = newBal;
    },
  };

  return account;
}

module.exports = {
  AccountProto,
  SavingsProto,
  CheckingProto,
  createAccountObject,
};