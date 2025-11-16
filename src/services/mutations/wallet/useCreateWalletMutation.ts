import { useMutation } from "@tanstack/react-query";
import { WalletService } from "../../wallet";
import { CreateWalletRequestDto } from "../../wallet/dto/create-request.dto";
import { mutationKeys } from "../key";

export const useCreateWalletMutation = (service: WalletService) => {
  return useMutation({
    mutationKey: [mutationKeys.POST_CREATE_WALLET],
    mutationFn: (data: CreateWalletRequestDto) => service.create(data),
  });
};
