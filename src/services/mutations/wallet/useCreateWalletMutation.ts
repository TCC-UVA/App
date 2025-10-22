import { Wallet } from "@/src/models";
import { useMutation } from "@tanstack/react-query";
import { WalletService } from "../../wallet";
import { mutationKeys } from "../key";

export const useCreateWalletMutation = (service: WalletService) => {
  return useMutation({
    mutationKey: [mutationKeys.POST_CREATE_WALLET],
    mutationFn: (data: Wallet) => service.create(data),
  });
};
