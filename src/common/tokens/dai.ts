import { ChainId } from '../../enums/chain-id';
import { ErrorCodes } from '../errors/error-codes';
import { QuickswapError } from '../errors/quickswap-error';

/**
 * DAI token context CHANGE CONTRACT ADDRESS INFO ETC
 */
export class DAI {
  public static MATIC() {
    return {
      chainId: ChainId.MATIC,
      contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      decimals: 18,
      symbol: 'DAI',
      name: '(PoS) Dai Stablecoin'
    }
  }

  /**
   * Get DAI token info by chain id
   * @param chainId The chain id
   */
  public static token(chainId: ChainId | number) {
    switch (chainId) {
      case ChainId.MATIC:
        return this.MATIC();
      default:
        throw new QuickswapError(
          `${chainId} is not allowed`,
          ErrorCodes.tokenChainIdContractDoesNotExist
        );
    }
  }
}
