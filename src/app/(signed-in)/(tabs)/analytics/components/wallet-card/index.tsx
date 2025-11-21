import { Wallet } from "@/src/models";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Card, Circle, H6, Paragraph, useTheme, XStack, YStack } from "tamagui";

const AnimatedCard = Animated.createAnimatedComponent(Card);

export { WalletCardSkeleton } from "./skeleton";

interface WalletCardProps {
  item: Wallet;
  index: number;
  isSelectingActive?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: number) => void;
}

export const WalletCard = ({
  item,
  index,
  isSelectingActive = false,
  isSelected = false,
  onToggleSelect,
}: WalletCardProps) => {
  const theme = useTheme();

  const handlePress = () => {
    if (isSelectingActive && onToggleSelect) {
      onToggleSelect(item.PortfolioId);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isSelected ? 0.98 : 1, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  return (
    <AnimatedCard
      entering={FadeInUp.delay(index * 100)
        .duration(600)
        .springify()}
      style={animatedStyle}
      bordered
      bg={isSelected ? "$blue2" : "$background"}
      borderColor={isSelected ? "$blue9" : "$gray5"}
      borderWidth={isSelected ? 3 : 1}
      borderRadius="$5"
      mb="$3"
      mx="$2"
      onPress={handlePress}
      pressStyle={{ scale: 0.97, opacity: 0.95 }}
      overflow="hidden"
    >
      {/* Selection Indicator Bar */}
      {isSelected && (
        <YStack
          position="absolute"
          top={0}
          left={0}
          bottom={0}
          w={6}
          bg="$blue10"
          zIndex={10}
        />
      )}

      <XStack p="$4" gap="$3" alignItems="flex-start">
        <YStack justifyContent="center" alignItems="center" w={50}>
          {isSelectingActive ? (
            <Circle
              size={44}
              bg={isSelected ? "$blue10" : "$gray4"}
              borderColor={isSelected ? "$blue11" : "$gray7"}
              borderWidth={2}
              pressStyle={{ scale: 0.9 }}
              onPress={() => onToggleSelect?.(item.PortfolioId)}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={24} color="white" />
              )}
            </Circle>
          ) : (
            <Circle size={44} bg="$blue4" borderColor="$blue8" borderWidth={2}>
              <Ionicons
                name="wallet"
                size={20}
                color={String(theme.blue10?.val)}
              />
            </Circle>
          )}
        </YStack>

        {/* Middle: Content */}
        <YStack flex={1} gap="$2.5">
          {/* Title */}
          <H6 color="$color" fontWeight="700" fontSize={17} lineHeight={22}>
            {item.name}
          </H6>

          {/* Stats Grid */}
          <XStack gap="$3" flexWrap="wrap">
            {/* Stocks Count */}
            <XStack
              alignItems="center"
              gap="$1.5"
              bg="$gray2"
              px="$2.5"
              py="$1.5"
              borderRadius="$3"
              flex={1}
              minWidth={100}
            >
              <Ionicons
                name="stats-chart"
                size={14}
                color={String(theme.gray11?.val || "#888888")}
              />
              <Paragraph fontSize={13} color="$gray12" fontWeight="500">
                {item.Assets.length || 0} ações
              </Paragraph>
            </XStack>
          </XStack>
        </YStack>
      </XStack>
    </AnimatedCard>
  );
};
