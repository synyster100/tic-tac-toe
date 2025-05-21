"use client";

import type { FC } from 'react';
import type { Player } from './Board';
import { cn } from '@/lib/utils';

interface GameInfoProps {
  winner: Player | null;
  isDraw: boolean;
  currentPlayer: Player;
}

const GameInfo: FC<GameInfoProps> = ({ winner, isDraw, currentPlayer }) => {
  let statusMessage;
  let messageClass = "text-xl text-foreground";

  if (winner) {
    statusMessage = `Player ${winner} Wins!`;
    messageClass = "text-2xl font-semibold text-accent animate-winner-text";
  } else if (isDraw) {
    statusMessage = "It's a Draw!";
    messageClass = "text-2xl font-semibold text-accent";
  } else {
    statusMessage = `Player ${currentPlayer}'s Turn`;
  }

  return (
    <div className="text-center mb-4 h-8">
      <p className={cn(messageClass)}>{statusMessage}</p>
    </div>
  );
};

export default GameInfo;
