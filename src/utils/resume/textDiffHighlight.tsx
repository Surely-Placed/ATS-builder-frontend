import React from "react";

/**
 * Highlights differences between original and optimized text at the word level
 * Returns JSX with colored highlights for changed, added, and removed words
 */
export function highlightTextDiff(
  originalText: string | null | undefined,
  optimizedText: string | null | undefined,
  changeType?: "modified" | "added" | "removed" | "reordered"
): React.ReactNode {
  // Handle null/undefined cases
  if (!optimizedText && !originalText) return null;
  if (!optimizedText) return <span className="text-muted-foreground">{originalText}</span>;
  if (!originalText) {
    // Entire text is new
    return (
      <span className="px-1 py-0.5 rounded border bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-green-300 dark:border-green-700">
        {optimizedText}
      </span>
    );
  }

  // If texts are identical, no highlighting needed
  if (originalText === optimizedText) {
    return <span>{optimizedText}</span>;
  }

  // For simple cases where entire text changed, highlight the whole thing
  if (changeType === "added") {
    return (
      <span className="px-1 py-0.5 rounded border bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-green-300 dark:border-green-700">
        {optimizedText}
      </span>
    );
  }

  if (changeType === "reordered") {
    return (
      <span className="px-1 py-0.5 rounded border bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-blue-300 dark:border-blue-700">
        {optimizedText}
      </span>
    );
  }

  // Perform word-level diff for modified text
  const originalWords = originalText.split(/(\s+)/); // Keep whitespace
  const optimizedWords = optimizedText.split(/(\s+)/);

  // Simple word-by-word comparison
  const result: React.ReactNode[] = [];
  const maxLength = Math.max(originalWords.length, optimizedWords.length);

  for (let i = 0; i < optimizedWords.length; i++) {
    const word = optimizedWords[i];
    const originalWord = originalWords[i];

    // Skip whitespace
    if (/^\s+$/.test(word)) {
      result.push(word);
      continue;
    }

    // Word was added (no corresponding original word)
    if (i >= originalWords.length || !originalWord) {
      result.push(
        <span
          key={`add-${i}`}
          className="px-1 py-0.5 rounded border bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-green-300 dark:border-green-700"
        >
          {word}
        </span>
      );
    }
    // Word was modified
    else if (word !== originalWord && !/^\s+$/.test(originalWord)) {
      result.push(
        <span
          key={`mod-${i}`}
          className="px-1 py-0.5 rounded border bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border-yellow-300 dark:border-yellow-700"
        >
          {word}
        </span>
      );
    }
    // Word unchanged
    else {
      result.push(<span key={`same-${i}`}>{word}</span>);
    }
  }

  return <>{result}</>;
}

/**
 * Highlights an array of items (like skills or responsibilities) showing which were added/modified
 */
export function highlightArrayItem(
  item: string,
  index: number,
  originalArray: string[] | null | undefined,
  optimizedArray: string[] | null | undefined
): React.ReactNode {
  if (!optimizedArray) return <span>{item}</span>;
  
  const originalItem = originalArray?.[index];

  // Item is new (added)
  if (!originalItem || index >= (originalArray?.length || 0)) {
    return (
      <span className="px-1 py-0.5 rounded border bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-green-300 dark:border-green-700">
        {item}
      </span>
    );
  }

  // Item was modified
  if (item !== originalItem) {
    return highlightTextDiff(originalItem, item, "modified");
  }

  // Item unchanged
  return <span>{item}</span>;
}
