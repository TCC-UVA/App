import { Stock } from "@/src/models";
import { useGetStockQuery } from "@/src/services/queries";
import { StockService } from "@/src/services/stocks";
import { useRouter } from "expo-router";
import { useState } from "react";

export const useSelectStocksViewModel = (service: StockService) => {
  const router = useRouter();
  const [selectedStocks, setSelectedStocks] = useState<Stock[]>([]);

  const handleSelectStock = (stock: Stock) => {
    const isSelected = selectedStocks.some((s) => s.id === stock.id);
    if (isSelected) {
      return setSelectedStocks((prev) => prev.filter((s) => s.id !== stock.id));
    }
    setSelectedStocks((prev) => [...prev, stock]);
  };

  const handleGoBack = () => {
    router.back();
  };

  const { data, isLoading } = useGetStockQuery(service);

  return {
    stocks: data,
    selectedStocks: selectedStocks,
    searchQuery: "",
    isLoading: isLoading,
    handleSearchChange: (query: string) => {
      console.log("Search query changed:", query);
    },
    handleSelectStock,
    handleConfirm: () => {
      console.log("Confirmed selected stocks");
    },
    handleGoBack,
  };
};
