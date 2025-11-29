import { Benchmark } from "@/src/models/benchmark";

export interface ComparePortfolioBenchmarkResponseDto {
  PortfolioId: number;
  ConsolidatedProfitability: string;
  Benchmark: Benchmark;
  BenchmarkValue: string;
  InitialDate: string;
  FinalDate: string;
  Assets: Record<string, string>;
}
