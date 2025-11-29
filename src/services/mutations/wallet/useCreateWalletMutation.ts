import { useToast } from "@/src/components/toast";
import { useAuthStore } from "@/src/store/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { QueryKeys } from "../../queries";
import { WalletService } from "../../wallet";
import { CreateWalletRequestDto } from "../../wallet/dto/create-request.dto";
import { mutationKeys } from "../key";

export const useCreateWalletMutation = (service: WalletService) => {
  const { error: showErrorToast } = useToast();
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
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        if (statusCode === 409) {
          showErrorToast(
            "Carteira já existe com esse nome",
            "Por favor, escolha outro nome."
          );
        }
        if (statusCode === 500) {
          showErrorToast("Erro no servidor. Tente novamente mais tarde");
          return;
        }
      }
    },
  });
};
