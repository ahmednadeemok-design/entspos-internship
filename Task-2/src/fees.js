// CURRYING: fee(rate)(amount) => feeAmount
function fee(rate) {
  return function (amount) {
    if (typeof amount !== "number" || amount < 0) {
      throw new Error("Amount must be a positive number");
    }
    return amount * rate;
  };
}

// Some example fee policies (curried functions)
const transferFee = fee(0.02); // 2%
const withdrawFeeChecking = fee(0.01); // 1%
const withdrawFeeSavings = fee(0.005); // 0.5%

module.exports = {
  fee,
  transferFee,
  withdrawFeeChecking,
  withdrawFeeSavings,
};