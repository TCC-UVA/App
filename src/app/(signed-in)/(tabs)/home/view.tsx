import { Header } from "@/src/components/header";
import { Layout } from "@/src/components/layout";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native";
import { Button, Input, Paragraph, XStack, YStack, useTheme } from "tamagui";
import { EmptyState } from "./components/empty";
import { WalletCard } from "./components/wallet-card";
import { WalletCardSkeleton } from "./components/wallet-card/skeleton";
import { useHomeViewModel } from "./viewModel";

export const HomeView = ({
  wallets,
  isLoading,
  draftSearch,
  handleChangeDraftSearch,
  handleGoToCreateWallet,
  handleApplySearch,
  handleEditWallet,
}: ReturnType<typeof useHomeViewModel>) => {
  const theme = useTheme();

  return (
    <Layout>
      <Header>
        <Button
          fontSize={"$3.5"}
          bg={"$blue10"}
          color={"white"}
          onPress={handleGoToCreateWallet}
        >
          Nova carteira
        </Button>
      </Header>

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
            testID="search-confirm-button"
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
            <WalletCard
              item={item}
              index={index}
              onPress={() => handleEditWallet(item)}
            />
          )}
          keyExtractor={(item) => item.PortfolioId.toString() || ""}
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
