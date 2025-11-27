import { useCompareTwoWalletsMutation } from "@/src/services/mutations";
import { useGetWalletsQuery } from "@/src/services/queries";
import { useState } from "react";
import { AnalyticsViewModelProps } from "./model";

export const useAnalyticsViewModel = ({
  walletService,
}: AnalyticsViewModelProps) => {
  const { data: walletData, isLoading: isLoadingWallets } =
    useGetWalletsQuery(walletService);

  const {
    mutate: onCompareTwoWallets,
    isPending: isPendingCompare,
    data: comparisonData,
  } = useCompareTwoWalletsMutation(walletService);
  const [isSelectingActive, setIsSelectingActive] = useState(false);
  const [selectedWalletIds, setSelectedWalletIds] = useState<Set<number>>(
    new Set()
  );
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  // Year selection state
  const currentYear = new Date().getFullYear().toString();
  const lastYear = (new Date().getFullYear() - 1).toString();
  const [initialYear, setInitialYear] = useState(lastYear);
  const [finalYear, setFinalYear] = useState(currentYear);

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
        // Limit to 2 portfolios
        if (newSet.size >= 2) {
          return prev; // Don't allow more than 2 selections
        }
        newSet.add(walletId);
      }
      return newSet;
    });
  };

  const handleCompare = () => {
    if (selectedWalletIds.size !== 2) return;

    const walletIds = Array.from(selectedWalletIds);
    onCompareTwoWallets(
      {
        initialDate: initialYear,
        finalDate: finalYear,
        firstWalletId: walletIds[0],
        secondWalletId: walletIds[1],
      },
      {
        onSuccess: () => {
          setIsComparisonModalOpen(true);
        },
      }
    );
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
    isPendingCompare,
    comparisonData,
    // Year selection
    initialYear,
    finalYear,
    setInitialYear,
    setFinalYear,
    currentYear,
    lastYear,
  };
};
