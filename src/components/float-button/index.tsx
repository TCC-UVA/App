import { ActivityIndicator } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, YStack } from "tamagui";

type FloatButtonProps = {
  isLoading?: boolean;
  handleConfirm: () => void;
  text: string;
};

export const FloatButton = ({
  handleConfirm,
  text,
  isLoading = false,
}: FloatButtonProps) => {
  const { bottom } = useSafeAreaInsets();
  return (
    <Animated.View entering={FadeInUp.duration(600).springify()}>
      <YStack
        position="absolute"
        bottom={bottom - 50}
        left={16}
        right={16}
        bg="$background"
        borderRadius="$4"
        p="$3"
        gap="$2"
        shadowColor="$shadowColor"
        shadowRadius={12}
        shadowOffset={{ width: 0, height: -4 }}
      >
        <Button
          bg="$blue10"
          color="white"
          size="$5"
          borderRadius="$4"
          fontWeight="600"
          fontSize={16}
          onPress={handleConfirm}
          disabled={isLoading}
          opacity={isLoading ? 0.7 : 1}
        >
          {isLoading ? (
            <ActivityIndicator testID="confirm-stocks-loading" color="white" />
          ) : (
            text
          )}
        </Button>
      </YStack>
    </Animated.View>
  );
};
