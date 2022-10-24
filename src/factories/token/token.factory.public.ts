import { ChainId } from '../../enums/chain-id';
import { EthersProvider } from '../../ethers-provider';
import { MOCK_PROVIDER_URL } from '../../mocks/provider-url.mock';
import { TokenFactory } from './token.factory';

export class TokenFactoryPublic extends TokenFactory {
  constructor(
    tokenContractAddress: string,
    chainId: ChainId,
    providerUrl?: string | undefined
  ) {
    super(tokenContractAddress, new EthersProvider(chainId, providerUrl ?? MOCK_PROVIDER_URL()), chainId);
  }
}
