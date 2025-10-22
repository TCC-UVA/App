import { useQuery } from "@tanstack/react-query";
import { WalletService } from "../../wallet";
import { QueryKeys } from "../key";

export const useGetWalletsQuery = (service: WalletService) => {
  return useQuery({
    queryKey: [QueryKeys.GET_WALLETS],
    queryFn: () => service.findAll(),
  });
};
