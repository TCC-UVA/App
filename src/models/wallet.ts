export interface Wallet {
  name: string;
  PortfolioId: number;
  Assets: Asset[];
}

export interface Asset {
  name: string;
  allocation: number;
}
