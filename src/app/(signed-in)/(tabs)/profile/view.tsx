import { Header } from "@/src/components/header";
import { Layout } from "@/src/components/layout";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Button, Paragraph, Sheet, useTheme, YStack } from "tamagui";
import { useProfileViewModel } from "./viewModel";

export const ProfileView = ({
  handleToggleSignOutSheet,
  handleSignout,
  signOutSheetOpen,
}: ReturnType<typeof useProfileViewModel>) => {
  const theme = useTheme();
  return (
    <Layout>
      <Header>
        <TouchableOpacity onPress={handleToggleSignOutSheet}>
          <Ionicons size={24} name="log-out-outline" color={theme.red10.val} />
        </TouchableOpacity>
      </Header>

      <Sheet
        modal
        open={signOutSheetOpen}
        onOpenChange={handleToggleSignOutSheet}
        snapPoints={[25]}
        dismissOnSnapToBottom
        zIndex={100_000}
      >
        <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Frame p="$5" gap="$5">
          <YStack gap="$5" alignItems="center" flex={1} w={"100%"}>
            <Paragraph size={"$4"}>
              Deseja realmente sair da sua conta?
            </Paragraph>
            <YStack gap="$3" pb="$2" w={"100%"}>
              <Button bg="$blue10" color="white" onPress={handleSignout}>
                Sair
              </Button>
              <Button
                variant="outlined"
                borderColor="$gray8"
                color="$gray12"
                onPress={handleToggleSignOutSheet}
              >
                Cancelar
              </Button>
            </YStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </Layout>
  );
};
