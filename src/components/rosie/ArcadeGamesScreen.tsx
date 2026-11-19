import React, { useEffect, useRef, useState } from 'react';
import { QUIZ_QUESTIONS } from '../../lib/rosieData';
import { chiptune } from '../../lib/chiptuneAudio';
import { PixelHeart, PixelStar } from './PixelSprites';

interface ArcadeGamesScreenProps {
  completedGames: string[];
  ticTacToeScore: { p1: number; p2: number; ties: number };
  onUpdateTttScore: (score: { p1: number; p2: number; ties: number }) => void;
  onGameCompleted: (gameId: string, apReward: number) => void;
  onBackToWorld: () => void;
}

type ArcadeTab = 'ttt' | 'stars' | 'memory' | 'quiz';

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkTttWinner(board: Array<'X' | 'O' | null>): {
  winner: 'X' | 'O' | 'DRAW' | null;
  line: number[];
} {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { winner: 'DRAW', line: [] };
  }
  return { winner: null, line: [] };
}

/* ---------------- GAME 01: TIC TAC TOE ---------------- */
const TicTacToeGame: React.FC<{
  score: { p1: number; p2: number; ties: number };
  onUpdateScore: (s: { p1: number; p2: number; ties: number }) => void;
  onComplete: () => void;
}> = ({ score, onUpdateScore, onComplete }) => {
  const [board, setBoard] = useState<Array<'X' | 'O' | null>>(Array(9).fill(null));
  const [mode, setMode] = useState<'cpu' | 'pvp'>('cpu');
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const { winner, line } = checkTttWinner(board);

  const finalizeRound = (nextBoard: Array<'X' | 'O' | null>) => {
    const res = checkTttWinner(nextBoard);
    if (res.winner === 'X') {
      chiptune.playSfx('victory');
      onUpdateScore({ ...score, p1: score.p1 + 1 });
      onComplete();
    } else if (res.winner === 'O') {
      chiptune.playSfx('click');
      onUpdateScore({ ...score, p2: score.p2 + 1 });
    } else if (res.winner === 'DRAW') {
      chiptune.playSfx('nav');
      onUpdateScore({ ...score, ties: score.ties + 1 });
    }
  };

  useEffect(() => {
    if (mode !== 'cpu' || turn !== 'O' || winner) return;
    const timer = window.setTimeout(() => {
      const empty = board.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1);
      if (empty.length === 0) return;

      // Smart AI: win if possible, block X, take center, else random
      let pick = empty[Math.floor(Math.random() * empty.length)];
      for (const idx of empty) {
        const copy = [...board];
        copy[idx] = 'O';
        if (checkTttWinner(copy).winner === 'O') {
          pick = idx;
          break;
        }
      }
      if (board[pick] === null) {
        const block = empty.find((idx) => {
          const copy = [...board];
          copy[idx] = 'X';
          return checkTttWinner(copy).winner === 'X';
        });
        const winCheck = [...board];
        winCheck[pick] = 'O';
        if (checkTttWinner(winCheck).winner !== 'O' && block !== undefined) {
          pick = block;
        } else if (checkTttWinner(winCheck).winner !== 'O' && board[4] === null) {
          pick = 4;
        }
      }

      const next = [...board];
      next[pick] = 'O';
      setBoard(next);
      setTurn('X');
      chiptune.playSfx('click');
      finalizeRound(next);
    }, 360);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, mode, turn, winner]);

  const handleCellClick = (idx: number) => {
    if (board[idx] || winner) return;
    if (mode === 'cpu' && turn === 'O') return;
    chiptune.playSfx('click');
    const next = [...board];
    next[idx] = turn;
    setBoard(next);
    setTurn(turn === 'X' ? 'O' : 'X');
    finalizeRound(next);
  };

  const resetBoard = () => {
    chiptune.playSfx('nav');
    setBoard(Array(9).fill(null));
    setTurn('X');
  };

  return (
    <div className="pixel-box p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMode('cpu');
              resetBoard();
            }}
            className={`pixel-btn px-3 py-2 font-pixel-ui text-xs font-bold ${
              mode === 'cpu' ? 'bg-[#EC6FA9] text-[#FFF5EE]' : 'bg-[#FFD6E7] text-[#392337]'
            }`}
          >
            VS COMPUTER
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('pvp');
              resetBoard();
            }}
            className={`pixel-btn px-3 py-2 font-pixel-ui text-xs font-bold ${
              mode === 'pvp' ? 'bg-[#EC6FA9] text-[#FFF5EE]' : 'bg-[#FFD6E7] text-[#392337]'
            }`}
          >
            PLAYER VS PLAYER
          </button>
        </div>

        <div className="flex items-center gap-4 font-pixel-ui text-xs font-bold text-[#392337]">
          <span>♡ YOU: {score.p1}</span>
          <span>★ {mode === 'cpu' ? 'CPU' : 'P2'}: {score.p2}</span>
          <span>TIES: {score.ties}</span>
        </div>
      </div>

      {/* 3x3 Pink Pixel Board */}
      <div className="grid grid-cols-3 gap-3 max-w-[300px] mx-auto my-4">
        {board.map((cell, idx) => {
          const isWinCell = line.includes(idx);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleCellClick(idx)}
              className={`aspect-square border-4 border-[#392337] flex items-center justify-center transition-transform active:scale-95 ${
                isWinCell ? 'bg-[#FFDCC8]' : 'bg-[#FFC0D9] hover:bg-[#FFD6E7]'
              }`}
            >
              {cell === 'X' && <PixelHeart className="w-10 h-10" color="#EC6FA9" />}
              {cell === 'O' && <PixelStar className="w-10 h-10" color="#7D4E8D" />}
            </button>
          );
        })}
      </div>

      <div className="text-center mt-4 space-y-3">
        <p className="font-pixel-title text-xs text-[#C94F86]">
          {winner === 'X'
            ? 'YOU WIN! NICE MOVE, ROSIE!'
            : winner === 'O'
              ? mode === 'cpu'
                ? 'COMPUTER WINS! REMATCH?'
                : 'STAR PLAYER WINS!'
              : winner === 'DRAW'
                ? "IT'S A TIE! TRY AGAIN?"
                : `TURN: ${turn === 'X' ? '♡ HEART (YOU)' : mode === 'cpu' ? '★ CPU' : '★ STAR (P2)'}`}
        </p>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={resetBoard}
            className="pixel-btn bg-[#EC6FA9] text-[#FFF5EE] font-pixel-ui text-xs font-bold px-4 py-2"
          >
            RESTART BOARD
          </button>
          <button
            type="button"
            onClick={() => onUpdateScore({ p1: 0, p2: 0, ties: 0 })}
            className="pixel-btn bg-[#FFF5EE] text-[#392337] font-pixel-ui text-xs font-bold px-4 py-2"
          >
            RESET SCORE
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- GAME 02: CATCH THE STARS ---------------- */
const CatchStarsGame: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [basketX, setBasketX] = useState(50);
  const [finished, setFinished] = useState(false);

  const basketRef = useRef(50);
  const scoreRef = useRef(0);
  const itemsRef = useRef<
    Array<{ id: number; x: number; y: number; speed: number; kind: 'pink' | 'gold' | 'broken' }>
  >([]);
  const [renderItems, setRenderItems] = useState<typeof itemsRef.current>([]);

  const moveBasket = (delta: number) => {
    const next = Math.max(10, Math.min(90, basketRef.current + delta));
    basketRef.current = next;
    setBasketX(next);
  };

  useEffect(() => {
    if (!running) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveBasket(-8);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveBasket(8);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    let frameId = 0;
    let lastSpawn = 0;
    const startTs = performance.now();

    const loop = (now: number) => {
      const elapsedSec = Math.floor((now - startTs) / 1000);
      const rem = Math.max(0, 30 - elapsedSec);
      setTimeLeft(rem);

      if (rem <= 0) {
        setRunning(false);
        setFinished(true);
        chiptune.playSfx('victory');
        onComplete();
        return;
      }

      const difficultyBoost = 1 + (30 - rem) * 0.035;
      if (now - lastSpawn > Math.max(380, 680 - (30 - rem) * 8)) {
        lastSpawn = now;
        const r = Math.random();
        const kind = r < 0.62 ? 'pink' : r < 0.8 ? 'gold' : 'broken';
        itemsRef.current.push({
          id: now + Math.random(),
          x: 10 + Math.random() * 80,
          y: 0,
          speed: (0.85 + Math.random() * 0.65) * difficultyBoost,
          kind,
        });
      }

      const nextList: typeof itemsRef.current = [];
      for (const item of itemsRef.current) {
        item.y += item.speed;
        const caught =
          item.y >= 80 && item.y <= 92 && Math.abs(item.x - basketRef.current) <= 13;
        if (caught) {
          if (item.kind === 'pink') {
            scoreRef.current += 10;
            chiptune.playSfx('select');
          } else if (item.kind === 'gold') {
            scoreRef.current += 25;
            chiptune.playSfx('unlock');
          } else {
            scoreRef.current = Math.max(0, scoreRef.current - 15);
            chiptune.playSfx('attack');
          }
          setScore(scoreRef.current);
        } else if (item.y < 100) {
          nextList.push(item);
        }
      }
      itemsRef.current = nextList;
      setRenderItems([...nextList]);

      frameId = window.requestAnimationFrame(loop);
    };

    frameId = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frameId);
  }, [running, onComplete]);

  const startGame = () => {
    chiptune.playSfx('click');
    scoreRef.current = 0;
    itemsRef.current = [];
    basketRef.current = 50;
    setScore(0);
    setBasketX(50);
    setTimeLeft(30);
    setFinished(false);
    setRunning(true);
  };

  return (
    <div className="pixel-box p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="font-pixel-title text-xs text-[#392337] tabular-nums">
          SCORE: {score} · TIME: {timeLeft}s
        </div>
        <button
          type="button"
          onClick={startGame}
          className="pixel-btn bg-[#EC6FA9] text-[#FFF5EE] font-pixel-ui text-xs font-bold px-4 py-2"
        >
          {running ? 'RESTART' : finished ? 'PLAY AGAIN' : 'START CATCHING!'}
        </button>
      </div>

      {/* Play Area */}
      <div
        onPointerMove={(e) => {
          if (!running) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const clamped = Math.max(10, Math.min(90, x));
          basketRef.current = clamped;
          setBasketX(clamped);
        }}
        className="relative h-72 sm:h-80 w-full bg-gradient-to-b from-[#392337] to-[#753564] border-4 border-[#392337] overflow-hidden select-none touch-none"
      >
        {!running && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#392337]/75 p-4 text-center text-[#FFF5EE]">
            <p className="font-pixel-title text-xs sm:text-sm text-[#FFC0D9]">
              {finished ? `TIME UP! FINAL SCORE: ${score}` : 'CATCH THE PINK STARS!'}
            </p>
            <p className="mt-2 font-pixel-dialog text-xl text-[#FFDCC8]">
              Catch ★ Stars (+10 / +25) &amp; dodge dark ✖ Rocks!
            </p>
          </div>
        )}

        {renderItems.map((item) => (
          <div
            key={item.id}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            {item.kind === 'pink' && <PixelStar className="w-6 h-6" color="#FFC0D9" />}
            {item.kind === 'gold' && <PixelStar className="w-7 h-7" color="#FFDCC8" />}
            {item.kind === 'broken' && (
              <span className="inline-block w-6 h-6 bg-[#392337] border-2 border-[#C94F86] font-pixel-title text-[10px] text-[#EC6FA9] text-center leading-5">
                X
              </span>
            )}
          </div>
        ))}

        {/* Pixel Basket */}
        <div
          style={{ left: `${basketX}%` }}
          className="absolute bottom-3 -translate-x-1/2 w-20 h-7 bg-[#FFDCC8] border-3 border-[#392337] flex items-center justify-center shadow-[2px_3px_0_#EC6FA9]"
        >
          <span className="font-pixel-title text-[8px] text-[#392337]">BASKET</span>
        </div>
      </div>

      {/* Mobile Touch Controls */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => moveBasket(-10)}
          className="pixel-btn bg-[#D9C7FF] text-[#392337] font-pixel-title text-xs px-6 py-3"
        >
          ◄ LEFT
        </button>
        <button
          type="button"
          onClick={() => moveBasket(10)}
          className="pixel-btn bg-[#D9C7FF] text-[#392337] font-pixel-title text-xs px-6 py-3"
        >
          RIGHT ►
        </button>
      </div>
    </div>
  );
};

