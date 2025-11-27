import { Quote } from "@/src/models/quote";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Card, H4, Paragraph, XStack, YStack } from "tamagui";

const AnimatedCard = Animated.createAnimatedComponent(Card);

type StockCardProps = {
  item: Quote;
  handleSelectStock: (item: Quote) => void;
  isSelected: boolean;
  index: number;
};

export const StockCard = ({
  handleSelectStock,
  item,
  isSelected,
  index,
}: StockCardProps) => {
  return (
    <AnimatedCard
      entering={FadeInUp.delay(index * 50)
        .duration(600)
        .springify()}
      bordered
      bg={isSelected ? "$blue3" : "$background"}
      borderColor={isSelected ? "$blue10" : "$gray6"}
      borderWidth={isSelected ? 2 : 1}
      borderRadius="$4"
      p="$4"
      mb="$3"
      onPress={() => handleSelectStock(item)}
      pressStyle={{ scale: 0.97, opacity: 0.9 }}
    >
      <XStack alignItems="center" justifyContent="space-between">
        <YStack flex={1} gap="$2">
          <XStack alignItems="center" gap="$3">
            <YStack
              bg={isSelected ? "$blue10" : "$gray5"}
              w={48}
              h={48}
              borderRadius={24}
              alignItems="center"
              justifyContent="center"
            >
              <Paragraph
                color={isSelected ? "white" : "$gray11"}
                fontWeight="700"
                fontSize={16}
              >
                {item.symbol?.substring(0, 2) || "??"}
              </Paragraph>
            </YStack>
            <YStack flex={1}>
              <H4 fontSize={14} color="$color" fontWeight="700" mb="$1">
                {item?.symbol || "--"}
              </H4>
              <Paragraph fontSize={14} color="$gray11" numberOfLines={1}>
                {item?.longname || item?.shortname || "Nome indisponível"}
              </Paragraph>
            </YStack>
          </XStack>
        </YStack>

        <YStack
          bg={isSelected ? "$blue10" : "$gray5"}
          w={28}
          h={28}
          borderRadius={14}
          alignItems="center"
          justifyContent="center"
        >
          {isSelected && <Ionicons name="checkmark" size={20} color="white" />}
        </YStack>
      </XStack>
    </AnimatedCard>
  );
};
