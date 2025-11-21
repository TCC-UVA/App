import { useMutation } from "@tanstack/react-query";
import { WalletService } from "../../wallet";
import { CompareTwoWalletsRequestDto } from "../../wallet/dto/compare-two-wallets-request.dto";
import { mutationKeys } from "../key";

export const useCompareTwoWalletsMutation = (service: WalletService) => {
  return useMutation({
    mutationKey: [mutationKeys.POST_COMPARE_TWO_WALLETS],
    mutationFn: (data: CompareTwoWalletsRequestDto) =>
      service.compareTwoWallets(data),
  });
};
