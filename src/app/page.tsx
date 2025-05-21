
"use client";

import { useState, useEffect, useCallback } from 'react';
import Board, { type SquareValue, type Player } from '@/components/tic-tac-toe/Board';
import GameInfo from '@/components/tic-tac-toe/GameInfo';
import RestartButton from '@/components/tic-tac-toe/RestartButton';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  const [gameMode, setGameMode] = useState<'pvp' | 'pvc'>('pvp');
  const [isComputerThinking, setIsComputerThinking] = useState<boolean>(false);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleRestart = useCallback((): void => {
    setBoard(initialBoard);
    setCurrentPlayer('X'); // Player X always starts
    setWinnerInfo(null);
    setIsDraw(false);
    setLastMoveIndex(null);
    setIsComputerThinking(false);
  }, []);


  const makeComputerMove = useCallback((currentBoardState: SquareValue[]): void => {
    setIsComputerThinking(true);
    setTimeout(() => {
      const emptyCells = currentBoardState
        .map((value, index) => (value === null ? index : null))
        .filter((index) => index !== null) as number[];

      if (emptyCells.length === 0) {
        setIsComputerThinking(false);
        return;
      }

      let computerMoveIndex: number | null = null;

      // 1. Check if computer ('O') can win
      for (const index of emptyCells) {
        const testBoard = [...currentBoardState];
        testBoard[index] = 'O';
        if (calculateWinner(testBoard)?.winner === 'O') {
          computerMoveIndex = index;
          break;
        }
      }

      // 2. Check if player ('X') can win, then block
      if (computerMoveIndex === null) {
        for (const index of emptyCells) {
          const testBoard = [...currentBoardState];
          testBoard[index] = 'X';
          if (calculateWinner(testBoard)?.winner === 'X') {
            computerMoveIndex = index;
            break;
          }
        }
      }
      
      // 3. Take center if available and not winning/blocking
      if (computerMoveIndex === null && currentBoardState[4] === null) {
        computerMoveIndex = 4;
      }

      // 4. Pick a random empty cell if no win/block/center
      if (computerMoveIndex === null) {
          const randomIndex = Math.floor(Math.random() * emptyCells.length);
          computerMoveIndex = emptyCells[randomIndex];
      }

      const newBoard = [...currentBoardState];
      newBoard[computerMoveIndex!] = 'O'; // Computer is always 'O'
      setBoard(newBoard);
      setLastMoveIndex(computerMoveIndex!);

      const newWinnerInfo = calculateWinner(newBoard);
      if (newWinnerInfo) {
        setWinnerInfo(newWinnerInfo);
      } else if (newBoard.every((square) => square !== null)) {
        setIsDraw(true);
      } else {
        setCurrentPlayer('X');
      }
      setIsComputerThinking(false);
    }, 700); 
  }, [calculateWinner]);


  useEffect(() => {
    if (gameMode === 'pvc' && currentPlayer === 'O' && !winnerInfo && !isDraw && !isComputerThinking) {
      makeComputerMove(board);
    }
  }, [currentPlayer, gameMode, board, winnerInfo, isDraw, isComputerThinking, makeComputerMove]);


  const handleCellClick = (index: number): void => {
    if (winnerInfo || board[index] || isComputerThinking || (gameMode === 'pvc' && currentPlayer === 'O')) {
      return; 
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
          <div className="mb-6 flex flex-col items-center space-y-2">
            <Label className="text-md font-medium text-foreground">Play against:</Label>
            <RadioGroup
              value={gameMode}
              onValueChange={(value: 'pvp' | 'pvc') => {
                setGameMode(value);
                handleRestart(); 
              }}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pvp" id="pvp" />
                <Label htmlFor="pvp" className="cursor-pointer">Player</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pvc" id="pvc" />
                <Label htmlFor="pvc" className="cursor-pointer">Computer</Label>
              </div>
            </RadioGroup>
          </div>

          <GameInfo
            winner={winnerInfo?.winner || null}
            isDraw={isDraw}
            currentPlayer={currentPlayer}
            gameMode={gameMode}
          />
          <Board
            squares={board}
            onCellClick={handleCellClick}
            winningLine={winnerInfo?.line || null}
            isGameOver={isGameOver || isComputerThinking}
            lastMoveIndex={lastMoveIndex}
          />
          <RestartButton onRestart={handleRestart} />
        </CardContent>
      </Card>
      {/* {mounted && winnerInfo && <ConfettiEffect />} */}
    </main>
  );
}
