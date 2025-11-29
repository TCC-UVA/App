export interface GetAIInsightsBenchmarkRequestDto {
  Assets: Record<string, string>;
  ConsolidatedProfitability: string;
  InitialDate: string;
  FinalDate: string;
  PortfolioId: number;
  Benchmark: string;
  BenchmarkValue: string;
}
