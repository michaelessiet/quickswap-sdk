import { ChainId, TokenFactoryPublic } from '../..';
import { ContractContext } from '../../common/contract-context';
import { MOCK1INCH } from '../../mocks/1inch-token.mock';
import { MockEthereumAddress } from '../../mocks/ethereum-address.mock';

describe('TokenFactoryPublic', () => {
  const token = MOCK1INCH();

  const tokenFactoryPublic = new TokenFactoryPublic(
    token.contractAddress,
    ChainId.MATIC
  );

  it('getToken', async () => {
    const result = await tokenFactoryPublic.getToken();
    expect(result).toEqual(token);
  });

  it('allowance', async () => {
    const result = await tokenFactoryPublic.allowance(MockEthereumAddress());
    expect(result).not.toBeUndefined();
  });

  it('generateApproveAllowanceData', () => {
    const result = tokenFactoryPublic.generateApproveAllowanceData(
      new ContractContext(ChainId.MATIC).routerAddress(),
      '0x05'
    );
    expect(result).toEqual(
      '0x095ea7b3000000000000000000000000a5e0829caced8ffdd4de3c43696c57f7d7a678ff0000000000000000000000000000000000000000000000000000000000000005'
    );
  });

  it('balanceOf', async () => {
    const result = await tokenFactoryPublic.balanceOf(MockEthereumAddress());
    expect(result).not.toBeUndefined();
  });

  it('totalSupply', async () => {
    const result = await tokenFactoryPublic.totalSupply();
    expect(result).toEqual('0x181c23647a808a16712b');
  });

  it('getAllowanceAndBalanceOf', async () => {
    const result = await tokenFactoryPublic.getAllowanceAndBalanceOf(
      MockEthereumAddress()
    );
    expect(result).toEqual({
      allowance: '0x00',
      balanceOf: '0x00',
    });
  });
});
