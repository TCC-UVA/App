import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { useCreatePortfolioContext } from "../context";
import { CreateWalletFormData, createWalletSchema } from "./model";

export const useCreateWalletViewModel = () => {
  const router = useRouter();
  const { name, setName } = useCreatePortfolioContext();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: "onSubmit",
    defaultValues: { name: "" },
    values: {
      name,
    },
    resolver: yupResolver(createWalletSchema),
  });

  const handleGoBack = () => {
    router.back();
  };

  const onSubmit = (data: CreateWalletFormData) => {
    setName(data.name);
    router.navigate("/(signed-in)/(create-portfolio)/select-stocks");
  };

  return {
    control,
    handleSubmit,
    isLoading: isSubmitting,
    handleGoBack,
    onSubmit,
  };
};
