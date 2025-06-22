
import { useEffect } from 'react';

export const usePageProtection = (hasUnsavedData: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedData) {
        const message = 'Are you sure you want to leave? All game data from this game will be lost.';
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    if (hasUnsavedData) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedData]);
};
