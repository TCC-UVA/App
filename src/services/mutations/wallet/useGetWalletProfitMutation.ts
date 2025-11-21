import { useMutation } from "@tanstack/react-query";
import { WalletService } from "../../wallet";
import { GetProfitsByWalletIdRequestDto } from "../../wallet/dto/get-profits-by-wallet-id-request.dto";
import { mutationKeys } from "../key";

export const useGetWalletProfitMutation = (service: WalletService) => {
  return useMutation({
    mutationKey: [mutationKeys.GET_PROFITS_BY_WALLET_ID],
    mutationFn: (data: GetProfitsByWalletIdRequestDto) =>
      service.getProfitsByWalletId(data),
  });
};
