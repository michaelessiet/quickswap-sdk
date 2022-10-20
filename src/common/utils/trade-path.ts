import { ChainId } from "../../enums/chain-id";
import { TradePath } from "../../enums/trade-path";
import { Token } from "../../factories/token/models/token";
import { ETH, MATIC } from "../tokens";

export function getTradePath(
  chainId: ChainId,
  fromToken: Token,
  toToken: Token
): TradePath {
  if (fromToken.contractAddress === ETH.token(chainId)?.contractAddress) {
    return TradePath.ethToErc20;
  }

  if (toToken.contractAddress === ETH.token(chainId)?.contractAddress) {
    return TradePath.erc20ToEth;
  }

  if (fromToken.contractAddress === MATIC.token(chainId).contractAddress) {
    return TradePath.ethToErc20;
  }

  if (toToken.contractAddress === MATIC.token(chainId).contractAddress) {
    return TradePath.erc20ToEth;
  }

  return TradePath.erc20ToErc20;
}
