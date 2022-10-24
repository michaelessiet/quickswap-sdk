import { ChainId, ErrorCodes, QuickswapError, QuickswapPair } from '../..';
import { TradePath } from '../../enums/trade-path';
import { MOCK1INCH } from '../../mocks/1inch-token.mock';
import { MOCKAAVE } from '../../mocks/aave-token.mock';
import { MockEthereumAddress } from '../../mocks/ethereum-address.mock';
import { MOCK_PROVIDER_URL } from '../../mocks/provider-url.mock';
import {
  QuickswapPairContextForChainId,
  QuickswapPairContextForProviderUrl,
} from './models/pair-contexts';

describe('QuickswapPair', () => {
  it('should throw if no fromTokenContractAddress is passed in', () => {
    // @ts-ignore
    const context: QuickswapPairContextForChainId = {};
    expect(() => new QuickswapPair(context)).toThrowError(
      new QuickswapError(
        'Must have a `fromTokenContractAddress` on the context',
        ErrorCodes.fromTokenContractAddressRequired
      )
    );
  });

  it('should throw if fromTokenContractAddress is invalid address', () => {
    // @ts-ignore
    const context: QuickswapPairContextForChainId = {
      fromTokenContractAddress: '1',
    };
    expect(() => new QuickswapPair(context)).toThrowError(
      new QuickswapError(
        '`fromTokenContractAddress` is not a valid contract address',
        ErrorCodes.fromTokenContractAddressNotValid
      )
    );
  });

  it('should throw if no toTokenContractAddress is passed in', () => {
    // @ts-ignore
    const context: QuickswapPairContextForChainId = {
      fromTokenContractAddress: MOCK1INCH().contractAddress,
    };
    expect(() => new QuickswapPair(context)).toThrowError(
      new QuickswapError(
        'Must have a `toTokenContractAddress` on the context',
        ErrorCodes.toTokenContractAddressRequired
      )
    );
  });

  it('should throw if toTokenContractAddress is invalid address', () => {
    // @ts-ignore
    const context: QuickswapPairContextForChainId = {
      fromTokenContractAddress: MOCK1INCH().contractAddress,
      toTokenContractAddress: '1',
    };
    expect(() => new QuickswapPair(context)).toThrowError(
      new QuickswapError(
        '`toTokenContractAddress` is not a valid contract address',
        ErrorCodes.toTokenContractAddressNotValid
      )
    );
  });

  it('should throw if no ethereumAddress is passed in', () => {
    // @ts-ignore
    const context: QuickswapPairContextForChainId = {
      fromTokenContractAddress: MOCK1INCH().contractAddress,
      toTokenContractAddress: MOCKAAVE().contractAddress,
    };
    expect(() => new QuickswapPair(context)).toThrowError(
      new QuickswapError(
        'Must have a `ethereumAddress` on the context',
        ErrorCodes.ethereumAddressRequired
      )
    );
  });

  it('should throw if ethereumAddress is invalid address', () => {
    // @ts-ignore
    const context: QuickswapPairContextForChainId = {
      fromTokenContractAddress: MOCK1INCH().contractAddress,
      toTokenContractAddress: MOCKAAVE().contractAddress,
      ethereumAddress: '1',
    };
    expect(() => new QuickswapPair(context)).toThrowError(
      new QuickswapError(
        '`ethereumAddress` is not a valid address',
        ErrorCodes.ethereumAddressNotValid
      )
    );
  });

  it('should throw if no chainId is passed in', () => {
    // @ts-ignore
    const context: QuickswapPairContextForChainId = {
      fromTokenContractAddress: MOCK1INCH().contractAddress,
      toTokenContractAddress: MOCKAAVE().contractAddress,
      ethereumAddress: MockEthereumAddress(),
    };
    expect(() => new QuickswapPair(context)).toThrowError(
      new QuickswapError(
        'You must have a chainId on the context.',
        ErrorCodes.youMustSupplyAChainId
      )
    );
  });

  it('should create ethers provider', () => {
    const context: QuickswapPairContextForChainId = {
      fromTokenContractAddress: MOCK1INCH().contractAddress,
      toTokenContractAddress: MOCKAAVE().contractAddress,
      ethereumAddress: MockEthereumAddress(),
      chainId: ChainId.MATIC,
      tradePath: TradePath.erc20ToErc20
    };

    const quickswapPair = new QuickswapPair(context);

    //@ts-ignore
    expect(typeof quickswapPair._ethersProvider).not.toBeUndefined();
  });

  it('should create ethers provider', () => {
    const context: QuickswapPairContextForProviderUrl = {
      fromTokenContractAddress: MOCK1INCH().contractAddress,
      toTokenContractAddress: MOCKAAVE().contractAddress,
      ethereumAddress: MockEthereumAddress(),
      chainId: ChainId.MATIC,
      providerUrl: MOCK_PROVIDER_URL(),
      tradePath: TradePath.erc20ToErc20
    };

    const quickswapPair = new QuickswapPair(context);

    //@ts-ignore
    expect(typeof quickswapPair._ethersProvider).not.toBeUndefined();
  });

  describe('createFactory', () => {
    it('should create a quickswap pair factory', async () => {
      const context: QuickswapPairContextForChainId = {
        fromTokenContractAddress: MOCK1INCH().contractAddress,
        toTokenContractAddress: MOCKAAVE().contractAddress,
        ethereumAddress: MockEthereumAddress(),
        chainId: ChainId.MATIC,
        tradePath: TradePath.erc20ToErc20
      };

      const quickswapPair = new QuickswapPair(context);
      const factory = await quickswapPair.createFactory();
      expect(factory.toToken).toEqual(MOCKAAVE());
      expect(factory.fromToken).toEqual(MOCK1INCH());
    });
  });
});
