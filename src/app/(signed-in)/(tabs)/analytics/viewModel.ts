import { useState } from "react";

export const useAnalyticsViewModel = () => {
  const [isSelectingActive, setIsSelectingActive] = useState(false);
  const [selectedWalletIds, setSelectedWalletIds] = useState<Set<string>>(
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

  const toggleWalletSelection = (walletId: string) => {
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
    if (selectedWalletIds.size > 0) {
      setIsComparisonModalOpen(true);
    }
  };

  const closeComparisonModal = () => {
    setIsComparisonModalOpen(false);
  };

  return {
    isSelectingActive,
    handleChangeIsSelectingActive,
    selectedWalletIds,
    toggleWalletSelection,
    handleCompare,
    isComparisonModalOpen,
    closeComparisonModal,
  };
};
