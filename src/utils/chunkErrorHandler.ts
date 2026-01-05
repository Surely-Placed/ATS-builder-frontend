/**
 * Chunk loading error handler for production
 */

export const setupChunkErrorHandler = () => {
  if (typeof window === 'undefined' || !import.meta.env.PROD) {
    return;
  }

  // Handle chunk loading errors
  const handleChunkError = (error: Error | Event) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check if it's a chunk loading error
    if (
      errorMessage.includes('Failed to fetch dynamically imported module') ||
      errorMessage.includes('Loading chunk') ||
      errorMessage.includes('Loading CSS chunk') ||
      errorMessage.includes('ChunkLoadError')
    ) {
      console.error('Chunk loading error detected:', errorMessage);
      
      // Show user-friendly message
      const shouldReload = window.confirm(
        'A new version of the app is available. Would you like to reload to get the latest version?'
      );
      
      if (shouldReload) {
        window.location.reload();
      }
    }
  };

  // Listen for errors
  window.addEventListener('error', (event) => {
    if (event.error) {
      handleChunkError(event.error);
    }
  });

  // Listen for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason) {
      handleChunkError(event.reason);
    }
  });
};




