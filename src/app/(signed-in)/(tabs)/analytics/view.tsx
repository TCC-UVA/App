import { ComparisonModal } from "@/src/components/comparison-modal";
import { FloatButton } from "@/src/components/float-button";
import { Header } from "@/src/components/header";
import { Layout } from "@/src/components/layout";
import { FlatList } from "react-native";
import { Button } from "tamagui";
import { EmptyState } from "./components/empty";
import { WalletCard, WalletCardSkeleton } from "./components/wallet-card";
import { useAnalyticsViewModel } from "./viewModel";

export const AnalyticsView = ({
  walletData,
  isLoadingWallets,
  handleChangeIsSelectingActive,
  isSelectingActive,
  selectedWalletIds,
  toggleWalletSelection,
  handleCompare,
  isComparisonModalOpen,
  closeComparisonModal,
  isPendingCompare,
}: ReturnType<typeof useAnalyticsViewModel>) => {
  const hasSelectedWallets = selectedWalletIds.size > 0;

  const selectedWallets = walletData?.filter((wallet) =>
    selectedWalletIds.has(wallet.PortfolioId)
  );

  return (
    <Layout>
      <Header>
        <Button
          fontSize={"$3.5"}
          bg={"$blue10"}
          color={"white"}
          onPress={handleChangeIsSelectingActive}
        >
          {isSelectingActive ? "Cancelar" : "Selecionar"}
        </Button>
      </Header>

      {isLoadingWallets ? (
        <FlatList
          data={[0, 1, 2, 3, 4]}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={() => <WalletCardSkeleton />}
        />
      ) : (
        <FlatList
          data={walletData}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => (
            <WalletCard
              item={item}
              index={index}
              isSelectingActive={isSelectingActive}
              isSelected={selectedWalletIds.has(item.PortfolioId)}
              onToggleSelect={toggleWalletSelection}
            />
          )}
          ListEmptyComponent={<EmptyState />}
        />
      )}

      {hasSelectedWallets && (
        <FloatButton
          isLoading={isPendingCompare}
          text={`Comparar (${selectedWalletIds.size})`}
          handleConfirm={handleCompare}
        />
      )}

      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={closeComparisonModal}
        wallets={selectedWallets || []}
      />
    </Layout>
  );
};
