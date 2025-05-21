"use client";

import type { FC } from 'react';
import Cell from './Cell';

export type Player = 'X' | 'O';
export type SquareValue = Player | null;

interface BoardProps {
  squares: SquareValue[];
  onCellClick: (index: number) => void;
  winningLine: number[] | null;
  isGameOver: boolean;
  lastMoveIndex: number | null;
}

const Board: FC<BoardProps> = ({ squares, onCellClick, winningLine, isGameOver, lastMoveIndex }) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 my-6" aria-label="Tic Tac Toe board">
      {squares.map((value, index) => (
        <Cell
          key={index}
          value={value}
          onClick={() => onCellClick(index)}
          isWinningCell={winningLine?.includes(index)}
          disabled={isGameOver}
          isLastMove={index === lastMoveIndex}
        />
      ))}
    </div>
  );
};

export default Board;