/* ---------------- GAME 03: MEMORY MATCH (4x4) ---------------- */
const MEMORY_SYMBOLS = [
  { key: 'heart', label: '♡ HEART', color: '#EC6FA9' },
  { key: 'star', label: '★ STAR', color: '#FFDCC8' },
  { key: 'flower', label: '✿ FLOWER', color: '#FFC0D9' },
  { key: 'cat', label: '🐱 CAT', color: '#F7A8C9' },
  { key: 'ghost', label: '👻 GHOST', color: '#D9C7FF' },
  { key: 'chest', label: '💎 GEM', color: '#C94F86' },
  { key: 'crown', label: '👑 CROWN', color: '#FFDCC8' },
  { key: 'bow', label: '🎀 BOW', color: '#EC6FA9' },
];

function createShuffledDeck() {
  const deck = [...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS].map((item, idx) => ({
    uid: idx,
    ...item,
    matched: false,
  }));
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

const MemoryMatchGame: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [cards, setCards] = useState(() => createShuffledDeck());
  const [openIndices, setOpenIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (won) return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [won]);

  const handleCardTap = (idx: number) => {
    if (won || openIndices.length >= 2 || openIndices.includes(idx) || cards[idx].matched) {
      return;
    }
    chiptune.playSfx('flip');
    const nextOpen = [...openIndices, idx];
    setOpenIndices(nextOpen);

    if (nextOpen.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nextOpen;
      if (cards[a].key === cards[b].key) {
        chiptune.playSfx('select');
        const updated = cards.map((c, i) =>
          i === a || i === b ? { ...c, matched: true } : c
        );
        setCards(updated);
        setOpenIndices([]);
        if (updated.every((c) => c.matched)) {
          setWon(true);
          chiptune.playSfx('victory');
          onComplete();
        }
      } else {
        window.setTimeout(() => setOpenIndices([]), 650);
      }
    }
  };

  const resetMemory = () => {
    chiptune.playSfx('nav');
    setCards(createShuffledDeck());
    setOpenIndices([]);
    setMoves(0);
    setSeconds(0);
    setWon(false);
  };

  return (
    <div className="pixel-box p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="font-pixel-title text-xs text-[#392337] tabular-nums">
          MOVES: {moves} · TIME: {seconds}s
        </div>
        <button
          type="button"
          onClick={resetMemory}
          className="pixel-btn bg-[#EC6FA9] text-[#FFF5EE] font-pixel-ui text-xs font-bold px-4 py-2"
        >
          NEW BOARD
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 max-w-md mx-auto">
        {cards.map((card, idx) => {
          const revealed = card.matched || openIndices.includes(idx);
          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => handleCardTap(idx)}
              className={`aspect-square border-3 border-[#392337] flex flex-col items-center justify-center p-1 transition-transform active:scale-95 ${
                revealed
                  ? 'bg-[#FFF5EE] shadow-[2px_2px_0_#EC6FA9]'
                  : 'bg-[#C94F86] hover:bg-[#EC6FA9]'
              }`}
            >
              {revealed ? (
                <span className="font-pixel-ui text-[10px] sm:text-xs font-bold text-[#392337] text-center">
                  {card.label}
                </span>
              ) : (
                <span className="font-pixel-title text-sm text-[#FFF5EE]">?</span>
              )}
            </button>
          );
        })}
      </div>

      {won && (
        <div className="mt-5 bg-[#FFD6E7] border-3 border-[#392337] p-4 text-center">
          <p className="font-pixel-title text-xs text-[#C94F86]">
            MEMORY MATCH CLEARED IN {moves} MOVES! ♡
          </p>
        </div>
      )}
    </div>
  );
};

