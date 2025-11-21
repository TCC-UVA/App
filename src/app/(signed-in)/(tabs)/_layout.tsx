import { useAuthStore } from "@/src/store/auth";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { useTheme } from "tamagui";

export default function Layout() {
  const token = useAuthStore((state) => state.token);
  const theme = useTheme();

  if (!token) {
    return <Redirect href={"/"} />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.blue10.val,
        headerShown: false,
      }}
    >
      <Tabs.Protected guard>
        <Tabs.Screen
          name="home/index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons size={20} name="home" color={color} />
            ),
          }}
        />
      </Tabs.Protected>
      <Tabs.Protected guard>
        <Tabs.Screen
          name="analytics/index"
          options={{
            title: "Métricas",
            tabBarIcon: ({ color }) => (
              <Ionicons size={20} name="analytics" color={color} />
            ),
          }}
        />
      </Tabs.Protected>
      <Tabs.Protected guard>
        <Tabs.Screen
          name="profile/index"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color }) => (
              <Ionicons size={20} name="person" color={color} />
            ),
          }}
        />
      </Tabs.Protected>
    </Tabs>
  );
}
