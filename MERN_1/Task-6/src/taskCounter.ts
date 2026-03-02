export type TaskCounter = {
  increment: () => void;
  getCount: () => number;
};

export function createTaskCounter(): TaskCounter {
  let createdCount = 0; // private closure

  return {
    increment() {
      createdCount += 1;
    },
    getCount() {
      return createdCount;
    },
  };
}