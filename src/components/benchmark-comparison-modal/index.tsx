import { benchmarkToLabel } from "@/src/models/benchmark";
import { ComparePortfolioBenchmarkResponseDto } from "@/src/services/wallet/dto/compare-portfolio-benchmark-response.dto";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

interface BenchmarkComparisonModalProps {
  isOpen: boolean;
  comparisonData?: ComparePortfolioBenchmarkResponseDto;
  onClose: () => void;
  handleAIAnalysis?: () => void;
}

export const BenchmarkComparisonModal = ({
  isOpen,
  onClose,
  comparisonData,
}: BenchmarkComparisonModalProps) => {
  const theme = useTheme();
  const router = useRouter();

  const handleAIAnalysis = () => {
    if (!comparisonData) return;

    const params = JSON.stringify({
      PortfolioId: comparisonData.PortfolioId,
      Assets: comparisonData.Assets,
      ConsolidatedProfitability: comparisonData.ConsolidatedProfitability,
      InitialDate: comparisonData.InitialDate,
      FinalDate: comparisonData.FinalDate,
      walletName: `Comparação com ${comparisonData.Benchmark}`,
      Benchmark: comparisonData.Benchmark,
      BenchmarkValue: comparisonData.BenchmarkValue,
      type: "benchmark",
    });

    router.push({
      pathname: "/ai-insights",
      params: {
        params,
      },
    });
    onClose();
  };

  const parseProfit = (profitStr: string): number => {
    const match = profitStr?.match(/-?\d+\.?\d*/);
    const parsed = match ? parseFloat(match[0]) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const period = {
    InitialDate: comparisonData?.InitialDate,
    FinalDate: comparisonData?.FinalDate,
  };

  if (!comparisonData || !period) {
    return (
      <Dialog modal open={false} onOpenChange={onClose}>
        <Dialog.Portal />
      </Dialog>
    );
  }

  const portfolioProfit = parseProfit(comparisonData.ConsolidatedProfitability);
  const benchmarkProfit = parseProfit(comparisonData.BenchmarkValue);

  const maxProfit = Math.max(
    Math.abs(portfolioProfit),
    Math.abs(benchmarkProfit),
    1
  );

  const getProfitColor = (profit: number) => {
    return profit > 0 ? "$green10" : profit < 0 ? "$red10" : "$gray11";
  };

  const portfolioWins = portfolioProfit > benchmarkProfit;
  const isTie = portfolioProfit === benchmarkProfit;

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth * 0.85;

  const chartConfig = {
    backgroundColor: String(theme.background?.val || "#fff"),
    backgroundGradientFrom: String(theme.gray2?.val || "#f5f5f5"),
    backgroundGradientTo: String(theme.gray3?.val || "#e5e5e5"),
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) =>
      String(theme.gray11?.val || `rgba(0, 0, 0, ${opacity})`),
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 11,
    },
  };

  // Comparison chart data
  const comparisonChartData = {
    labels: ["Portfolio", benchmarkToLabel[comparisonData.Benchmark]],
    datasets: [
      {
        data: [portfolioProfit, benchmarkProfit],
        colors: [
          (opacity = 1) =>
            portfolioProfit >= 0
              ? `rgba(59, 130, 246, ${opacity})` // Blue
              : `rgba(239, 68, 68, ${opacity})`, // Red
          (opacity = 1) =>
            benchmarkProfit >= 0
              ? `rgba(34, 197, 94, ${opacity})` // Green
              : `rgba(239, 68, 68, ${opacity})`, // Red
        ],
      },
    ],
  };

  const renderPortfolioDetails = () => {
    const profitColor = getProfitColor(portfolioProfit);
    const rawProgress =
      maxProfit > 0 ? (Math.abs(portfolioProfit) / maxProfit) * 100 : 0;
    const progressValue = Math.floor(Math.min(100, Math.max(0, rawProgress)));

    return (
      <YStack bg="$gray2" p="$4" borderRadius="$4" gap="$3">
        <XStack alignItems="center" justifyContent="space-between">
          <H6 fontSize={16} fontWeight="700" color="$blue11">
            Carteira
          </H6>
          <XStack bg="$blue3" px="$2" py="$1" borderRadius="$2">
            <Paragraph fontSize={11} color="$blue11">
              Carteira
            </Paragraph>
          </XStack>
        </XStack>

        <Separator />

        <YStack gap="$2">
          <Paragraph fontSize={12} color="$gray11" fontWeight="600">
            Rentabilidade Consolidada
          </Paragraph>
          <H5 fontSize={24} color={profitColor} fontWeight="700">
            {comparisonData.ConsolidatedProfitability}
          </H5>
          <Progress value={progressValue} max={100} h="$1" bg="$gray5">
            <Progress.Indicator animation="fast" bg={profitColor} />
          </Progress>
        </YStack>

        <Separator />

        <YStack gap="$2">
          <XStack alignItems="center" gap="$2">
            <Ionicons
              name="pulse-outline"
              size={14}
              color={String(theme.gray11?.val)}
            />
            <Paragraph fontSize={12} color="$gray11" fontWeight="600">
              Ativos ({Object.keys(comparisonData.Assets || {}).length})
            </Paragraph>
          </XStack>
          <YStack gap="$1.5">
            {Object.entries(comparisonData.Assets || {}).map(
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
              <H5>Carteira vs {benchmarkToLabel[comparisonData.Benchmark]}</H5>
            </Dialog.Title>
            <Dialog.Description>
              <Paragraph color="$gray11" fontSize={13}>
                Período: {period.InitialDate} - {period.FinalDate}
              </Paragraph>
            </Dialog.Description>
          </YStack>

          {!isTie && (
            <XStack
              bg={portfolioWins ? "$blue2" : "$green2"}
              p="$3"
              borderRadius="$3"
              alignItems="center"
              gap="$2"
              borderWidth={1}
              borderColor={portfolioWins ? "$blue6" : "$green6"}
            >
              <Ionicons
                name={portfolioWins ? "trophy" : "analytics"}
                size={20}
                color={String(
                  portfolioWins ? theme.blue10?.val : theme.green10?.val
                )}
              />
              <YStack flex={1}>
                <Paragraph
                  fontSize={13}
                  fontWeight="600"
                  color={portfolioWins ? "$blue11" : "$green11"}
                >
                  {portfolioWins
                    ? `Portfolio superou ${
                        benchmarkToLabel[comparisonData.Benchmark]
                      }`
                    : `${
                        benchmarkToLabel[comparisonData.Benchmark]
                      } superou Portfolio`}
                </Paragraph>
              </YStack>
            </XStack>
          )}

          <Separator />

          <ScrollView style={{ maxHeight: 500 }}>
            <YStack gap="$4" pb="$3">
              <YStack gap="$2">
                <Paragraph fontSize={14} color="$gray11" fontWeight="600">
                  Rentabilidade Total
                </Paragraph>

                <YStack
                  alignItems="center"
                  bg="$gray2"
                  borderRadius="$4"
                  p="$3"
                >
                  <BarChart
                    data={comparisonChartData}
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

              <Separator />

              <YStack bg="$green2" p="$4" borderRadius="$4" gap="$3">
                <XStack alignItems="center" justifyContent="space-between">
                  <H6 fontSize={16} fontWeight="700" color="$green11">
                    {benchmarkToLabel[comparisonData.Benchmark]}
                  </H6>
                  <XStack bg="$green3" px="$2" py="$1" borderRadius="$2">
                    <Paragraph fontSize={11} color="$green11">
                      Benchmark
                    </Paragraph>
                  </XStack>
                </XStack>

                <Separator />

                <YStack gap="$2">
                  <Paragraph fontSize={12} color="$gray11" fontWeight="600">
                    Rentabilidade
                  </Paragraph>
                  <H5
                    fontSize={24}
                    color={getProfitColor(benchmarkProfit)}
                    fontWeight="700"
                  >
                    {comparisonData.BenchmarkValue}
                  </H5>
                </YStack>
              </YStack>

              <Separator />

              {/* Portfolio Details */}
              {renderPortfolioDetails()}
            </YStack>
          </ScrollView>

          <XStack gap="$3" justifyContent="space-between">
            <Button
              variant="outlined"
              borderColor="$blue10"
              color="$blue10"
              fontSize="$3"
              onPress={handleAIAnalysis}
              icon={
                <Ionicons
                  name="sparkles"
                  size={18}
                  color={String(theme.blue10?.val)}
                />
              }
            >
              Análise com IA
            </Button>

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
