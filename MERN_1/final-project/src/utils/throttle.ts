export function throttle<T extends (...args: any[]) => void>(fn: T, interval = 300) {
  let last = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn(...args);
    }
  };
}