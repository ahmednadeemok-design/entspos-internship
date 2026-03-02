export function throttle(fn, intervalMs = 500) {
  let lastTime = 0;

  return (...args) => {
    const now = Date.now();
    if (now - lastTime >= intervalMs) {
      lastTime = now;
      fn(...args);
    }
  };
}