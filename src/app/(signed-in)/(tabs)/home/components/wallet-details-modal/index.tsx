import { SkeletonBox } from "@/src/components/base/skeleton";
import { Wallet } from "@/src/models";
import { GetDividendsYieldByWalletIdResponseDto } from "@/src/services/wallet/dto/get-dividends-yield-by-wallet-id-response.dto";
import { GetProfitsByWalletIdResponseDto } from "@/src/services/wallet/dto/get-profits-by-wallet-id-response.dto";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  AlertDialog,
  Button,
  H5,
  Input,
  Paragraph,
  Separator,
  Sheet,
  Spinner,
  ToggleGroup,
  XStack,
  YStack,
  useTheme,
} from "tamagui";

export type MetricType = "profitability" | "dividendYield";

type WalletDetailsModalProps = {
  wallet: Wallet | null;
  isOpen: boolean;
  onClose: () => void;
  onGetMetrics: (
    portfolioId: number,
    initialYear: string,
    finalYear: string,
    metricType: MetricType
  ) => void;
  onGetAIInsights: () => void;
  metricsData?:
    | GetDividendsYieldByWalletIdResponseDto
    | GetProfitsByWalletIdResponseDto
    | undefined;
  isLoadingMetrics?: boolean;
  currentMetricType: MetricType;
  setMetricType: (type: MetricType) => void;
};

