export enum ChainId {
  MATIC = 137,
  MUMBAI = 80001
}

export const ChainNames = new Map<number, string>([
  [ChainId.MATIC, 'matic'],
  [ChainId.MUMBAI, 'mumbai']
]);
