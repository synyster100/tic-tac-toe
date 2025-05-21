"use client";

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface RestartButtonProps {
  onRestart: () => void;
}

const RestartButton: FC<RestartButtonProps> = ({ onRestart }) => {
  return (
    <Button
      onClick={onRestart}
      variant="default"
      size="lg"
      className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
      aria-label="Restart game"
    >
      <RotateCcw className="mr-2 h-5 w-5" />
      Restart Game
    </Button>
  );
};

export default RestartButton;
