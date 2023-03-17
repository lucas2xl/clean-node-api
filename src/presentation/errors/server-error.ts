export class ServerError extends Error {
  constructor(public readonly stack?: string) {
    super(`Internal server error`);
    this.name = 'ServerError';
    this.stack = stack;
  }
}
