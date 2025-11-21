import { useAuthStore } from "@/src/store/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "../../queries";
import { WalletService } from "../../wallet";
import { CreateWalletRequestDto } from "../../wallet/dto/create-request.dto";
import { mutationKeys } from "../key";

export const useCreateWalletMutation = (service: WalletService) => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  return useMutation({
    mutationKey: [mutationKeys.POST_CREATE_WALLET],
    mutationFn: (data: CreateWalletRequestDto) => service.create(data),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.GET_WALLETS, token],
      });
    },
  });
};
