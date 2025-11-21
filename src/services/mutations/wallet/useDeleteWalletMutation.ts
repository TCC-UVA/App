import { useToast } from "@/src/components/toast";
import { useAuthStore } from "@/src/store/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { QueryKeys } from "../../queries";
import { WalletService } from "../../wallet";
import { FindAllResponseDto } from "../../wallet/dto/find-all-response.dto";
import { mutationKeys } from "../key";

export const useDeleteWalletMutation = (service: WalletService) => {
  const { success } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  return useMutation({
    mutationKey: [mutationKeys.DELETE_WALLET],
    mutationFn: (id: number) => service.delete(id),
    onSuccess: (_, id) => {
      const data = queryClient.getQueryData<FindAllResponseDto>([
        QueryKeys.GET_WALLETS,
        token,
      ]);

      const arrayData = Object.values(data || {});

      const filteredData = arrayData.filter(
        (wallet) => wallet.PortfolioId !== id
      );

      queryClient.setQueryData([QueryKeys.GET_WALLETS, token], filteredData);
      success("Carteira deletada com sucesso.");
      router.replace("/(signed-in)/(tabs)/home");
    },
  });
};
