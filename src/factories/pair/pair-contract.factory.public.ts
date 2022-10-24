import { ChainId } from '../../enums/chain-id';
import { EthersProvider } from '../../ethers-provider';
import { QuickswapPairContractFactory } from './pair-contract.factory';
import {MOCK_PROVIDER_URL} from '../../mocks/provider-url.mock'

export class QuickswapPairContractFactoryPublic extends QuickswapPairContractFactory {
  constructor(chainId: ChainId, providerUrl?: string | undefined) {
    super(new EthersProvider(chainId, providerUrl ?? MOCK_PROVIDER_URL()), chainId);
  }
}
