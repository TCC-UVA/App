import { Wallet } from "@/src/models";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Card, Circle, Paragraph, useTheme, XStack, YStack } from "tamagui";
import { useEffect } from "react";

interface CompactWalletCardProps {
  item: Wallet;
  isSelectingActive?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: number) => void;
}

export const CompactWalletCard = ({
  item,
  isSelectingActive = false,
  isSelected = false,
  onToggleSelect,
}: CompactWalletCardProps) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(isSelected ? 1.02 : 1, {
      damping: 15,
      stiffness: 150,
    });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (isSelectingActive && onToggleSelect) {
      onToggleSelect(item.PortfolioId);
    }
  };

  const assetCount = Object.keys(item.Assets || {}).length;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Card
          elevate
          bordered
          bg={isSelected ? "$blue2" : "$background"}
          borderColor={isSelected ? "$blue8" : "$gray6"}
          borderWidth={isSelected ? 2 : 1}
          borderRadius="$4"
          p="$4"
          w={200}
          h={140}
          animation="fast"
          position="relative"
        >
          {/* Selection indicator */}
          {isSelected && (
            <YStack
              position="absolute"
              top={0}
              left={0}
              bottom={0}
              w={4}
              bg="$blue10"
              borderTopLeftRadius="$4"
              borderBottomLeftRadius="$4"
            />
          )}

          <YStack
            flex={1}
            justifyContent="space-between"
            paddingLeft={isSelected ? "$2" : "$0"}
          >
            {/* Header with selection circle */}
            <XStack alignItems="center" justifyContent="space-between">
              <Circle
                size={48}
                bg={isSelected ? "$blue10" : "$gray11"}
                animation="fast"
              >
                <Ionicons
                  name="wallet"
                  size={24}
                  color={String(theme.background?.val)}
                />
              </Circle>

              {isSelected && (
                <Circle size={24} bg="$blue10">
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={String(theme.blue10?.val)}
                  />
                </Circle>
              )}
            </XStack>

            {/* Portfolio name */}
            <YStack gap="$1" flex={1} justifyContent="center">
              <Paragraph
                fontSize={15}
                fontWeight="700"
                color={isSelected ? "$blue11" : "$gray12"}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.name}
              </Paragraph>
            </YStack>

            {/* Asset count badge */}
            <XStack
              bg={isSelected ? "$blue3" : "$gray3"}
              px="$2.5"
              py="$1.5"
              borderRadius="$3"
              alignSelf="flex-start"
              alignItems="center"
              gap="$1.5"
            >
              <Ionicons
                name="pie-chart"
                size={12}
                color={String(isSelected ? theme.blue11?.val : theme.gray11?.val)}
              />
              <Paragraph
                fontSize={11}
                fontWeight="600"
                color={isSelected ? "$blue11" : "$gray11"}
              >
                {assetCount} {assetCount === 1 ? "ativo" : "ativos"}
              </Paragraph>
            </XStack>
          </YStack>
        </Card>
      </Pressable>
    </Animated.View>
  );
};
