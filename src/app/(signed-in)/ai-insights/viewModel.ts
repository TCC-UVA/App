import {
  useGetWalletAIInsightBenchmarkQuery,
  useGetWalletAIInsightQuery,
} from "@/src/services/queries";
import { WalletService } from "@/src/services/wallet";
import { GetAIInsightsBenchmarkRequestDto } from "@/src/services/wallet/dto/get-ai-insights-benchmark-request.dto";
import { GetAIInsightsRequestDto } from "@/src/services/wallet/dto/get-ai-insights-request.dto";
import { useLocalSearchParams, useRouter } from "expo-router";

export const useAIInsightsViewModel = (service: WalletService) => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    params: string;
  }>();

  const sanitizedParams = JSON.parse(params.params);
  const isBenchmark = sanitizedParams.type === "benchmark";

  const queryByType = isBenchmark
    ? useGetWalletAIInsightBenchmarkQuery
    : useGetWalletAIInsightQuery;

  const paramsByType:
    | GetAIInsightsBenchmarkRequestDto
    | GetAIInsightsRequestDto = isBenchmark
    ? {
        Benchmark: sanitizedParams.Benchmark,
        BenchmarkValue: sanitizedParams.BenchmarkValue,
        PortfolioId: sanitizedParams.PortfolioId,
        Assets: sanitizedParams.Assets,
        ConsolidatedProfitability: sanitizedParams.ConsolidatedProfitability,
        FinalDate: sanitizedParams.FinalDate,
        InitialDate: sanitizedParams.InitialDate,
      }
    : {
        Assets: sanitizedParams.Assets,
        ConsolidatedProfitability: sanitizedParams.ConsolidatedProfitability,
        FinalDate: sanitizedParams.FinalDate,
        InitialDate: sanitizedParams.InitialDate,
      };

  const {
    data: insights,
    isLoading,
    isError,
  } = (queryByType as unknown as (service: WalletService, params: any) => any)(
    service,
    paramsByType
  );

  const handleGoBack = () => {
    router.back();
  };

  return {
    insights,
    isLoading,
    error: isError,
    walletName: sanitizedParams.walletName,
    handleGoBack,
  };
};
