import { Wallet } from "@/src/models";
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

type WalletCardProps = {
  item: Wallet;
  index: number;
  onPress?: () => void;
};

export const WalletCard = ({ item, index, onPress }: WalletCardProps) => {
  const theme = useTheme();

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
      onPress={onPress}
      pressStyle={{ scale: 0.97, opacity: 0.9 }}
    >
      <XStack alignItems="center" justifyContent="space-between">
        <YStack flex={1} gap="$2" p="$4">
          <XStack alignItems="center" gap="$2">
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
                {item.Assets.length || 0} ações
              </Paragraph>
            </XStack>
          </XStack>
        </YStack>
      </XStack>
    </AnimatedCard>
  );
};
