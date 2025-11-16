import { ComparisonModal } from "@/src/components/comparison-modal";
import { FloatButton } from "@/src/components/float-button";
import { Header } from "@/src/components/header";
import { Layout } from "@/src/components/layout";
import { mockWallets } from "@/src/mock/wallets";
import { FlatList } from "react-native";
import { Button } from "tamagui";
import { WalletCard } from "./components/wallet-card";
import { useAnalyticsViewModel } from "./viewModel";

export const AnalyticsView = ({
  handleChangeIsSelectingActive,
  isSelectingActive,
  selectedWalletIds,
  toggleWalletSelection,
  handleCompare,
  isComparisonModalOpen,
  closeComparisonModal,
}: ReturnType<typeof useAnalyticsViewModel>) => {
  const hasSelectedWallets = selectedWalletIds.size > 0;

  const selectedWallets = mockWallets.filter((wallet) =>
    selectedWalletIds.has(wallet.id)
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

      <FlatList
        data={mockWallets}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item, index }) => (
          <WalletCard
            item={item}
            index={index}
            isSelectingActive={isSelectingActive}
            isSelected={selectedWalletIds.has(item.id)}
            onToggleSelect={toggleWalletSelection}
          />
        )}
      />

      {hasSelectedWallets && (
        <FloatButton
          text={`Comparar (${selectedWalletIds.size})`}
          handleConfirm={handleCompare}
        />
      )}

      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={closeComparisonModal}
        wallets={selectedWallets}
      />
    </Layout>
  );
};
