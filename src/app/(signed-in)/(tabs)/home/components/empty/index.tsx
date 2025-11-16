import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Button, H5, Paragraph, useTheme, YStack } from "tamagui";

export const EmptyState = () => {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeInDown.duration(600).springify()}>
      <YStack alignItems="center" justifyContent="center" py="$8" px="$4">
        <YStack
          bg="$gray4"
          w={120}
          h={120}
          borderRadius={60}
          alignItems="center"
          justifyContent="center"
          mb="$6"
        >
          <Ionicons
            name="briefcase-outline"
            size={60}
            color={String(theme.gray11?.val || "#888888")}
          />
        </YStack>
        <H5 color="$color" textAlign="center" fontWeight="700" mb="$2">
          Nenhuma carteira ainda
        </H5>
        <Paragraph color="$gray11" textAlign="center" mb="$6">
          Crie sua primeira carteira de ações e comece a investir
        </Paragraph>
        <Button
          bg="$blue10"
          color="white"
          size="$4"
          borderRadius="$4"
          fontWeight="600"
          fontSize={16}
          onPress={() => {}}
          icon={<Ionicons name="add" size={20} color="white" />}
        >
          Criar Carteira
        </Button>
      </YStack>
    </Animated.View>
  );
};
