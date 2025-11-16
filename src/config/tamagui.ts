import { color, radius, size, space, themes, zIndex } from "@tamagui/themes";
import { createTamagui, createTokens } from "tamagui";
import { createAnimations } from "@tamagui/animations-react-native";

const tokens = createTokens({
  size,
  space,
  zIndex,
  color: {
    ...color,
    white: "#FFFFFF",
  },
  radius,
});

const animations = createAnimations({
  fast: {
    type: "spring",
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    type: "spring",
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  slow: {
    type: "spring",
    damping: 20,
    stiffness: 60,
  },
});

const config = createTamagui({
  themes,
  tokens,
  fonts: {},
  animations,
  settings: {
    onlyAllowShorthands: true,
  },
  shorthands: {
    px: "paddingHorizontal",
    py: "paddingVertical",
    pt: "paddingTop",
    pb: "paddingBottom",
    mx: "marginHorizontal",
    mt: "marginTop",
    mb: "marginBottom",
    ml: "marginLeft",
    mr: "marginRight",
    p: "padding",
    m: "margin",
    bg: "backgroundColor",
    w: "width",
    h: "height",
  } as const,
});

export type Conf = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default config;
