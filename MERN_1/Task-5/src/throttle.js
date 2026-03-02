export function throttle(fn, interval = 300) {
  let last = 0;

  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn(...args);
    }
  };
}