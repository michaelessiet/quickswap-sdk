import { Token } from '../factories/token/models/token';

export function MOCKAAVE(): Token {
  return {
    chainId: 137,
    contractAddress: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
    decimals: 18,
    symbol: 'AAVE',
    name: 'Aave (PoS)',
  };
}
