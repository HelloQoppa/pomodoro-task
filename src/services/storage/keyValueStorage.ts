import AsyncStorage from '@react-native-async-storage/async-storage';

export interface KeyValueStorage {
  getString(key: string): Promise<string | null>;
  setString(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export const keyValueStorage: KeyValueStorage = {
  async getString(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },
  async setString(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },
  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};
