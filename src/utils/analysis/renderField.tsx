import React from 'react';

/**
 * Helper function to render field with fallback
 * @param value - The value to render
 * @param label - Label for the field (currently unused but kept for future extensibility)
 * @param fallback - Fallback text when value is not available
 * @returns JSX element with the appropriate value or fallback
 */
export const renderField = (
  value: any, 
  label: string, 
  fallback: string = "Not Available"
): JSX.Element => {
  if (value === null || value === undefined || 
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)) {
    return <span className="text-gray-500 italic">{fallback}</span>;
  }
  return <span>{value.toString()}</span>;
};