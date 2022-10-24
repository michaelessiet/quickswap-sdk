import { EthersProvider } from '../../../ethers-provider';
import { Token } from '../../token/models/token';
import { QuickswapPairSettings } from './pair-settings';

export interface QuickswapPairFactoryContext {
  fromToken: Token;
  toToken: Token;
  ethereumAddress: string;
  settings: QuickswapPairSettings;
  ethersProvider: EthersProvider;
}
