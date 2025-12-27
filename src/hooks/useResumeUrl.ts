import { useMemo } from 'react';
import { getResumeUrl } from '../utils/resumeUrlHelper';

interface UseResumeUrlOptions {
  useProxy?: boolean;
  preferOptimized?: boolean;
  baseUrl?: string;
}

export const useResumeUrl = (
  resume: {
    id?: string;
    original_file_url?: string | null;
    optimized_file_url?: string | null;
  } | null | undefined,
  options?: UseResumeUrlOptions
): string | null => {
  return useMemo(() => {
    if (!resume) return null;
    
    try {
      return getResumeUrl(resume, options);
    } catch (error) {
      return null;
    }
  }, [resume, options?.useProxy, options?.preferOptimized, options?.baseUrl]);
};

