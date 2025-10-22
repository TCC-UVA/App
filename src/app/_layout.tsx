import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TamaguiProvider } from "tamagui";
import config from "../config/tamagui";
export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#f3f" style={"dark"} />
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={config}>
          <SafeAreaView style={{ flex: 1 }}>
            <Slot />
          </SafeAreaView>
        </TamaguiProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
