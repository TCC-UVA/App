import { Benchmark } from "@/src/models/benchmark";
import { useCompareTwoWalletsMutation } from "@/src/services/mutations";
import { useCompareWalletWithBenchmarkMutation } from "@/src/services/mutations/wallet/useCompareWalletWithBenchmarkMutation";
import { useGetWalletsQuery } from "@/src/services/queries";
import { useState } from "react";
import { AnalyticsViewModelProps, ComparisonMode } from "./model";

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

  const {
    mutate: onCompareBenchmark,
    isPending: isPendingBenchmarkCompare,
    data: benchmarkComparisonData,
  } = useCompareWalletWithBenchmarkMutation(walletService);

  const [isSelectingActive, setIsSelectingActive] = useState(false);
  const [selectedWalletIds, setSelectedWalletIds] = useState<Set<number>>(
    new Set()
  );
  const [selectedBenchmark, setSelectedBenchmark] = useState<Benchmark | null>(
    null
  );
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState(false);

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
        setSelectedBenchmark(null);
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
        // If a benchmark is selected: only 1 wallet allowed (radio behavior)
        if (selectedBenchmark !== null) {
          return new Set([walletId]);
        }
        // If no benchmark: limit to 2 wallets for wallet comparison
        if (newSet.size >= 2) {
          return prev; // Don't allow more than 2 selections
        }
        newSet.add(walletId);
      }
      return newSet;
    });
  };

  const toggleBenchmarkSelection = (benchmark: Benchmark) => {
    setSelectedBenchmark((prev) => {
      const newBenchmark = prev === benchmark ? null : benchmark;

      // If selecting a benchmark, clear wallet selections except the first one
      if (newBenchmark !== null && selectedWalletIds.size > 1) {
        const firstWallet = Array.from(selectedWalletIds)[0];
        setSelectedWalletIds(new Set([firstWallet]));
      }

      return newBenchmark;
    });
  };

  const handleCompareTwoWallets = () => {
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

  // Determine which comparison to trigger based on selections
  const handleCompare = () => {
    // Scenario 1: 1 wallet + 1 benchmark = benchmark comparison
    if (selectedWalletIds.size === 1 && selectedBenchmark !== null) {
      handleCompareBenchmark();
    }
    // Scenario 2: 2 wallets + no benchmark = wallet comparison
    else if (selectedWalletIds.size === 2 && selectedBenchmark === null) {
      handleCompareTwoWallets();
    }
  };

  const handleCompareBenchmark = () => {
    if (selectedWalletIds.size !== 1 || !selectedBenchmark) return;

    const walletId = Array.from(selectedWalletIds)[0];
    onCompareBenchmark(
      {
        walletId,
        benchmark: selectedBenchmark,
        initialYear,
        finalYear,
      },
      {
        onSuccess: () => {
          setIsBenchmarkModalOpen(true);
        },
      }
    );
  };

  const closeComparisonModal = () => {
    setIsComparisonModalOpen(false);
  };

  const closeBenchmarkModal = () => {
    setIsBenchmarkModalOpen(false);
  };

  // Determine if user can compare based on selections
  const canCompare =
    (selectedWalletIds.size === 2 && selectedBenchmark === null) || // 2 wallets
    (selectedWalletIds.size === 1 && selectedBenchmark !== null); // 1 wallet + 1 benchmark

  // Determine which comparison type is active
  const isWalletComparison =
    selectedWalletIds.size === 2 && selectedBenchmark === null;
  const isBenchmarkComparison =
    selectedWalletIds.size === 1 && selectedBenchmark !== null;

  // Get comparison button text
  const getCompareButtonText = () => {
    if (isWalletComparison) {
      return "Comparar 2 Carteiras";
    }
    if (isBenchmarkComparison && selectedBenchmark) {
      return `Comparar com ${selectedBenchmark}`;
    }
    return "Selecione itens para comparar";
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
    // Benchmark comparison
    selectedBenchmark,
    toggleBenchmarkSelection,
    isPendingBenchmarkCompare,
    benchmarkComparisonData,
    isBenchmarkModalOpen,
    closeBenchmarkModal,
    // Unified comparison state
    canCompare,
    isWalletComparison,
    isBenchmarkComparison,
    getCompareButtonText,
  };
};
