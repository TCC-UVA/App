import { SkeletonBox } from "@/src/components/base/skeleton";
import { Card, Separator, XStack, YStack } from "tamagui";

export const WalletCardSkeleton = () => {
  return (
    <Card
      testID="wallet-card-skeleton"
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
