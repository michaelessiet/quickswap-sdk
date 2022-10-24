import { ErrorCodes } from './error-codes';
import { QuickswapError } from './quickswap-error';

describe('QuickswapError', () => {
  const message = 'message_error';
  const code = ErrorCodes.canNotFindChainId;
  const quickswapError = new QuickswapError(message, code);

  it('should have the correct name on error', () => {
    expect(quickswapError.name).toEqual('QuickswapError');
  });

  it('should have the correct code on error', () => {
    expect(quickswapError.code).toEqual(code);
  });

  it('should have the correct message on error', () => {
    expect(quickswapError.message).toEqual(message);
  });
});
