import { PropsWithChildren } from "react";
import { YStack, YStackProps } from "tamagui";

type Props = PropsWithChildren & YStackProps & {};

export const Layout = ({ children, ...rest }: Props) => {
  return (
    <YStack flex={1} p={"$4"} bg={"$background"} {...rest}>
      {children}
    </YStack>
  );
};
