import { DIContainer } from "@/src/di";
import { FactoryKeys } from "@/src/di/factories";
import { WalletService } from "@/src/services/wallet";
import { AllocateQuantitiesView } from "./view";
import { useAllocateQuantitiesViewModel } from "./viewModel";

const AllocateQuantities = () => {
  const service = DIContainer.getInstance().resolve<WalletService>(
    FactoryKeys.WalletService
  );
  const methods = useAllocateQuantitiesViewModel(service);

  return <AllocateQuantitiesView {...methods} />;
};

export default AllocateQuantities;
