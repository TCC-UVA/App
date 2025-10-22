import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { CreateWalletFormData, createWalletSchema } from "./model";

export const useCreateWalletViewModel = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: "onSubmit",
    defaultValues: { name: "" },
    resolver: yupResolver(createWalletSchema),
  });

  const handleGoBack = () => {
    router.back();
  };

  const onSubmit = (data: CreateWalletFormData) => {
    router.navigate("/(signed-in)/select-stocks");
  };

  return {
    control,
    handleSubmit,
    isLoading: isSubmitting,
    handleGoBack,
    onSubmit,
  };
};
