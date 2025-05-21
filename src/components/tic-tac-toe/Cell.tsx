"use client";

import type { FC } from 'react';
import { X, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CellProps {
  value: 'X' | 'O' | null;
  onClick: () => void;
  isWinningCell?: boolean;
  disabled?: boolean;
  isLastMove?: boolean; // To trigger animation
}

const Cell: FC<CellProps> = ({ value, onClick, isWinningCell = false, disabled = false, isLastMove = false }) => {
  const iconSizeClass = "w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !!value}
      aria-label={`Cell ${value ? `marked as ${value}` : 'empty'}`}
      className={cn(
        "flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg border-2 shadow-sm transition-all duration-150 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
        isWinningCell 
          ? "bg-accent border-accent-foreground focus:ring-accent-foreground" 
          : "bg-card border-primary hover:bg-primary/10 focus:ring-primary",
        (disabled || !!value) ? "cursor-default" : "cursor-pointer",
        value && isLastMove && "animate-cell-enter"
      )}
    >
      {value === 'X' && (
        <X className={cn(iconSizeClass, isWinningCell ? "text-accent-foreground" : "text-primary")} />
      )}
      {value === 'O' && (
        <Circle className={cn(iconSizeClass, isWinningCell ? "text-accent-foreground" : "text-primary")} />
      )}
    </button>
  );
};

export default Cell;
