import { BenchmarkComparisonModal } from "@/src/components/benchmark-comparison-modal";
import { ComparisonModal } from "@/src/components/comparison-modal";
import { FloatButton } from "@/src/components/float-button";
import { Header } from "@/src/components/header";
import { Layout } from "@/src/components/layout";
import { Benchmark } from "@/src/models/benchmark";
import { FlatList, ScrollView } from "react-native";
import {
  Button,
  H6,
  Input,
  Paragraph,
  Separator,
  XStack,
  YStack,
} from "tamagui";
import { BenchmarkCard } from "./components/benchmark-card";
import { CompactWalletCard } from "./components/compact-wallet-card";
import { CompactWalletCardSkeleton } from "./components/compact-wallet-card/skeleton";
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
  selectedBenchmark,
  toggleBenchmarkSelection,
  isPendingBenchmarkCompare,
  benchmarkComparisonData,
  isBenchmarkModalOpen,
  closeBenchmarkModal,
  canCompare,
  isWalletComparison,
  isBenchmarkComparison,
  getCompareButtonText,
}: ReturnType<typeof useAnalyticsViewModel>) => {
  const benchmarks = [
    Benchmark.IPCA,
    Benchmark.CDI,
    Benchmark.SELIC,
    Benchmark.DOLLAR,
  ];

  // Determine selection info text
  const getSelectionInfo = () => {
    if (selectedBenchmark && selectedWalletIds.size === 0) {
      return "Selecione 1 carteira para comparar com benchmark (0/1)";
    }
    if (selectedBenchmark && selectedWalletIds.size === 1) {
      return "Pronto! Clique em comparar (1/1)";
    }
    if (selectedWalletIds.size === 1 && !selectedBenchmark) {
      return "Selecione 1 benchmark ou mais 1 carteira (1/2)";
    }
    if (selectedWalletIds.size === 2) {
      return "Pronto! Clique em comparar 2 carteiras (2/2)";
    }
    return "Selecione 2 carteiras OU 1 carteira + 1 benchmark";
  };

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

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >

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
              {getSelectionInfo()}
            </Paragraph>
            <Separator />
          </YStack>
        )}

        {/* Wallets Section - Horizontal Scroll */}
        <YStack gap="$2" mb="$4">
          <YStack px="$4">
            <H6 fontSize={16} fontWeight="700" color="$gray12">
              Carteiras
            </H6>
          </YStack>

          {isLoadingWallets ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                gap: 12,
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <CompactWalletCardSkeleton key={i} />
              ))}
            </ScrollView>
          ) : walletData && walletData.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                gap: 12,
              }}
            >
              {walletData.map((item) => (
                <CompactWalletCard
                  key={item.PortfolioId}
                  item={item}
                  isSelectingActive={isSelectingActive}
                  isSelected={selectedWalletIds.has(item.PortfolioId)}
                  onToggleSelect={toggleWalletSelection}
                />
              ))}
            </ScrollView>
          ) : (
            <YStack px="$4" py="$8">
              <EmptyState />
            </YStack>
          )}
        </YStack>

        {/* Benchmarks Section */}
        <YStack px="$4" pt="$4" gap="$3" pb="$4">
          <H6 fontSize={16} fontWeight="700" color="$gray12">
            Comparar com Benchmarks
          </H6>

          <YStack gap="$3" opacity={isSelectingActive ? 1 : 0.5}>
            <XStack gap="$3">
              <YStack flex={1}>
                <BenchmarkCard
                  benchmark={benchmarks[0]}
                  isSelected={selectedBenchmark === benchmarks[0]}
                  onPress={
                    isSelectingActive
                      ? () => toggleBenchmarkSelection(benchmarks[0])
                      : undefined
                  }
                />
              </YStack>
              <YStack flex={1}>
                <BenchmarkCard
                  benchmark={benchmarks[1]}
                  isSelected={selectedBenchmark === benchmarks[1]}
                  onPress={
                    isSelectingActive
                      ? () => toggleBenchmarkSelection(benchmarks[1])
                      : undefined
                  }
                />
              </YStack>
            </XStack>
            <XStack gap="$3">
              <YStack flex={1}>
                <BenchmarkCard
                  benchmark={benchmarks[2]}
                  isSelected={selectedBenchmark === benchmarks[2]}
                  onPress={
                    isSelectingActive
                      ? () => toggleBenchmarkSelection(benchmarks[2])
                      : undefined
                  }
                />
              </YStack>
              <YStack flex={1}>
                <BenchmarkCard
                  benchmark={benchmarks[3]}
                  isSelected={selectedBenchmark === benchmarks[3]}
                  onPress={
                    isSelectingActive
                      ? () => toggleBenchmarkSelection(benchmarks[3])
                      : undefined
                  }
                />
              </YStack>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>

      {/* Unified FloatButton */}
      {canCompare && (
        <FloatButton
          isLoading={isPendingCompare || isPendingBenchmarkCompare}
          text={getCompareButtonText()}
          handleConfirm={handleCompare}
          disabled={!initialYear || !finalYear}
        />
      )}

      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={closeComparisonModal}
        comparisonData={comparisonData}
      />

      <BenchmarkComparisonModal
        isOpen={isBenchmarkModalOpen}
        onClose={closeBenchmarkModal}
        comparisonData={benchmarkComparisonData}
      />
    </Layout>
  );
};
