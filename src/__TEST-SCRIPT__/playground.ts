import { ChainId } from '../enums/chain-id';
import { TradePath } from '../enums/trade-path';
import { QuickswapPairSettings } from '../factories/pair/models/pair-settings';
import { QuickswapPair } from '../factories/pair/pair';

// WBTC - 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599
// FUN - 0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b
// REP - 0x1985365e9f78359a9B6AD760e32412f4a445E862
// WETH - 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
// AAVE - 0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9
// DAI - 0x6B175474E89094C44Da98b954EedeAC495271d0F
// 1INCH - 0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f

const routeTest = async () => {
  console.log(new Date().getTime());
  const fromTokenContractAddress = '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f'; //'0xEf0e839Cf88E47be676E72D5a9cB6CED99FaD1CF';
  const toTokenContractAddress = '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9'; // 0x1985365e9f78359a9B6AD760e32412f4a445E862
  const ethereumAddress = '0xB576f4Fac19eA8935A4BAA4F7AD5bc566A5845b1';

  const quickswapPair = new QuickswapPair({
    fromTokenContractAddress,
    toTokenContractAddress,
    ethereumAddress,
    chainId: ChainId.MATIC,
    tradePath: TradePath.erc20ToErc20,
    settings: new QuickswapPairSettings({
      // if not supplied it use `0.005` which is 0.5%;
      // all figures
      slippage: 0.005,
      // if not supplied it will use 20 a deadline minutes
      deadlineMinutes: 20,
      disableMultihops: false,
    }),
  });

  const quickswapPairFactory = await quickswapPair.createFactory();

  try {
    const trade = await quickswapPairFactory.trade('10');
    console.log(trade);

    console.log(new Date().getTime());
  } catch (error: any) {
    console.log(error.message);
  }

  process.stdin.resume();

  // console.log(JSON.stringify(trade));

  // const data = await QuickswapPairFactory.generateApproveMaxAllowanceData();
  // console.log(data);

  // const toToken = QuickswapPairFactory.toToken;
  // console.log(toToken);

  // const fromToken = QuickswapPairFactory.fromToken;
  // console.log(fromToken);

  // const tokenContractAddress = '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b';

  // const tokenFactoryPublic = new TokenFactoryPublic(
  //   fromTokenContractAddress,
  //   ChainId.MATIC
  // );

  // console.log(
  //   await tokenFactoryPublic.getAllowanceAndBalanceOf(ethereumAddress)
  // );

  // // the contract address for which you are allowing to move tokens on your behalf
  // const spender = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

  // // the amount you wish to allow them to move, this example just uses the max
  // // hex. If not each time they do a operation which needs to move tokens then
  // // it will cost them 2 transactions, 1 to approve the allowance then 1 to actually
  // // do the contract call to move the tokens.
  // const value =
  //   '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

  // const data = tokenFactoryPublic.generateApproveAllowanceData(spender, value);
  // console.log(data);
};

routeTest();
