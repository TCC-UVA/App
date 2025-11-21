import { useToast } from "@/src/components/toast";
import { AuthService } from "@/src/services/auth";
import { useRegisterMutation } from "@/src/services/mutations";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterFormData, registerSchema } from "./model";

export const useRegisterViewModel = (service: AuthService) => {
  const router = useRouter();
  const { success } = useToast();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const { handleSubmit, control, trigger } = useForm<RegisterFormData>({
    mode: "onSubmit",
    resolver: yupResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      birthDate: "",
    },
  });

  const { mutate: onRegister, isPending: isLoading } =
    useRegisterMutation(service);

  const handleNextStep = async () => {
    const step1Fields = ["name", "email", "birthDate"] as const;
    const isValid = await trigger(step1Fields);

    if (isValid) {
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  const onSubmit = (data: RegisterFormData) => {
    const dateParts = data.birthDate.split("/");
    onRegister(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        birthDate: `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`,
      },
      {
        onSuccess: () => {
          success("Registro bem-sucedido!", "Você já pode fazer login agora.");
          router.replace("/(signed-off)/login");
        },
      }
    );
  };

  const handleGoToLogin = () => {
    router.navigate("/(signed-off)/login");
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    isLoading,
    handleGoToLogin,
    currentStep,
    handleNextStep,
    handlePreviousStep,
  };
};
