// WeakMap cache stores response by key object reference
const responseCache = new WeakMap();

// This Map keeps stable key objects for each URL
const keyStore = new Map();

function getKey(url, method = "GET") {
  const k = `${method}:${url}`;
  if (!keyStore.has(k)) {
    keyStore.set(k, { url, method });
  }
  return keyStore.get(k);
}

export function getCached(url, method = "GET") {
  const keyObj = getKey(url, method);
  return responseCache.get(keyObj);
}

export function setCached(url, value, method = "GET") {
  const keyObj = getKey(url, method);
  responseCache.set(keyObj, value);
}