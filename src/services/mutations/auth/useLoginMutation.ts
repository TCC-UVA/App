import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../../auth";
import { LoginRequestDto } from "../../auth/dto/login-request.dto";
import { mutationKeys } from "../key";

export const useLoginMutation = (service: AuthService) => {
  return useMutation({
    mutationKey: [mutationKeys.login],
    mutationFn: (params: LoginRequestDto) => service.login(params),
  });
};
