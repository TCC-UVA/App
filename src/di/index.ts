export class DIContainer {
  private static instance: DIContainer;
  private dependencies = new Map<string, () => any>();

  static getInstance() {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  register<T>(key: string, factory: () => T): void {
    this.dependencies.set(key, factory);
  }

  resolve<T>(key: string): T {
    const factory = this.dependencies.get(key);

    if (!factory) {
      throw new Error(`Dependency ${key} not found`);
    }

    return factory();
  }
}
