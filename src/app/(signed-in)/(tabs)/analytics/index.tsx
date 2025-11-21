import { DIContainer } from "@/src/di";
import { FactoryKeys } from "@/src/di/factories";
import { WalletService } from "@/src/services/wallet";
import { AnalyticsView } from "./view";
import { useAnalyticsViewModel } from "./viewModel";

const Analytics = () => {
  const walletService = DIContainer.getInstance().resolve<WalletService>(
    FactoryKeys.WalletService
  );
  const methods = useAnalyticsViewModel({
    walletService,
  });
  return <AnalyticsView {...methods} />;
};

export default Analytics;
