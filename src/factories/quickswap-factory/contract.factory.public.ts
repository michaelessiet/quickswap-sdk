import { ChainId } from '../../enums/chain-id';
import { EthersProvider } from '../../ethers-provider';
import { QuickswapContractFactory } from './contract.factory';

export class QuickswapContractFactoryPublic extends QuickswapContractFactory {
  constructor(chainId: ChainId, providerUrl?: string | undefined) {
    super(new EthersProvider(chainId, providerUrl), chainId);
  }
}