/* ---------------- GAME 04: HOW WELL DO YOU KNOW ROSIE? ---------------- */
const RosieQuizGame: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [lastComment, setLastComment] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[step];

  const handleAnswer = (points: number, comment: string) => {
    chiptune.playSfx('select');
    const nextScore = totalScore + points;
    setTotalScore(nextScore);
    setLastComment(comment);

    window.setTimeout(() => {
      setLastComment(null);
      if (step + 1 >= QUIZ_QUESTIONS.length) {
        setFinished(true);
        chiptune.playSfx('victory');
        onComplete();
      } else {
        setStep((s) => s + 1);
      }
    }, 850);
  };

  const resetQuiz = () => {
    chiptune.playSfx('nav');
    setStep(0);
    setTotalScore(0);
    setLastComment(null);
    setFinished(false);
  };

  return (
    <div className="pixel-box p-5 sm:p-7">
      {!finished ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="font-pixel-title text-xs text-[#C94F86]">
              QUESTION {step + 1}/{QUIZ_QUESTIONS.length}
            </span>
            <span className="font-pixel-ui text-xs font-bold text-[#392337]">
              ROSIE QUIZ
            </span>
          </div>

          <h3 className="font-pixel-dialog text-2xl sm:text-3xl text-[#392337] mb-5">
            {currentQ.question}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                disabled={lastComment !== null}
                onClick={() => handleAnswer(opt.points, opt.comment)}
                className="pixel-btn bg-[#FFD6E7] hover:bg-[#FFC0D9] text-[#392337] text-left font-rounded font-bold text-sm p-3.5 disabled:opacity-60"
              >
                {opt.label}
              </button>
            ))}
          </div>

          {lastComment && (
            <div className="mt-4 bg-[#D9C7FF] border-2 border-[#392337] p-3 font-pixel-dialog text-xl text-[#392337]">
              ★ {lastComment}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center space-y-4">
          <p className="font-pixel-title text-sm text-[#C94F86]">
            QUIZ COMPLETE! SCORE: {totalScore}/{QUIZ_QUESTIONS.length * 3}
          </p>
          <p className="font-pixel-dialog text-2xl sm:text-3xl text-[#392337]">
            Result: Certified Rosie Expert &amp; Official Adventure Bestie! ♡
          </p>
          <p className="font-rounded text-sm font-semibold text-[#573654] max-w-lg mx-auto">
            Whether exploring haunted pink mansions or opening surprise cards, Hannalle Dewyrose always brings top-tier main character energy!
          </p>
          <button
            type="button"
            onClick={resetQuiz}
            className="pixel-btn bg-[#EC6FA9] text-[#FFF5EE] font-pixel-title text-xs px-5 py-3"
          >
            REPLAY QUIZ
          </button>
        </div>
      )}
    </div>
  );
};

