// Enterprise Error Framework
// File: src/core/errors/errorFramework.ts

export abstract class BaseError extends Error {
  public abstract readonly code: string;
  public abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends BaseError {
  public readonly code = "VALIDATION_ERROR";
  public readonly statusCode = 400;
}

export class BusinessError extends BaseError {
  public readonly code = "BUSINESS_ERROR";
  public readonly statusCode = 422;
}

export class RepositoryError extends BaseError {
  public readonly code = "REPOSITORY_ERROR";
  public readonly statusCode = 500;
}

export class NetworkError extends BaseError {
  public readonly code = "NETWORK_ERROR";
  public readonly statusCode = 503;
}

export class UnexpectedError extends BaseError {
  public readonly code = "UNEXPECTED_ERROR";
  public readonly statusCode = 500;
}

export class ErrorHandler {
  public static handle(err: unknown): { message: string; code: string } {
    if (err instanceof BaseError) {
      console.error(`[${err.code}] ${err.message}`);
      return { message: err.message, code: err.code };
    }
    const message = err instanceof Error ? err.message : "Đã xảy ra lỗi hệ thống không xác định.";
    console.error(`[UNEXPECTED_ERROR]`, err);
    return { message, code: "UNEXPECTED_ERROR" };
  }
}
