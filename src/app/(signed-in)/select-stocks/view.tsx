import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Card,
  H2,
  H4,
  Input,
  Paragraph,
  XStack,
  YStack,
  useTheme,
} from "tamagui";
import { useSelectStocksViewModel } from "./viewModel";

const AnimatedCard = Animated.createAnimatedComponent(Card);

export const SelectStocksView = ({
  stocks,
  selectedStocks,
  searchQuery,
  isLoading,
  handleSearchChange,
  handleSelectStock,
  handleConfirm,
  handleGoBack,
}: ReturnType<typeof useSelectStocksViewModel>) => {
  const { bottom, top } = useSafeAreaInsets();
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

    return (
      <Animated.View entering={FadeInDown.duration(600).springify()}>
        <YStack alignItems="center" justifyContent="center" py="$8" px="$4">
          <YStack
            bg="$gray4"
            w={100}
            h={100}
            borderRadius={50}
            alignItems="center"
            justifyContent="center"
            mb="$6"
          >
            <Ionicons
              name="search-outline"
              size={50}
              color={String(theme.gray11?.val || "#888888")}
            />
          </YStack>
          <H4
            fontSize={14}
            color="$color"
            textAlign="center"
            fontWeight="700"
            mb="$2"
          >
            Nenhuma ação encontrada
          </H4>
          <Paragraph fontSize={14} color="$gray11" textAlign="center">
            {searchQuery
              ? "Tente buscar por outro nome ou ticker"
              : "Não há ações disponíveis no momento"}
          </Paragraph>
        </YStack>
      </Animated.View>
    );
  };

  const renderStockCard = ({ item, index }: { item: any; index: number }) => {
    const isSelected = selectedStocks.includes(item);

    return (
      <AnimatedCard
        entering={FadeInUp.delay(index * 50)
          .duration(600)
          .springify()}
        bordered
        bg={isSelected ? "$blue3" : "$background"}
        borderColor={isSelected ? "$blue10" : "$gray6"}
        borderWidth={isSelected ? 2 : 1}
        borderRadius="$4"
        p="$4"
        mb="$3"
        onPress={() => handleSelectStock(item)}
        pressStyle={{ scale: 0.97, opacity: 0.9 }}
      >
        <XStack alignItems="center" justifyContent="space-between">
          <YStack flex={1} gap="$2">
            <XStack alignItems="center" gap="$3">
              <YStack
                bg={isSelected ? "$blue10" : "$gray5"}
                w={48}
                h={48}
                borderRadius={24}
                alignItems="center"
                justifyContent="center"
              >
                <Paragraph
                  color={isSelected ? "white" : "$gray11"}
                  fontWeight="700"
                  fontSize={16}
                >
                  {item.ticker?.substring(0, 2) || "??"}
                </Paragraph>
              </YStack>
              <YStack flex={1}>
                <H4 fontSize={14} color="$color" fontWeight="700" mb="$1">
                  {item.ticker}
                </H4>
                <Paragraph fontSize={14} color="$gray11" numberOfLines={1}>
                  {item.name}
                </Paragraph>
              </YStack>
            </XStack>

            {item.price && (
              <XStack alignItems="center" gap="$2">
                <Ionicons
                  name="cash-outline"
                  size={16}
                  color={String(theme.gray11?.val || "#888888")}
                />
                <Paragraph fontSize={14} color="$gray11">
                  R$ {item.price.toFixed(2)}
                </Paragraph>
                {item.variation !== undefined && (
                  <Paragraph
                    fontSize={14}
                    color={item.variation >= 0 ? "$green10" : "$red10"}
                    fontWeight="600"
                  >
                    {item.variation >= 0 ? "+" : ""}
                    {item.variation.toFixed(2)}%
                  </Paragraph>
                )}
              </XStack>
            )}
          </YStack>

          <YStack
            bg={isSelected ? "$blue10" : "$gray5"}
            w={28}
            h={28}
            borderRadius={14}
            alignItems="center"
            justifyContent="center"
          >
            {isSelected && (
              <Ionicons name="checkmark" size={20} color="white" />
            )}
          </YStack>
        </XStack>
      </AnimatedCard>
    );
  };

  return (
    <YStack flex={1} pt={top + 20} pb={bottom + 20} bg="$background">
      <YStack px="$4" mb="$4" gap="$4">
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
              placeholder="Buscar por nome ou ticker..."
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
          data={stocks}
          renderItem={renderStockCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            flexGrow: 1,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      </YStack>

      {selectedStocks.length > 0 && (
        <Animated.View entering={FadeInUp.duration(600).springify()}>
          <YStack
            position="absolute"
            bottom={bottom + 20}
            left={16}
            right={16}
            bg="$background"
            borderRadius="$4"
            p="$3"
            gap="$2"
            shadowColor="$shadowColor"
            shadowRadius={12}
            shadowOffset={{ width: 0, height: -4 }}
          >
            <Button
              bg="$blue10"
              color="white"
              size="$5"
              borderRadius="$4"
              fontWeight="600"
              fontSize={16}
              onPress={handleConfirm}
              disabled={isLoading}
              opacity={isLoading ? 0.7 : 1}
            >
              {isLoading ? (
                <ActivityIndicator
                  testID="confirm-stocks-loading"
                  color="white"
                />
              ) : (
                `Confirmar (${selectedStocks.length})`
              )}
            </Button>
          </YStack>
        </Animated.View>
      )}
    </YStack>
  );
};
