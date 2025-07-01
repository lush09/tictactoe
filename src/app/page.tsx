"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import "./ttt.css";

const emptyBoard = Array(9).fill(null);

function checkWinner(board: (string|null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.every(cell => cell) ? "draw" : null;
}

function getRandomMove(board: (string|null)[]) {
  const available = board.map((v, i) => v ? null : i).filter(v => v !== null) as number[];
  if (available.length === 0) return -1;
  return available[Math.floor(Math.random() * available.length)];
}

export default function Home() {
  const [mode, setMode] = useState<null | "2p" | "bot">(null);
  const [board, setBoard] = useState<(string | null)[]>([...emptyBoard]);
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [waitingBot, setWaitingBot] = useState(false);

  React.useEffect(() => {
    if (mode === "bot" && turn === "O" && !winner && !waitingBot) {
      setWaitingBot(true);
      setTimeout(() => {
        const idx = getRandomMove(board);
        if (idx !== -1) {
          const newBoard = [...board];
          newBoard[idx] = "O";
          setBoard(newBoard);
          const res = checkWinner(newBoard);
          if (res) setWinner(res);
          setTurn("X");
        }
        setWaitingBot(false);
      }, 600);
    }
  }, [mode, board, turn, winner]);

  function handleCellClick(idx: number) {
    if (winner || board[idx] || (mode === "bot" && turn === "O")) return;
    const newBoard = [...board];
    newBoard[idx] = turn;
    setBoard(newBoard);
    const res = checkWinner(newBoard);
    if (res) setWinner(res);
    setTurn(turn === "X" ? "O" : "X");
  }

  function startGame(selectedMode: "2p" | "bot") {
    setMode(selectedMode);
    setBoard([...emptyBoard]);
    setTurn("X");
    setWinner(null);
    setWaitingBot(false);
  }

  function restart() {
    setBoard([...emptyBoard]);
    setTurn("X");
    setWinner(null);
    setWaitingBot(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
  <Card className="w-full max-w-md">
    <CardContent className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-center">Tic-Tac-Toe</h1>
      {!mode ? (
        <div className="flex gap-4 mb-4">
          <Button onClick={() => startGame("2p")} variant="default">2 Players</Button>
          <Button onClick={() => startGame("bot")} variant="secondary">Vs Bot</Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-2 mb-4 w-full justify-center items-center">
            <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 min-w-[110px]">
              <span className="font-semibold text-xs text-gray-500 dark:text-gray-400">Mode</span>
              <span className="font-bold text-base text-gray-900 dark:text-gray-50">{mode === "2p" ? "2 Players" : "Vs Bot"}</span>
            </div>
            <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 min-w-[110px]">
              <span className="font-semibold text-xs text-gray-500 dark:text-gray-400">Turn</span>
              <span className="font-bold text-base text-gray-900 dark:text-gray-50">{winner ? "-" : turn === "X" ? "X" : mode === "2p" ? "O" : "Bot (O)"}</span>
            </div>
          </div>
          <div className="ttt-board">
            {board.map((cell, idx) => (
  <Button
    key={idx}
    className={`ttt-cell${cell ? " cursor-default" : ""}`}
    variant="outline"
    onClick={() => handleCellClick(idx)}
    disabled={!!cell || !!winner || (mode === "bot" && turn === "O")}
    aria-label={`Cell ${idx+1}`}
  >
    {cell}
  </Button>
))}
          </div>
          <div className="ttt-status mt-3 mb-2">
            {winner === "draw" ? "It's a draw!" : winner ? `${winner === "O" && mode === "bot" ? "Bot (O)" : winner} wins!` : ""}
          </div>
          <div className="flex gap-4 mt-2">
            <Button onClick={restart} variant="destructive">Restart</Button>
            <Button onClick={() => setMode(null)} variant="ghost">Change Mode</Button>
          </div>
        </>
      )}
    </CardContent>
  </Card>
</div>
  );
}
