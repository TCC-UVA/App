import { PropsWithChildren } from "react";
import { Paragraph, Sheet, YStack } from "tamagui";

type ConfirmActionSheetProps = {
  title: string;
  onClose: () => void;
  isOpen: boolean;
};

export const ConfirmActionSheet = ({
  isOpen,
  onClose,
  title,
  children,
}: PropsWithChildren<ConfirmActionSheetProps>) => {
  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={onClose}
      snapPoints={[25]}
      dismissOnSnapToBottom
      zIndex={100_000}
    >
      <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame p="$5" gap="$5">
        <YStack gap="$5" alignItems="center" flex={1} w={"100%"}>
          <Paragraph size={"$4"}>{title}</Paragraph>
          <YStack gap="$3" pb="$2" w={"100%"}>
            {children}
          </YStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
