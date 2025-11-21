import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { YStack } from "tamagui";

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

export const SkeletonBox = ({
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
