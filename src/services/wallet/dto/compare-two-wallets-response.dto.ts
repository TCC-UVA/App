export interface WalletComparisonData {
  PortfolioId: number;
  Name: string;
  ConsolidatedProfitability: string;
  Assets: Record<string, string>;
}

export type Portfolio = {
  PortfolioName: string;
  PortfolioId: number;
  Assets: Record<string, string>;
  ConsolidatedProfitability: string;
  InitialDate: number;
  FinalDate: number;
};

export interface CompareTwoWalletsResponseDto {
  ["Portfolio 1"]: Portfolio;
  ["Portfolio 2"]: Portfolio;
  AbsoluteDifference: string;
}
