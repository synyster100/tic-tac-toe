"use client";

import { useState, useEffect } from 'react';
import Board, { type SquareValue, type Player } from '@/components/tic-tac-toe/Board';
import GameInfo from '@/components/tic-tac-toe/GameInfo';
import RestartButton from '@/components/tic-tac-toe/RestartButton';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialBoard = Array(9).fill(null) as SquareValue[];

const calculateWinner = (squares: SquareValue[]): { winner: Player; line: number[] } | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],          // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a] as Player, line: lines[i] };
    }
  }
  return null;
};

export default function GamePage() {
  const [board, setBoard] = useState<SquareValue[]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winnerInfo, setWinnerInfo] = useState<{ winner: Player; line: number[] } | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [lastMoveIndex, setLastMoveIndex] = useState<number | null>(null);
  
  // Client-side check for mounted state to avoid hydration issues with confetti or other effects
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);


  const handleCellClick = (index: number): void => {
    if (winnerInfo || board[index]) {
      return; // Ignore click if game over or cell taken
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setLastMoveIndex(index);

    const newWinnerInfo = calculateWinner(newBoard);
    if (newWinnerInfo) {
      setWinnerInfo(newWinnerInfo);
    } else if (newBoard.every((square) => square !== null)) {
      setIsDraw(true);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const handleRestart = (): void => {
    setBoard(initialBoard);
    setCurrentPlayer('X');
    setWinnerInfo(null);
    setIsDraw(false);
    setLastMoveIndex(null);
  };

  const isGameOver = !!winnerInfo || isDraw;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4 font-sans">
      <Card className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-3xl sm:text-4xl font-bold text-center tracking-tight py-2">
            Noughts & Crosses
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 md:p-8">
          <GameInfo
            winner={winnerInfo?.winner || null}
            isDraw={isDraw}
            currentPlayer={currentPlayer}
          />
          <Board
            squares={board}
            onCellClick={handleCellClick}
            winningLine={winnerInfo?.line || null}
            isGameOver={isGameOver}
            lastMoveIndex={lastMoveIndex}
          />
          <RestartButton onRestart={handleRestart} />
        </CardContent>
      </Card>
      {/* Placeholder for confetti or other effects on win. Only run if mounted. */}
      {/* {mounted && winnerInfo && <ConfettiEffect />} */}
    </main>
  );
}
