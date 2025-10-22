import { images } from "@/src/assets";
import { Layout } from "@/src/components/layout";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  Button,
  Image,
  Input,
  Paragraph,
  XStack,
  YStack,
  useTheme,
} from "tamagui";
import { EmptyState } from "./components/empty";
import { WalletCard, WalletCardSkeleton } from "./components/wallet-card";
import { useHomeViewModel } from "./viewModel";

export const HomeView = ({
  wallets,
  isLoading,
  draftSearch,
  handleChangeDraftSearch,
  handleGoToCreateWallet,
  handleApplySearch,
}: ReturnType<typeof useHomeViewModel>) => {
  const theme = useTheme();

  return (
    <Layout>
      <YStack mb="$4">
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <XStack alignItems="center" justifyContent="space-between" mb="$2">
            <Image source={images.logo} w={160} objectFit="contain" />
            <Button
              fontSize={"$3.5"}
              bg={"$blue10"}
              color={"white"}
              onPress={handleGoToCreateWallet}
            >
              Nova carteira
            </Button>
          </XStack>
        </Animated.View>
      </YStack>
      <YStack px={"$3.5"} gap={"$2"}>
        <XStack alignItems="center">
          <Paragraph fontSize={18} color="$gray11">
            Suas carteiras
          </Paragraph>
          <Paragraph fontSize={16} color="$gray11" ml="auto">
            {wallets?.length ?? 0} carteira
            {wallets && wallets.length !== 1 ? "s" : ""}
          </Paragraph>
        </XStack>

        <XStack>
          <Input
            value={draftSearch}
            onChangeText={handleChangeDraftSearch}
            fontSize={16}
            mt="$2"
            mb="$4"
            placeholder="Buscar carteira..."
            flex={1}
            bg={"$gray5"}
            clearButtonMode="while-editing"
          />
          <Button
            ml="$2"
            mt="$2"
            mb="$4"
            onPress={handleApplySearch}
            fontSize={"$3.5"}
            variant="outlined"
            borderColor="$blue10"
          >
            <Ionicons
              size={20}
              color={String(theme.blue10?.val)}
              name="search"
            />
          </Button>
        </XStack>
      </YStack>

      {isLoading ? (
        <YStack flex={1} alignItems="center" justifyContent="center">
          <FlatList
            data={[1, 2, 3, 4, 5]}
            renderItem={() => <WalletCardSkeleton />}
            keyExtractor={(item) => item.toString()}
            contentContainerStyle={{
              paddingHorizontal: 16,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={EmptyState}
          />
        </YStack>
      ) : (
        <FlatList
          data={wallets}
          renderItem={({ item, index }) => (
            <WalletCard item={item} index={index} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyState}
        />
      )}
    </Layout>
  );
};
