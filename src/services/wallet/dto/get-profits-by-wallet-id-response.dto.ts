export interface AssetMetric {
  name: string;
  profitability: number;
  // Add more fields based on what the API returns
}

export interface GetProfitsByWalletIdResponseDto {
  Assets: {
    [key: string]: string;
  };
  ConsolidatedProfitability: string;
  InitialDate: number;
  FinalDate: number;
}
