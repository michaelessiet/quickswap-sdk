
import { ErrorCodes, QuickswapError } from "../..";
import { ChainId } from "../../enums/chain-id";
import { Token } from "../../factories/token/models/token";

/**
 * WMATIC token context
 */
export class WMATIC {
  public static WMATIC(): Token {
    return {
      chainId: ChainId.MATIC,
      contractAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      decimals: 18,
      symbol: 'WMATIC',
      name: 'Wrapped Matic'
    }
  }

  public static MUMBAI(): Token {
    return {
      chainId: ChainId.MATIC,
      contractAddress: '0x0000000000000000000000000000000000001010',
      decimals: 18,
      symbol: 'MATIC',
      name: 'Matic Token'
    }
  }

  public static token(chainId: ChainId | number) {
    switch (chainId) {
      case ChainId.MATIC:
        return this.WMATIC();
      case ChainId.MUMBAI:
        return this.MUMBAI()
      default:
        throw new QuickswapError(
          `${chainId} is not allowed`,
          ErrorCodes.tokenChainIdContractDoesNotExist
        );
    }
  }
}