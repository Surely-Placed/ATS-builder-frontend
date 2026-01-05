import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ViewState } from '@/hooks/useResumeAnalysisStorage';

interface UseOptimizationHandlersProps {
  analysisId: string | null;
  isWebSocketConnected: boolean;
  startOptimization: () => Promise<void>;
  setViewState: (state: ViewState) => void;
}

export function useOptimizationHandlers({
  analysisId,
  isWebSocketConnected,
  startOptimization,
  setViewState,
}: UseOptimizationHandlersProps) {
  const { toast } = useToast();

  const handleStartOptimization = useCallback(async () => {
    if (!analysisId) {
      toast({
        title: 'Optimization Error',
        description: 'No analysis ID available to start optimization.',
        variant: 'destructive',
      });
      return;
    }
    if (!isWebSocketConnected) {
      toast({
        title: 'Connection Error',
        description: 'WebSocket is not connected. Please check your internet connection or try again.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await startOptimization();
      setViewState('optimizing');
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to start optimization';
      toast({
        title: 'Failed to start optimization',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  }, [analysisId, isWebSocketConnected, startOptimization, setViewState, toast]);

  return {
    handleStartOptimization,
  };
}

