import { ChainId } from "../../enums/chain-id";
import { Token } from "../../factories/token/models/token";
import { ErrorCodes } from "../errors/error-codes";
import { QuickswapError } from "../errors/quickswap-error";

/**
 * WETH token context
 */
export class WETH {
  public static MATIC() {
    return {
      chainId: ChainId.MATIC,
      contractAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      decimals: 18,
      symbol: "WETH",
      name: "Wrapped Ether",
    };
  }

  /**
   * Get WETH token info by chain id
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
