import { isHexString } from 'ethers/lib/utils';
import { ChainId, WETH } from '../..';
import { EthersProvider } from '../../ethers-provider';
import { MOCK1INCH } from '../../mocks/1inch-token.mock';
import { MOCK_PROVIDER_URL } from '../../mocks/provider-url.mock';
import { QuickswapContractFactory } from './contract.factory';

describe('QuickswapContractFactory', () => {
  const ethersProvider = new EthersProvider(ChainId.MATIC, MOCK_PROVIDER_URL());

  const quickswapContractFactory = new QuickswapContractFactory(ethersProvider, ChainId.MATIC);

  it('allPairs', async () => {
    const result = await quickswapContractFactory.allPairs('0x01');
    expect(result).toEqual('0xbB60D1f9cbAeFA6845bf635db23Ea25a27A11E83');
  });

  it('allPairsLength', async () => {
    const result = await quickswapContractFactory.allPairsLength();
    expect(isHexString(result)).toEqual(true);
  });

  it('createPair', () => {
    const result = quickswapContractFactory.createPair(
      MOCK1INCH().contractAddress,
      WETH.MATIC().contractAddress
    );
    expect(result).toEqual(
      '0xc9c653960000000000000000000000009c2c5fd7b07e95ee044ddeba0e97a665f142394f0000000000000000000000007ceb23fd6bc0add59e62ac25578270cff1b9f619'
    );
  });

  it('feeTo', async () => {
    const result = await quickswapContractFactory.feeTo();
    expect(isHexString(result)).toEqual(true);
  });

  it('feeToSetter', async () => {
    const result = await quickswapContractFactory.feeToSetter();
    expect(isHexString(result)).toEqual(true);
  });

  it('getPair', async () => {
    const result = await quickswapContractFactory.getPair(
      WETH.MATIC().contractAddress,
      MOCK1INCH().contractAddress
    );
    expect(result).toEqual('0x94dFd065b57F2a857A693E40f399C51D6b76C739');
  });

  it('setFeeTo', async () => {
    const result = await quickswapContractFactory.setFeeTo(
      '0x05B0c1D8839eF3a989B33B6b63D3aA96cB7Ec142'
    );
    expect(result).toEqual(
      '0xf46901ed00000000000000000000000005b0c1d8839ef3a989b33b6b63d3aa96cb7ec142'
    );
  });

  it('setFeeToSetter', async () => {
    const result = await quickswapContractFactory.setFeeToSetter(
      '0x05B0c1D8839eF3a989B33B6b63D3aA96cB7Ec142'
    );
    expect(result).toEqual(
      '0xa2e74af600000000000000000000000005b0c1d8839ef3a989b33b6b63d3aa96cb7ec142'
    );
  });
});
