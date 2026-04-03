'use client';

import { useOnlineStatus } from '@/hooks/use-online-status';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  return (
    <p className={`offlineIndicator ${isOnline ? 'isOnline' : 'isOffline'}`} aria-live="polite">
      {isOnline ? 'Online' : 'Offline mode: local edits are still available'}
    </p>
  );
}
