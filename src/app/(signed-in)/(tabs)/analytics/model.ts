import { WalletService } from "@/src/services/wallet";

export type AnalyticsViewModelProps = {
  walletService: WalletService;
};

export type ComparisonMode = "wallets" | "benchmark";
