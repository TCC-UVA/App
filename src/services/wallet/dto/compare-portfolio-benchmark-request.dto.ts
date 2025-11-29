import { Benchmark } from "@/src/models/benchmark";

export interface ComparePortfolioBenchmarkRequestDto {
  walletId: number;
  benchmark: Benchmark;
  initialYear: string;
  finalYear: string;
}
