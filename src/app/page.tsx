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
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every(cell => cell)) return { winner: "draw", line: [] };
  return null;
}

function getRandomMove(board: (string|null)[]) {
  const available = board.map((v, i) => v ? null : i).filter(v => v !== null) as number[];
  if (available.length === 0) return -1;
  return available[Math.floor(Math.random() * available.length)];
}

export default function Home() {
  const [mode, setMode] = useState<null | "2p" | "bot">(null);
const [playerSide, setPlayerSide] = useState<null | "X" | "O">(null);
  const [board, setBoard] = useState<(string | null)[]>([...emptyBoard]);
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string | null>(null);
const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [waitingBot, setWaitingBot] = useState(false);

  React.useEffect(() => {
    if (
      mode === "bot" &&
      playerSide &&
      turn !== playerSide &&
      !winner &&
      !waitingBot
    ) {
      setWaitingBot(true);
      setTimeout(() => {
        const idx = getRandomMove(board);
        if (idx !== -1) {
          const newBoard = [...board];
          newBoard[idx] = turn;
          setBoard(newBoard);
          const res = checkWinner(newBoard);
          if (res) {
            setWinner(res.winner);
            setWinningLine(res.line);
          }
          setTurn(playerSide);
        }
        setWaitingBot(false);
      }, 600);
    }
  }, [mode, board, turn, winner, playerSide, waitingBot]);

  function handleCellClick(idx: number) {
    if (winner || board[idx]) return;
    if (mode === "bot" && playerSide && turn !== playerSide) return;
    const newBoard = [...board];
    newBoard[idx] = turn;
    setBoard(newBoard);
    const res = checkWinner(newBoard);
    if (res) {
      setWinner(res.winner);
      setWinningLine(res.line);
    }
    setTurn(turn === "X" ? "O" : "X");
  }

  function startGame(selectedMode: "2p" | "bot") {
    setMode(selectedMode);
    setPlayerSide(null);
    setBoard([...emptyBoard]);
    setTurn("X");
    setWinner(null);
    setWinningLine(null);
    setWaitingBot(false);
  }

  function startBotGame(side: "X" | "O" | "random") {
    let chosen: "X" | "O";
    if (side === "random") {
      chosen = Math.random() < 0.5 ? "X" : "O";
    } else {
      chosen = side;
    }
    setPlayerSide(chosen);
    setBoard([...emptyBoard]);
    setTurn("X");
    setWinner(null);
    setWinningLine(null);
    setWaitingBot(false);
  }

  function restart() {
    setBoard([...emptyBoard]);
    setTurn("X");
    setWinner(null);
    setWinningLine(null);
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
          ) : mode === "bot" && playerSide === null ? (
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="text-lg font-semibold mb-2">Choose your side:</div>
              <div className="flex gap-3">
                <Button onClick={() => startBotGame("X")}
                  variant="outline"
                  className="flex flex-col items-center justify-center">
                  <img src="/ninja.png" alt="Ninja" style={{ width: 32, height: 32, marginBottom: 4 }} />
                  Ninja
                </Button>
                <Button onClick={() => startBotGame("O")}
                  variant="outline"
                  className="flex flex-col items-center justify-center">
                  <img src="/pirate.png" alt="Pirate" style={{ width: 32, height: 32, marginBottom: 4 }} />
                  Pirate
                </Button>
                <Button onClick={() => startBotGame("random")}
                  variant="outline"
                  className="flex flex-col items-center justify-center">
                  <span style={{ fontSize: 24, marginBottom: 4 }}>🎲</span>
                  Random
                </Button>
              </div>
              <Button onClick={() => setMode(null)} variant="ghost" className="mt-2">Back</Button>
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
                  <span className="font-bold text-base text-gray-900 dark:text-gray-50">
                    {winner ? "-" : turn === "X" ? (
  <>
    <img src="/ninja.png" alt="Ninja" style={{ width: 24, height: 24, display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
    Ninja
    {mode === "2p" || (mode === "bot" && playerSide === "X") ? (
      <span style={{ color: '#2563eb', fontWeight: 'bold', marginLeft: 4 }}>(You)</span>
    ) : null}
  </>
) : (
  <>
    <img src="/pirate.png" alt="Pirate" style={{ width: 24, height: 24, display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
    {mode === "2p" ? "Pirate" : playerSide === "O" ? "Pirate" : "Bot (Pirate)"}
    {mode === "2p" || (mode === "bot" && playerSide === "O") ? (
      <span style={{ color: '#dc2626', fontWeight: 'bold', marginLeft: 4 }}>(You)</span>
    ) : null}
  </>
)}
                  </span>
                </div>
              </div>
              <div className="ttt-board">
                {board.map((cell, idx) => {
                  let icon = null;
                  if (cell === "X") {
                    icon = <img src="/ninja.png" alt="Ninja" style={{ width: 48, height: 48 }} />;
                  } else if (cell === "O") {
                    icon = <img src="/pirate.png" alt="Pirate" style={{ width: 48, height: 48 }} />;
                  }
                  let highlight = "";
                  if (winningLine && winningLine.includes(idx)) {
                    highlight = cell === "X" ? " highlight-ninja" : " highlight-pirate";
                  }
                  return (
                    <Button
                      key={idx}
                      className={`ttt-cell${cell ? " cursor-default" : ""}${highlight}`}
                      variant="outline"
                      onClick={() => handleCellClick(idx)}
                      disabled={!!cell || !!winner || (mode === "bot" && !!playerSide && turn !== playerSide)}
                      aria-label={`Cell ${idx+1}`}
                    >
                      {icon}
                    </Button>
                  );
                })}
              </div>
              <div className="ttt-status mt-3 mb-2">
                {winner === "draw" ? (
                  "It's a draw!"
                ) : winner ? (
                  <>
                    {winner === "X" ? (
                      <span style={{ color: '#2563eb', fontWeight: 'bold', fontSize: '1.5rem' }}>
                        <img src="/ninja.png" alt="Ninja" style={{ width: 28, height: 28, display: 'inline', verticalAlign: 'middle', marginRight: '12px', marginBottom: '5px' }} />
                        Ninja wins!
                      </span>
                    ) : (
                      <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '1.5rem' }}>
                        <img src="/pirate.png" alt="Pirate" style={{ width: 28, height: 28, display: 'inline', verticalAlign: 'middle', marginRight: '12px', marginBottom: '5px' }} />
                        Pirate wins!
                      </span>
                    )}
                  </>
                ) : ""}
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
