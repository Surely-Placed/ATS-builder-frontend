/**
 * Format date for display in overview tab (DD/MM/YYYY)
 */
export const formatDateOverview = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

/**
 * Format date for display in API keys tab (with time, handles null)
 */
export const formatDateApiKeys = (dateString: string | null): string => {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleString();
};

/**
 * Generic date formatter
 */
export const formatDate = (
  dateString: string | null | undefined,
  includeTime: boolean = false
): string => {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  if (includeTime) {
    return date.toLocaleString();
  }
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

