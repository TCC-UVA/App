import { DIContainer } from "@/src/di";
import { FactoryKeys } from "@/src/di/factories";
import { WalletService } from "@/src/services/wallet";
import { AllocatePercentagesView } from "./view";
import { useAllocatePercentagesViewModel } from "./viewModel";

const AllocatePercentages = () => {
  const service = DIContainer.getInstance().resolve<WalletService>(
    FactoryKeys.WalletService
  );
  const methods = useAllocatePercentagesViewModel(service);

  return <AllocatePercentagesView {...methods} />;
};

export default AllocatePercentages;
