export type StockType = "ACAO" | "FII" | "ETF";

export interface Stock {
  id: string;
  ticker: string;
  name: string;
  price: number;
  variation: number;
  sector: string;
  type: StockType;
  volume: number;
  marketCap?: number;
  dividendYield?: number;
}

export enum StockTypeEnum {
  ACAO = "ACAO",
  FII = "FII",
  ETF = "ETF",
}
