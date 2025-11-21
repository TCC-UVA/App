import { useToast } from "@/src/components/toast";
import {
  useCreateWalletMutation,
  useUpdateWalletMutation,
} from "@/src/services/mutations";
import { WalletService } from "@/src/services/wallet";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, useWatch } from "react-hook-form";
import { useCreatePortfolioContext } from "../context";
import {
  AllocateQuantitiesFormData,
  StockAllocation,
  allocateQuantitiesSchema,
} from "./model";

export const useAllocateQuantitiesViewModel = (service: WalletService) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const toast = useToast();
  const { name, selectedStocks } = useCreatePortfolioContext();

  const { mutate: onCreateWallet, isPending: isCreatingWallet } =
    useCreateWalletMutation(service);
  const { mutate: onUpdateWallet, isPending: isUpdatingWallet } =
    useUpdateWalletMutation(service);

  const isEditingMode = !!params?.id;

  const { control, handleSubmit, setValue } =
    useForm<AllocateQuantitiesFormData>({
      resolver: yupResolver(allocateQuantitiesSchema),
      defaultValues: {
        allocations: selectedStocks.map((stock) => ({
          quantity: stock.quantity || 0,
          symbol: stock.symbol,
        })),
      },
    });

  const allocations = useWatch({
    control,
    name: "allocations",
    defaultValue: selectedStocks.map((stock) => ({
      quantity: stock.quantity || 0,
      symbol: stock.symbol,
    })),
  });

  const totalQuantity =
    allocations?.reduce(
      (total, allocation) => total + (allocation?.quantity || 0),
      0
    ) || 0;

  console.log("totalQuantity", totalQuantity);

  const onSubmit = (data: AllocateQuantitiesFormData) => {
    if (!data.allocations) return;

    const stockAllocations: StockAllocation[] = data.allocations.map(
      (allocation) => ({
        Name: allocation.symbol,
        Allocation: allocation.quantity,
      })
    );

    if (isEditingMode) {
      onUpdateWallet(
        {
          id: Number(params?.id) || 0,
          assets: stockAllocations,
        },
        {
          onSuccess: () => {
            toast.success(
              "Carteira atualizada com sucesso!",
              "Sua carteira foi atualizada e as quantidades foram alocadas."
            );
            router.replace("/(signed-in)/(tabs)/home");
          },
        }
      );
      return;
    }

    onCreateWallet(
      {
        name: name,
        assets: stockAllocations,
      },
      {
        onSuccess: () => {
          toast.success(
            "Carteira criada com sucesso!",
            "Sua carteira foi criada e as quantidades foram alocadas."
          );
          router.replace("/(signed-in)/(tabs)/home");
        },
      }
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  const clearAll = () => {
    if (selectedStocks.length === 0) return;

    selectedStocks.forEach((_item, index) => {
      setValue(`allocations.${index}.quantity`, 0, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    });

    toast.info(
      "Quantidades limpas",
      "Todas as quantidades foram resetadas para 0"
    );
  };

  return {
    isEditingMode,
    control,
    handleSubmit,
    onSubmit,
    handleGoBack,
    selectedStocks,
    totalQuantity,
    clearAll,
    isLoading: isCreatingWallet || isUpdatingWallet,
  };
};
