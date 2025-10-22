import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import {
  Card,
  H6,
  Paragraph,
  Separator,
  useTheme,
  XStack,
  YStack,
} from "tamagui";

const AnimatedCard = Animated.createAnimatedComponent(Card);

export { WalletCardSkeleton } from "./skeleton";

export const WalletCard = ({ item, index }: { item: any; index: number }) => {
  const theme = useTheme();

  const profitColor =
    item.profitPercentage > 0
      ? "$green10"
      : item.profitPercentage < 0
      ? "$red10"
      : "$gray11";
  const profitSign = item.profitPercentage > 0 ? "+" : "";

  return (
    <AnimatedCard
      entering={FadeInUp.delay(index * 100)
        .duration(600)
        .springify()}
      bordered
      bg="$background"
      borderColor="$gray6"
      borderRadius="$4"
      mb="$3"
      onPress={() => {}}
      pressStyle={{ scale: 0.97, opacity: 0.9 }}
    >
      <XStack alignItems="center" justifyContent="space-between">
        <YStack flex={1} gap="$2" p="$4">
          <XStack alignItems="center" gap="$2">
            {/* <YStack
              bg="$blue10"
              w={28}
              h={28}
              borderRadius={20}
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons
                name="briefcase"
                size={16}
                color={String(theme.background?.val)}
              />
            </YStack> */}
            <H6 color="$color" fontWeight="700" flex={1}>
              {item.name}
            </H6>
          </XStack>
          <Separator />
          <XStack gap="$1" justifyContent="space-between" mt={"$2"} w="100%">
            <XStack alignItems="center" gap="$2">
              <Ionicons
                name="pulse-outline"
                size={16}
                color={String(theme.gray11?.val || "#888888")}
              />
              <Paragraph fontSize={14} color="$gray11">
                {item.stocksCount || 0} ações
              </Paragraph>
            </XStack>
            <XStack alignItems="center" gap="$2">
              <Ionicons
                name="calendar-outline"
                size={16}
                color={String(theme.gray11?.val || "#888888")}
              />
              <Paragraph fontSize={14} color="$gray11">
                {item.createdAt}
              </Paragraph>
            </XStack>
          </XStack>
          {item.profitPercentage !== undefined && (
            <XStack alignItems="center" gap="$2" mt="$2">
              <Ionicons
                name={
                  item.profitPercentage >= 0 ? "trending-up" : "trending-down"
                }
                size={16}
                color={String(theme[profitColor.slice(1)]?.val || "#888888")}
              />
              <Paragraph fontSize={14} color={profitColor} fontWeight="600">
                {profitSign}
                {item.profitPercentage.toFixed(2)}% de rentabilidade
              </Paragraph>
            </XStack>
          )}
        </YStack>
      </XStack>
    </AnimatedCard>
  );
};
