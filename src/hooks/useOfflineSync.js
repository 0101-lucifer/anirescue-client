import { useState, useEffect, useCallback } from 'react';

export default function useOfflineSync() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingCases, setPendingCases] = useState([]);

  // Load any cases stuck in the queue when the app boots up
  const loadPendingCases = useCallback(() => {
    const stored = localStorage.getItem('anirescue_offline_queue');
    if (stored) {
      setPendingCases(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      syncCases(); // Try to push to PostgreSQL when internet returns
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadPendingCases();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadPendingCases]);

  // Saves a case to the browser if the user has no signal
  const saveForOfflineSync = (reportData) => {
    const stored = localStorage.getItem('anirescue_offline_queue');
    const queue = stored ? JSON.parse(stored) : [];
    
    // Add a local ID so we can remove it once successfully synced
    queue.push({ ...reportData, localId: Date.now() });
    
    localStorage.setItem('anirescue_offline_queue', JSON.stringify(queue));
    setPendingCases(queue);
  };

  // The Engine: Pushes offline cases to your Node.js API
  const syncCases = async () => {
    const stored = localStorage.getItem('anirescue_offline_queue');
    if (!stored) return;

    const queue = JSON.parse(stored);
    if (queue.length === 0) return;

    // We MUST have a token to sync to the secure backend
    const token = localStorage.getItem('anirescue_token');
    if (!token) {
      console.warn("⚠️ Cannot sync cases: User is not logged in.");
      return; 
    }

    let remainingQueue = [...queue];

    for (const caseData of queue) {
      try {
        const response = await fetch('https://anirescue-api.onrender.com/api/cases/report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Secure identity transmission
          },
          body: JSON.stringify(caseData)
        });

        if (response.ok) {
          // Successfully saved to Neon DB! Remove it from the local browser queue
          remainingQueue = remainingQueue.filter(c => c.localId !== caseData.localId);
        } else if (response.status === 401 || response.status === 403) {
          // If the token expired, stop syncing to prevent spamming errors
          console.error("Authentication failed during sync.");
          break;
        }
      } catch (error) {
        console.error("Network error during sync", error);
        break; // Stop syncing if the Node server is unreachable
      }
    }

    // Update the browser storage with whatever cases are left
    localStorage.setItem('anirescue_offline_queue', JSON.stringify(remainingQueue));
    setPendingCases(remainingQueue);
  };

  // Failsafe to wipe the queue manually if needed
  const clearQueue = () => {
    localStorage.removeItem('anirescue_offline_queue');
    setPendingCases([]);
  };

  return { isOffline, pendingCases, saveForOfflineSync, syncCases, clearQueue };
}