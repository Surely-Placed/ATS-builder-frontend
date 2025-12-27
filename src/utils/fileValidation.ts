import { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE } from '@/constants/analysis';

export const validateFileType = (file: File): boolean => {
  return SUPPORTED_FILE_TYPES.includes(file.type);
};

export const validateFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

export const validateFileContent = async (file: File): Promise<boolean> => {
  try {
    const buffer = await file.arrayBuffer();
    const arr = new Uint8Array(buffer).subarray(0, 4);
    let header = '';
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16).padStart(2, '0');
    }
    
    const isPDF = header.startsWith('25504446');
    const isDOCX = header.startsWith('504b0304') || header.startsWith('504b0506');
    
    return isPDF || isDOCX;
  } catch (err) {
    return false;
  }
};

export const getFileErrorMessage = (file: File): string | null => {
  if (!validateFileType(file)) {
    return 'Please upload a PDF, DOC, or DOCX file';
  }
  
  if (!validateFileSize(file)) {
    return 'File size must be less than 10MB';
  }
  
  return null;
};
