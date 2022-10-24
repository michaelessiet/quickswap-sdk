import { ChainId } from '../../enums/chain-id';
import { EthersProvider } from '../../ethers-provider';
import { QuickswapRouterContractFactory } from './router-contract.factory';

export class QuickswapRouterContractFactoryPublic extends QuickswapRouterContractFactory {
  constructor(chainId: ChainId, providerUrl?: string | undefined) {
    super(new EthersProvider(chainId, providerUrl), chainId);
  }
}
