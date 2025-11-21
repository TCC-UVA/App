import { Wallet } from "@/src/models";
import { useGetWalletsQuery } from "@/src/services/queries";
import { WalletService } from "@/src/services/wallet";
import { useRouter } from "expo-router";
import { useState } from "react";

export const useHomeViewModel = (service: WalletService) => {
  const router = useRouter();
  const [draftSearch, setDraftSearch] = useState("");
  const [search, setSearch] = useState("");

  const handleGoToCreateWallet = () => {
    router.navigate("/(signed-in)/(create-portfolio)/create");
  };

  const handleEditWallet = (item: Wallet) => {
    const walletParam = encodeURIComponent(JSON.stringify(item));
    router.push(
      `/(signed-in)/(create-portfolio)/edit-portfolio?wallet=${walletParam}`
    );
  };

  const { data: walletsData, isFetching } = useGetWalletsQuery(service);

  const filteredWallets = walletsData?.filter((wallet) =>
    wallet.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleApplySearch = () => {
    setSearch(draftSearch);
  };

  const handleChangeDraftSearch = (text: string) => {
    setDraftSearch(text);
  };
  return {
    draftSearch,
    wallets: filteredWallets,
    isLoading: isFetching,
    handleGoToCreateWallet,
    handleApplySearch,
    handleChangeDraftSearch,
    handleEditWallet,
  };
};
