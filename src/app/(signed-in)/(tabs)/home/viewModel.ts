import { Wallet } from "@/src/models";
import {
  useGetWalletDividendYieldMutation,
  useGetWalletProfitMutation,
} from "@/src/services/mutations";
import { useGetWalletsQuery } from "@/src/services/queries";
import { WalletService } from "@/src/services/wallet";
import { useRouter } from "expo-router";
import { useState } from "react";
import { MetricType } from "./components/wallet-details-modal";

export const useHomeViewModel = (service: WalletService) => {
  const router = useRouter();
  const [draftSearch, setDraftSearch] = useState("");
  const [search, setSearch] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { data: walletsData, isFetching } = useGetWalletsQuery(service);
  const {
    data: walletProfitData,
    mutate: onGetWalletProfit,
    isPending: isLoadingWalletProfit,
  } = useGetWalletProfitMutation(service);
  const {
    data: walletDividendYieldData,
    mutate: onGetWalletDividendYield,
    isPending: isLoadingWalletDividendYield,
  } = useGetWalletDividendYieldMutation(service);

  const [currentMetricType, setCurrentMetricType] =
    useState<MetricType>("profitability");

  const handleGoToCreateWallet = () => {
    router.navigate("/(signed-in)/(create-portfolio)/create");
  };

  const handleEditWallet = (item: Wallet) => {
    const walletParam = encodeURIComponent(JSON.stringify(item));
    router.push(
      `/(signed-in)/(create-portfolio)/edit-portfolio?wallet=${walletParam}`
    );
  };

  const handleOpenDetails = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    const currentYear = new Date().getFullYear().toString();
    const lastYear = (new Date().getFullYear() - 1).toString();
    handleGetMetrics(
      wallet.PortfolioId,
      lastYear,
      currentYear,
      "profitability"
    );
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedWallet(null);
  };

  const handleGetMetrics = (
    portfolioId: number,
    initialYear: string,
    finalYear: string,
    metricType: MetricType
  ) => {
    setCurrentMetricType(metricType);
    const params = {
      walletId: portfolioId,
      initial_year: initialYear,
      final_year: finalYear,
    };

    if (metricType === "profitability") {
      onGetWalletProfit(params);
    } else {
      onGetWalletDividendYield(params);
    }
  };

  const handleGetAIInsights = () => {
    const currentData = walletProfitData;

    if (!currentData || !selectedWallet) {
      return;
    }

    const params = JSON.stringify({
      ...currentData,
      Assets: currentData.Assets,
      walletName: selectedWallet.name,
    });

    handleCloseDetails();
    router.push({
      pathname: "/(signed-in)/ai-insights",
      params: {
        params,
      },
    });
  };

  const filteredWallets = walletsData?.filter((wallet) =>
    wallet.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleApplySearch = () => {
    setSearch(draftSearch);
  };

  const handleChangeDraftSearch = (text: string) => {
    setDraftSearch(text);
  };
  const currentMetricsData =
    currentMetricType === "profitability"
      ? walletProfitData
      : walletDividendYieldData;

  const isLoadingMetrics =
    currentMetricType === "profitability"
      ? isLoadingWalletProfit
      : isLoadingWalletDividendYield;

  return {
    draftSearch,
    wallets: filteredWallets,
    isLoading: isFetching,
    handleGoToCreateWallet,
    handleApplySearch,
    handleChangeDraftSearch,
    handleEditWallet,
    selectedWallet,
    isDetailsModalOpen,
    handleOpenDetails,
    handleCloseDetails,
    handleGetMetrics,
    handleGetAIInsights,
    metricsData: currentMetricsData,
    isLoadingMetrics,
    currentMetricType,
    setCurrentMetricType,
  };
};
