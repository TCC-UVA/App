import { useQuery } from "@tanstack/react-query";
import { WalletService } from "../../wallet";
import { GetAIInsightsBenchmarkRequestDto } from "../../wallet/dto/get-ai-insights-benchmark-request.dto";
import { QueryKeys } from "../key";

export const useGetWalletAIInsightBenchmarkQuery = (
  service: WalletService,
  params: GetAIInsightsBenchmarkRequestDto
) => {
  return useQuery({
    queryKey: [QueryKeys.POST_WALLET_AI_INSIGHT_BENCHMARK, params],
    queryFn: () => service.getAIInsightsBenchmark(params),
  });
};
