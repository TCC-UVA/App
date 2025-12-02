import { useToast } from "@/src/components/toast";
import { useMutation } from "@tanstack/react-query";
import { WalletService } from "../../wallet";
import { GetProfitsByWalletIdRequestDto } from "../../wallet/dto/get-profits-by-wallet-id-request.dto";
import { mutationKeys } from "../key";

export const useGetWalletDividendYieldMutation = (service: WalletService) => {
  const { error } = useToast();
  return useMutation({
    mutationKey: [mutationKeys.GET_DIVIDEND_YIELD_BY_WALLET_ID],
    mutationFn: (data: GetProfitsByWalletIdRequestDto) =>
      service.getDividendsByWalletId(data),
    onError: () => {
      error("Ocorreu um erro ao buscar os dados de dividend yield da carteira.");
    },
  });
};
