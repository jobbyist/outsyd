import React from 'react';
import { EVENT_CATEGORIES, EventCategory } from '@/constants/eventCategories';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selected: EventCategory | null;
  onSelect: (category: EventCategory | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "px-3 py-1.5 text-[11px] font-medium uppercase border transition-colors",
          selected === null
            ? "bg-foreground text-background border-foreground"
            : "bg-background text-foreground border-border hover:border-foreground"
        )}
      >
        All
      </button>
      {EVENT_CATEGORIES.map((category) => (
        <button
          key={category.value}
          onClick={() => onSelect(category.value)}
          className={cn(
            "px-3 py-1.5 text-[11px] font-medium uppercase border transition-colors flex items-center gap-1.5",
            selected === category.value
              ? "bg-foreground text-background border-foreground"
              : "bg-background text-foreground border-border hover:border-foreground"
          )}
        >
          <span>{category.emoji}</span>
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  );
};
