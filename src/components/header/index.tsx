import { images } from "@/src/assets";
import { PropsWithChildren } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Image, XStack } from "tamagui";

type Props = {};

export const Header = ({ children }: PropsWithChildren<Props>) => {
  return (
    <Animated.View entering={FadeInDown.duration(600).springify()}>
      <XStack alignItems="center" justifyContent="space-between" mb="$6">
        <Image source={images.logo} w={160} objectFit="contain" />
        {children}
      </XStack>
    </Animated.View>
  );
};
