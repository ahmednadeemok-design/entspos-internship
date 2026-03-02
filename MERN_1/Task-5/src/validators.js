export function isValidEmail(email) {
  // simple email check (good enough for task)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).trim());
}

export function isValidPattern(text) {
  // letters + spaces only
  const re = /^[A-Za-z\s]+$/;
  return re.test(String(text).trim());
}

export function isValidTitle(title) {
  return String(title).trim().length >= 3;
}