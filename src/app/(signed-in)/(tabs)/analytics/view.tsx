import { ComparisonModal } from "@/src/components/comparison-modal";
import { FloatButton } from "@/src/components/float-button";
import { Header } from "@/src/components/header";
import { Layout } from "@/src/components/layout";
import { FlatList } from "react-native";
import { Button, Input, Paragraph, Separator, XStack, YStack } from "tamagui";
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
  comparisonData,
  initialYear,
  finalYear,
  setInitialYear,
  setFinalYear,
  currentYear,
  lastYear,
}: ReturnType<typeof useAnalyticsViewModel>) => {
  const canCompare = selectedWalletIds.size === 2;

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

      {/* Year Selection Section */}
      {isSelectingActive && (
        <YStack px="$4" pt="$3" pb="$2" gap="$3" bg="$background">
          <Paragraph fontSize={14} color="$gray11" fontWeight="600">
            Selecione o período para comparação
          </Paragraph>
          <XStack gap="$3">
            <YStack flex={1} gap="$2">
              <Paragraph fontSize={12} color="$gray10">
                Ano Inicial
              </Paragraph>
              <Input
                value={initialYear}
                onChangeText={setInitialYear}
                placeholder={lastYear}
                keyboardType="numeric"
                fontSize={14}
                bg="$gray3"
              />
            </YStack>
            <YStack flex={1} gap="$2">
              <Paragraph fontSize={12} color="$gray10">
                Ano Final
              </Paragraph>
              <Input
                value={finalYear}
                onChangeText={setFinalYear}
                placeholder={currentYear}
                keyboardType="numeric"
                fontSize={14}
                bg="$gray3"
              />
            </YStack>
          </XStack>
          <Paragraph fontSize={12} color="$blue10" fontWeight="500">
            Selecione exatamente 2 carteiras para comparar ({selectedWalletIds.size}/2)
          </Paragraph>
          <Separator />
        </YStack>
      )}

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

      {canCompare && (
        <FloatButton
          isLoading={isPendingCompare}
          text="Comparar 2 Carteiras"
          handleConfirm={handleCompare}
          disabled={!initialYear || !finalYear}
        />
      )}

      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={closeComparisonModal}
        comparisonData={comparisonData}
      />
    </Layout>
  );
};
