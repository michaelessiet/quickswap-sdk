# quickswap-sdk-lite

[![npm version](https://badge.fury.io/js/quickswap-sdk-lite.svg)](https://badge.fury.io/js/quickswap-sdk-lite)
![downloads](https://img.shields.io/npm/dw/quickswap-sdk-lite)

A Simple Quickswap SDK which handles the routes automatically for you, changes in trade quotes reactive subscriptions, exposure to formatted easy to understand information, bringing back the best trade quotes automatically, generating transactions for you and much more. All the Quickswap logic for you in a simple to easy understand interface to hook straight into your dApp without having to understand how it all works.

Please note this is not owned or maintained by quickswap and is a open source package for anyone to use freely.

## Features 🚀

🚀 Queries all the best routes and finds the best price for you
<br/>
🚀 Exposes all the route paths it tried so you can see every detail in how it worked out the best price
<br/>
🚀 Easy subscriptions to get alerted when the price moves or the trade expires
<br/>
🚀 The transaction is generated for you, just fill it with the gas details and send it on its way
<br/>
🚀 All the figures are all formatted for you, no need to worry about timing it back to its decimal formatted place, just render it straight onto your UI
<br/>
🚀 Exposes all the tokens metadata for you, name, symbol, decimals
<br/>
🚀 Uses [multicall](https://github.com/joshstevens19/ethereum-multicall) for every on chain lookup, so even though it could be doing 100 JSONRPC calls it is all put into a few calls meaning it can stay very fast
<br/>
🚀 Tidy bundle size
<br/>
🚀 Fully typescript supported with full generated typings
<br/>
🚀 Other cool internal stuff exposed for your use
<br/>

- 🚀query many tokens in 1 jsonrpc call perfect to get token metadata fast
  <br/>
- 🚀all the quickswap contracts are all exposed for your use with full typings if you wanted to call a more bespoke method
  <br/>
- 🚀 and much more!!

# Motivation

As a ethereum dApp developer you try to get your dApp experience as integrated as possible, Ethereum right now is hard to show in a web2.0 world as it is. On top of this as a developer you have to learn all the complex stuff for the blockchain which can take its toll on you.

When I was integrating quickswap on our wallet I found that they lacked a proper `SDK`. Deepdown from the dApp point of view I only really cared about getting the best price for the user with all the fees related. I also found myself having to write a lot of custom code which I thought could be abstracted away so nobody has to deal with that again. A lot of the quickswap features like routing is all done in their client itself which is great but not when you want to use it in a more integrated approach in your own dApp.

# Installing

## npm

```bash
$ npm install quickswap-sdk-lite
```

## yarn

```bash
$ yarn add quickswap-sdk-lite
```

# SDK guide

## Creating a quickswap pair factory

The quickswap pair factory is an instance which is joint together with the `from` token and the `to` token, it is all self contained in the instance and exposes easy methods for you to call to start using quickswap.

**Note**: In order to make use of the Polygon network or testnets make sure to provide your own `providerUrl`, as the default one is only that of the Ethereum mainnet

```ts
export class QuickswapPair {
  constructor(
    private _quickswapPairContext:
      | QuickswapPairContextForChainId
      | QuickswapPairContextForProviderUrl
)
```

```ts
export enum ChainId {
  MATIC = 137,
  MUMBAI = 80001,
}

interface QuickswapPairContextBase {
  fromTokenContractAddress: string;
  toTokenContractAddress: string;
  ethereumAddress: string;
  settings?: QuickswapPairSettings | undefined;
}

export interface QuickswapPairContextForChainId
  extends QuickswapPairContextBase {
  chainId: ChainId | number;
}

export interface QuickswapPairContextForProviderUrl
  extends QuickswapPairContextForChainId {
  providerUrl: string;
}
```

```ts
export class QuickswapPairSettings {
  slippage: number;
  deadlineMinutes: number;
  disableMultihops: boolean;

  constructor(settings?: {
    slippage?: number | undefined;
    deadlineMinutes?: number | undefined;
    disableMultihops?: boolean | undefined;
  }) {
    this.slippage = settings?.slippage || 0.005;
    this.deadlineMinutes = settings?.deadlineMinutes || 20;
    this.disableMultihops = settings?.disableMultihops || false;
  }
}
```

```ts
import { QuickswapPair, ChainId, TradePath } from 'quickswap-sdk-lite';

const quickswapPair = new QuickswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
  chainId: ChainId.MATIC,
  // the kind of transaction that should be carried out
  tradePath: TradePath.erc20ToErc20
  // you can pass in the provider url as well if you want
  providerUrl: YOUR_PROVIDER_URL,
  settings: new QuickswapPairSettings({
    // if not supplied it will use `0.005` which is 0.5%
    // please pass it in as a full number decimal so 0.7%
    // would be 0.007
    slippage: 0.005,
    // if not supplied it will use 20 a deadline minutes
    deadlineMinutes: 20,
    // if not supplied it will try to use multihops
    // if this is true it will require swaps to direct
    // pairs
    disableMultihops: false,
  }),
});

// now to create the factory you just do
const quickswapPair = await quickswapPair.createFactory();
```

## Catching error

I know randomly throwing errors with no error codes is a pain when writing dApps. In this package when we throw we have our own custom error. This has error codes you can map to what actually happened to allow your dApp to handle them gracefully.

```ts
export class QuickswapError extends Error {
  public name = "QuickswapError";
  public code: ErrorCodes;
  public message: string;
  constructor(message: string, code: ErrorCodes) {
    super(message);
    this.message = message;
    this.code = code;
  }
}
```

```ts
export enum ErrorCodes {
  noRoutesFound = 1,
  canNotFindChainId = 2,
  tokenChainIdContractDoesNotExist = 3,
  tradePathIsNotSupported = 4,
  generateApproveMaxAllowanceDataNotAllowed = 5,
  fromTokenContractAddressRequired = 6,
  fromTokenContractAddressNotValid = 7,
  toTokenContractAddressRequired = 8,
  toTokenContractAddressNotValid = 9,
  ethereumAddressRequired = 10,
  ethereumAddressNotValid = 11,
  youMustSupplyAChainId = 12,
  invalidFromOrToContractToken = 13,
}
```

## Quickswap pair factory

### toToken

This exposes the to token contract information, like decimals, symbol and name.

```ts
get toToken(): Token
```

```ts
export interface Token {
  chainId: ChainId;
  contractAddress: string;
  decimals: number;
  symbol: string;
  name: string;
}
```

#### Usage

```ts
import { QuickswapPair, ChainId, TradePath } from 'quickswap-sdk-lite';

const quickswapPair = new QuickswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
  chainId: ChainId.MATIC,
  // the kind of transaction that should be carried out
  tradePath: TradePath.erc20ToErc20
});

// now to create the factory you just do
const quickswapPairFactory = await quickswapPair.createFactory();

const toToken = quickswapPairFactory.toToken;
console.log(toToken);
// toToken:
{
  chainId: 137,
  contractAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
  decimals: 18,
  symbol: 'AAVE',
  name: 'Aave Token'
}
```

### fromToken

This exposes the from token contract information, like decimals, symbol and name.

```ts
get fromToken(): Token
```

```ts
export interface Token {
  chainId: ChainId;
  contractAddress: string;
  decimals: number;
  symbol: string;
  name: string;
}
```

#### Usage

```ts
import { QuickswapPair, ChainId } from 'quickswap-sdk-lite';

const quickswapPair = new QuickswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
  chainId: ChainId.MATIC,
  // the kind of transaction that should be carried out
  tradePath: TradePath.erc20ToErc20
});

// now to create the factory you just do
const quickswapPairFactory = await quickswapPair.createFactory();

const fromToken = quickswapPairFactory.fromToken;
console.log(fromToken);
// fromToken:
{
  chainId: 137,
  contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
  decimals: 18,
  symbol: '1INCH',
  name: '1INCH Token'
}
```

### Trade

This will generate you the trade with all the information you need to show to the user on the dApp. It will find the best route price for you automatically. You will still need to send the transaction if they confirm the swap, we generate the transaction for you but you will still need to estimate the gas and get them to sign and send it on the dApp once they confirm the swap.

It will also return a `hasEnoughAllowance` in the `TradeContext` trade response, if the allowance approved for moving tokens is below the amount sending to the quickswap router this will be false if not true. We still return the quote but if this is `false` you need to make sure you send the approval generated data first before being able to do the swap. We advise you check the allowance before you execute the trade which you should do anyway or it will fail onchain. You can use our `hasGotEnoughAllowance` method below to check and also our `generateApproveMaxAllowanceData` to generate the transaction for the user to appove moving of the tokens.

Please note `MUMBAI` will only use `WETH` or `WMATIC` as a main currency unlike `MATIC` which uses everything, so you will get less routes on the testnets.

```ts
async trade(amount: string): Promise<TradeContext>
```

```ts
export interface TradeContext {
  // the amount you requested to convert
  // this will be formatted in readable number
  // so you can render straight out the box
  baseConvertRequest: string;
  // the min amount you will receive taking off the slippage
  // if the price changes below that then
  // the quickswap contract will throw
  // this will be formatted in readable number
  // so you can render straight out the box
  minAmountConvertQuote: string;
  // the expected amount you will receive
  // this will be formatted in readable number
  // so you can render straight out the box
  expectedConvertQuote: string;
  // A portion of each trade (0.03%) goes to
  // liquidity providers as a protocol of
  // incentive
  liquidityProviderFee: string;
  // A unix datestamp in when this trade expires
  // if it does expiry while looking at it as long
  // as you are hooked onto `quoteChanged$` that will
  // emit you a new valid quote
  tradeExpires: number;
  // the route path mapped with full token info
  routePathTokenMap: Token[];
  // the route text so you can display it on the dApp easily
  routeText: string;
  // the pure route path, only had the arrays in nothing else
  routePath: string[];
  // full list of every route it tried with the expected convert quotes
  // this will be ordered from the best expected convert quote to worse [0] = best
  allTriedRoutesQuotes: {
    expectedConvertQuote: string;
    routePathArrayTokenMap: Token[];
    routeText: string;
    routePathArray: string[];
  }[];
  // if the allowance approved for moving tokens is below the amount sending to the
  // quickswap router this will be false if not true
  // this is not reactive so if you get the trade quote
  // and this returns false but then you do the approval
  // transaction, this old context will still say false
  hasEnoughAllowance: boolean;
  // the from token info
  fromToken: Token;
  // the to token info
  toToken: Token;
  // holds the from balance context
  // this is not reactive so if they top
  // up their account after this is generated
  // then you need to query that yourself
  // or regen the trade info
  fromBalance: {
    // if the balance of the users has enough to perform this trade, does not consider gas prices
    // right now if your doing ETH > ERC20
    hasEnough: boolean;
    // the total balance that user has on the from formatted for you already
    balance: string;
  };
  // this is the transaction you need to send if they approve the swap
  // it DOES not estimate gas so you should fill in those blanks before
  // you send it (most dApps have a picker to choose the speed)
  transaction: {
    to: string;
    from: string;
    data: string;
    value: string;
  };
  // this is a stream which emits if the quote has changed, this will emit
  // not matter what you should listen to this for the source of truth
  // for a reactive dApp. If you dont listen to this the user could end up
  // sending a quickswap transaction which price is now out of date
  quoteChanged$: Observable<TradeContext>;
  // when you generate a trade it does more then just return data, it makes
  // sure your data stays in sync with the `quoteChanged$`, so once you have
  // finished with a trade please call this to do a general clear up so we do
  // not keep timeouts and streams running.
  // when you call this it will kill all `quoteChanged$` subscriptions and
  // some watcher timeouts. If you execute a new trade with a new amount on
  // the same instance it will clear it for you.
  destroy: () => void;
}
```

```ts
export interface Token {
  chainId: ChainId;
  contractAddress: string;
  decimals: number;
  symbol: string;
  name: string;
}

export enum ChainId {
  MATIC = 137,
  MUMBAI = 80001,
}
```

#### Usage

#### ERC20 > ERC20

```ts
import { QuickswapPair, ChainId, TradeContext } from 'quickswap-sdk-lite';

const quickswapPair = new QuickswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
  chainId: ChainId.MATIC,
  // the kind of transaction that should be carried out
  tradePath: TradePath.erc20ToErc20
});

// now to create the factory you just do
const quickswapPairFactory = await quickswapPair.createFactory();

// the amount is the proper entered amount
// so if they enter 10 pass in 10
// it will work it all out for you
const trade = await quickswapPairFactory.trade('10');

// subscribe to quote changes
trade.quoteChanged$.subscribe((value: TradeContext) => {
  // value will hold the same info as below but obviously with
  // the new trade info.
});

console.log(trade);
{
  baseConvertRequest: '10',
  minAmountConvertQuote: '0.014400465273974444',
  expectedConvertQuote: '0.014730394044348867',
  liquidityProviderFee: '0.030000000000000000',
  tradeExpires: 1612189240,
  routePathTokenMap: [
     {
       chainId: 137,
       contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
       decimals: 18,
       symbol: '1INCH',
       name: '1INCH Token'
     },
     {
       chainId: 137,
       contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
       decimals: 18,
       symbol: 'DAI',
       name: '(PoS) Dai Stablecoin'
     },
     {
       chainId: 137,
       contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
       decimals: 18,
       symbol: 'WETH',
       name: 'Wrapped Ether'
     },
     {
       chainId: 137,
       contractAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
       decimals: 18,
       symbol: 'AAVE',
       name: 'Aave Token'
     }
   ],
  routeText: '1INCH > DAI > WETH > AAVE',
  routePath:['0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f', '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619','0xD6DF932A45C0f255f85145f286eA0b292B21C90B' ],
  allTriedRoutesQuotes: [
      {
        expectedConvertQuote: '0.014730394044348867',
        routePathArrayTokenMap: [
          {
            chainId: 137,
            contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
            symbol: 1INCH,
            decimals: 18,
            name: '1INCH Token',
          },
          {
            chainId: 137,
            contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            decimals: 18,
            symbol: 'WETH',
            name: 'Wrapped Ether',
          },
          {
            chainId: 137,
            contractAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
            symbol: 'AAVE',
            decimals: 18,
            name: 'Aave Token',
          },
        ],
        routeText: '1INCH > WETH > AAVE',
        routePathArray: [
          '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
        ],
      },
      {
        expectedConvertQuote: '0.014606303273323544',
        routePathArrayTokenMap: [
          {
            chainId: 137,
            contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
            symbol: '1INCH',
            decimals: 18,
            name: '1INCH Token',
          },
          {
            chainId: 137,
            contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
            decimals: 18,
            symbol: 'DAI',
            name: '(PoS) Dai Stablecoin',
          },
          {
            chainId: 137,
            contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            decimals: 18,
            symbol: 'WETH',
            name: 'Wrapped Ether',
          },
          {
            chainId: 137,
            contractAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
            symbol: 'AAVE',
            decimals: 18,
            name: 'Aave Token',
          },
        ],
        routeText: '1INCH > DAI > WETH > AAVE',
        routePathArray: [
          '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
        ],
      },
      {
        expectedConvertQuote: '0.013997397994408657',
        routePathArrayTokenMap: [
          {
            chainId: 137,
            contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
            symbol: '1INCH',
            decimals: 18,
            name: '1INCH Token',
          },
          {
            chainId: 137,
            contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
            decimals: 18,
            symbol: 'USDC',
            name: 'USD Coin (PoS)',
          },
          {
            chainId: 137,
            contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            decimals: 18,
            symbol: 'WETH',
            name: 'Wrapped Ether',
          },
          {
            chainId: 137,
            contractAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
            symbol: 'AAVE',
            decimals: 18,
            name: 'Aave Token',
          },
        ],
        routeText: '1INCH > USDC > WETH > AAVE',
        routePathArray: [
          '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
        ],
      },
      {
        expectedConvertQuote: '0.000000298264906505',
        routePathArrayTokenMap: [
          {
            chainId: 137,
            contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
            symbol: '1INCH',
            decimals: 18,
            name: '1INCH Token',
          },
          {
            chainId: 137,
            contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
            decimals: 18,
            symbol: 'USDT',
            name: '(PoS) Tether USD',
          },
          {
            chainId: 137,
            contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
            decimals: 18,
            symbol: 'WETH',
            name: 'Wrapped Ether',
          },
          {
            chainId: 137,
            contractAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
            symbol: 'AAVE',
            decimals: 18,
            name: 'Aave Token',
          },
        ],
        routeText: '1INCH > USDT > WETH > AAVE',
        routePathArray: [
          '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
        ],
      },
  ],
  hasEnoughAllowance: true,
  toToken: {
    chainId: 137,
    contractAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
    decimals: 18,
    symbol: 'AAVE',
    name: 'Aave Token'
  },
  fromToken: {
    chainId: 137,
    contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
    decimals: 18,
    symbol: '1INCH',
    name: '1INCH Token'
  },
  fromBalance: {
    hasEnough: true,
    balance: "3317.73129463"
  },
  transaction: {
    to: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
    from: "0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9",
    data:"0x38ed1739000000000000000000000000000000000000000000000000000000003b9aca0000000000000000000000000000000000000000000000000000359578d85cf61000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000b1e6079212888f0be0cf55874b2eb9d7a5e02cd900000000000000000000000000000000000000000000000000000000601683e30000000000000000000000000000000000000000000000000000000000000003000000000000000000000000419d0d8bdd9af5e606ae2232ed285aff190e711b000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000001985365e9f78359a9b6ad760e32412f4a445e862",
    value: "0x00"
  }
}

// once done with trade aka they have sent it and you don't need it anymore call
trade.destroy();
```

#### ETH > ERC20

```ts
import { QuickswapPair, WETH, TradePath, ChainId, TradeContext } from 'quickswap-sdk-lite';

const quickswapPair = new QuickswapPair({
  // use the WETH import from the lib, bare in mind you should use the
  // network which yours on, so if your on rinkeby you should use
  // WETH.RINKEBY
  fromTokenContractAddress: WETH.MATIC().contractAddress,
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
  chainId: ChainId.MATIC,
  // the kind of transaction that should be carried out
  tradePath: TradePath.ethToErc20
});

// now to create the factory you just do
const quickswapPairFactory = await quickswapPair.createFactory();

// the amount is the proper entered amount
// so if they enter 10 pass in 10 and
// it will work it all out for you
const trade = await quickswapPairFactory.trade('10');


// subscribe to quote changes
trade.quoteChanged$.subscribe((value: TradeContext) => {
  // value will hold the same info as below but obviously with
  // the new trade info.
});

console.log(trade);
{
  baseConvertRequest: '10',
  minAmountConvertQuote: '446878.20758208',
  expectedConvertQuote: '449123.82671566',
  liquidityProviderFee: '0.030000000000000000',
  tradeExpires: 1612189240,
  routePathTokenMap: [
    {
      chainId: 137,
      contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      symbol: 'WETH',
      decimals: 18,
      name: 'Wrapped Ether',
    },
    {
      chainId: 137,
      contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      symbol: '1INCH',
      decimals: 18,
      name: '1INCH Token',
    },
  ],
  routeText: 'WETH > 1INCH',
  routePath: [
    '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
  ],
  hasEnoughAllowance: true,
  toToken: {
    chainId: 137,
    contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
    symbol: '1INCH',
    decimals: 18,
    name: '1INCH Token',
  },
  fromToken: {
    chainId: 137,
    contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    symbol: 'WETH',
    decimals: 18,
    name: 'Wrapped Ether',
  },
  fromBalance: {
    hasEnough: false,
    balance: '0.008474677789598637',
  },
  transaction: {
    to: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    from: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
    data:
      '0x7ff36ab5000000000000000000000000000000000000000000000000000028a4b1ae9cc00000000000000000000000000000000000000000000000000000000000000080000000000000000000000000b1e6079212888f0be0cf55874b2eb9d7a5e02cd90000000000000000000000000000000000000000000000000000000060168ee30000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000419d0d8bdd9af5e606ae2232ed285aff190e711b',
    value: '0x8ac7230489e80000',
  },
  allTriedRoutesQuotes: [
    {
      expectedConvertQuote: '449123.82671566',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '446400.4834047',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDC > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '446400.4834047',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDC > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '446356.68778218',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDT > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '446356.68778218',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDT > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '446345.24608428',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > DAI > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '446345.24608428',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > DAI > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '347402.73288796',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > DAI > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '346246.52439964',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDC > DAI > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '346246.52439964',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDC > DAI > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '346246.52439964',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDC > DAI > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '345845.48248206',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDT > DAI > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '345845.48248206',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDT > DAI > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '345845.48248206',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDT > DAI > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '153353.27776886',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDC > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '153171.51955671',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) (PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > DAI > USDC > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '153171.51955671',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > DAI > USDC > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '153171.51955671',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > DAI > USDC > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '153099.84287111',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDT > USDC > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '153099.84287111',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDT > USDC > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '153099.84287111',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDT > USDC > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '10090.42827381',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > COMP > DAI > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '10090.42827381',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > COMP > DAI > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '176.25846115',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > COMP > USDC > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '176.25846115',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > COMP > USDC > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDC > USDT > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > DAI > USDT > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDC > USDT > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDT > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > COMP > USDT > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > DAI > USDT > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > DAI > USDT > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > COMP > USDT > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
      ],
      routeText: 'WETH > USDC > USDT > 1INCH',
      routePathArray: [
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      ],
    },
  ],
}

// once done with trade aka they have sent it and you don't need it anymore call
trade.destroy();

```

#### ERC20 > ETH

```ts
import { QuickswapPair, WETH, ChainId, TradeContext, TradePath } from 'quickswap-sdk-lite';

const quickswapPair = new QuickswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
  // use the WETH import from the lib, bare in mind you should use the
  // network which yours on, so if your on rinkeby you should use
  // WETH.RINKEBY
  toTokenContractAddress: WETH.MATIC().contractAddress,
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
  chainId: ChainId.MATIC,
  // the kind of transaction that should be carried out
  tradePath: TradePath.erc20ToEth
});

// now to create the factory you just do
const quickswapPairFactory = await quickswapPair.createFactory();

// the amount is the proper entered amount
// so if they enter 10 pass in 10
// it will work it all out for you
const trade = await quickswapPairFactory.trade('10');

// subscribe to quote changes
trade.quoteChanged$.subscribe((value: TradeContext) => {
  // value will hold the same info as below but obviously with
  // the new trade info.
});

console.log(trade);
{
  baseConvertRequest: '10',
  minAmountConvertQuote: '0.00022040807282109',
  expectedConvertQuote: '0.00022151807282109',
  liquidityProviderFee: '0.03000000',
  tradeExpires: 1612189240,
  routePathTokenMap: [
    {
      chainId: 137,
      contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
      symbol: '1INCH',
      decimals: 18,
      name: '1INCH Token',
    },
    {
      chainId: 137,
      contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      decimals: 18,
      symbol: 'DAI',
      name: '(PoS) Dai Stablecoin',
    },
    {
      chainId: 137,
      contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
      decimals: 18,
      symbol: 'COMP',
      name: 'Compound',
    },
    {
      chainId: 137,
      contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      symbol: 'WETH',
      decimals: 18,
      name: 'Wrapped Ether',
    },
  ],
  routeText: '1INCH > DAI > COMP > WETH',
  routePath: [
    '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  ],
  allTriedRoutesQuotes: [
    {
      expectedConvertQuote: '0.00022151807282109',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > DAI > COMP > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.00022151807282109',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > DAI > COMP > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000217400884509221',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000216692105524981',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > DAI > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000216165414503092',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > DAI > USDC > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000216165414503092',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > DAI > USDC > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000216165414503092',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > DAI > USDC > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000216113740987982',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > DAI > USDT > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000216113740987982',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > DAI > USDT > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000216113740987982',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > DAI > USDT > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000207416610491746',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDC > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000206879660311982',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDC > USDT > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000206879660311982',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDC > USDT > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000206879660311982',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDC > USDT > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000206675889551395',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDC > DAI > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000206675889551395',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDC > DAI > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000206675889551395',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDC > DAI > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000201332888879835',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDC > COMP > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000201332888879835',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDC > COMP > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.00000000454541448',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDT > COMP > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.00000000454541448',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDT > COMP > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000000004421040886',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDT > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000000004406314787',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDT > DAI > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000000004406314787',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDT > DAI > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000000004406314787',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          decimals: 18,
          symbol: 'DAI',
          name: '(PoS) Dai Stablecoin',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDT > DAI > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000000003689610342',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDT > USDC > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000000003689610342',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDT > USDC > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
    {
      expectedConvertQuote: '0.000000003689610342',
      routePathArrayTokenMap: [
        {
          chainId: 137,
          contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
          symbol: '1INCH',
          decimals: 18,
          name: '1INCH Token',
        },
        {
          chainId: 137,
          contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          decimals: 18,
          symbol: 'USDT',
          name: '(PoS) Tether USD',
        },
        {
          chainId: 137,
          contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin (PoS)',
        },
        {
          chainId: 137,
          contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
          symbol: 'WETH',
          decimals: 18,
          name: 'Wrapped Ether',
        },
      ],
      routeText: '1INCH > USDT > USDC > WETH',
      routePathArray: [
        '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      ],
    },
  ],
  hasEnoughAllowance: true,
  toToken: {
    chainId: 137,
    contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    symbol: 'WETH',
    decimals: 18,
    name: 'Wrapped Ether',
  },
  fromToken: {
    chainId: 137,
    contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
    symbol: '1INCH',
    decimals: 18,
    name: '1INCH Token',
  },
  fromBalance: {
    hasEnough: true,
    balance: '3317.73129463',
  },
  transaction: {
    to: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    from: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
    data:
      '0x18cbafe5000000000000000000000000000000000000000000000000000000003b9aca000000000000000000000000000000000000000000000000000000c875c0e2d96200000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000b1e6079212888f0be0cf55874b2eb9d7a5e02cd90000000000000000000000000000000000000000000000000000000060168fe80000000000000000000000000000000000000000000000000000000000000004000000000000000000000000419d0d8bdd9af5e606ae2232ed285aff190e711b0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000c00e94cb662c3520282e6f5717214004a7f26888000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    value: '0x00',
  },
}

// once done with trade aka they have sent it and you don't need it anymore call
trade.destroy();
```

### hasGotEnoughAllowance

This method will return `true` or `false` if the user has enough allowance to move the tokens. If you call this when doing `eth` > `erc20` it will always return true as you only need to check this when moving `erc20 > eth` and `erc20 > erc20`.

```ts
async hasGotEnoughAllowance(amount: string): Promise<boolean>
```

#### Usage

```ts
import { QuickswapPair, ChainId, TradePath } from "quickswap-sdk-lite";

const quickswapPair = new QuickswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
  // the contract address of the token you want to convert TO
  toTokenContractAddress: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: "0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9",
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
  chainId: ChainId.MATIC,
  // the kind of transaction that should be carried out
  tradePath: TradePath.erc20ToErc20,
});

// now to create the factory you just do
const quickswapPairFactory = await quickswapPair.createFactory();

const hasGotEnoughAllowance = await quickswapPairFactory.hasGotEnoughAllowance(
  "10"
);
console.log(hasGotEnoughAllowance);
true;
```

### allowance

This method will return the allowance the user has to move tokens from the from token they have picked. This is always returned as a hex and is not formatted for you. If you call this when doing `eth` > `erc20` it will always return the max hex as you only need to check this when moving `erc20 > eth` and `erc20 > erc20`.

```ts
async allowance(): Promise<string>
```

#### Usage

```ts
import { QuickswapPair, ChainId, TradePath } from "quickswap-sdk-lite";

const quickswapPair = new QuickswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
  // the contract address of the token you want to convert TO
  toTokenContractAddress: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: "0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9",
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
  chainId: ChainId.MATIC,
  // the kind of transaction that should be carried out
  tradePath: TradePath.erc20ToErc20,
});

// now to create the factory you just do
const quickswapPairFactory = await quickswapPair.createFactory();

const allowance = await quickswapPairFactory.allowance();
console.log(allowance);
// '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
```

### generateApproveMaxAllowanceData

This method will generate the transaction for the approval of moving tokens for the user. This uses the max hex possible which means they will not have to do this again if they want to swap from the SAME from token again later. Please note the approval is per each erc20 token, so if they picked another from token after they swapped they would need to do this again. You have to send and sign the transaction from within your dApp. Remember when they do not have enough allowance it will mean doing 2 transaction, 1 to extend the allowance using this transaction then the next one to actually execute the trade. If you call this when doing `eth` > `erc20` it will always throw an error as you only need to do this when moving `erc20 > eth` and `erc20 > erc20`.

```ts
async generateApproveMaxAllowanceData(): Promise<Transaction>
```

```ts
export interface Transaction {
  to: string;
  from: string;
  data: string;
  value: string;
}
```

#### Usage

```ts
import { QuickswapPair, ChainId } from 'quickswap-sdk-lite';

// the contract address of the token you want to convert FROM
const fromTokenContractAddress = '0xD6DF932A45C0f255f85145f286eA0b292B21C90B';
// the contract address of the token you want to convert TO
const toTokenContractAddress = '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f';
// the ethereum address of the user using this part of the dApp
const ethereumAddress = '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9';

const quickswapPair = new QuickswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
  chainId: ChainId.MATIC,
});

// now to create the factory you just do
const quickswapPairFactory = await quickswapPair.createFactory();

const transaction = await quickswapPairFactory.generateApproveMaxAllowanceData();
console.log(transaction);
{
  to: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
  from: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
  data:
   '0x095ea7b30000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  value: '0x00'
}
```

### findBestRoute

This method will return you the best route for the amount you want to trade.

```ts
async findBestRoute(amountToTrade: string): Promise<RouteQuote>
```

#### Usage

```ts
import { QuickswapPair, ChainId, TradePath } from 'quickswap-sdk-lite';

const quickswapPair = new QuickswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
  chainId: ChainId.MATIC,
  // the kind of transaction that should be carried out
  tradePath: TradePath.erc20ToErc20
});

// now to create the factory you just do
const quickswapPairFactory = await quickswapPair.createFactory();

const bestRoute = await quickswapPairFactory.findBestRoute('10');
console.log(bestRoute);
{
  expectedConvertQuote: "0.014634280991384697",
  routePathArrayTokenMap: [
      {
        chainId: 137,
        contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
        decimals: 18,
        symbol: '1INCH',
        name: '1INCH Token'
      },
      {
        chainId: 137,
        contractAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        decimals: 18,
        symbol: 'DAI',
        name: '(PoS) Dai Stablecoin',
      },
     {
       chainId: 137,
       contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
       decimals: 18,
       symbol: 'WETH',
       name: 'Wrapped Ether'
     },
     { chainId: 137,
       contractAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
       decimals: 18,
       symbol: 'AAVE',
       name: 'Aave Token'
      }
    ],
  routeText: '1INCH > WETH > AAVE',
  routePathArray: ['0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f', '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619' '0xD6DF932A45C0f255f85145f286eA0b292B21C90B']
}
```

### findAllPossibleRoutesWithQuote

This method will return you all the possible routes with quotes ordered by the best quote first (index 0).

```ts
async findAllPossibleRoutesWithQuote(amountToTrade: string): Promise<RouteQuote[]>
```

#### Usage

```ts
import { QuickswapPair, ChainId, TradePath } from "quickswap-sdk-lite";

const quickswapPair = new QuickswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
  // the contract address of the token you want to convert TO
  toTokenContractAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: "0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9",
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
  chainId: ChainId.MATIC,
  // the kind of transaction that should be carried out
  tradePath: TradePath.erc20ToErc20,
});

// now to create the factory you just do
const quickswapPairFactory = await quickswapPair.createFactory();

const allPossibleRoutes = await quickswapPairFactory.findAllPossibleRoutesWithQuote(
  "10"
);
console.log(allPossibleRoutes);
[
  {
    expectedConvertQuote: "0.014634280991384697",
    routePathArrayTokenMap: [
      {
        chainId: 137,
        contractAddress: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
        decimals: 18,
        symbol: "1INCH",
        name: "1INCH Token",
      },
      {
        chainId: 137,
        contractAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        decimals: 18,
        symbol: "DAI",
        name: "(PoS) Dai Stablecoin",
      },
      {
        chainId: 137,
        contractAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        decimals: 18,
        symbol: "WETH",
        name: "Wrapped Ether",
      },
      {
        chainId: 137,
        contractAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
        decimals: 18,
        symbol: "AAVE",
        name: "Aave Token",
      },
    ],
    routeText: "1INCH > DAI > WETH > AAVE",
    routePathArray: [
      "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
      "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
    ],
  },
  {
    expectedConvertQuote: "0.014506490902564688",
    routePathArrayTokenMap: [
      {
        chainId: 137,
        contractAddress: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
        decimals: 18,
        symbol: "1INCH",
        name: "1INCH Token",
      },
      {
        chainId: 137,
        contractAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        decimals: 18,
        symbol: "WETH",
        name: "Wrapped Ether",
      },
      {
        chainId: 137,
        contractAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
        decimals: 18,
        symbol: "AAVE",
        name: "Aave Token",
      },
    ],
    routeText: "1INCH > WETH > AAVE",
    routePathArray: [
      "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
      "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
    ],
  },
  {
    expectedConvertQuote: "0.011506490902564688",
    routePathArrayTokenMap: [
      {
        chainId: 137,
        contractAddress: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
        decimals: 18,
        symbol: "1INCH",
        name: "1INCH Token",
      },
      {
        chainId: 137,
        contractAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        decimals: 18,
        symbol: "USDC",
        name: "USD Coin (PoS)",
      },
      {
        chainId: 137,
        contractAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        decimals: 18,
        symbol: "WETH",
        name: "Wrapped Ether",
      },
      {
        chainId: 137,
        contractAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
        decimals: 18,
        symbol: "AAVE",
        name: "Aave Token",
      },
    ],
    routeText: "1INCH > USDC > WETH > AAVE",
    routePathArray: [
      "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
      "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
    ],
  },
  {
    expectedConvertQuote: "0.000000291402712857",
    routePathArrayTokenMap: [
      {
        chainId: 137,
        contractAddress: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
        decimals: 18,
        symbol: "1INCH",
        name: "1INCH Token",
      },
      {
        chainId: 137,
        contractAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        decimals: 18,
        symbol: "USDT",
        name: "(PoS) Tether USD",
      },
      {
        chainId: 137,
        contractAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        decimals: 18,
        symbol: "WETH",
        name: "Wrapped Ether",
      },
      {
        chainId: 137,
        contractAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
        decimals: 18,
        symbol: "AAVE",
        name: "Aave Token",
      },
    ],
    routeText: "1INCH > USDT > WETH > AAVE",
    routePathArray: [
      "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
      "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
    ],
  },
];
```

### findAllPossibleRoutes

This method will return you the all the possible routes you can take when trading.

```ts
async findAllPossibleRoutes(): Promise<Token[][]>
```

```ts
export interface Token {
  chainId: ChainId;
  contractAddress: string;
  decimals: number;
  symbol: string;
  name: string;
}
```

#### Usage

```ts
import { QuickswapPair, ChainId, TradePath } from "quickswap-sdk-lite";

const quickswapPair = new QuickswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
  // the contract address of the token you want to convert TO
  toTokenContractAddress: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: "0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9",
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
  chainId: ChainId.MATIC,
  // the kind of transaction that should be carried out
  tradePath: TradePath.erc20ToErc20,
});

// now to create the factory you just do
const quickswapPairFactory = await quickswapPair.createFactory();

const allRoutes = await quickswapPairFactory.findAllPossibleRoutes();
console.log(allRoutes);
[
  [
    {
      chainId: 137,
      contractAddress: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
      decimals: 18,
      symbol: "1INCH",
      name: "1INCH Token",
    },
    {
      chainId: 137,
      contractAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      decimals: 18,
      symbol: "WETH",
      name: "Wrapped Ether",
    },
    {
      chainId: 137,
      contractAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
      decimals: 18,
      symbol: "AAVE",
      name: "Aave Token",
    },
  ],
  [
    {
      chainId: 137,
      contractAddress: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
      decimals: 18,
      symbol: "1INCH",
      name: "1INCH Token",
    },
    {
      chainId: 137,
      contractAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      decimals: 18,
      symbol: "USDT",
      name: "(PoS) Tether USD",
    },
    {
      chainId: 137,
      contractAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      decimals: 18,
      symbol: "WETH",
      name: "Wrapped Ether",
    },
    {
      chainId: 137,
      contractAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
      decimals: 18,
      symbol: "AAVE",
      name: "Aave Token",
    },
  ],
  [
    {
      chainId: 137,
      contractAddress: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
      decimals: 18,
      symbol: "1INCH",
      name: "1INCH Token",
    },
    {
      chainId: 137,
      contractAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      decimals: 18,
      symbol: "USDC",
      name: "USD Coin (PoS)",
    },
    {
      chainId: 137,
      contractAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      decimals: 18,
      symbol: "WETH",
      name: "Wrapped Ether",
    },
    {
      chainId: 137,
      contractAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
      decimals: 18,
      symbol: "AAVE",
      name: "Aave Token",
    },
  ],
  [
    {
      chainId: 137,
      contractAddress: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
      decimals: 18,
      symbol: "1INCH",
      name: "1INCH Token",
    },
    {
      chainId: 137,
      contractAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      decimals: 18,
      symbol: "DAI",
      name: "(PoS) Dai Stablecoin",
    },
    {
      chainId: 137,
      contractAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      decimals: 18,
      symbol: "WETH",
      name: "Wrapped Ether",
    },
    {
      chainId: 137,
      contractAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
      decimals: 18,
      symbol: "AAVE",
      name: "Aave Token",
    },
  ],
];
```

## TokenFactoryPublic

Along side the above we also have exposed some helpful erc20 token calls.

### getToken

This method will return you the token information like decimals, name etc.

```ts
async getToken(): Promise<Token>
```

```ts
export interface Token {
  chainId: ChainId;
  contractAddress: string;
  decimals: number;
  symbol: string;
  name: string;
}
```

#### Usage

```ts
import { TokenFactoryPublic, ChainId } from 'quickswap-sdk-lite';

const tokenContractAddress = '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f';

const tokenFactoryPublic = new TokenFactoryPublic(
  toTokenContractAddress,
  ChainId.MATIC
);

const token = await tokenFactoryPublic.getToken();
console.log(token);
{
  chainId: 137,
  contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
  decimals: 18,
  symbol: '1INCH',
  name: '1INCH Token',
},
```

### allowance

This method will return the allowance the user has allowed to be able to be moved on his behalf. Quickswap needs this allowance to be higher then the amount swapping for it to be able to move the tokens for the user. This is always returned as a hex and not formatted for you.

```ts
async allowance(ethereumAddress: string): Promise<string>
```

#### Usage

```ts
import { TokenFactoryPublic, ChainId } from "quickswap-sdk-lite";

const tokenContractAddress = "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f";

const tokenFactoryPublic = new TokenFactoryPublic(
  toTokenContractAddress,
  ChainId.MATIC
);

const ethereumAddress = "0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9";

const allowance = await tokenFactoryPublic.allowance(ethereumAddress);
console.log(allowance);
// '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
```

### balanceOf

This method will return the balance this user holds of this token. This always returned as a hex and not formatted for you.

```ts
async balanceOf(ethereumAddress: string): Promise<string>
```

#### Usage

```ts
import { TokenFactoryPublic, ChainId } from "quickswap-sdk-lite";

const tokenContractAddress = "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f";

const tokenFactoryPublic = new TokenFactoryPublic(
  toTokenContractAddress,
  ChainId.MATIC
);

const ethereumAddress = "0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9";

const balanceOf = await tokenFactoryPublic.balanceOf(ethereumAddress);
console.log(balanceOf);
// '0x00';
```

### totalSupply

This method will return the total supply of tokens which exist. This always returned as a hex.

```ts
async totalSupply(): Promise<string>
```

#### Usage

```ts
import { TokenFactoryPublic, ChainId } from "quickswap-sdk-lite";

const tokenContractAddress = "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f";

const tokenFactoryPublic = new TokenFactoryPublic(
  toTokenContractAddress,
  ChainId.MATIC
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
);

const totalSupply = await tokenFactoryPublic.totalSupply();
console.log(totalSupply);
// '0x09195731e2ce35eb000000';
```

### generateApproveAllowanceData

This method will generate the data for the approval of being able to move tokens for the user. You have to send the transaction yourself, this only generates the data for you to send.

```ts
generateApproveAllowanceData(spender: string, value: string): string
```

#### Usage

```ts
import { TokenFactoryPublic, ChainId } from "quickswap-sdk-lite";

const tokenContractAddress = "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f";

const tokenFactoryPublic = new TokenFactoryPublic(
  tokenContractAddress,
  ChainId.MATIC
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
);

// the contract address for which you are allowing to move tokens on your behalf
const spender = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";

// the amount you wish to allow them to move, this example just uses the max
// hex. If not each time they do a operation which needs to move tokens then
// it will cost them 2 transactions, 1 to approve the allowance then 1 to actually
// do the contract call to move the tokens.
const value =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

const data = tokenFactoryPublic.generateApproveAllowanceData(spender, value);
console.log(data);
// '0x095ea7b30000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
```

### getAllowanceAndBalanceOf

This method will get the allowance and balance for the token in a multicall request. Will return as hex and NOT formatted for you.

```ts
async getAllowanceAndBalanceOf(ethereumAddress: string): Promise<AllowanceAndBalanceOf>
```

```ts
export interface AllowanceAndBalanceOf {
  allowance: string;
  balanceOf: string;
}
```

#### Usage

```ts
import { TokenFactoryPublic, ChainId } from 'quickswap-sdk-lite';

const tokenContractAddress = '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f';

const tokenFactoryPublic = new TokenFactoryPublic(
  tokenContractAddress,
  ChainId.MATIC
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
);

const ethereumAddress = '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9';

const result = await tokenFactoryPublic.getAllowanceAndBalanceOf(
  ethereumAddress
);
console.log(result);
{
  allowance: '0x2386f01852b720',
  balanceOf: '0x4d3f3832f7'
}
```

## TokensFactoryPublic

Along side the `TokenFactoryPublic` we also have exposed a way to call many contracts at once, this uses `multicall` so its super fast.

### getTokens

This method will return you the tokens information like decimals, name etc.

```ts
async getTokens(tokenContractAddresses: string[]): Promise<Token[]>
```

```ts
export interface Token {
  chainId: ChainId;
  contractAddress: string;
  decimals: number;
  symbol: string;
  name: string;
}
```

#### Usage

```ts
import { TokensFactoryPublic, ChainId } from "quickswap-sdk-lite";

const tokensFactoryPublic = new TokensFactoryPublic(
  ChainId.MATIC
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
);

const tokens = await tokensFactoryPublic.getTokens([
  "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
  "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
]);
console.log(tokens);
[
  {
    chainId: 137,
    contractAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
    symbol: "AAVE",
    decimals: 18,
    name: "Aave Token",
  },
  {
    chainId: 137,
    contractAddress: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
    symbol: "1INCH",
    decimals: 18,
    name: "1INCH Token",
  },
];
```

### Contract calls

Along side this we also expose in here the quickswap pair contract calls. Any methods which are state changing will return you the data and you will have to send it. Only use these if your doing any bespoke stuff with pairs. The `QuickswapPairContractFactoryPublic` is also exposed in the package which you can pass it a chainId or a providerUrl

```ts
export interface QuickswapPair {
  async allPairs(
    parameter0: BigNumberish,
  ): Promise<string>;

  async allPairsLength(): Promise<string>;

  // state changing
  async createPair(
    tokenA: string,
    tokenB: string,
  ): Promise<string>;

  async feeTo(): Promise<string>;

  async feeToSetter(): Promise<string>;

  async getPair(
    parameter0: string,
    parameter1: string,
  ): Promise<string>;

  // state changing
  async setFeeTo(
    _feeTo: string,
  ): Promise<string>;

  // state changing
  async setFeeToSetter(
    _feeToSetter: string,
  ): Promise<string>;
```

#### Usage

#### In QuickswapPairFactory

```ts
import { QuickswapPair, ChainId, TradePath } from 'quickswap-sdk-lite';

// the contract address of the token you want to convert FROM
const fromTokenContractAddress = '0xD6DF932A45C0f255f85145f286eA0b292B21C90B';
// the contract address of the token you want to convert TO
const toTokenContractAddress = '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f';
// the ethereum address of the user using this part of the dApp
const ethereumAddress = '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9';

const quickswapPair = new QuickswapPair(
  toTokenContractAddress,
  fromTokenContractAddress,
  ethereumAddress,
  ChainId.MATIC
  tradePath: TradePath.erc20ToErc20
  providerUrl: YOUR_PROVIDER_URL,
);

// now to create the factory you just do
const quickswapPairFactory = await quickswapPair.createFactory();

// contract calls here, are only for the quickswap pair contract https://polygonscan.com/address/0x5757371414417b8c6caad45baef941abc7d3ab32#code
quickswapPairFactory.contractCalls;
```

#### Using QuickswapPairContractFactoryPublic on its own

```ts
import {
  QuickswapPairContractFactoryPublic,
  ChainId,
} from "quickswap-sdk-lite";

const quickswapPairContractFactoryPublic = new QuickswapPairContractFactoryPublic(
  ChainId.MATIC
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
);

// contract calls our here, this is only for the quickswap pair contract https://polygonscan.com/address/0x5757371414417b8c6caad45baef941abc7d3ab32#code
quickswapPairContractFactoryPublic;
```

### QuickswapContractFactoryPublic

```ts
async allPairs(parameter0: BigNumberish): Promise<string>;

async allPairsLength(): Promise<string>;

// state changing
acreatePair(tokenA: string, tokenB: string): string;

async getPair(token0: string, token1: string): Promise<string>;
```

### Usage

```ts
import { QuickswapContractFactoryPublic, ChainId } from "quickswap-sdk-lite";

const quickswapContractFactoryPublic = new QuickswapContractFactoryPublic(
  ChainId.MATIC
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
);

// contract calls our here https://polygonscan.com/address/0x5757371414417b8c6caad45baef941abc7d3ab32#code
quickswapContractFactoryPublic;
```

### QuickswapRouterContractFactoryPublic

```ts
// state changing
addLiquidity(
  tokenA: string,
  tokenB: string,
  amountADesired: BigNumberish,
  amountBDesired: BigNumberish,
  amountAMin: BigNumberish,
  amountBMin: BigNumberish,
  to: string,
  deadline: BigNumberish
): string;

// state changing
addLiquidityETH(
  token: string,
  amountTokenDesired: BigNumberish,
  amountTokenMin: BigNumberish,
  amountETHMin: BigNumberish,
  to: string,
  deadline: BigNumberish
): string;

async factory(): Promise<string>;

async getAmountsOut(
  amountIn: BigNumberish,
  path: string[]
): Promise<string[]>;

async quote(
  amountA: BigNumberish,
  reserveA: BigNumberish,
  reserveB: BigNumberish
): Promise<string>;

// state changing
removeLiquidity(
  tokenA: string,
  tokenB: string,
  liquidity: BigNumberish,
  amountAMin: BigNumberish,
  amountBMin: BigNumberish,
  to: string,
  deadline: BigNumberish
): string;

// state changing
removeLiquidityETH(
  token: string,
  liquidity: BigNumberish,
  amountTokenMin: BigNumberish,
  amountETHMin: BigNumberish,
  to: string,
  deadline: BigNumberish
): string;

// state changing
removeLiquidityETHSupportingFeeOnTransferTokens(
  token: string,
  liquidity: BigNumberish,
  amountTokenMin: BigNumberish,
  amountETHMin: BigNumberish,
  to: string,
  deadline: BigNumberish
): string;

// state changing
removeLiquidityETHWithPermit(
  token: string,
  liquidity: BigNumberish,
  amountTokenMin: BigNumberish,
  amountETHMin: BigNumberish,
  to: string,
  deadline: BigNumberish,
  approveMax: boolean,
  v: BigNumberish,
  r: BytesLike,
  s: BytesLike
);

// state changing
removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
  token: string,
  liquidity: BigNumberish,
  amountTokenMin: BigNumberish,
  amountETHMin: BigNumberish,
  to: string,
  deadline: BigNumberish,
  approveMax: boolean,
  v: BigNumberish,
  r: BytesLike,
  s: BytesLike
): string

// state changing
removeLiquidityWithPermit(
  tokenA: string,
  tokenB: string,
  liquidity: BigNumberish,
  amountAMin: BigNumberish,
  amountBMin: BigNumberish,
  to: string,
  deadline: BigNumberish,
  approveMax: boolean,
  v: BigNumberish,
  r: BytesLike,
  s: BytesLike
): string;

// state changing
swapExactETHForTokens(
  amountOutMin: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string

// state changing
swapETHForExactTokens(
  amountOut: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string

// state changing
swapExactETHForTokensSupportingFeeOnTransferTokens(
  amountIn: BigNumberish,
  amountOutMin: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string;

// state changing
swapExactTokensForETH(
  amountIn: BigNumberish,
  amountOutMin: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string;

// state changing
swapTokensForExactETH(
  amountOut: BigNumberish,
  amountInMax: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string;

// state changing
swapExactTokensForETHSupportingFeeOnTransferTokens(
  amountIn: BigNumberish,
  amountOutMin: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string;

// state changing
swapExactTokensForTokens(
  amountIn: BigNumberish,
  amountOutMin: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string;

// state changing
swapTokensForExactTokens(
  amountOut: BigNumberish,
  amountInMax: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string

// state changing
swapExactTokensForTokensSupportingFeeOnTransferTokens(
  amountIn: BigNumberish,
  amountOutMin: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string
```

### Usage

```ts
import {
  QuickswapRouterContractFactoryPublic,
  ChainId,
} from "quickswap-sdk-lite";

const quickswapRouterContractFactoryPublic = new QuickswapRouterContractFactoryPublic(
  ChainId.MATIC
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
);

// contract calls our here https://polygonscan.com/address/0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff#code
quickswapRouterContractFactoryPublic;
```

## Tests

The whole repo is covered in tests output below:

Test Suites: 21 passed, 21 total
Tests: 133 passed, 133 total
Snapshots: 0 total
Time: 32.287s
Ran all test suites.

## Issues

Please raise any issues in the below link.

https://github.com/michaelessiet/quickswap-sdk-lite

## Thanks And Support

This package was developed by [Josh Stevens](https://github.com/joshstevens19) and [Michael Essiet](https://github.com/michaelessiet). Our aim is to be able to keep creating these awesome packages to help the Ethereum space grow with easier-to-use tools to allow the learning curve to get involved with blockchain development easier and making Ethereum ecosystem better. If you want to help with that vision and allow us to invest more time into creating cool packages or if this package has saved you a lot of development time donations are welcome, every little helps. By donating, you are supporting us to be able to maintain existing packages, extend existing packages (as Ethereum matures), and allowing us to build more packages for Ethereum due to being able to invest more time into it. Thanks, everyone!

## Direct donations

Direct donations to Michael, any token accepted - Eth address > `0x3449afBf888f21fF83E55Bd15d0061602034016c`

Direct donations to Josh, any token accepted - Eth address > `0x699c2daD091ffcF18f3cd9E8495929CA3a64dFe1`
