import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useTheme } from "tamagui";

export default function Layout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.blue10.val,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons size={20} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics/index"
        options={{
          title: "Métricas",
          tabBarIcon: ({ color }) => (
            <Ionicons size={20} name="analytics" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons size={20} name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
