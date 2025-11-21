import { Stack } from "expo-router";
import { CreatePortfolioProvider } from "./context";

export default function Layout() {
  return (
    <CreatePortfolioProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="create" />
        <Stack.Screen name="select-stocks" />
        <Stack.Screen name="allocate-quantities" />
        <Stack.Screen name="edit-portfolio" />
      </Stack>
    </CreatePortfolioProvider>
  );
}
