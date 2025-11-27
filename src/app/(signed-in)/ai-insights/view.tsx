import { SkeletonBox } from "@/src/components/base/skeleton";
import { Layout } from "@/src/components/layout";
import { Ionicons } from "@expo/vector-icons";
import {
  Button,
  H6,
  Paragraph,
  ScrollView,
  XStack,
  YStack,
  useTheme,
} from "tamagui";
import { useAIInsightsViewModel } from "./viewModel";

export const AIInsightsView = ({
  insights,
  isLoading,
  error,
  walletName,
  handleGoBack,
}: ReturnType<typeof useAIInsightsViewModel>) => {
  const theme = useTheme();

  return (
    <Layout>
      <YStack flex={1} bg="$background">
        <XStack
          p="$1"
          pb={"$4"}
          alignItems="center"
          gap="$3"
          borderBottomWidth={1}
          borderBottomColor="$gray6"
          bg="$background"
        >
          <Button
            size="$3"
            circular
            variant="outlined"
            onPress={handleGoBack}
            icon={
              <Ionicons
                name="arrow-back"
                size={20}
                color={String(theme.gray12?.val)}
              />
            }
          />
          <YStack flex={1}>
            <H6>Análise com IA</H6>
            <Paragraph fontSize={14} color="$gray11">
              {walletName}
            </Paragraph>
          </YStack>
          <Ionicons
            name="sparkles"
            size={24}
            color={String(theme.blue10?.val)}
          />
        </XStack>

        {isLoading ? (
          <YStack flex={1} gap="$4">
            <SkeletonBox width="100%" height={16} />
            <SkeletonBox width="100%" height={16} />
            <SkeletonBox width="100%" height={16} />
            <SkeletonBox width="100%" height={16} />
            <SkeletonBox width="100%" height={16} />
            <SkeletonBox width="100%" height={16} />
            <SkeletonBox width="100%" height={16} />
            <SkeletonBox width="95%" height={16} />
            <SkeletonBox width="85%" height={16} />
            <SkeletonBox width="92%" height={16} />
            <SkeletonBox width="88%" height={16} />
            <SkeletonBox width="65%" height={16} />
          </YStack>
        ) : error ? (
          <YStack
            flex={1}
            alignItems="center"
            justifyContent="center"
            gap="$4"
            p="$4"
          >
            <Ionicons
              name="alert-circle-outline"
              size={64}
              color={String(theme.red10?.val)}
            />
            <Paragraph fontSize={16} color="$red10" textAlign="center">
              Erro ao carregar análise
            </Paragraph>
            <Button onPress={handleGoBack} variant="outlined">
              Voltar
            </Button>
          </YStack>
        ) : insights ? (
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            <YStack p="$4" gap="$4">
              <YStack gap="$3">
                <XStack alignItems="center" gap="$2">
                  <Ionicons
                    name="sparkles"
                    size={20}
                    color={String(theme.blue10?.val)}
                  />
                  <Paragraph fontSize={16} fontWeight="600" color="$gray12">
                    Análise da IA
                  </Paragraph>
                </XStack>
                <YStack
                  bg="$gray2"
                  p="$4"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$gray6"
                >
                  <Paragraph
                    fontSize={15}
                    color="$gray12"
                    lineHeight={24}
                    whiteSpace="pre-wrap"
                  >
                    {insights}
                  </Paragraph>
                </YStack>
              </YStack>

              <YStack
                bg="$gray3"
                p="$3"
                borderRadius="$4"
                borderLeftWidth={3}
                borderLeftColor="$blue10"
              >
                <Paragraph fontSize={12} color="$gray11">
                  Esta análise foi gerada por Inteligência Artificial e tem
                  caráter informativo. Sempre consulte um profissional
                  financeiro para decisões de investimento.
                </Paragraph>
              </YStack>
            </YStack>
          </ScrollView>
        ) : null}
      </YStack>
    </Layout>
  );
};
