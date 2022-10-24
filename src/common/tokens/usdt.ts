import { ChainId } from '../../enums/chain-id';
import { ErrorCodes } from '../errors/error-codes';
import { QuickswapError } from '../errors/quickswap-error';

/**
 * USDT token context CHANGE CONTRACT ADDRESS INFO ETC
 */
export class USDT {
  public static MATIC() {
    return {
      chainId: ChainId.MATIC,
      contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      decimals: 6,
      symbol: 'USDT',
      name:'Tether USD'
    }
  }

  /**
   * Get USDT token info by chain id
   * @param chainId The chain id
   */
  public static token(chainId: ChainId | number) {
    switch (chainId) {
      case ChainId.MATIC:
        return this.MATIC()
      default:
        throw new QuickswapError(
          `${chainId} is not allowed`,
          ErrorCodes.tokenChainIdContractDoesNotExist
        );
    }
  }
}
