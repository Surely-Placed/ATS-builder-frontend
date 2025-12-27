/**
 * File validation utilities for resume uploads
 */

export const VALID_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword'
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const FILE_TYPE_NAMES = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/msword': 'DOC'
};

/**
 * Validates file type by checking MIME type
 */
export const validateFileType = (file: File): { valid: boolean; error?: string } => {
  if (!VALID_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a PDF, DOC, or DOCX file'
    };
  }
  return { valid: true };
};

/**
 * Validates file size
 */
export const validateFileSize = (file: File): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size must be less than 10MB'
    };
  }
  return { valid: true };
};

/**
 * Validates file content by checking file signature (magic numbers)
 */
export const validateFileContent = async (file: File): Promise<{ valid: boolean; error?: string }> => {
  try {
    const buffer = await file.arrayBuffer();
    const arr = new Uint8Array(buffer).subarray(0, 4);
    let header = '';
    for (let i = 0; i < arr.length; i++) {
      header += arr[i].toString(16).padStart(2, '0');
    }
    
    const isPDF = header.startsWith('25504446'); // %PDF
    const isDOCX = header.startsWith('504b0304') || header.startsWith('504b0506'); // ZIP-based formats
    
    if (!isPDF && !isDOCX) {
      return {
        valid: false,
        error: 'File content validation failed. File may be corrupted.'
      };
    }
    
    return { valid: true };
  } catch (err) {
    return {
      valid: false,
      error: 'Failed to validate file content'
    };
  }
};

/**
 * Complete file validation
 */
export const validateFile = async (file: File): Promise<{ valid: boolean; error?: string }> => {
  // Check file type
  const typeCheck = validateFileType(file);
  if (!typeCheck.valid) return typeCheck;
  
  // Check file size
  const sizeCheck = validateFileSize(file);
  if (!sizeCheck.valid) return sizeCheck;
  
  // Check file content
  const contentCheck = await validateFileContent(file);
  if (!contentCheck.valid) return contentCheck;
  
  return { valid: true };
};
