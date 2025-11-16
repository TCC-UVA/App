import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { H4, Paragraph, useTheme, YStack } from "tamagui";

export const Empty = () => {
  const theme = useTheme();
  return (
    <Animated.View entering={FadeInDown.duration(600).springify()}>
      <YStack alignItems="center" justifyContent="center" py="$8" px="$4">
        <YStack
          bg="$gray4"
          w={100}
          h={100}
          borderRadius={50}
          alignItems="center"
          justifyContent="center"
          mb="$6"
        >
          <Ionicons
            name="search-outline"
            size={50}
            color={String(theme.gray11?.val || "#888888")}
          />
        </YStack>
        <H4
          fontSize={14}
          color="$color"
          textAlign="center"
          fontWeight="700"
          mb="$2"
        >
          Nenhuma ação encontrada
        </H4>
        <Paragraph fontSize={14} color="$gray11" textAlign="center">
          {false
            ? "Tente buscar por outro nome ou ticker"
            : "Não há ações disponíveis no momento"}
        </Paragraph>
      </YStack>
    </Animated.View>
  );
};