export const WalletDetailsModal = ({
  wallet,
  isOpen,
  onClose,
  onGetMetrics,
  onGetAIInsights,
  metricsData,
  isLoadingMetrics = false,
  currentMetricType,
  setMetricType,
}: WalletDetailsModalProps) => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear().toString();
  const lastYear = (new Date().getFullYear() - 1).toString();

  const [initialYear, setInitialYear] = useState(lastYear);
  const [finalYear, setFinalYear] = useState(currentYear);
  const [showAIAlert, setShowAIAlert] = useState(false);

  if (!wallet) return null;

  const handleGetMetrics = () => {
    onGetMetrics(wallet.PortfolioId, initialYear, finalYear, currentMetricType);
  };

  const handleAIInsights = () => {
    if (!metricsData) {
      return setShowAIAlert(true);
    }
    onGetAIInsights();
  };

  const isProfit = currentMetricType === "profitability";

  const metricData = (name: string) => {
    if (isProfit) {
      return (
        Object.entries(metricsData?.Assets || {}).map(([key, profit]) =>
          key === name ? profit : null
        ) || "--"
      );
    }

    return (
      Object.entries(metricsData || {}).map(([key, yieldValue]) =>
        key === name ? yieldValue : null
      ) || "--"
    );
  };

  return (
    <Sheet
      zIndex={1000}
      modal
      open={isOpen}
      onOpenChange={(open: boolean) => !open && onClose()}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay
        zIndex={1000}
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame zIndex={1000} p="$4" gap="$4" bg="$background">
        <XStack alignItems="center" justifyContent="space-between">
          <H5>Detalhes da Carteira</H5>
          <Button
            size="$3"
            circular
            onPress={onClose}
            icon={
              <Ionicons
                name="close"
                size={20}
                color={String(theme.gray11?.val)}
              />
            }
          />
        </XStack>

        <Separator />

        <Sheet.ScrollView>
          <YStack gap="$3" pb="$4">
            <YStack gap="$2">
              <Paragraph fontSize={14} color="$gray11" fontWeight="600">
                Nome da Carteira
              </Paragraph>
              <Paragraph fontSize={16}>{wallet.name}</Paragraph>
            </YStack>

            <Separator />

            <YStack gap="$2">
              <Paragraph fontSize={14} color="$gray11" fontWeight="600">
                Total de Ativos
              </Paragraph>
              <Paragraph fontSize={16}>{wallet.Assets.length} ações</Paragraph>
            </YStack>
            <Separator />

            <YStack gap="$3">
              <Paragraph fontSize={14} color="$gray11" fontWeight="600">
                Tipo de Métrica
              </Paragraph>
              <ToggleGroup
                orientation="horizontal"
                type="single"
                value={currentMetricType}
                onValueChange={(value) => {
                  if (value) setMetricType(value as MetricType);
                }}
                disableDeactivation
              >
                <ToggleGroup.Item
                  value="profitability"
                  flex={1}
                  bg={
                    currentMetricType === "profitability" ? "$blue10" : "$gray3"
                  }
                  borderColor={
                    currentMetricType === "profitability" ? "$blue10" : "$gray6"
                  }
                  borderWidth={1}
                  pressStyle={{
                    bg:
                      currentMetricType === "profitability"
                        ? "$blue9"
                        : "$gray4",
                  }}
                >
                  <Paragraph
                    fontSize={14}
                    fontWeight="600"
                    color={
                      currentMetricType === "profitability"
                        ? "white"
                        : "$gray11"
                    }
                  >
                    Rentabilidade
                  </Paragraph>
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="dividendYield"
                  flex={1}
                  bg={
                    currentMetricType === "dividendYield" ? "$blue10" : "$gray3"
                  }
                  borderColor={
                    currentMetricType === "dividendYield" ? "$blue10" : "$gray6"
                  }
                  borderWidth={1}
                  pressStyle={{
                    bg:
                      currentMetricType === "dividendYield"
                        ? "$blue9"
                        : "$gray4",
                  }}
                >
                  <Paragraph
                    fontSize={14}
                    fontWeight="600"
                    color={
                      currentMetricType === "dividendYield"
                        ? "white"
                        : "$gray11"
                    }
                  >
                    Dividend Yield
                  </Paragraph>
                </ToggleGroup.Item>
              </ToggleGroup>
            </YStack>

            <Separator />

            {isProfit ? (
              <YStack gap="$2">
                <Paragraph fontSize={14} color="$gray11" fontWeight="600">
                  Rentabilidade Total da Carteira
                </Paragraph>
                {isLoadingMetrics ? (
                  <SkeletonBox width={100} height={24} />
                ) : metricsData?.ConsolidatedProfitability ? (
                  <Paragraph fontSize={18} color="$blue10" fontWeight="700">
                    {metricsData.ConsolidatedProfitability}
                  </Paragraph>
                ) : (
                  <Paragraph fontSize={16} color="$gray10">
                    -
                  </Paragraph>
                )}
              </YStack>
            ) : null}

            {wallet.Assets.length > 0 && (
              <>
                <Separator />
                <YStack gap="$3">
                  <Paragraph fontSize={14} color="$gray11" fontWeight="600">
                    Ativos na Carteira
                  </Paragraph>
                  {wallet.Assets.map((asset, index) => (
                    <XStack
                      key={index}
                      justifyContent="space-between"
                      alignItems="center"
                      bg="$gray3"
                      p="$3"
                      borderRadius="$3"
                    >
                      <XStack alignItems="center" gap="$2">
                        <Ionicons
                          name="pulse-outline"
                          size={16}
                          color={String(theme.blue10?.val)}
                        />
                        <Paragraph fontSize={15}>{asset.name}</Paragraph>
                      </XStack>
                      {isLoadingMetrics ? (
                        <SkeletonBox width={60} height={20} />
                      ) : (
                        <Paragraph
                          fontSize={15}
                          color="$blue10"
                          fontWeight="600"
                        >
                          {metricData(asset.name)}
                        </Paragraph>
                      )}
                    </XStack>
                  ))}
                </YStack>
              </>
            )}
          </YStack>
        </Sheet.ScrollView>

        <Separator />

        <YStack gap="$3">
          <Paragraph fontSize={14} color="$gray11" fontWeight="600">
            Obter Métricas dos Ativos
          </Paragraph>
          <XStack gap="$2" alignItems="flex-end">
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
          <YStack gap="$2">
            <Button
              bg="$blue10"
              color="white"
              onPress={handleGetMetrics}
              disabled={!initialYear || !finalYear || isLoadingMetrics}
              opacity={!initialYear || !finalYear || isLoadingMetrics ? 0.5 : 1}
              icon={
                isLoadingMetrics ? (
                  <Spinner size="small" color="white" />
                ) : (
                  <Ionicons
                    name="stats-chart-outline"
                    size={18}
                    color="white"
                  />
                )
              }
            >
              {isLoadingMetrics ? "Carregando..." : "Obter Métricas"}
            </Button>
            {isProfit && (
              <Button
                variant="outlined"
                borderColor="$blue10"
                color="$blue10"
                onPress={handleAIInsights}
                disabled={!initialYear || !finalYear}
                opacity={!initialYear || !finalYear ? 0.5 : 1}
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
            )}
          </YStack>
        </YStack>

        <AlertDialog open={showAIAlert} onOpenChange={setShowAIAlert}>
          <AlertDialog.Portal>
            <AlertDialog.Overlay
              key="overlay"
              animation="slow"
              opacity={0.5}
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
            <AlertDialog.Content
              bordered
              elevate
              key="content"
              animation={[
                "slow",
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
              enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
              exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
              gap="$4"
            >
              <YStack gap="$2">
                <AlertDialog.Title fontSize={18}>
                  Métricas Necessárias
                </AlertDialog.Title>
                <AlertDialog.Description fontSize={15} color="$gray11">
                  A análise com IA depende das métricas geradas. Por favor,
                  clique em &quot;Obter Métricas&quot; primeiro para gerar os
                  dados necessários para a análise.
                </AlertDialog.Description>
              </YStack>

              <XStack gap="$3" justifyContent="flex-end">
                <AlertDialog.Cancel asChild>
                  <Button
                    bg="$gray5"
                    color="$gray12"
                    onPress={() => setShowAIAlert(false)}
                  >
                    Entendi
                  </Button>
                </AlertDialog.Cancel>
              </XStack>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog>
      </Sheet.Frame>
    </Sheet>
  );
};
