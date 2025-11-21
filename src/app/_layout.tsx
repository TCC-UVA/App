if (__DEV__) {
  import("../../reactotron.config").then(() =>
    console.log("Reactotron Configured")
  );
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TamaguiProvider } from "tamagui";
import { ToastContainer, ToastProvider } from "../components/toast";
import config from "../config/tamagui";
import { useAuthStore } from "../store/auth";

export default function RootLayout() {
  const queryClient = new QueryClient();

  const token = useAuthStore((state) => state.token);

  if (!token) {
    <Redirect href={"/"} />;
  }
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#f3f" style={"dark"} />
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={config}>
          <ToastProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <Slot />
              <ToastContainer />
            </SafeAreaView>
          </ToastProvider>
        </TamaguiProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
