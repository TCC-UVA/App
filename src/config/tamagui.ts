import { color, radius, size, space, themes, zIndex } from "@tamagui/themes";
import { createTamagui, createTokens } from "tamagui";

const tokens = createTokens({
  size,
  space,
  zIndex,
  color,
  radius,
});

const config = createTamagui({
  themes,
  tokens,
  fonts: {},

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
