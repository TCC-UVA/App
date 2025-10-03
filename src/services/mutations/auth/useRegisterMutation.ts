import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../../auth";
import { RegisterRequestDto } from "../../auth/dto/register-request.dto";
import { mutationKeys } from "../key";

export const useRegisterMutation = (service: AuthService) => {
  return useMutation({
    mutationKey: [mutationKeys.register],
    mutationFn: (params: RegisterRequestDto) => service.register(params),
  });
};
