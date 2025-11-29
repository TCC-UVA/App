export enum Benchmark {
  IPCA = "IPCA",
  CDI = "CDI",
  SELIC = "SELIC",
  DOLLAR = "DOLLAR",
}

export const benchmarkToLabel: Record<Benchmark, string> = {
  [Benchmark.IPCA]: "IPCA",
  [Benchmark.CDI]: "CDI",
  [Benchmark.SELIC]: "SELIC",
  [Benchmark.DOLLAR]: "Dólar",
};
