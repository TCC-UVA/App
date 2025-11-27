import { useGetWalletAIInsightQuery } from "@/src/services/queries";
import { WalletService } from "@/src/services/wallet";
import { useLocalSearchParams, useRouter } from "expo-router";

export const useAIInsightsViewModel = (service: WalletService) => {
  const router = useRouter();
  const params = useLocalSearchParams<{ walletName: string; params: string }>();

  const sanitizedParams = JSON.parse(params.params);

  const {
    data: insights,
    isLoading,
    isError,
  } = useGetWalletAIInsightQuery(service, {
    Assets: sanitizedParams.Assets,
    ConsolidatedProfitability: sanitizedParams.ConsolidatedProfitability,
    FinalDate: sanitizedParams.FinalDate,
    InitialDate: sanitizedParams.InitialDate,
  });

  const handleGoBack = () => {
    router.back();
  };

  return {
    insights,
    isLoading,
    error: isError,
    walletName: params.walletName,
    handleGoBack,
  };
};
