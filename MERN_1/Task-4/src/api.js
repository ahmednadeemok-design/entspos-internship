import { getCached, setCached } from "./cache.js";
import { NetworkError, ParseError } from "./errors.js";

const BASE = "https://jsonplaceholder.typicode.com";

export async function fetchJSON(url) {
  const cached = getCached(url, "GET");
  if (cached) return cached;

  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    throw new NetworkError("Network failed: " + err.message);
  }

  if (!res.ok) {
    throw new NetworkError(`HTTP error ${res.status} for ${url}`, res.status);
  }

  try {
    const data = await res.json();
    setCached(url, data, "GET");
    return data;
  } catch (err) {
    throw new ParseError("Failed to parse JSON: " + err.message);
  }
}

export const getUsers = () => fetchJSON(`${BASE}/users`);
export const getPosts = () => fetchJSON(`${BASE}/posts`);
export const getCommentsByPostId = (postId) => fetchJSON(`${BASE}/posts/${postId}/comments`);