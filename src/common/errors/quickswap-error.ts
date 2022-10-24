import { ErrorCodes } from '../..';

export class QuickswapError extends Error {
  public name = 'QuickswapError';
  public code: ErrorCodes;
  public message: string;
  constructor(message: string, code: ErrorCodes) {
    super(message);
    this.message = message;
    this.code = code;
  }
}
