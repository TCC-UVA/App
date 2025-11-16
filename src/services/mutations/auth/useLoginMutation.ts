import { useAuthStore } from "@/src/store/auth";
import { useMutation } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { AuthService } from "../../auth";
import { LoginRequestDto } from "../../auth/dto/login-request.dto";
import { mutationKeys } from "../key";

export const useLoginMutation = (service: AuthService) => {
  const { setData, setToken } = useAuthStore(
    useShallow((state) => ({
      setData: state.setData,
      setToken: state.setToken,
    }))
  );
  return useMutation({
    mutationKey: [mutationKeys.login],
    mutationFn: (params: LoginRequestDto) => service.login(params),
    onSuccess: (data) => {
      setToken(data.access_token);
      setData(data.email, data.username);
    },
  });
};
