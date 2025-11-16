import { FloatButton } from "@/src/components/float-button";
import { Layout } from "@/src/components/layout";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { H2, Input, Paragraph, XStack, YStack, useTheme } from "tamagui";
import { Empty } from "./components/empty";
import { StockCard } from "./components/stock-card";
import { useSelectStocksViewModel } from "./viewModel";

export const SelectStocksView = ({
  stocks,
  selectedStocks,
  searchQuery,
  isLoading,
  handleSearchChange,
  handleSelectStock,
  handleConfirm,
  handleGoBack,
  isDropdownOpen,
  toggleDropdown,
}: ReturnType<typeof useSelectStocksViewModel>) => {
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <YStack alignItems="center" justifyContent="center" py="$8">
          <ActivityIndicator size="large" color={String(theme.blue10?.val)} />
          <Paragraph color="$gray11" mt="$4">
            Buscando ações disponíveis...
          </Paragraph>
        </YStack>
      );
    }

    return <Empty />;
  };

  return (
    <Layout pb={bottom + 20}>
      <YStack mb="$4" gap="$4">
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <XStack alignItems="center" gap="$3" mb="$2">
            <TouchableOpacity onPress={handleGoBack}>
              <YStack
                bg="$gray5"
                w={40}
                h={40}
                borderRadius={20}
                alignItems="center"
                justifyContent="center"
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={String(theme.gray11?.val || "#888888")}
                />
              </YStack>
            </TouchableOpacity>
            <YStack flex={1}>
              <H2 fontSize={14} color="$color" fontWeight="700">
                Selecionar Ações
              </H2>
              <Paragraph color="$gray11" fontSize={14}>
                {selectedStocks.length} ações selecionadas
              </Paragraph>
            </YStack>
          </XStack>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
        >
          <XStack
            bg="$gray3"
            borderRadius="$4"
            px="$3"
            py="$2"
            alignItems="center"
            gap="$2"
            borderWidth={1}
            borderColor="$gray6"
          >
            <Ionicons
              name="search-outline"
              size={20}
              color={String(theme.gray11?.val || "#888888")}
            />
            <Input
              fontSize={16}
              flex={1}
              placeholder="Digite 3 letras para buscar"
              value={searchQuery}
              onChangeText={handleSearchChange}
              borderWidth={0}
              bg="transparent"
              focusStyle={{
                borderWidth: 0,
                outlineWidth: 0,
              }}
              placeholderTextColor={String(theme.gray10?.val)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearchChange("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={String(theme.gray10?.val || "#888888")}
                />
              </TouchableOpacity>
            )}
          </XStack>
        </Animated.View>
      </YStack>

      <YStack flex={1}>
        <FlatList
          data={stocks?.filter(
            (stock) => !selectedStocks.some((s) => s.symbol === stock.symbol)
          )}
          renderItem={({ item, index }) => {
            return (
              <StockCard
                key={item.symbol}
                item={item}
                index={index}
                isSelected={false}
                handleSelectStock={handleSelectStock}
              />
            );
          }}
          keyExtractor={(item) => item.symbol}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          ListHeaderComponent={
            selectedStocks.length > 0 ? (
              <YStack mb="$4">
                <TouchableOpacity onPress={toggleDropdown}>
                  <XStack
                    px="$4"
                    py="$3"
                    alignItems="center"
                    justifyContent="space-between"
                    bg="$gray4"
                    borderRadius="$3"
                    mx="$4"
                    mb="$2"
                  >
                    <Paragraph fontSize={12} color="$gray11" fontWeight="600">
                      Selecionadas ({selectedStocks.length})
                    </Paragraph>
                    <Ionicons
                      name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={String(theme.gray11?.val || "#888888")}
                    />
                  </XStack>
                </TouchableOpacity>

                {isDropdownOpen && (
                  <YStack gap="$2" mb="$2">
                    {selectedStocks.map((item, idx) => (
                      <StockCard
                        key={item.symbol}
                        item={item}
                        isSelected={true}
                        handleSelectStock={handleSelectStock}
                        index={idx}
                      />
                    ))}
                  </YStack>
                )}

                {searchQuery.length >= 3 && stocks && stocks.length > 0 && (
                  <Paragraph fontSize={12} color="$gray11" px="$4" mt="$4" mb="$2">
                    Resultados da busca
                  </Paragraph>
                )}
              </YStack>
            ) : null
          }
        />
      </YStack>

      {selectedStocks.length > 0 && (
        <FloatButton
          handleConfirm={handleConfirm}
          isLoading={isLoading}
          text={`Confirmar (${selectedStocks.length})`}
        />
      )}
    </Layout>
  );
};
