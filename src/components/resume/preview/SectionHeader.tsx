import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { ChangeHighlight } from '@/types/resume/preview';
import { SECTION_THEMES } from '@/constants/resume/preview';
import { getBadgeStyles } from '@/utils/resume/preview';

interface SectionHeaderProps {
  title: string;
  sectionKey: keyof typeof SECTION_THEMES;
  changes: ChangeHighlight[];
  badgeLabel?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, sectionKey, changes, badgeLabel }) => {
  const hasChanges = changes.length > 0;
  const theme = SECTION_THEMES[sectionKey];
  const label = badgeLabel || (changes.some(c => c.changeType === 'reordered') ? 'Reordered' : theme.label);
  
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      {hasChanges && (
        <Badge variant="outline" className={getBadgeStyles(theme.color)}>
          {badgeLabel || `${changes.length} ${label}${changes.length !== 1 ? 's' : ''}`}
        </Badge>
      )}
    </div>
  );
};

