import { useToast } from "@/src/components/toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AuthService } from "../../auth";
import { RegisterRequestDto } from "../../auth/dto/register-request.dto";
import { mutationKeys } from "../key";

export const useRegisterMutation = (service: AuthService) => {
  const { error: showErrorToast } = useToast();

  return useMutation({
    mutationKey: [mutationKeys.register],
    mutationFn: async (params: RegisterRequestDto) => {
      const response = await service.register(params);

      return response;
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;

        if (statusCode === 409) {
          showErrorToast("Usuário já registrado com esse e-mail");
          return;
        }

        if (statusCode === 400) {
          showErrorToast("Dados inválidos. Verifique os campos");
          return;
        }

        if (statusCode === 500) {
          showErrorToast("Erro no servidor. Tente novamente mais tarde");
          return;
        }
      }

      showErrorToast(
        "Não foi possível completar o registro. Tente novamente mais tarde."
      );
    },
  });
};
