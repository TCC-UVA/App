import { createMMKV } from "react-native-mmkv";
import { StorageService } from "..";
export const storage = createMMKV();

export const mmkvStorage: StorageService = {
  getItem: (key) => {
    const item = storage.getString(key);

    if (item) {
      return JSON.parse(item);
    }

    return null;
  },
  setItem: (key, value) => {
    storage.set(key, JSON.stringify(value));
  },
  removeItem: (key) => {
    storage.remove(key);
  },
};
