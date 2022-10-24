import { ChainId } from '../../enums/chain-id';
import { ErrorCodes } from '../errors/error-codes';
import { QuickswapError } from '../errors/quickswap-error';

/**
 * COMP token context CHANGE CONTRACT ADDRESS INFO ETC
 */
export class COMP {
  public static MATIC() {
    return {
      chainId: ChainId.MATIC,
      contractAddress: '0x8505b9d2254A7Ae468c0E9dd10Ccea3A837aef5c',
      decimals: 18,
      symbol: 'COMP',
      name:'(PoS) Compound'
    }
  }

  /**
   * Get COMP token info by chain id
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
