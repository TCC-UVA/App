import {
  useCompareTwoWalletsMutation,
  useGetWalletProfitMutation,
} from "@/src/services/mutations";
import { useGetWalletsQuery } from "@/src/services/queries";
import { format, startOfYear } from "date-fns";
import { useState } from "react";
import { AnalyticsViewModelProps } from "./model";

export const useAnalyticsViewModel = ({
  walletService,
}: AnalyticsViewModelProps) => {
  const { data: walletData, isLoading: isLoadingWallets } =
    useGetWalletsQuery(walletService);

  const { mutate: onCompareTwoWallets, isPending: isPendingCompare } =
    useCompareTwoWalletsMutation(walletService);

  const { mutate: onGetWalletProfit, isPending: isPendingGetProfit } =
    useGetWalletProfitMutation(walletService);
  const [isSelectingActive, setIsSelectingActive] = useState(false);
  const [selectedWalletIds, setSelectedWalletIds] = useState<Set<number>>(
    new Set()
  );
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  const handleChangeIsSelectingActive = () => {
    setIsSelectingActive((prev) => {
      const newValue = !prev;
      // Clear selections when exiting select mode
      if (!newValue) {
        setSelectedWalletIds(new Set());
      }
      return newValue;
    });
  };

  const toggleWalletSelection = (walletId: number) => {
    setSelectedWalletIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(walletId)) {
        newSet.delete(walletId);
      } else {
        newSet.add(walletId);
      }
      return newSet;
    });
  };

  const handleCompare = () => {
    if (selectedWalletIds.size === 0) return;

    // onGetWalletProfit({
    //   initialDate: format(startOfYear(new Date()), "yyyy-MM-dd"),
    //   finalDate: format(new Date(), "yyyy-MM-dd"),
    //   walletId: Array.from(selectedWalletIds)[0],
    // });
    onCompareTwoWallets({
      initialDate: format(startOfYear(new Date()), "yyyy-MM-dd"),
      finalDate: format(new Date(), "yyyy-MM-dd"),
      firstWalletId: Array.from(selectedWalletIds)[0],
      secondWalletId: Array.from(selectedWalletIds)[1],
    });
  };

  const closeComparisonModal = () => {
    setIsComparisonModalOpen(false);
  };

  return {
    isLoadingWallets,
    walletData,
    isSelectingActive,
    handleChangeIsSelectingActive,
    selectedWalletIds,
    toggleWalletSelection,
    handleCompare,
    isComparisonModalOpen,
    closeComparisonModal,
    isPendingCompare: isPendingCompare || isPendingGetProfit,
  };
};
