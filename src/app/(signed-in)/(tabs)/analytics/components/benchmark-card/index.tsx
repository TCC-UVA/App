import { Benchmark } from "@/src/models/benchmark";
import { Ionicons } from "@expo/vector-icons";
import { Card, Paragraph, useTheme, XStack, YStack } from "tamagui";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";
import { Pressable } from "react-native";

interface BenchmarkCardProps {
  benchmark: Benchmark;
  isSelected: boolean;
  onPress?: () => void;
}

const BENCHMARK_INFO: Record<
  Benchmark,
  { name: string; description: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  [Benchmark.IPCA]: {
    name: "IPCA",
    description: "Inflação",
    icon: "trending-up",
  },
  [Benchmark.CDI]: {
    name: "CDI",
    description: "Taxa",
    icon: "cash",
  },
  [Benchmark.SELIC]: {
    name: "SELIC",
    description: "Juros",
    icon: "stats-chart",
  },
  [Benchmark.DOLLAR]: {
    name: "DÓLAR",
    description: "Câmbio",
    icon: "logo-usd",
  },
};

export const BenchmarkCard = ({
  benchmark,
  isSelected,
  onPress,
}: BenchmarkCardProps) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const info = BENCHMARK_INFO[benchmark];

  useEffect(() => {
    scale.value = withSpring(isSelected ? 1.05 : 1, {
      damping: 15,
      stiffness: 150,
    });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => ({
          opacity: !onPress ? 1 : pressed ? 0.7 : 1,
        })}
      >
        <Card
          elevate
          bordered
          size="$4"
          bg={isSelected ? "$blue2" : "$gray2"}
          borderColor={isSelected ? "$blue8" : "$gray6"}
          borderWidth={isSelected ? 2 : 1}
          p="$3"
          h={110}
          w="100%"
          animation="fast"
        >
          <YStack flex={1} justifyContent="space-between">
            <XStack justifyContent="space-between" alignItems="flex-start">
              <YStack
                bg={isSelected ? "$blue10" : "$gray11"}
                p="$2"
                borderRadius="$3"
              >
                <Ionicons
                  name={info.icon}
                  size={20}
                  color={String(theme.background?.val)}
                />
              </YStack>
              {isSelected && (
                <YStack
                  bg="$blue10"
                  w={24}
                  h={24}
                  borderRadius="$12"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={String(theme.background?.val)}
                  />
                </YStack>
              )}
            </XStack>

            <YStack gap="$1">
              <Paragraph
                fontSize={16}
                fontWeight="700"
                color={isSelected ? "$blue11" : "$gray12"}
              >
                {info.name}
              </Paragraph>
              <Paragraph fontSize={12} color="$gray11">
                {info.description}
              </Paragraph>
            </YStack>
          </YStack>
        </Card>
      </Pressable>
    </Animated.View>
  );
};
