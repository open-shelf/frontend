export interface Stake {
  staker: string;
  amount: number;
  earnings: number;
}

export interface BookDetails {
  pubKey: string;
  title: string;
  author: string;
  stakes: Stake[];
}