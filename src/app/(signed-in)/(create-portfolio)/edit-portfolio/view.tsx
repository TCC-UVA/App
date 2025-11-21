import { ConfirmActionSheet } from "@/src/components/base/confirm-action-sheet";
import { Layout } from "@/src/components/layout";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import Animated, { FadeInDown, FadeInUp, FadeOutRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Button,
  Card,
  H6,
  Paragraph,
  XStack,
  YStack,
  useTheme,
} from "tamagui";
import { useEditPortfolioViewModel } from "./viewModel";

const AnimatedCard = Animated.createAnimatedComponent(Card);
const AnimatedYStack = Animated.createAnimatedComponent(YStack);

export const EditPortfolioView = ({
  wallet,
  assets,
  handleGoBack,
  handleRemoveAsset,
  handleAddMore,
  handleAllocateQuantities,
  handleDeletePortfolio,
  deleteWalletSheetOpen,
  handleToggleDeleteWalletSheet,
  isDeleting,
  showOptionsSheet,
  handleToggleOptionsSheet,
  hasChanges,
  handleSaveChanges,
  isSaving,
}: ReturnType<typeof useEditPortfolioViewModel>) => {
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();

  if (!wallet) {
    return (
      <Layout>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Paragraph color="$gray11">Nenhuma carteira selecionada</Paragraph>
        </YStack>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(600).springify()}>
        <XStack alignItems="center" gap="$3" mb="$5">
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
            <H6 color="$color" fontWeight="700" fontSize={18}>
              {wallet.name}
            </H6>
            <Paragraph fontSize={13} color="$gray11" mt="$1">
              {assets.length} {assets.length === 1 ? 'ativo' : 'ativos'}
            </Paragraph>
          </YStack>
          <TouchableOpacity onPress={handleToggleOptionsSheet}>
            <YStack
              bg="$gray5"
              w={40}
              h={40}
              borderRadius={20}
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={24}
                color={String(theme.gray11?.val || "#888888")}
              />
            </YStack>
          </TouchableOpacity>
        </XStack>
      </Animated.View>

      {/* Assets List */}
      <YStack flex={1} mb="$2">
        <Animated.View
          entering={FadeInDown.delay(200).duration(600).springify()}
        >
          <XStack alignItems="center" justifyContent="space-between" mb="$3">
            <Paragraph fontSize={14} color="$gray11" fontWeight="600">
              Ativos da Carteira
            </Paragraph>
            <TouchableOpacity onPress={handleAddMore}>
              <XStack
                bg="$blue10"
                px="$3"
                py="$2"
                borderRadius="$3"
                alignItems="center"
                gap="$2"
              >
                <Ionicons name="add" size={18} color="white" />
                <Paragraph fontSize={12} color="white" fontWeight="600">
                  Adicionar
                </Paragraph>
              </XStack>
            </TouchableOpacity>
          </XStack>
        </Animated.View>

        <FlatList
          data={assets}
          renderItem={({ item, index }) => (
            <AnimatedCard
              entering={FadeInUp.delay(index * 80)
                .duration(500)
                .springify()}
              exiting={FadeOutRight.duration(300)}
              bordered
              bg="$background"
              borderColor="$gray6"
              borderRadius="$4"
              mb="$3"
              overflow="hidden"
            >
              <XStack alignItems="center" p="$4" gap="$3">
                <YStack
                  bg="$blue4"
                  w={48}
                  h={48}
                  borderRadius={24}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Ionicons
                    name="stats-chart"
                    size={24}
                    color={String(theme.blue10?.val || "#0066cc")}
                  />
                </YStack>

                <YStack flex={1} gap="$1">
                  <H6 color="$color" fontWeight="700">
                    {item.name}
                  </H6>
                  <Paragraph fontSize={12} color="$gray11">
                    {item.allocation ? `${item.allocation} ações` : "Quantidade não definida"}
                  </Paragraph>
                </YStack>

                <TouchableOpacity
                  onPress={() => handleRemoveAsset(item.name)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <YStack
                    bg="$red4"
                    w={40}
                    h={40}
                    borderRadius={20}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={String(theme.red10?.val || "#ff0000")}
                    />
                  </YStack>
                </TouchableOpacity>
              </XStack>
            </AnimatedCard>
          )}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: assets.length > 0 ? 100 : 20,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Animated.View
              entering={FadeInDown.delay(300).duration(600).springify()}
            >
              <YStack
                alignItems="center"
                justifyContent="center"
                py="$8"
                gap="$4"
              >
                <YStack
                  bg="$gray4"
                  w={80}
                  h={80}
                  borderRadius={40}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Ionicons
                    name="briefcase-outline"
                    size={40}
                    color={String(theme.gray10?.val || "#888888")}
                  />
                </YStack>
                <YStack gap="$2" alignItems="center">
                  <Paragraph
                    color="$gray11"
                    fontSize={16}
                    fontWeight="600"
                    textAlign="center"
                  >
                    Carteira Vazia
                  </Paragraph>
                  <Paragraph
                    color="$gray10"
                    fontSize={14}
                    textAlign="center"
                    maxWidth={240}
                  >
                    Adicione ativos à sua carteira para começar a gerenciar seus investimentos
                  </Paragraph>
                </YStack>
                <Button
                  onPress={handleAddMore}
                  bg="$blue10"
                  color="white"
                  borderRadius="$4"
                  mt="$2"
                  icon={
                    <Ionicons name="add-circle-outline" size={20} color="white" />
                  }
                >
                  Adicionar Ativos
                </Button>
              </YStack>
            </Animated.View>
          }
        />
      </YStack>

      {/* Bottom Action Buttons */}
      {assets.length > 0 && (
        <AnimatedYStack
          entering={FadeInUp.delay(400).duration(500).springify()}
          position="absolute"
          bottom={bottom + 20}
          left={20}
          right={20}
          bg="$background"
          borderRadius="$5"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: -2 }}
          shadowOpacity={0.1}
          shadowRadius={8}
          elevation={5}
          gap="$3"
        >
          {hasChanges ? (
            <Button
              onPress={handleSaveChanges}
              bg="$green10"
              color="white"
              borderRadius="$4"
              size="$5"
              disabled={isSaving}
              pressStyle={{ opacity: 0.9, scale: 0.98 }}
              icon={
                !isSaving ? (
                  <Ionicons name="checkmark-circle-outline" size={22} color="white" />
                ) : undefined
              }
            >
              {isSaving ? (
                <ActivityIndicator testID="saving-changes-loading" color="white" />
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          ) : (
            <Button
              onPress={handleAllocateQuantities}
              bg="$blue10"
              color="white"
              borderRadius="$4"
              size="$5"
              pressStyle={{ opacity: 0.9, scale: 0.98 }}
              icon={
                <Ionicons name="calculator-outline" size={22} color="white" />
              }
            >
              Alocar Quantidades
            </Button>
          )}
        </AnimatedYStack>
      )}

      {/* Options Sheet */}
      <ConfirmActionSheet
        isOpen={showOptionsSheet}
        onClose={handleToggleOptionsSheet}
        title="Opções da Carteira"
      >
        <Button
          bg="$red10"
          color="white"
          onPress={handleToggleDeleteWalletSheet}
          disabled={isDeleting}
          icon={
            !isDeleting ? (
              <Ionicons name="trash-outline" size={20} color="white" />
            ) : undefined
          }
        >
          {isDeleting ? (
            <ActivityIndicator testID="deleting-wallet-button-loading" color="white" />
          ) : (
            "Deletar Carteira"
          )}
        </Button>
        <Button
          variant="outlined"
          borderColor="$gray8"
          color="$gray12"
          onPress={handleToggleOptionsSheet}
        >
          Cancelar
        </Button>
      </ConfirmActionSheet>

      {/* Delete Confirmation Sheet */}
      <ConfirmActionSheet
        isOpen={deleteWalletSheetOpen}
        onClose={handleToggleDeleteWalletSheet}
        title="Tem certeza que deseja apagar a carteira?"
      >
        <YStack gap="$3" mb="$3">
          <Paragraph color="$gray11" fontSize={14} textAlign="center">
            Esta ação é irreversível. Todos os ativos e configurações desta carteira serão perdidos.
          </Paragraph>
        </YStack>
        <Button
          bg="$red10"
          color="white"
          onPress={handleDeletePortfolio}
          disabled={isDeleting}
          icon={
            !isDeleting ? (
              <Ionicons name="trash" size={20} color="white" />
            ) : undefined
          }
        >
          {isDeleting ? (
            <ActivityIndicator color="white" />
          ) : (
            "Sim, Apagar Carteira"
          )}
        </Button>
        <Button
          variant="outlined"
          borderColor="$gray8"
          color="$gray12"
          onPress={handleToggleDeleteWalletSheet}
          disabled={isDeleting}
        >
          Cancelar
        </Button>
      </ConfirmActionSheet>
    </Layout>
  );
};
