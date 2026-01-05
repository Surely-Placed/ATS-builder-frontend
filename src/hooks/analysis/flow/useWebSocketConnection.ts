import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { socketService } from '@/services/socketService';

export function useWebSocketConnection() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      const connectWebSocket = async () => {
        try {
          const firebaseIdToken = await user.getIdToken();
          socketService.connect({
            userId: user.uid,
            firebaseIdToken,
          });
        } catch (error) {
          // Failed to connect WebSocket
        }
      };
      connectWebSocket();
    }
  }, [user]);
}

