import { useMutation } from "@tanstack/react-query";
import { WalletService } from "../../wallet";
import { ComparePortfolioBenchmarkRequestDto } from "../../wallet/dto/compare-portfolio-benchmark-request.dto";
import { mutationKeys } from "../key";

export const useCompareWalletWithBenchmarkMutation = (
  service: WalletService
) => {
  return useMutation({
    mutationKey: [mutationKeys.GET_COMPARE_WALLET_WITH_BENCHMARK],
    mutationFn: (params: ComparePortfolioBenchmarkRequestDto) =>
      service.comparePortfolioWithBenchmark(params),
  });
};
