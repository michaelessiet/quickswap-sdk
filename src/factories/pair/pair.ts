import { ErrorCodes } from "../../common/errors/error-codes";
import { QuickswapError } from "../../common/errors/quickswap-error";
import { isAddress } from "../../common/utils/is-address";
import { TradePath } from "../../enums/trade-path";
import { EthersProvider } from "../../ethers-provider";
import { MOCK_PROVIDER_URL } from "../../mocks/provider-url.mock";
import { TokensFactory } from "../token/tokens.factory";
import {
  QuickswapPairContextForChainId,
  QuickswapPairContextForProviderUrl,
} from "./models/pair-contexts";
import { QuickswapPairFactoryContext } from "./models/pair-factory-context";
import { QuickswapPairSettings } from "./models/pair-settings";
import { QuickswapPairFactory } from "./pair.factory";

export class QuickswapPair {
  private _ethersProvider: EthersProvider;

  constructor(
    private _quickswapPairContext:
      | QuickswapPairContextForChainId
      | QuickswapPairContextForProviderUrl
  ) {
    if (!this._quickswapPairContext.fromTokenContractAddress) {
      throw new QuickswapError(
        "Must have a `fromTokenContractAddress` on the context",
        ErrorCodes.fromTokenContractAddressRequired
      );
    }

    if (!isAddress(this._quickswapPairContext.fromTokenContractAddress)) {
      throw new QuickswapError(
        "`fromTokenContractAddress` is not a valid contract address",
        ErrorCodes.fromTokenContractAddressNotValid
      );
    }

    if (!this._quickswapPairContext.toTokenContractAddress) {
      throw new QuickswapError(
        "Must have a `toTokenContractAddress` on the context",
        ErrorCodes.toTokenContractAddressRequired
      );
    }

    if (!isAddress(this._quickswapPairContext.toTokenContractAddress)) {
      throw new QuickswapError(
        "`toTokenContractAddress` is not a valid contract address",
        ErrorCodes.toTokenContractAddressNotValid
      );
    }

    if (!this._quickswapPairContext.ethereumAddress) {
      throw new QuickswapError(
        "Must have a `ethereumAddress` on the context",
        ErrorCodes.ethereumAddressRequired
      );
    }

    if (!isAddress(this._quickswapPairContext.ethereumAddress)) {
      throw new QuickswapError(
        "`ethereumAddress` is not a valid address",
        ErrorCodes.ethereumAddressNotValid
      );
    }

    const chainId = (<QuickswapPairContextForChainId>this._quickswapPairContext)
      .chainId;

    const providerUrl = (<QuickswapPairContextForProviderUrl>(
      this._quickswapPairContext
    )).providerUrl;

    if (providerUrl && chainId) {
      this._ethersProvider = new EthersProvider(chainId, providerUrl);
      return;
    }

    if (chainId) {
      this._ethersProvider = new EthersProvider(chainId, MOCK_PROVIDER_URL());
      return;
    }

    throw new QuickswapError(
      "You must have a chainId on the context.",
      ErrorCodes.youMustSupplyAChainId
    );
  }

  /**
   * Create factory to be able to call methods on the 2 tokens
   */
  public async createFactory(): Promise<QuickswapPairFactory> {
    const tokensFactory = new TokensFactory(this._ethersProvider);
    const tokens = await tokensFactory.getTokens([
      this._quickswapPairContext.fromTokenContractAddress,
      this._quickswapPairContext.toTokenContractAddress,
    ]);

    const quickswapFactoryContext: QuickswapPairFactoryContext = {
      fromToken: tokens.find(
        (t) =>
          t.contractAddress ===
          this._quickswapPairContext.fromTokenContractAddress
      )!,
      toToken: tokens.find(
        (t) =>
          t.contractAddress ===
          this._quickswapPairContext.toTokenContractAddress
      )!,
      ethereumAddress: this._quickswapPairContext.ethereumAddress,
      settings:
        this._quickswapPairContext.settings || new QuickswapPairSettings(),
      ethersProvider: this._ethersProvider,
    };

    return new QuickswapPairFactory(
      quickswapFactoryContext,
      (<QuickswapPairContextForChainId>this._quickswapPairContext).chainId,
      this._quickswapPairContext.tradePath
    );
  }
}
