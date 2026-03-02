function createTaskCounter() {
  let createdCount = 0; // private

  function increment() {
    createdCount += 1;
  }

  function getCount() {
    return createdCount;
  }

  return { increment, getCount };
}

module.exports = { createTaskCounter };