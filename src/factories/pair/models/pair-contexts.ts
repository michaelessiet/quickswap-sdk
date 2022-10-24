import { ChainId } from '../../../enums/chain-id';
import { TradePath } from '../../../enums/trade-path';
import { QuickswapPairSettings } from './pair-settings';

interface QuickswapPairContextBase {
  fromTokenContractAddress: string;
  toTokenContractAddress: string;
  ethereumAddress: string;
  tradePath: TradePath
  settings?: QuickswapPairSettings | undefined;
}

export interface QuickswapPairContextForChainId
  extends QuickswapPairContextBase {
  chainId: ChainId | number;
}

export interface QuickswapPairContextForProviderUrl
  extends QuickswapPairContextForChainId {
  providerUrl: string;
}
