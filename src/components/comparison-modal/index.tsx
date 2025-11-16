import { Ionicons } from "@expo/vector-icons";
import { Wallet } from "@/src/mock/wallets";
import { ScrollView } from "react-native";
import {
  Button,
  Dialog,
  H5,
  H6,
  Paragraph,
  Separator,
  useTheme,
  XStack,
  YStack,
} from "tamagui";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: Wallet[];
}

export const ComparisonModal = ({
  isOpen,
  onClose,
  wallets,
}: ComparisonModalProps) => {
  const theme = useTheme();

  const renderMetricRow = (label: string, icon: string, values: string[]) => (
    <YStack gap="$2" mb="$3">
      <XStack alignItems="center" gap="$2">
        <Ionicons
          name={icon as any}
          size={16}
          color={String(theme.gray11?.val || "#888888")}
        />
        <Paragraph fontSize={13} color="$gray11" fontWeight="600">
          {label}
        </Paragraph>
      </XStack>
      <XStack gap="$2" flexWrap="wrap">
        {values.map((value, idx) => (
          <YStack
            key={idx}
            bg="$gray3"
            px="$3"
            py="$2"
            borderRadius="$2"
            flex={1}
            minWidth={100}
          >
            <Paragraph fontSize={14} color="$color" fontWeight="500">
              {value}
            </Paragraph>
          </YStack>
        ))}
      </XStack>
    </YStack>
  );

  const renderProfitRow = (wallets: Wallet[]) => {
    return (
      <YStack gap="$2" mb="$3">
        <XStack alignItems="center" gap="$2">
          <Ionicons
            name="trending-up"
            size={16}
            color={String(theme.gray11?.val || "#888888")}
          />
          <Paragraph fontSize={13} color="$gray11" fontWeight="600">
            Rentabilidade
          </Paragraph>
        </XStack>
        <XStack gap="$2" flexWrap="wrap">
          {wallets.map((wallet, idx) => {
            const profitPercentage = wallet.profitPercentage || 0;
            const profitColor =
              profitPercentage > 0
                ? "$green10"
                : profitPercentage < 0
                ? "$red10"
                : "$gray11";
            const profitSign = profitPercentage > 0 ? "+" : "";

            return (
              <YStack
                key={idx}
                bg="$gray3"
                px="$3"
                py="$2"
                borderRadius="$2"
                flex={1}
                minWidth={100}
              >
                <Paragraph fontSize={14} color={profitColor} fontWeight="600">
                  {profitSign}
                  {profitPercentage.toFixed(2)}%
                </Paragraph>
              </YStack>
            );
          })}
        </XStack>
      </YStack>
    );
  };

  return (
    <Dialog modal open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
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
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
          maxHeight="80%"
          w="90%"
        >
          <Dialog.Title>
            <H5>Comparação de Carteiras</H5>
          </Dialog.Title>
          <Dialog.Description>
            <Paragraph color="$gray11">
              Comparando {wallets.length}{" "}
              {wallets.length === 1 ? "carteira" : "carteiras"}
            </Paragraph>
          </Dialog.Description>

          <ScrollView style={{ maxHeight: 400 }}>
            <YStack gap="$3" pt="$2">
              {/* Wallet Names */}
              <YStack gap="$2" mb="$2">
                <Paragraph fontSize={13} color="$gray11" fontWeight="600">
                  Carteiras
                </Paragraph>
                <XStack gap="$2" flexWrap="wrap">
                  {wallets.map((wallet) => (
                    <YStack
                      key={wallet.id}
                      bg="$blue3"
                      px="$3"
                      py="$2"
                      borderRadius="$2"
                      flex={1}
                      minWidth={100}
                    >
                      <H6 fontSize={14} color="$blue11" fontWeight="600">
                        {wallet.name}
                      </H6>
                    </YStack>
                  ))}
                </XStack>
              </YStack>

              <Separator />

              {/* Metrics */}
              {renderMetricRow(
                "Número de Ações",
                "pulse-outline",
                wallets.map((w) => `${w.stocksCount} ações`)
              )}

              {renderMetricRow(
                "Data de Criação",
                "calendar-outline",
                wallets.map((w) => w.createdAt)
              )}

              {renderMetricRow(
                "Valor Total",
                "cash-outline",
                wallets.map((w) =>
                  w.totalValue
                    ? `R$ ${w.totalValue.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}`
                    : "N/A"
                )
              )}

              {renderProfitRow(wallets)}
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
