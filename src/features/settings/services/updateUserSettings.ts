import { keyValueStorage } from '@/services/storage/keyValueStorage';

import type { UserSettings } from '../types';
import { userSettingsStorageKey } from './fetchUserSettings';

export async function updateUserSettings(settings: UserSettings): Promise<void> {
  await keyValueStorage.setString(userSettingsStorageKey, JSON.stringify(settings));
}
