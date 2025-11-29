import { ConfirmActionSheet } from "@/src/components/base/confirm-action-sheet";
import { Header } from "@/src/components/header";
import { Layout } from "@/src/components/layout";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Button, useTheme } from "tamagui";
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
        <TouchableOpacity
          testID="logout-button"
          onPress={handleToggleSignOutSheet}
        >
          <Ionicons size={24} name="log-out-outline" color={theme.red10.val} />
        </TouchableOpacity>
      </Header>

      {signOutSheetOpen && (
        <ConfirmActionSheet
          isOpen={signOutSheetOpen}
          onClose={handleToggleSignOutSheet}
          title="Deseja realmente sair da sua conta?"
        >
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
        </ConfirmActionSheet>
      )}
    </Layout>
  );
};
