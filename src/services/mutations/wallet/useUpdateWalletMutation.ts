import { useMutation } from "@tanstack/react-query";
import { WalletService } from "../../wallet";
import { UpdateWalletRequestDto } from "../../wallet/dto/update-request.dto";
import { mutationKeys } from "../key";

export const useUpdateWalletMutation = (service: WalletService) => {
  return useMutation({
    mutationKey: [mutationKeys.PATCH_UPDATE_WALLET],
    mutationFn: (data: UpdateWalletRequestDto) => service.update(data),
  });
};
