import { CACHE } from "@/src/constants/cache";
import { Wallet } from "@/src/models";
import { useAuthStore } from "@/src/store/auth";
import { useQuery } from "@tanstack/react-query";
import { WalletService } from "../../wallet";
import { QueryKeys } from "../key";

export const useGetWalletsQuery = (service: WalletService) => {
  const token = useAuthStore((state) => state.token);
  return useQuery<
    Awaited<ReturnType<WalletService["findAll"]>>,
    Error,
    Wallet[]
  >({
    queryKey: [QueryKeys.GET_WALLETS, token],
    queryFn: () => service.findAll(),
    staleTime: CACHE.TEN_MINUTES,
    select: (data) => {
      const mappedData: Wallet[] = Object.entries(data).map(([name, data]) => ({
        name,
        ...data,
      }));

      return mappedData;
    },
  });
};
