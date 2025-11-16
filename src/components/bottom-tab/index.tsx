import { Ionicons } from "@expo/vector-icons";
import { usePathname } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  LinearTransition,
} from "react-native-reanimated";
import { useTheme } from "tamagui";
import { styles } from "./styles";
import { TabBarProps } from "./types";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export const BottomTab: React.FC<TabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const theme = useTheme();
  const pathName = usePathname();

  const iconsByRouteName: Record<
    string,
    (isFocused: boolean) => React.ReactNode
  > = {
    "home/index": (isFocused: boolean) => (
      <Ionicons
        name="home"
        weight="regular"
        size={22}
        color={isFocused ? "#FFFF" : theme.blue10.val}
      />
    ),
    "profile/index": (isFocused: boolean) => (
      <Ionicons
        name="person"
        weight="regular"
        size={22}
        color={isFocused ? "#FFFF" : theme.blue10.val}
      />
    ),
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutDown.duration(300)}
      style={[styles.container, { backgroundColor: theme.blue6.val }]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const icon =
          iconsByRouteName[route.name as keyof typeof iconsByRouteName]?.(
            isFocused
          ) || null;

        return (
          <AnimatedTouchableOpacity
            layout={LinearTransition.springify().mass(0.5)}
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabItem,
              {
                backgroundColor: isFocused ? theme.blue10.val : "transparent",
              },
            ]}
          >
            {icon}
            {isFocused ? (
              <Animated.Text
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={[styles.text]}
              >
                {label as string}
              </Animated.Text>
            ) : null}
          </AnimatedTouchableOpacity>
        );
      })}
    </Animated.View>
  );
};
