export class AppError extends Error {
  constructor(message) {
    super(message);
    this.name = "AppError";
  }
}

export class NetworkError extends AppError {
  constructor(message, status) {
    super(message);
    this.name = "NetworkError";
    this.status = status;
  }
}

export class ParseError extends AppError {
  constructor(message) {
    super(message);
    this.name = "ParseError";
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}