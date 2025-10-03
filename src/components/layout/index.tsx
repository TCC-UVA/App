import { PropsWithChildren } from "react";
import { YStack } from "tamagui";

type Props = PropsWithChildren & {};

export const Layout = ({ children }: Props) => {
  return (
    <YStack flex={1} p={"$4"} bg={"$background"}>
      {children}
    </YStack>
  );
};
