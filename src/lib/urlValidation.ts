/**
 * URL validation utilities for job posting URLs
 */

export const SUPPORTED_JOB_BOARDS = [
  'linkedin.com',
  'indeed.com',
  'glassdoor.com',
  'monster.com',
  'dice.com',
  'careerbuilder.com',
  'ziprecruiter.com'
];

/**
 * Validates job posting URL
 */
export const validateJobUrl = (url: string): { valid: boolean; error?: string } => {
  if (!url || url.trim() === '') {
    return {
      valid: false,
      error: 'Job URL is required'
    };
  }
  
  // Check basic URL format
  if (!/^https?:\/\/.+\..+/.test(url)) {
    return {
      valid: false,
      error: 'Invalid URL format. Please enter a complete URL starting with http:// or https://'
    };
  }
  
  try {
    const urlObj = new URL(url);
    const isSupported = SUPPORTED_JOB_BOARDS.some(domain => 
      urlObj.hostname.includes(domain)
    );
    
    if (!isSupported) {
      return {
        valid: false,
        error: 'Please use a supported job board (LinkedIn, Indeed, Glassdoor, Monster, Dice, CareerBuilder, or ZipRecruiter)'
      };
    }
    
    return { valid: true };
  } catch (err) {
    return {
      valid: false,
      error: 'Invalid URL format'
    };
  }
};

/**
 * Get supported job boards as a formatted string
 */
export const getSupportedJobBoardsText = (): string => {
  return SUPPORTED_JOB_BOARDS
    .map(domain => domain.replace('.com', ''))
    .map(name => name.charAt(0).toUpperCase() + name.slice(1))
    .join(', ');
};
