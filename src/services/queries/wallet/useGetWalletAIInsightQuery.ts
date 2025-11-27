import { useQuery } from "@tanstack/react-query";
import { WalletService } from "../../wallet";
import { GetAIInsightsRequestDto } from "../../wallet/dto/get-ai-insights-request.dto";
import { QueryKeys } from "../key";

export const useGetWalletAIInsightQuery = (
  service: WalletService,
  params: GetAIInsightsRequestDto
) => {
  return useQuery({
    queryKey: [QueryKeys.POST_WALLET_AI_INSIGHT, params],
    queryFn: () => service.getAIInsights(params),
  });
};
