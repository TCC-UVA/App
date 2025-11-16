import { useCreateWalletMutation } from "@/src/services/mutations";
import { WalletService } from "@/src/services/wallet";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useCreatePortfolioContext } from "../context";
import {
  AllocatePercentagesFormData,
  StockAllocation,
  allocatePercentagesSchema,
} from "./model";

export const useAllocatePercentagesViewModel = (service: WalletService) => {
  const router = useRouter();
  const { selectedStocks, name } = useCreatePortfolioContext();
  const [totalPercentage, setTotalPercentage] = useState(0);

  const { mutate: onCreateWallet } = useCreateWalletMutation(service);

  const { control, handleSubmit, setValue } =
    useForm<AllocatePercentagesFormData>({
      resolver: yupResolver(allocatePercentagesSchema),
      defaultValues: {
        allocations: [],
      },
      values: {
        allocations: selectedStocks.map((stock) => ({
          symbol: stock.symbol,
          percentage: 0,
        })),
      },
    });

  const allocations = useWatch({
    control,
    name: "allocations",
  });

  useEffect(() => {
    if (allocations && allocations.length > 0) {
      const total = allocations.reduce((sum, item) => {
        const value =
          typeof item?.percentage === "number"
            ? item.percentage
            : parseFloat(item?.percentage as any) || 0;

        return sum + value;
      }, 0);
      setTotalPercentage(total);
    }
  }, [allocations]);

  const onSubmit = (data: AllocatePercentagesFormData) => {
    if (!data.allocations) return;

    const stockAllocations: StockAllocation[] = data.allocations.map(
      (allocation) => ({
        Name: allocation.symbol,
        Allocation: allocation.percentage,
      })
    );

    onCreateWallet({
      name: name,
      assets: stockAllocations,
    });

    router.replace("/(signed-in)/(tabs)/home");
  };

  const handleGoBack = () => {
    router.back();
  };

  const distributeEqually = () => {
    if (selectedStocks.length === 0) return;

    const equalPercentage = parseFloat(
      (100 / selectedStocks.length).toFixed(2)
    );
    let allocated = 0;

    selectedStocks.forEach((_item, index) => {
      let percentage: number;
      if (index === selectedStocks.length - 1) {
        percentage = parseFloat((100 - allocated).toFixed(2));
      } else {
        percentage = equalPercentage;
        allocated += percentage;
      }

      setValue(`allocations.${index}.percentage`, percentage, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    });
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    handleGoBack,
    selectedStocks,
    totalPercentage,
    distributeEqually,
  };
};
