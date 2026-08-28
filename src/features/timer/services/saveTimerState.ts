import { keyValueStorage } from '@/services/storage/keyValueStorage';

import type { PersistedTimerState } from '../types';
import { timerStateStorageKey } from './fetchTimerState';

export async function saveTimerState(state: PersistedTimerState): Promise<void> {
  await keyValueStorage.setString(timerStateStorageKey, JSON.stringify(state));
}
