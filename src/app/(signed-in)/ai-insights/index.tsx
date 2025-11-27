import { DIContainer } from "@/src/di";
import { FactoryKeys } from "@/src/di/factories";
import { WalletService } from "@/src/services/wallet";
import { AIInsightsView } from "./view";
import { useAIInsightsViewModel } from "./viewModel";

export default function AIInsightsScreen() {
  const service = DIContainer.getInstance().resolve<WalletService>(
    FactoryKeys.WalletService
  );
  const methods = useAIInsightsViewModel(service);

  return <AIInsightsView {...methods} />;
}
