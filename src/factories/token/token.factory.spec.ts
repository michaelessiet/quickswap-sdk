import { ChainId } from '../..';
import { ContractContext } from '../../common/contract-context';
import { EthersProvider } from '../../ethers-provider';
import { MOCK1INCH } from '../../mocks/1inch-token.mock';
import { MockEthereumAddress } from '../../mocks/ethereum-address.mock';
import { MOCK_PROVIDER_URL } from '../../mocks/provider-url.mock';
import { TokenFactory } from './token.factory';

describe('TokenFactory', () => {
  const ethersProvider = new EthersProvider(ChainId.MATIC, MOCK_PROVIDER_URL());
  const token = MOCK1INCH();

  const tokenFactory = new TokenFactory(token.contractAddress, ethersProvider,ChainId.MATIC);

  it('getToken', async () => {
    const result = await tokenFactory.getToken();
    expect(result).toEqual(token);
  });

  it('allowance', async () => {
    const result = await tokenFactory.allowance(MockEthereumAddress());
    expect(result).not.toBeUndefined();
  });

  it('generateApproveAllowanceData', () => {
    const result = tokenFactory.generateApproveAllowanceData(
      new ContractContext(ChainId.MATIC).routerAddress(),
      '0x05'
    );
    expect(result).toEqual(
      '0x095ea7b3000000000000000000000000a5e0829caced8ffdd4de3c43696c57f7d7a678ff0000000000000000000000000000000000000000000000000000000000000005'
    );
  });

  it('balanceOf', async () => {
    const result = await tokenFactory.balanceOf(MockEthereumAddress());
    expect(result).not.toBeUndefined();
  });

  it('totalSupply', async () => {
    const result = await tokenFactory.totalSupply();
    expect(result).toEqual('0x181c23647a808a16712b');
  });

  it('getAllowanceAndBalanceOf', async () => {
    const result = await tokenFactory.getAllowanceAndBalanceOf(
      MockEthereumAddress()
    );
    expect(result).toEqual({
      allowance: '0x00',
      balanceOf: '0x00',
    });
  });
});
