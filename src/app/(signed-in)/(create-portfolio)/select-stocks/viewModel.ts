import { useDebounce } from "@/src/hooks/useDebounce";
import { Quote } from "@/src/models/quote";
import { useGetStockQuery } from "@/src/services/queries";
import { StockService } from "@/src/services/stocks";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useCreatePortfolioContext } from "../context";

export const useSelectStocksViewModel = (service: StockService) => {
  const { selectedStocks, setSelectedStocks } = useCreatePortfolioContext();
  const router = useRouter();

  const [selectedStocksDraft, setSelectedStocksDraft] = useState<Quote[]>(
    selectedStocks || []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  const handleSelectStock = (item: Quote) => {
    const isSelected = selectedStocksDraft.some(
      (s) => s.symbol === item.symbol
    );
    if (isSelected) {
      return setSelectedStocksDraft((prev) =>
        prev.filter((s) => s.symbol !== item.symbol)
      );
    }
    setSelectedStocksDraft((prev) => [...prev, item]);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data, isLoading } = useGetStockQuery(service, debouncedSearch);

  const handleConfirm = () => {
    if (selectedStocksDraft.length === 0) return;
    setSelectedStocks(selectedStocksDraft);
    router.push({
      pathname: "/(signed-in)/(create-portfolio)/allocate-percentages",
    });
  };

  return {
    stocks: data,
    selectedStocks: selectedStocksDraft,
    isLoading: isLoading,
    handleSelectStock,
    handleConfirm,
    handleGoBack,
    searchQuery,
    handleSearchChange,
    isDropdownOpen,
    toggleDropdown,
  };
};