/* ---------------- MAIN ARCADE WRAPPER ---------------- */
export const ArcadeGamesScreen: React.FC<ArcadeGamesScreenProps> = ({
  completedGames,
  ticTacToeScore,
  onUpdateTttScore,
  onGameCompleted,
  onBackToWorld,
}) => {
  const [tab, setTab] = useState<ArcadeTab>('ttt');

  const tabs: Array<{ id: ArcadeTab; label: string }> = [
    { id: 'ttt', label: '01. TIC TAC TOE' },
    { id: 'stars', label: '02. CATCH STARS' },
    { id: 'memory', label: '03. MEMORY MATCH' },
    { id: 'quiz', label: '04. ROSIE QUIZ' },
  ];

  return (
    <div className="min-h-screen w-full pixel-grid-bg px-3 sm:px-6 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="pixel-panel-pink p-4 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-pixel-ui text-xs font-bold text-[#C94F86]">
              PINK PIXEL ARCADE
            </p>
            <h1 className="mt-1 font-pixel-title text-base sm:text-xl text-[#392337]">
              LET&apos;S PLAY SOMETHING!
            </h1>
            <p className="mt-1 font-pixel-dialog text-xl text-[#392337]">
              Games Cleared: {completedGames.length}/4 · Complete 2 to help unlock the Secret Room!
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              chiptune.playSfx('nav');
              onBackToWorld();
            }}
            className="pixel-btn bg-[#FFF5EE] text-[#392337] font-pixel-ui text-xs font-bold px-4 py-3 shrink-0"
          >
            ◄ WORLD MAP
          </button>
        </div>

        {/* Arcade Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          {tabs.map((t) => {
            const cleared = completedGames.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  chiptune.playSfx('nav');
                  setTab(t.id);
                }}
                className={`pixel-btn px-3 py-3 font-pixel-ui text-[10px] sm:text-xs font-bold ${
                  tab === t.id
                    ? 'bg-[#EC6FA9] text-[#FFF5EE]'
                    : 'bg-[#FFF5EE] text-[#392337]'
                }`}
              >
                {t.label} {cleared ? '✓' : ''}
              </button>
            );
          })}
        </div>

        {tab === 'ttt' && (
          <TicTacToeGame
            score={ticTacToeScore}
            onUpdateScore={onUpdateTttScore}
            onComplete={() => onGameCompleted('ttt', 45)}
          />
        )}
        {tab === 'stars' && (
          <CatchStarsGame onComplete={() => onGameCompleted('stars', 50)} />
        )}
        {tab === 'memory' && (
          <MemoryMatchGame onComplete={() => onGameCompleted('memory', 55)} />
        )}
        {tab === 'quiz' && (
          <RosieQuizGame onComplete={() => onGameCompleted('quiz', 45)} />
        )}
      </div>
    </div>
  );
};
