import { useDebounce } from "@/src/hooks/useDebounce";
import { Wallet } from "@/src/models";
import { Quote } from "@/src/models/quote";
import { useGetStockQuery } from "@/src/services/queries";
import { StockService } from "@/src/services/stocks";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useCreatePortfolioContext } from "../context";

export const useSelectStocksViewModel = (service: StockService) => {
  const { selectedStocks, setSelectedStocks } = useCreatePortfolioContext();
  const { wallet, mode } = useLocalSearchParams<{
    wallet: string;
    mode?: string;
  }>();
  const router = useRouter();
  const isEditMode = mode === "edit";

  const parsedWallet = wallet ? (JSON.parse(wallet) as Wallet) : null;
  const existingAssets = parsedWallet?.Assets || [];

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

    if (selectedStocksDraft.length >= 2) {
      setIsDropdownOpen(false);
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

  console.log("existingAssets", existingAssets);

  const filteredStocks =
    isEditMode && data
      ? data.filter((stock) =>
          existingAssets.every((asset) => asset.name !== stock.symbol)
        )
      : data;

  const handleConfirm = () => {
    if (selectedStocksDraft.length === 0) return;

    if (isEditMode && parsedWallet) {
      const updatedAssets = [
        ...selectedStocksDraft.map((stock) => ({
          symbol: stock.symbol,
          quantity: 0,
        })),
        ...parsedWallet.Assets.map((asset) => ({
          symbol: asset.name,
          quantity: asset.allocation,
        })),
      ];

      setSelectedStocks([...(updatedAssets as Quote[])]);
      router.push({
        pathname: "/(signed-in)/(create-portfolio)/allocate-quantities",
        params: {
          id: parsedWallet.PortfolioId,
        },
      });
    } else {
      setSelectedStocks(selectedStocksDraft);
      router.push({
        pathname: "/(signed-in)/(create-portfolio)/allocate-quantities",
      });
    }
  };

  useEffect(() => {
    if (wallet) {
      // You can parse and use the wallet data if needed
      const parsedWallet = JSON.parse(wallet);
      console.log("Creating portfolio for wallet:", parsedWallet);
    }
  }, [wallet]);

  return {
    stocks: filteredStocks,
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
