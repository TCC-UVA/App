import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Card, Separator, XStack, YStack } from "tamagui";

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

const SkeletonBox = ({
  width,
  height,
}: {
  width: number | string;
  height: number;
}) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <AnimatedYStack
      bg="$gray6"
      w={width}
      h={height}
      borderRadius="$2"
      style={animatedStyle}
    />
  );
};

export const WalletCardSkeleton = () => {
  return (
    <Card
      bordered
      bg="$background"
      borderColor="$gray6"
      borderRadius="$4"
      mb="$3"
    >
      <YStack flex={1} gap="$2" p="$4">
        <XStack alignItems="center" gap="$2">
          <SkeletonBox width="60%" height={24} />
        </XStack>

        <Separator />

        <XStack gap="$1" justifyContent="space-between" mt="$2" w="100%">
          <XStack alignItems="center" gap="$2">
            <SkeletonBox width={16} height={16} />
            <SkeletonBox width={60} height={14} />
          </XStack>
          <XStack alignItems="center" gap="$2">
            <SkeletonBox width={16} height={16} />
            <SkeletonBox width={80} height={14} />
          </XStack>
        </XStack>

        <XStack alignItems="center" gap="$2" mt="$2">
          <SkeletonBox width={16} height={16} />
          <SkeletonBox width="50%" height={14} />
        </XStack>
      </YStack>
    </Card>
  );
};
