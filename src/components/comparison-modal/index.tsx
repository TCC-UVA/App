import { CompareTwoWalletsResponseDto } from "@/src/services/wallet/dto/compare-two-wallets-response.dto";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import {
  Button,
  Dialog,
  H5,
  H6,
  Paragraph,
  Progress,
  Separator,
  useTheme,
  XStack,
  YStack,
} from "tamagui";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparisonData?: CompareTwoWalletsResponseDto;
}

export const ComparisonModal = ({
  isOpen,
  onClose,
  comparisonData,
}: ComparisonModalProps) => {
  const theme = useTheme();

  // Parse profitability percentages for comparison
  const parseProfit = (profitStr: string): number => {
    const match = profitStr?.match(/-?\d+\.?\d*/);
    const parsed = match ? parseFloat(match[0]) : 0;
    // Ensure we return a finite number, defaulting to 0 if invalid
    return Number.isFinite(parsed) ? parsed : 0;
  };

  // Safe data extraction with null checks
  const firstPortfolio = comparisonData?.["Portfolio 1"];
  const secondPortfolio = comparisonData?.["Portfolio 2"];
  const period = {
    InitialDate: firstPortfolio?.InitialDate,
    FinalDate: firstPortfolio?.FinalDate,
  };

  // Don't render if essential data is missing
  if (!firstPortfolio || !secondPortfolio || !period) {
    return (
      <Dialog modal open={false} onOpenChange={onClose}>
        <Dialog.Portal />
      </Dialog>
    );
  }

  const profit1 = parseProfit(firstPortfolio.ConsolidatedProfitability);
  const profit2 = parseProfit(secondPortfolio.ConsolidatedProfitability);
  // Ensure maxProfit is always at least 1 to avoid division by zero
  const maxProfit = Math.max(
    Math.abs(Number.isFinite(profit1) ? profit1 : 0),
    Math.abs(Number.isFinite(profit2) ? profit2 : 0),
    1
  );

  const getProfitColor = (profit: number) => {
    return profit > 0 ? "$green10" : profit < 0 ? "$red10" : "$gray11";
  };

  const renderWalletCard = (
    portfolio: NonNullable<typeof firstPortfolio>,
    index: number
  ) => {
    const profit = parseProfit(portfolio?.ConsolidatedProfitability || "");
    const profitColor = getProfitColor(profit);
    // Calculate progress safely - clamp between 0-100 and ensure it's an integer
    const rawProgress = maxProfit > 0 ? (Math.abs(profit) / maxProfit) * 100 : 0;
    const progressValue = Math.floor(Math.min(100, Math.max(0, rawProgress)));

    return (
      <YStack
        key={index}
        bg="$gray2"
        p="$4"
        borderRadius="$4"
        gap="$3"
        flex={1}
      >
        <XStack alignItems="center" justifyContent="space-between">
          <H6 fontSize={16} fontWeight="700" color="$blue11">
            {portfolio?.PortfolioName || "Carteira"}
          </H6>
          <XStack
            bg={index === 0 ? "$blue3" : "$purple3"}
            px="$2"
            py="$1"
            borderRadius="$2"
          >
            <Paragraph
              fontSize={11}
              color={index === 0 ? "$blue11" : "$purple11"}
            >
              Carteira {index + 1}
            </Paragraph>
          </XStack>
        </XStack>

        <Separator />

        {/* Consolidated Profitability */}
        <YStack gap="$2">
          <Paragraph fontSize={12} color="$gray11" fontWeight="600">
            Rentabilidade Consolidada
          </Paragraph>
          <H5 fontSize={24} color={profitColor} fontWeight="700">
            {portfolio?.ConsolidatedProfitability || "0%"}
          </H5>
          <Progress value={progressValue} max={100} h="$1" bg="$gray5">
            <Progress.Indicator animation="fast" bg={profitColor} />
          </Progress>
        </YStack>

        <Separator />

        {/* Assets */}
        <YStack gap="$2">
          <XStack alignItems="center" gap="$2">
            <Ionicons
              name="pulse-outline"
              size={14}
              color={String(theme.gray11?.val)}
            />
            <Paragraph fontSize={12} color="$gray11" fontWeight="600">
              Ativos ({Object.keys(portfolio?.Assets || {}).length})
            </Paragraph>
          </XStack>
          <YStack gap="$1.5">
            {Object.entries(portfolio?.Assets || {}).map(
              ([asset, profitability]) => (
                <XStack
                  key={asset}
                  justifyContent="space-between"
                  alignItems="center"
                  bg="$gray3"
                  px="$2.5"
                  py="$2"
                  borderRadius="$2"
                >
                  <Paragraph fontSize={13} color="$color">
                    {asset}
                  </Paragraph>
                  <Paragraph
                    fontSize={13}
                    color={getProfitColor(parseProfit(profitability))}
                    fontWeight="600"
                  >
                    {profitability}
                  </Paragraph>
                </XStack>
              )
            )}
          </YStack>
        </YStack>
      </YStack>
    );
  };

  // Comparison summary
  const winner =
    profit1 > profit2
      ? firstPortfolio?.PortfolioName
      : profit2 > profit1
      ? secondPortfolio?.PortfolioName
      : null;
  const difference = Math.abs(profit1 - profit2).toFixed(2);

  // Chart configuration
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth * 0.85;

  const chartConfig = {
    backgroundColor: String(theme.background?.val || "#fff"),
    backgroundGradientFrom: String(theme.gray2?.val || "#f5f5f5"),
    backgroundGradientTo: String(theme.gray3?.val || "#e5e5e5"),
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => String(theme.gray11?.val || `rgba(0, 0, 0, ${opacity})`),
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 10, // Smaller font to fit longer names
    },
    propsForVerticalLabels: {
      fontSize: 10,
    },
  };

  // Portfolio comparison chart data
  // Use simple labels since we have a legend above
  const portfolioChartData = {
    labels: ["P1", "P2"],
    datasets: [
      {
        data: [profit1, profit2],
        colors: [
          // P1 - Blue shade (matching legend)
          (opacity = 1) =>
            profit1 >= 0
              ? `rgba(59, 130, 246, ${opacity})` // Blue for profit
              : `rgba(239, 68, 68, ${opacity})`, // Red for loss
          // P2 - Purple shade (matching legend)
          (opacity = 1) =>
            profit2 >= 0
              ? `rgba(168, 85, 247, ${opacity})` // Purple for profit
              : `rgba(239, 68, 68, ${opacity})`, // Red for loss
        ],
      },
    ],
  };

  // Combine all assets from both portfolios and get the best performers overall
  const getAllAssets = () => {
    const assets1 = Object.entries(firstPortfolio?.Assets || {}).map(
      ([name, profit]) => ({
        name,
        profit: parseProfit(profit),
        portfolio: 1,
      })
    );

    const assets2 = Object.entries(secondPortfolio?.Assets || {}).map(
      ([name, profit]) => ({
        name,
        profit: parseProfit(profit),
        portfolio: 2,
      })
    );

    // Combine all assets and group by name, keeping the best profit
    const assetMap = new Map<string, { name: string; profit: number }>();

    [...assets1, ...assets2].forEach((asset) => {
      const existing = assetMap.get(asset.name);
      if (!existing || asset.profit > existing.profit) {
        assetMap.set(asset.name, { name: asset.name, profit: asset.profit });
      }
    });

    // Convert to array and sort by profit (highest to lowest)
    return Array.from(assetMap.values())
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5);
  };

  const topAssets = getAllAssets();
  const allAssetNames = topAssets.map((a) => a.name);

  // For assets chart, show the better (higher) profit between the two portfolios
  const assetsChartData = {
    labels: allAssetNames.map((name) => name.substring(0, 6)),
    datasets: [
      {
        data: topAssets.map((asset) => asset.profit),
        colors: topAssets.map((asset) => {
          return (opacity = 1) =>
            asset.profit >= 0
              ? `rgba(34, 197, 94, ${opacity})`
              : `rgba(239, 68, 68, ${opacity})`;
        }),
      },
    ],
  };

  return (
    <Dialog modal open={isOpen && !!comparisonData} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="fast"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={["transform", "opacity"]}
          animation={[
            "fast",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
          maxHeight="85%"
          w="95%"
        >
          <YStack gap="$2">
            <Dialog.Title>
              <H5>Comparação de Carteiras</H5>
            </Dialog.Title>
            <Dialog.Description>
              <Paragraph color="$gray11" fontSize={13}>
                Período: {period.InitialDate} - {period.FinalDate}
              </Paragraph>
            </Dialog.Description>
          </YStack>

          {/* Winner Summary */}
          {winner && (
            <XStack
              bg="$blue2"
              p="$3"
              borderRadius="$3"
              alignItems="center"
              gap="$2"
              borderWidth={1}
              borderColor="$blue6"
            >
              <Ionicons
                name="trophy"
                size={20}
                color={String(theme.blue10?.val)}
              />
              <YStack flex={1}>
                <Paragraph fontSize={13} fontWeight="600" color="$blue11">
                  Melhor Performance
                </Paragraph>
                <Paragraph fontSize={12} color="$gray11">
                  {winner} ({difference}% de diferença)
                </Paragraph>
              </YStack>
            </XStack>
          )}

          <Separator />

          <ScrollView style={{ maxHeight: 500 }}>
            <YStack gap="$4" pb="$3">
              {/* Portfolio Comparison Chart */}
              <YStack gap="$2">
                <Paragraph fontSize={14} color="$gray11" fontWeight="600">
                  Comparação de Rentabilidade
                </Paragraph>

                {/* Portfolio names legend */}
                <XStack gap="$3" flexWrap="wrap" px="$2">
                  <XStack alignItems="center" gap="$2">
                    <YStack
                      w={12}
                      h={12}
                      bg="$blue10"
                      borderRadius="$2"
                    />
                    <Paragraph fontSize={11} color="$gray11">
                      <Paragraph fontSize={11} fontWeight="600" color="$gray12">
                        P1:{" "}
                      </Paragraph>
                      {firstPortfolio?.PortfolioName || "Portfolio 1"}
                    </Paragraph>
                  </XStack>
                  <XStack alignItems="center" gap="$2">
                    <YStack
                      w={12}
                      h={12}
                      bg="$purple10"
                      borderRadius="$2"
                    />
                    <Paragraph fontSize={11} color="$gray11">
                      <Paragraph fontSize={11} fontWeight="600" color="$gray12">
                        P2:{" "}
                      </Paragraph>
                      {secondPortfolio?.PortfolioName || "Portfolio 2"}
                    </Paragraph>
                  </XStack>
                </XStack>

                <YStack alignItems="center" bg="$gray2" borderRadius="$4" p="$3">
                  <BarChart
                    data={portfolioChartData}
                    width={chartWidth}
                    height={220}
                    chartConfig={chartConfig}
                    showValuesOnTopOfBars
                    fromZero
                    yAxisLabel=""
                    yAxisSuffix="%"
                    withInnerLines={false}
                    style={{
                      borderRadius: 16,
                    }}
                  />
                </YStack>
              </YStack>

              {/* Assets Comparison Chart */}
              {allAssetNames.length > 0 && (
                <YStack gap="$2">
                  <Paragraph fontSize={14} color="$gray11" fontWeight="600">
                    Top Ativos por Rentabilidade
                  </Paragraph>
                  <YStack alignItems="center" bg="$gray2" borderRadius="$4" p="$3">
                    <BarChart
                      data={assetsChartData}
                      width={chartWidth}
                      height={220}
                      chartConfig={chartConfig}
                      showValuesOnTopOfBars
                      fromZero
                      yAxisLabel=""
                      yAxisSuffix="%"
                      withInnerLines={false}
                      style={{
                        borderRadius: 16,
                      }}
                    />
                  </YStack>
                </YStack>
              )}

              <Separator />

              {/* Portfolio Cards */}
              <YStack gap="$3">
                {renderWalletCard(firstPortfolio, 0)}
                {renderWalletCard(secondPortfolio, 1)}
              </YStack>
            </YStack>
          </ScrollView>

          <XStack gap="$3" justifyContent="flex-end">
            <Dialog.Close displayWhenAdapted asChild>
              <Button
                bg="$blue10"
                color="white"
                fontSize="$3"
                onPress={onClose}
              >
                Fechar
              </Button>
            </Dialog.Close>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
