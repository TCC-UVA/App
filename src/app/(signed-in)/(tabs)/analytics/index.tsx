import { AnalyticsView } from "./view";
import { useAnalyticsViewModel } from "./viewModel";

const Analytics = () => {
  const methods = useAnalyticsViewModel();
  return <AnalyticsView {...methods} />;
};

export default Analytics;
