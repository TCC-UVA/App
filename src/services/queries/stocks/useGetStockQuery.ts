import { useQuery } from "@tanstack/react-query";
import { StockService } from "../../stocks";
import { QueryKeys } from "../key";

export const useGetStockQuery = (service: StockService) => {
  return useQuery({
    queryKey: [QueryKeys.GET_STOCKS],
    queryFn: () => service.get(),
  });
};
