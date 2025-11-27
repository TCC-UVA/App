import { useQuery } from "@tanstack/react-query";
import { StockService } from "../../stocks";
import { QueryKeys } from "../key";

export const useGetStockQuery = (service: StockService, search?: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_STOCKS, search],
    queryFn: () => service.searchAssets(search || ""),
    select: (data) => {
      return data.quotes.filter((quote) => {
        return quote.symbol.endsWith(".SA");
      });
    },
    enabled: !!search && search.length >= 3,
  });
};
