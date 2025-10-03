import { DIContainer } from ".";
import { AuthServiceHttp } from "../services/auth";

export const FactoryKeys = {
  AuthService: "AuthService",
};

export const factories = [
  {
    key: FactoryKeys.AuthService,
    factory: () => new AuthServiceHttp(),
  },
];

factories.forEach((factory) => {
  DIContainer.getInstance().register(factory.key, factory.factory);
});
