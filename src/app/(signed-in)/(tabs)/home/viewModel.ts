import { useDebounce } from "@/src/hooks/useDebounce";
import { useGetWalletsQuery } from "@/src/services/queries";
import { WalletService } from "@/src/services/wallet";
import { useRouter } from "expo-router";
import { useState } from "react";

export const useHomeViewModel = (service: WalletService) => {
  const router = useRouter();
  const [draftSearch, setDraftSearch] = useState("");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  const handleGoToCreateWallet = () => {
    router.navigate("/(signed-in)/(create-portfolio)/create");
  };

  const { data: walletsData, isFetching } = useGetWalletsQuery(service);

  const filteredWallets = walletsData?.filter((wallet) =>
    wallet.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const wallets = debouncedSearch ? filteredWallets : walletsData;

  const handleApplySearch = () => {
    setSearch(draftSearch);
  };

  const handleChangeDraftSearch = (text: string) => {
    setDraftSearch(text);
  };
  return {
    draftSearch,
    wallets: wallets,
    isLoading: isFetching,
    handleGoToCreateWallet,
    handleApplySearch,
    handleChangeDraftSearch,
  };
};
