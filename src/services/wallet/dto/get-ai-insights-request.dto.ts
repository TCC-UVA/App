export interface GetAIInsightsRequestDto {
  Assets: {
    [key: string]: string;
  };
  ConsolidatedProfitability: string;
  InitialDate: number;
  FinalDate: number;
}
