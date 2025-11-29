import { Card, Circle, XStack, YStack } from "tamagui";

export const CompactWalletCardSkeleton = () => {
  return (
    <Card
      bordered
      bg="$background"
      borderColor="$gray6"
      borderWidth={1}
      borderRadius="$4"
      p="$4"
      w={200}
      h={140}
    >
      <YStack flex={1} justifyContent="space-between">
        {/* Header with circle */}
        <XStack alignItems="center" justifyContent="space-between">
          <Circle size={48} bg="$gray5" />
        </XStack>

        {/* Portfolio name skeleton */}
        <YStack gap="$2" flex={1} justifyContent="center">
          <YStack h={16} w="80%" bg="$gray5" borderRadius="$2" />
          <YStack h={16} w="60%" bg="$gray5" borderRadius="$2" />
        </YStack>

        {/* Asset count badge skeleton */}
        <XStack
          bg="$gray3"
          px="$2.5"
          py="$1.5"
          borderRadius="$3"
          w={80}
          h={24}
        />
      </YStack>
    </Card>
  );
};
