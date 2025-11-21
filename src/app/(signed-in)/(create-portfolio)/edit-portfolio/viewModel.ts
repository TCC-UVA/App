import { Asset, Wallet } from "@/src/models";
import { Quote } from "@/src/models/quote";
import {
  useDeleteWalletMutation,
  useUpdateWalletMutation,
} from "@/src/services/mutations";
import { WalletService } from "@/src/services/wallet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useCreatePortfolioContext } from "../context";

export const useEditPortfolioViewModel = (service: WalletService) => {
  const { setName, setSelectedStocks } = useCreatePortfolioContext();
  const { mutate: onDeleteWallet, isPending: isDeleting } =
    useDeleteWalletMutation(service);
  const { mutate: onUpdateWallet, isPending: isSaving } =
    useUpdateWalletMutation(service);
  const { wallet: walletParam } = useLocalSearchParams<{ wallet: string }>();
  const router = useRouter();
  const [deleteWalletSheetOpen, setDeleteWalletSheetOpen] = useState(false);
  const [showOptionsSheet, setShowOptionsSheet] = useState(false);

  const wallet: Wallet = walletParam ? JSON.parse(walletParam) : null;
  const [assets, setAssets] = useState<Asset[]>(wallet?.Assets || []);

  const hasChanges = useMemo(() => {
    if (!wallet?.Assets) return false;
    if (wallet.Assets.length !== assets.length) return true;

    const originalAssetNames = wallet.Assets.map((a) => a.name).sort();
    const currentAssetNames = assets.map((a) => a.name).sort();

    return (
      JSON.stringify(originalAssetNames) !== JSON.stringify(currentAssetNames)
    );
  }, [assets, wallet?.Assets]);

  useEffect(() => {
    if (wallet?.Assets) {
      setAssets(wallet.Assets);
    }
    setName(wallet?.name || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletParam]);

  const handleGoBack = () => {
    router.back();
  };

  const handleRemoveAsset = (symbol: string) => {
    setAssets((prev) => prev.filter((asset) => asset.name !== symbol));
  };

  const handleAddMore = () => {
    router.push({
      pathname: "/(signed-in)/(create-portfolio)/select-stocks",
      params: {
        wallet: JSON.stringify({ ...wallet, assets }),
        mode: "edit",
      },
    });
  };

  const handleAllocateQuantities = () => {
    const updatedAssets = assets.map((asset) => ({
      symbol: asset.name,
      quantity: asset.allocation || 0,
    }));
    setSelectedStocks(updatedAssets as Quote[]);
    router.push({
      pathname: "/(signed-in)/(create-portfolio)/allocate-quantities",
      params: {
        id: wallet.PortfolioId.toString(),
      },
    });
  };

  const handleDeletePortfolio = () => {
    handleToggleDeleteWalletSheet();
    handleToggleOptionsSheet();
    onDeleteWallet(wallet.PortfolioId, {});
  };

  const handleToggleDeleteWalletSheet = () => {
    setDeleteWalletSheetOpen((prev) => !prev);
  };

  const handleToggleOptionsSheet = () => {
    setShowOptionsSheet((prev) => !prev);
  };

  const handleSaveChanges = () => {
    if (!hasChanges || !wallet) return;

    const updateData = {
      id: wallet.PortfolioId,
      assets: assets.map((asset) => ({
        Name: asset.name,
        Allocation: asset.allocation || 0,
      })),
    };

    onUpdateWallet(updateData, {
      onSuccess: () => {
        router.back();
      },
    });
  };

  return {
    wallet,
    assets,
    handleGoBack,
    handleRemoveAsset,
    handleAddMore,
    handleAllocateQuantities,
    handleDeletePortfolio,
    handleToggleDeleteWalletSheet,
    deleteWalletSheetOpen,
    isDeleting,
    showOptionsSheet,
    handleToggleOptionsSheet,
    hasChanges,
    handleSaveChanges,
    isSaving,
  };
};
