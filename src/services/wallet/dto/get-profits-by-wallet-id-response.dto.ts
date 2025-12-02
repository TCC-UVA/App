export interface AssetMetric {
  name: string;
  profitability: number;
}

export interface GetProfitsByWalletIdResponseDto {
  Assets: {
    [key: string]: string;
  };
  ConsolidatedProfitability: string;
  InitialDate: number;
  FinalDate: number;
}
