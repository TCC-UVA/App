import { DIContainer } from ".";
import { AuthServiceHttp } from "../services/auth";
import { StockServiceHttp } from "../services/stocks";
import { WalletServiceHttp } from "../services/wallet";

export const FactoryKeys = {
  AuthService: "AuthService",
  StockService: "StockService",
  WalletService: "WalletService",
};

export const factories = [
  {
    key: FactoryKeys.AuthService,
    factory: () => new AuthServiceHttp(),
  },
  {
    key: FactoryKeys.StockService,
    factory: () => new StockServiceHttp(),
  },
  {
    key: FactoryKeys.WalletService,
    factory: () => new WalletServiceHttp(),
  },
];

factories.forEach((factory) => {
  DIContainer.getInstance().register<ReturnType<typeof factory.factory>>(
    factory.key,
    factory.factory
  );
});
