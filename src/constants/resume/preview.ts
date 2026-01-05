export const SECTION_THEMES = {
  summary: { color: 'yellow', label: 'Modified' },
  skills: { color: 'blue', label: 'Modified' },
  work_experience: { color: 'purple', label: 'Updated' },
  projects: { color: 'green', label: 'Enhanced' },
  education: { color: 'indigo', label: 'Modified' },
  certifications: { color: 'teal', label: 'Enhanced' },
} as const;

export const CHANGE_TYPE_STYLES = {
  modified: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border-yellow-300 dark:border-yellow-700',
  added: 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-green-300 dark:border-green-700',
  removed: 'bg-gray-100 dark:bg-gray-800',
  reordered: 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-blue-300 dark:border-blue-700',
} as const;

export const BADGE_STYLES: Record<string, string> = {
  yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-100 border-yellow-300 dark:border-yellow-700',
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100 border-blue-300 dark:border-blue-700',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-100 border-purple-300 dark:border-purple-700',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100 border-green-300 dark:border-green-700',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-100 border-indigo-300 dark:border-indigo-700',
  teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-100 border-teal-300 dark:border-teal-700',
};

export const SECTION_STYLES: Record<string, string> = {
  yellow: 'mb-6 border-l-4 border-yellow-500 dark:border-yellow-400 pl-4 bg-yellow-50/30 dark:bg-yellow-900/10 rounded-r',
  blue: 'mb-6 border-l-4 border-blue-500 dark:border-blue-400 pl-4 bg-blue-50/30 dark:bg-blue-900/10 rounded-r',
  purple: 'mb-6 border-l-4 border-purple-500 dark:border-purple-400 pl-4 bg-purple-50/30 dark:bg-purple-900/10 rounded-r',
  green: 'mb-6 border-l-4 border-green-500 dark:border-green-400 pl-4 bg-green-50/30 dark:bg-green-900/10 rounded-r',
  indigo: 'mb-6 border-l-4 border-indigo-500 dark:border-indigo-400 pl-4 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-r',
  teal: 'mb-6 border-l-4 border-teal-500 dark:border-teal-400 pl-4 bg-teal-50/30 dark:bg-teal-900/10 rounded-r',
};

