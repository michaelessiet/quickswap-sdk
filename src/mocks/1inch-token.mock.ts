import { Token } from '../factories/token/models/token';

export function MOCK1INCH(): Token {
  return {
    chainId: 137,
    contractAddress: '0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f',
    decimals: 18,
    symbol: '1INCH',
    name: '1Inch (PoS)',
  };
}
