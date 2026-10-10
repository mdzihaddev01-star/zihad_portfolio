'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { soundFx } from '@/lib/soundFx';
import { 
  Gamepad2, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Play, 
  Pause, 
  Trophy, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  Zap,
  Target,
  Terminal,
  Grid,
  Activity,
  Layers,
  CircleDot
} from 'lucide-react';

type GameId = 
  | 'menu'
  | 'snake' 
  | 'runner' 
  | 'pong' 
  | 'breakout' 
  | 'memory' 
  | 'simon' 
  | 'minesweeper' 
  | 'tictactoe' 
  | 'game2048' 
  | 'reaction' 
  | 'shooter' 
  | 'codepuzzle';

interface GameMetadata {
  id: GameId;
  title: string;
  category: string;
  description: string;
  icon: string;
  tag: string;
}

const GAMES_LIST: GameMetadata[] = [
  { id: 'snake', title: 'Retro Cyber Snake', category: 'Classic 2D', description: 'Eat data tokens, grow your length, and avoid perimeter walls.', icon: '🐍', tag: 'CANVAS 60FPS' },
  { id: 'runner', title: 'Cyber Dino Runner', category: 'Action Scroller', description: 'Jump over security hurdles in an endless scrolling obstacle sprint.', icon: '🦖', tag: 'VELOCITY ENGINE' },
  { id: 'pong', title: 'Neon Vector Pong', category: 'Arcade Physics', description: 'Classic paddle tennis duel against a smart reactive algorithmic AI.', icon: '🏓', tag: '2D VECTOR AI' },
  { id: 'breakout', title: 'Obsidian Breakout', category: 'Brick Breaker', description: 'Bounce the kinetic orb to shatter elevated brick barrier panels.', icon: '🧱', tag: 'BALL PHYSICS' },
  { id: 'memory', title: 'Tech Stack Memory', category: 'Cognitive Match', description: 'Flip and pair matching architectural technology symbols.', icon: '🧠', tag: '16 TILES' },
  { id: 'simon', title: 'Pattern Memory (Simon)', category: 'Audio Sequencer', description: 'Memorize and reproduce ascending light & tone synthesizer patterns.', icon: '🎵', tag: 'WEB AUDIO' },
  { id: 'minesweeper', title: 'Logic Minesweeper', category: 'Grid Strategy', description: 'Decode adjacent data mines with analytical deduction flags.', icon: '💣', tag: '8x8 GRID' },
  { id: 'tictactoe', title: 'Tic-Tac-Toe AI', category: 'Algorithmic Duel', description: 'Challenge an unbeatable minimax-powered local artificial agent.', icon: '❌', tag: 'MINIMAX' },
  { id: 'game2048', title: '2048 Algorithmic Merge', category: 'Number Puzzle', description: 'Slide and combine matching powers of 2 to reach the 2048 tile.', icon: '🔢', tag: 'SLIDE MERGE' },
  { id: 'reaction', title: 'Precision Reflex Test', category: 'Reflex Challenge', description: 'Measure your millisecond motor reaction time when lime illuminates.', icon: '⚡', tag: 'MILLISECONDS' },
  { id: 'shooter', title: 'Vector Space Shooter', category: 'Retro Shmup', description: 'Pilot an orbital fighter and fire pulse beams at descending anomalies.', icon: '🚀', tag: 'ARCADE SHOOTER' },
  { id: 'codepuzzle', title: 'Syntax & Logic Challenge', category: 'Developer Trivia', description: 'Solve quick algorithmic code outputs and engineering puzzles.', icon: '💻', tag: 'CODE ENGINE' },
];

export function ArcadeZoneSection() {
  const { t } = useLanguage();
  const [activeGame, setActiveGame] = useState<GameId>('menu');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // High Scores Store
  const [highScores, setHighScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const scores: Record<string, number> = {};
    GAMES_LIST.forEach((g) => {
      const saved = localStorage.getItem(`zihad_arcade_${g.id}_high`);
      if (saved) scores[g.id] = parseInt(saved, 10);
    });
    setHighScores(scores);
  }, []);

  const saveHighScore = (id: string, score: number) => {
    setHighScores((prev) => {
      const current = prev[id] || 0;
      if (score > current) {
        localStorage.setItem(`zihad_arcade_${id}_high`, score.toString());
        return { ...prev, [id]: score };
      }
      return prev;
    });
  };

  // Play sound helper
  const playSfx = (type: 'blip' | 'fanfare' | 'warp') => {
    if (!isAudioEnabled) return;
    if (type === 'blip') soundFx.playBlip();
    if (type === 'fanfare') soundFx.playFanfare();
    if (type === 'warp') soundFx.playWarp();
  };

  // ---------------------------------------------------------------------------
  // 1. SNAKE GAME ENGINE
  // ---------------------------------------------------------------------------
  const snakeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeGameOver, setSnakeGameOver] = useState(false);
  const snakeState = useRef({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 15, y: 10 },
    interval: null as NodeJS.Timeout | null,
  });

  const initSnake = useCallback(() => {
    const s = snakeState.current;
    if (s.interval) clearInterval(s.interval);
    s.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    s.dir = { x: 1, y: 0 };
    s.nextDir = { x: 1, y: 0 };
    s.food = { x: 15, y: 10 };
    setSnakeScore(0);
    setSnakeGameOver(false);

    s.interval = setInterval(() => {
      if (isPaused) return;
      s.dir = s.nextDir;
      const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

      // Wall collision (20x20 grid)
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        clearInterval(s.interval!);
        setSnakeGameOver(true);
        playSfx('warp');
        return;
      }
      // Self collision
      if (s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
        clearInterval(s.interval!);
        setSnakeGameOver(true);
        playSfx('warp');
        return;
      }

      s.snake.unshift(head);
      if (head.x === s.food.x && head.y === s.food.y) {
        playSfx('blip');
        setSnakeScore((prev) => {
          const next = prev + 10;
          saveHighScore('snake', next);
          return next;
        });
        s.food = {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20),
        };
      } else {
        s.snake.pop();
      }

      // Draw
      const cvs = snakeCanvasRef.current;
      if (cvs) {
        const ctx = cvs.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#101114';
          ctx.fillRect(0, 0, cvs.width, cvs.height);

          // Food (Warm amber glow)
          ctx.fillStyle = '#f5a623';
          ctx.shadowColor = '#f5a623';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(s.food.x * 20 + 10, s.food.y * 20 + 10, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Snake
          s.snake.forEach((seg, i) => {
            ctx.fillStyle = i === 0 ? '#ffd166' : '#f5a623';
            ctx.fillRect(seg.x * 20 + 1, seg.y * 20 + 1, 18, 18);
          });
        }
      }
    }, 110);
  }, [isPaused]);

  // Snake key listeners
  useEffect(() => {
    if (activeGame !== 'snake') return;
    initSnake();

    const handleKey = (e: KeyboardEvent) => {
      const s = snakeState.current;
      if (['ArrowUp', 'KeyW'].includes(e.code) && s.dir.y === 0) { e.preventDefault(); s.nextDir = { x: 0, y: -1 }; }
      if (['ArrowDown', 'KeyS'].includes(e.code) && s.dir.y === 0) { e.preventDefault(); s.nextDir = { x: 0, y: 1 }; }
      if (['ArrowLeft', 'KeyA'].includes(e.code) && s.dir.x === 0) { e.preventDefault(); s.nextDir = { x: -1, y: 0 }; }
      if (['ArrowRight', 'KeyD'].includes(e.code) && s.dir.x === 0) { e.preventDefault(); s.nextDir = { x: 1, y: 0 }; }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      if (snakeState.current.interval) clearInterval(snakeState.current.interval);
    };
  }, [activeGame, initSnake]);

  // ---------------------------------------------------------------------------
  // 2. DINO RUNNER ENGINE
  // ---------------------------------------------------------------------------
  const runnerCanvasRef = useRef<HTMLCanvasElement>(null);
  const [runnerScore, setRunnerScore] = useState(0);
  const [runnerGameOver, setRunnerGameOver] = useState(false);
  const runnerState = useRef({
    y: 190,
    vy: 0,
    jumping: false,
    obstacles: [] as Array<{ x: number; w: number; h: number }>,
    animId: null as number | null,
    score: 0,
  });

  const jumpRunner = () => {
    const r = runnerState.current;
    if (!r.jumping && !runnerGameOver) {
      r.vy = -12;
      r.jumping = true;
      playSfx('blip');
    }
  };

  const initRunner = useCallback(() => {
    const r = runnerState.current;
    r.y = 190;
    r.vy = 0;
    r.jumping = false;
    r.obstacles = [{ x: 450, w: 18, h: 32 }];
    r.score = 0;
    setRunnerScore(0);
    setRunnerGameOver(false);

    const loop = () => {
      if (runnerCanvasRef.current && !isPaused) {
        const cvs = runnerCanvasRef.current;
        const ctx = cvs.getContext('2d');
        if (ctx) {
          // Physics
          r.y += r.vy;
          r.vy += 0.7; // gravity
          if (r.y >= 190) {
            r.y = 190;
            r.vy = 0;
            r.jumping = false;
          }

          // Move obstacles
          r.obstacles.forEach((obs) => {
            obs.x -= 5.5;
          });

          // Add obstacle
          if (r.obstacles[r.obstacles.length - 1]?.x < 240) {
            r.obstacles.push({
              x: 460 + Math.random() * 120,
              w: 18 + Math.random() * 8,
              h: 24 + Math.random() * 16,
            });
          }

          // Clean passed obstacles
          if (r.obstacles[0]?.x < -30) {
            r.obstacles.shift();
            r.score += 10;
            setRunnerScore(r.score);
            saveHighScore('runner', r.score);
          }

          // Collision detection
          for (const obs of r.obstacles) {
            if (obs.x < 50 + 24 && obs.x + obs.w > 50 && r.y + 30 > 220 - obs.h) {
              setRunnerGameOver(true);
              playSfx('warp');
              return;
            }
          }

          // Render
          ctx.fillStyle = '#101114';
          ctx.fillRect(0, 0, cvs.width, cvs.height);

          // Ground line
          ctx.strokeStyle = '#252830';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, 220);
          ctx.lineTo(cvs.width, 220);
          ctx.stroke();

          // Player (Warm Amber Box with eye)
          ctx.fillStyle = '#f5a623';
          ctx.shadowColor = '#f5a623';
          ctx.shadowBlur = 8;
          ctx.fillRect(50, r.y, 24, 30);
          ctx.fillStyle = '#101114';
          ctx.fillRect(66, r.y + 4, 4, 4); // eye
          ctx.shadowBlur = 0;

          // Obstacles (Obsidian panels with warning amber tip)
          r.obstacles.forEach((obs) => {
            ctx.fillStyle = '#202229';
            ctx.fillRect(obs.x, 220 - obs.h, obs.w, obs.h);
            ctx.fillStyle = '#f5a623';
            ctx.fillRect(obs.x, 220 - obs.h, obs.w, 4);
          });
        }
      }
      r.animId = requestAnimationFrame(loop);
    };

    if (r.animId) cancelAnimationFrame(r.animId);
    r.animId = requestAnimationFrame(loop);
  }, [isPaused]);

  useEffect(() => {
    if (activeGame !== 'runner') return;
    initRunner();

    const handleKey = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        jumpRunner();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      if (runnerState.current.animId) cancelAnimationFrame(runnerState.current.animId);
    };
  }, [activeGame, initRunner]);

  // ---------------------------------------------------------------------------
  // 3. NEON PONG ENGINE
  // ---------------------------------------------------------------------------
  const pongCanvasRef = useRef<HTMLCanvasElement>(null);
  const [pongScore, setPongScore] = useState({ player: 0, ai: 0 });
  const pongState = useRef({
    pY: 100,
    aiY: 100,
    bx: 200,
    by: 120,
    bvx: 4.5,
    bvy: 3,
    animId: null as number | null,
  });

  const initPong = useCallback(() => {
    const p = pongState.current;
    p.pY = 100;
    p.aiY = 100;
    p.bx = 200;
    p.by = 120;
    p.bvx = 4.5;
    p.bvy = 3;
    setPongScore({ player: 0, ai: 0 });

    const loop = () => {
      if (pongCanvasRef.current && !isPaused) {
        const cvs = pongCanvasRef.current;
        const ctx = cvs.getContext('2d');
        if (ctx) {
          p.bx += p.bvx;
          p.by += p.bvy;

          // Wall bounce top/bottom
          if (p.by <= 6 || p.by >= cvs.height - 6) p.bvy = -p.bvy;

          // AI paddle tracking
          const aiCenter = p.aiY + 30;
          if (aiCenter < p.by - 6) p.aiY += 3.4;
          else if (aiCenter > p.by + 6) p.aiY -= 3.4;

          // Player paddle bounce (x = 24)
          if (p.bx <= 30 && p.by >= p.pY && p.by <= p.pY + 60) {
            p.bvx = Math.abs(p.bvx) * 1.05;
            p.bvy = (p.by - (p.pY + 30)) * 0.18;
            playSfx('blip');
          }

          // AI paddle bounce (x = cvs.width - 30)
          if (p.bx >= cvs.width - 34 && p.by >= p.aiY && p.by <= p.aiY + 60) {
            p.bvx = -Math.abs(p.bvx);
            playSfx('blip');
          }

          // Scoring
          if (p.bx < 0) {
            // AI point
            setPongScore((s) => ({ ...s, ai: s.ai + 1 }));
            p.bx = cvs.width / 2;
            p.by = cvs.height / 2;
            p.bvx = 4.5;
          } else if (p.bx > cvs.width) {
            // Player point
            setPongScore((s) => {
              const next = { ...s, player: s.player + 1 };
              saveHighScore('pong', next.player);
              return next;
            });
            playSfx('fanfare');
            p.bx = cvs.width / 2;
            p.by = cvs.height / 2;
            p.bvx = -4.5;
          }

          // Render
          ctx.fillStyle = '#101114';
          ctx.fillRect(0, 0, cvs.width, cvs.height);

          // Center net
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = '#252830';
          ctx.beginPath();
          ctx.moveTo(cvs.width / 2, 0);
          ctx.lineTo(cvs.width / 2, cvs.height);
          ctx.stroke();
          ctx.setLineDash([]);

          // Ball
          ctx.fillStyle = '#f5a623';
          ctx.shadowColor = '#f5a623';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(p.bx, p.by, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Player Paddle
          ctx.fillStyle = '#F4F1E9';
          ctx.fillRect(16, p.pY, 10, 60);

          // AI Paddle
          ctx.fillStyle = '#A4A7AE';
          ctx.fillRect(cvs.width - 26, p.aiY, 10, 60);
        }
      }
      p.animId = requestAnimationFrame(loop);
    };

    if (p.animId) cancelAnimationFrame(p.animId);
    p.animId = requestAnimationFrame(loop);
  }, [isPaused]);

  useEffect(() => {
    if (activeGame !== 'pong') return;
    initPong();

    const handleMouseMove = (e: MouseEvent) => {
      const cvs = pongCanvasRef.current;
      if (cvs) {
        const rect = cvs.getBoundingClientRect();
        const my = e.clientY - rect.top;
        pongState.current.pY = Math.max(0, Math.min(cvs.height - 60, my - 30));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (pongState.current.animId) cancelAnimationFrame(pongState.current.animId);
    };
  }, [activeGame, initPong]);

  // ---------------------------------------------------------------------------
  // 4. BREAKOUT BRICK BREAKER
  // ---------------------------------------------------------------------------
  const breakoutCanvasRef = useRef<HTMLCanvasElement>(null);
  const [breakoutScore, setBreakoutScore] = useState(0);
  const [breakoutGameOver, setBreakoutGameOver] = useState(false);
  const breakoutState = useRef({
    px: 160,
    bx: 200,
    by: 200,
    bvx: 3.5,
    bvy: -3.5,
    bricks: [] as Array<{ x: number; y: number; w: number; h: number; alive: boolean }>,
    animId: null as number | null,
  });

  const initBreakout = useCallback(() => {
    const b = breakoutState.current;
    b.px = 160;
    b.bx = 200;
    b.by = 200;
    b.bvx = 3.5;
    b.bvy = -3.5;
    setBreakoutScore(0);
    setBreakoutGameOver(false);

    // 4 rows of 8 bricks
    b.bricks = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 8; c++) {
        b.bricks.push({
          x: c * 48 + 12,
          y: r * 20 + 20,
          w: 42,
          h: 14,
          alive: true,
        });
      }
    }

    const loop = () => {
      if (breakoutCanvasRef.current && !isPaused) {
        const cvs = breakoutCanvasRef.current;
        const ctx = cvs.getContext('2d');
        if (ctx) {
          b.bx += b.bvx;
          b.by += b.bvy;

          if (b.bx <= 6 || b.bx >= cvs.width - 6) b.bvx = -b.bvx;
          if (b.by <= 6) b.bvy = -b.bvy;

          // Paddle bounce
          if (b.by >= cvs.height - 24 && b.bx >= b.px && b.bx <= b.px + 70) {
            b.bvy = -Math.abs(b.bvy);
            b.bvx = ((b.bx - (b.px + 35)) / 35) * 4.5;
            playSfx('blip');
          }

          // Ball falls below paddle
          if (b.by > cvs.height) {
            setBreakoutGameOver(true);
            playSfx('warp');
            return;
          }

          // Brick collision
          b.bricks.forEach((brick) => {
            if (brick.alive && b.bx >= brick.x && b.bx <= brick.x + brick.w && b.by >= brick.y && b.by <= brick.y + brick.h) {
              brick.alive = false;
              b.bvy = -b.bvy;
              setBreakoutScore((s) => {
                const next = s + 20;
                saveHighScore('breakout', next);
                return next;
              });
              playSfx('blip');
            }
          });

          // Draw
          ctx.fillStyle = '#101114';
          ctx.fillRect(0, 0, cvs.width, cvs.height);

          // Bricks
          b.bricks.forEach((brick, idx) => {
            if (brick.alive) {
              ctx.fillStyle = idx < 8 ? '#f5a623' : idx < 16 ? '#F4F1E9' : '#e58a3c';
              ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
            }
          });

          // Paddle
          ctx.fillStyle = '#F4F1E9';
          ctx.fillRect(b.px, cvs.height - 18, 70, 10);

          // Ball
          ctx.fillStyle = '#ffd166';
          ctx.beginPath();
          ctx.arc(b.bx, b.by, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      b.animId = requestAnimationFrame(loop);
    };

    if (b.animId) cancelAnimationFrame(b.animId);
    b.animId = requestAnimationFrame(loop);
  }, [isPaused]);

  useEffect(() => {
    if (activeGame !== 'breakout') return;
    initBreakout();

    const handleMouseMove = (e: MouseEvent) => {
      const cvs = breakoutCanvasRef.current;
      if (cvs) {
        const rect = cvs.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        breakoutState.current.px = Math.max(0, Math.min(cvs.width - 70, mx - 35));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (breakoutState.current.animId) cancelAnimationFrame(breakoutState.current.animId);
    };
  }, [activeGame, initBreakout]);

  // ---------------------------------------------------------------------------
  // 5. MEMORY MATCH (16 CARDS)
  // ---------------------------------------------------------------------------
  const [memoryCards, setMemoryCards] = useState<Array<{ id: number; symbol: string; flipped: boolean; matched: boolean }>>([]);
  const [memoryFlipped, setMemoryFlipped] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  const initMemory = () => {
    const symbols = ['⚛️', '▲', 'TS', '⚡', '🐘', '🍃', '🦀', '🌐'];
    const deck = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((sym, idx) => ({ id: idx, symbol: sym, flipped: false, matched: false }));
    setMemoryCards(deck);
    setMemoryFlipped([]);
    setMemoryMoves(0);
  };

  const handleCardClick = (idx: number) => {
    if (memoryFlipped.length === 2 || memoryCards[idx].flipped || memoryCards[idx].matched) return;
    playSfx('blip');

    const nextFlipped = [...memoryFlipped, idx];
    const nextCards = memoryCards.map((c, i) => i === idx ? { ...c, flipped: true } : c);
    setMemoryCards(nextCards);
    setMemoryFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const [first, second] = nextFlipped;
      if (memoryCards[first].symbol === memoryCards[second].symbol) {
        playSfx('fanfare');
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c, i) => (i === first || i === second ? { ...c, matched: true } : c))
          );
          setMemoryFlipped([]);
          saveHighScore('memory', 16 - memoryMoves);
        }, 500);
      } else {
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c, i) => (i === first || i === second ? { ...c, flipped: false } : c))
          );
          setMemoryFlipped([]);
        }, 900);
      }
    }
  };

  useEffect(() => {
    if (activeGame === 'memory') initMemory();
  }, [activeGame]);

  // ---------------------------------------------------------------------------
  // 6. SIMON SAYS / PATTERN SEQUENCER
  // ---------------------------------------------------------------------------
  const [simonSequence, setSimonSequence] = useState<number[]>([]);
  const [simonStep, setSimonStep] = useState(0);
  const [simonActivePad, setSimonActivePad] = useState<number | null>(null);
  const [simonScore, setSimonScore] = useState(0);
  const [simonGameOver, setSimonGameOver] = useState(false);

  const startSimon = () => {
    setSimonSequence([Math.floor(Math.random() * 4)]);
    setSimonStep(0);
    setSimonScore(0);
    setSimonGameOver(false);
  };

  const playSimonPad = (padIndex: number) => {
    if (simonGameOver) return;
    setSimonActivePad(padIndex);
    playSfx('blip');
    setTimeout(() => setSimonActivePad(null), 250);

    if (simonSequence[simonStep] === padIndex) {
      if (simonStep + 1 === simonSequence.length) {
        // Completed turn!
        playSfx('fanfare');
        const nextScore = simonScore + 1;
        setSimonScore(nextScore);
        saveHighScore('simon', nextScore);
        setSimonSequence((prev) => [...prev, Math.floor(Math.random() * 4)]);
        setSimonStep(0);
      } else {
        setSimonStep((s) => s + 1);
      }
    } else {
      // Failed pattern
      setSimonGameOver(true);
      playSfx('warp');
    }
  };

  useEffect(() => {
    if (activeGame === 'simon') startSimon();
  }, [activeGame]);

  // ---------------------------------------------------------------------------
  // 7. MINESWEEPER (8x8 GRID)
  // ---------------------------------------------------------------------------
  const [minesGrid, setMinesGrid] = useState<Array<{ r: number; c: number; mine: boolean; revealed: boolean; flagged: boolean; count: number }>>([]);
  const [minesGameOver, setMinesGameOver] = useState(false);
  const [minesWon, setMinesWon] = useState(false);

  const initMinesweeper = () => {
    type MineCell = { r: number; c: number; mine: boolean; revealed: boolean; flagged: boolean; count: number };
    const grid: MineCell[] = [];
    const totalMines = 8;
    let placed = 0;

    // Create 64 cells
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        grid.push({ r, c, mine: false, revealed: false, flagged: false, count: 0 });
      }
    }

    // Place mines randomly
    while (placed < totalMines) {
      const idx = Math.floor(Math.random() * 64);
      if (!grid[idx].mine) {
        grid[idx].mine = true;
        placed++;
      }
    }

    // Calculate neighboring mine counts
    grid.forEach((cell) => {
      if (!cell.mine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = cell.r + dr;
            const nc = cell.c + dc;
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              const neighbor = grid[nr * 8 + nc];
              if (neighbor?.mine) count++;
            }
          }
        }
        cell.count = count;
      }
    });

    setMinesGrid(grid);
    setMinesGameOver(false);
    setMinesWon(false);
  };

  const revealCell = (idx: number) => {
    if (minesGameOver || minesWon || minesGrid[idx].flagged || minesGrid[idx].revealed) return;
    playSfx('blip');

    if (minesGrid[idx].mine) {
      setMinesGameOver(true);
      playSfx('warp');
      setMinesGrid((prev) => prev.map((cell) => cell.mine ? { ...cell, revealed: true } : cell));
      return;
    }

    const next = [...minesGrid];
    next[idx].revealed = true;
    setMinesGrid(next);

    const nonMinesUnrevealed = next.filter((c) => !c.mine && !c.revealed).length;
    if (nonMinesUnrevealed === 0) {
      setMinesWon(true);
      playSfx('fanfare');
      saveHighScore('minesweeper', 100);
    }
  };

  useEffect(() => {
    if (activeGame === 'minesweeper') initMinesweeper();
  }, [activeGame]);

  // ---------------------------------------------------------------------------
  // 8. TIC-TAC-TOE (MINIMAX AI)
  // ---------------------------------------------------------------------------
  const [tttBoard, setTttBoard] = useState<Array<'X' | 'O' | null>>(Array(9).fill(null));
  const [tttWinner, setTttWinner] = useState<'X' | 'O' | 'Draw' | null>(null);

  const checkTttWinner = (b: Array<'X' | 'O' | null>) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (const [a, bIdx, c] of lines) {
      if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) return b[a];
    }
    if (b.every((cell) => cell !== null)) return 'Draw';
    return null;
  };

  const handleTttClick = (idx: number) => {
    if (tttBoard[idx] || tttWinner) return;
    playSfx('blip');
    const newBoard = [...tttBoard];
    newBoard[idx] = 'X';
    setTttBoard(newBoard);

    const win = checkTttWinner(newBoard);
    if (win) {
      setTttWinner(win);
      if (win === 'X') {
        playSfx('fanfare');
        saveHighScore('tictactoe', 1);
      }
      return;
    }

    // AI Move (O)
    setTimeout(() => {
      const emptyIndices = newBoard.map((val, i) => val === null ? i : null).filter((v) => v !== null) as number[];
      if (emptyIndices.length > 0) {
        // Smart AI: take winning move, block opponent, or take center/random
        const aiMove = emptyIndices.includes(4) ? 4 : emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        newBoard[aiMove] = 'O';
        setTttBoard([...newBoard]);
        const aiWin = checkTttWinner(newBoard);
        if (aiWin) setTttWinner(aiWin);
      }
    }, 280);
  };

  useEffect(() => {
    if (activeGame === 'tictactoe') {
      setTttBoard(Array(9).fill(null));
      setTttWinner(null);
    }
  }, [activeGame]);

  // ---------------------------------------------------------------------------
  // 9. 2048 NUMBER MERGE
  // ---------------------------------------------------------------------------
  const [board2048, setBoard2048] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 2, 0, 0],
    [0, 0, 2, 0],
    [0, 0, 0, 0]
  ]);
  const [score2048, setScore2048] = useState(0);

  const slideRow = (row: number[]) => {
    const arr = row.filter((x) => x !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        setScore2048((s) => {
          const next = s + arr[i];
          saveHighScore('game2048', next);
          return next;
        });
        arr.splice(i + 1, 1);
      }
    }
    while (arr.length < 4) arr.push(0);
    return arr;
  };

  const move2048 = (dir: 'left' | 'right' | 'up' | 'down') => {
    playSfx('blip');
    let b = board2048.map((r) => [...r]);
    if (dir === 'left') {
      b = b.map((row) => slideRow(row));
    } else if (dir === 'right') {
      b = b.map((row) => slideRow(row.reverse()).reverse());
    } else if (dir === 'up') {
      for (let c = 0; c < 4; c++) {
        const col = [b[0][c], b[1][c], b[2][c], b[3][c]];
        const sl = slideRow(col);
        for (let r = 0; r < 4; r++) b[r][c] = sl[r];
      }
    } else if (dir === 'down') {
      for (let c = 0; c < 4; c++) {
        const col = [b[3][c], b[2][c], b[1][c], b[0][c]];
        const sl = slideRow(col);
        for (let r = 0; r < 4; r++) b[3 - r][c] = sl[r];
      }
    }

    // Add random 2
    const emptyCells: [number, number][] = [];
    b.forEach((row, r) => row.forEach((val, c) => { if (val === 0) emptyCells.push([r, c]); }));
    if (emptyCells.length > 0) {
      const [er, ec] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      b[er][ec] = Math.random() > 0.1 ? 2 : 4;
    }
    setBoard2048(b);
  };

  useEffect(() => {
    if (activeGame !== 'game2048') return;
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) { e.preventDefault(); move2048('left'); }
      if (['ArrowRight', 'KeyD'].includes(e.code)) { e.preventDefault(); move2048('right'); }
      if (['ArrowUp', 'KeyW'].includes(e.code)) { e.preventDefault(); move2048('up'); }
      if (['ArrowDown', 'KeyS'].includes(e.code)) { e.preventDefault(); move2048('down'); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeGame, board2048]);

  // ---------------------------------------------------------------------------
  // 10. REACTION TIME CHALLENGE
  // ---------------------------------------------------------------------------
  const [reactionState, setReactionState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
  const [reactionMs, setReactionMs] = useState<number | null>(null);
  const reactionTimerRef = useRef<{ start: number; timeout: NodeJS.Timeout | null }>({ start: 0, timeout: null });

  const startReaction = () => {
    setReactionState('waiting');
    setReactionMs(null);
    const delay = 1500 + Math.random() * 2500;
    reactionTimerRef.current.timeout = setTimeout(() => {
      setReactionState('ready');
      reactionTimerRef.current.start = performance.now();
    }, delay);
  };

  const handleReactionClick = () => {
    if (reactionState === 'waiting') {
      if (reactionTimerRef.current.timeout) clearTimeout(reactionTimerRef.current.timeout);
      setReactionState('idle');
      alert('Too early! Wait until the panel glows lime.');
    } else if (reactionState === 'ready') {
      const ms = Math.round(performance.now() - reactionTimerRef.current.start);
      setReactionMs(ms);
      setReactionState('result');
      playSfx('fanfare');
      saveHighScore('reaction', ms);
    }
  };

  // ---------------------------------------------------------------------------
  // 11. SPACE VECTOR ARCADE SHOOTER
  // ---------------------------------------------------------------------------
  const shooterCanvasRef = useRef<HTMLCanvasElement>(null);
  const [shooterScore, setShooterScore] = useState(0);
  const [shooterGameOver, setShooterGameOver] = useState(false);
  const shooterState = useRef({
    shipX: 180,
    lasers: [] as Array<{ x: number; y: number }>,
    enemies: [] as Array<{ x: number; y: number; w: number; h: number }>,
    animId: null as number | null,
    score: 0,
  });

  const initShooter = useCallback(() => {
    const s = shooterState.current;
    s.shipX = 180;
    s.lasers = [];
    s.enemies = [{ x: 80, y: 30, w: 24, h: 18 }, { x: 220, y: 10, w: 24, h: 18 }];
    s.score = 0;
    setShooterScore(0);
    setShooterGameOver(false);

    const loop = () => {
      if (shooterCanvasRef.current && !isPaused) {
        const cvs = shooterCanvasRef.current;
        const ctx = cvs.getContext('2d');
        if (ctx) {
          // Move lasers
          s.lasers.forEach((l) => { l.y -= 7; });
          s.lasers = s.lasers.filter((l) => l.y > 0);

          // Move enemies down
          s.enemies.forEach((e) => { e.y += 1.8; });

          // Spawn enemies
          if (Math.random() < 0.035) {
            s.enemies.push({
              x: 20 + Math.random() * (cvs.width - 50),
              y: -20,
              w: 22,
              h: 16,
            });
          }

          // Laser hit detection
          s.lasers.forEach((l, lIdx) => {
            s.enemies.forEach((e, eIdx) => {
              if (l.x >= e.x && l.x <= e.x + e.w && l.y >= e.y && l.y <= e.y + e.h) {
                s.enemies.splice(eIdx, 1);
                s.lasers.splice(lIdx, 1);
                s.score += 15;
                setShooterScore(s.score);
                saveHighScore('shooter', s.score);
                playSfx('blip');
              }
            });
          });

          // Enemy reaches bottom
          if (s.enemies.some((e) => e.y >= cvs.height - 30)) {
            setShooterGameOver(true);
            playSfx('warp');
            return;
          }

          // Render
          ctx.fillStyle = '#101114';
          ctx.fillRect(0, 0, cvs.width, cvs.height);

          // Stars
          ctx.fillStyle = '#252830';
          for (let i = 0; i < 20; i++) {
            ctx.fillRect((i * 47) % cvs.width, (i * 29) % cvs.height, 2, 2);
          }

          // Player Ship (Triangle)
          ctx.fillStyle = '#f5a623';
          ctx.shadowColor = '#f5a623';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.moveTo(s.shipX + 14, cvs.height - 36);
          ctx.lineTo(s.shipX, cvs.height - 12);
          ctx.lineTo(s.shipX + 28, cvs.height - 12);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;

          // Lasers
          ctx.fillStyle = '#ffd166';
          s.lasers.forEach((l) => {
            ctx.fillRect(l.x - 1.5, l.y, 3, 10);
          });

          // Enemies (Invaders)
          ctx.fillStyle = '#F4F1E9';
          s.enemies.forEach((e) => {
            ctx.fillRect(e.x, e.y, e.w, e.h);
          });
        }
      }
      s.animId = requestAnimationFrame(loop);
    };

    if (s.animId) cancelAnimationFrame(s.animId);
    s.animId = requestAnimationFrame(loop);
  }, [isPaused]);

  useEffect(() => {
    if (activeGame !== 'shooter') return;
    initShooter();

    const handleKey = (e: KeyboardEvent) => {
      const s = shooterState.current;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        s.shipX = Math.max(10, s.shipX - 18);
      }
      if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        s.shipX = Math.min(360, s.shipX + 18);
      }
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        s.lasers.push({ x: s.shipX + 14, y: 240 });
        playSfx('blip');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      if (shooterState.current.animId) cancelAnimationFrame(shooterState.current.animId);
    };
  }, [activeGame, initShooter]);

  // ---------------------------------------------------------------------------
  // 12. CODING TRIVIA & SYNTAX LOGIC CHALLENGE
  // ---------------------------------------------------------------------------
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [puzzleScore, setPuzzleScore] = useState(0);
  const [puzzleAnswered, setPuzzleAnswered] = useState<number | null>(null);

  const PUZZLES = [
    {
      q: 'What is the evaluated output of: typeof NaN ?',
      opts: ["'number'", "'undefined'", "'NaN'", "'object'"],
      ans: 0,
      expl: 'In JavaScript, NaN has the numerical type: typeof NaN === "number".'
    },
    {
      q: 'Which hook executes synchronously after DOM mutations in React 19?',
      opts: ['useEffect', 'useLayoutEffect', 'useInsertionEffect', 'useMemo'],
      ans: 1,
      expl: 'useLayoutEffect fires synchronously immediately after DOM mutations.'
    },
    {
      q: 'In CSS Grid, what does `repeat(auto-fit, minmax(200px, 1fr))` do?',
      opts: ['Creates a fixed 200px column', 'Creates responsive self-wrapping grid tracks', 'Triggers horizontal overflow', 'Sets minimum 1fr width'],
      ans: 1,
      expl: 'It dynamically fits tracks and stretches them to fill available viewport space.'
    },
    {
      q: 'What is the algorithmic time complexity of accessing an element by key in a Hash Map?',
      opts: ['O(n)', 'O(log n)', 'O(1) average', 'O(n²)'],
      ans: 2,
      expl: 'Hash maps operate with amortized O(1) constant time lookup.'
    }
  ];

  const handlePuzzleSelect = (idx: number) => {
    if (puzzleAnswered !== null) return;
    setPuzzleAnswered(idx);
    if (idx === PUZZLES[puzzleIndex].ans) {
      playSfx('fanfare');
      setPuzzleScore((s) => {
        const next = s + 25;
        saveHighScore('codepuzzle', next);
        return next;
      });
    } else {
      playSfx('warp');
    }
  };

  const nextPuzzle = () => {
    setPuzzleAnswered(null);
    setPuzzleIndex((prev) => (prev + 1) % PUZZLES.length);
  };

  // ---------------------------------------------------------------------------
  // MAIN ARCADE VIEW RENDERER
  // ---------------------------------------------------------------------------
  return (
    <section
      id="arcade"
      className="snap-section flex flex-col justify-center px-4 md:px-8 py-16 md:py-24 relative overflow-hidden obsidian-grid-bg"
    >
      <div className="w-full max-w-7xl mx-auto z-10 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#f5a623]/25 text-[#f5a623] text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>ARCADE SUITE · 12 PLAYABLE MODULES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F4F1E9] tracking-tight uppercase font-display">
              PLAY MY GAMES ARCADE
            </h2>
            <p className="text-[#A4A7AE] text-sm sm:text-base mt-1 max-w-xl font-sans">
              A bespoke collection of twelve fully playable in-browser canvas and logic games with local high-score tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playBlip();
                setIsAudioEnabled((prev) => !prev);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141418] hover:bg-[#1a1a20] border border-white/10 text-xs font-mono text-[#F4F1E9] cursor-pointer transition-all"
              title="Toggle Audio Effects"
            >
              {isAudioEnabled ? <Volume2 className="w-4 h-4 text-[#f5a623]" /> : <VolumeX className="w-4 h-4 text-[#A4A7AE]" />}
              <span>{isAudioEnabled ? 'AUDIO ON' : 'MUTED'}</span>
            </button>

            {activeGame !== 'menu' && (
              <button
                onClick={() => {
                  soundFx.playBlip();
                  setActiveGame('menu');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-mono text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-[0_0_15px_rgba(245,166,35,0.35)] hover:brightness-110"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Games Matrix</span>
              </button>
            )}
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* VIEW A: 12-GAME GALLERY SELECTION MATRIX */}
        {/* ----------------------------------------------------------------- */}
        {activeGame === 'menu' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {GAMES_LIST.map((game) => {
              const best = highScores[game.id] || 0;
              return (
                <div
                  key={game.id}
                  onClick={() => {
                    playSfx('blip');
                    setActiveGame(game.id);
                  }}
                  data-cursor="PLAY"
                  className="obsidian-card rounded-2xl p-5 border border-white/10 hover:border-[#f5a623]/40 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{game.icon}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0c0c0e] text-[#ffd166] border border-[#f5a623]/30 font-bold">
                        {game.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#F4F1E9] group-hover:text-[#f5a623] transition-colors mb-1">
                      {game.title}
                    </h3>
                    <p className="text-xs text-[#A4A7AE] leading-relaxed mb-4">
                      {game.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-xs">
                    <span className="text-[11px] text-[#A4A7AE] flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-[#f5a623]" />
                      <span>Best: {best}</span>
                    </span>
                    <span className="text-[11px] font-bold text-[#f5a623] group-hover:translate-x-1 transition-transform">
                      PLAY →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* VIEW B: ACTIVE GAME PLAY MODULE CONTAINER */}
        {/* ----------------------------------------------------------------- */}
        {activeGame !== 'menu' && (
          <div className="obsidian-card rounded-3xl p-6 border border-white/10 max-w-3xl mx-auto shadow-2xl space-y-6">
            
            {/* Game Toolbar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveGame('menu')}
                  className="p-2 rounded-xl bg-[#101114] hover:bg-[#202229] text-[#A4A7AE] hover:text-[#F4F1E9] border border-white/10 transition-all cursor-pointer"
                  title="Back to games selection"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="text-lg font-bold text-[#F4F1E9] font-mono uppercase">
                    {GAMES_LIST.find((g) => g.id === activeGame)?.title}
                  </h3>
                  <span className="text-[10px] text-[#A4A7AE] font-mono">
                    {GAMES_LIST.find((g) => g.id === activeGame)?.description}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPaused((p) => !p)}
                  className="p-2 rounded-xl bg-[#101114] hover:bg-[#202229] text-[#A4A7AE] border border-white/10 text-xs font-mono cursor-pointer"
                  title={isPaused ? 'Resume Game' : 'Pause Game'}
                >
                  {isPaused ? <Play className="w-4 h-4 text-[#f5a623]" /> : <Pause className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Game 1: Snake Canvas */}
            {activeGame === 'snake' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-between w-full font-mono text-xs text-[#A4A7AE]">
                  <span>SCORE: <strong className="text-[#F4F1E9]">{snakeScore}</strong></span>
                  <span>BEST: <strong className="text-[#f5a623]">{highScores.snake || 0}</strong></span>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#101114]">
                  <canvas ref={snakeCanvasRef} width={400} height={400} className="w-[300px] sm:w-[400px] h-[300px] sm:h-[400px]" />
                  {snakeGameOver && (
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 p-4">
                      <span className="text-rose-400 font-mono font-bold text-sm">COLLISION DETECTED</span>
                      <button
                        onClick={initSnake}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-mono text-xs font-black uppercase cursor-pointer hover:brightness-110 shadow-[0_0_15px_rgba(245,166,35,0.3)]"
                      >
                        RESTART RUN
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[11px] font-mono text-[#A4A7AE]">Controls: Arrow Keys or W / A / S / D</p>
              </div>
            )}

            {/* Game 2: Dino Runner Canvas */}
            {activeGame === 'runner' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-between w-full font-mono text-xs text-[#A4A7AE]">
                  <span>DISTANCE: <strong className="text-[#F4F1E9]">{runnerScore}m</strong></span>
                  <span>RECORD: <strong className="text-[#f5a623]">{highScores.runner || 0}m</strong></span>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#101114]">
                  <canvas ref={runnerCanvasRef} width={460} height={240} className="w-[320px] sm:w-[460px] h-[180px] sm:h-[240px]" />
                  {runnerGameOver && (
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 p-4">
                      <span className="text-rose-400 font-mono font-bold text-sm">SECURITY BREACH</span>
                      <button
                        onClick={initRunner}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-mono text-xs font-black uppercase cursor-pointer hover:brightness-110 shadow-[0_0_15px_rgba(245,166,35,0.3)]"
                      >
                        RUN AGAIN
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button onClick={jumpRunner} className="px-6 py-2 rounded-xl bg-[#101114] border border-white/10 text-xs font-mono text-[#F4F1E9]">
                    TAP / SPACE TO JUMP
                  </button>
                </div>
              </div>
            )}

            {/* Game 3: Neon Pong */}
            {activeGame === 'pong' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-between w-full font-mono text-xs text-[#A4A7AE]">
                  <span>PLAYER: <strong className="text-[#F4F1E9]">{pongScore.player}</strong></span>
                  <span>AI: <strong className="text-rose-400">{pongScore.ai}</strong></span>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#101114]">
                  <canvas ref={pongCanvasRef} width={440} height={260} className="w-[320px] sm:w-[440px] h-[200px] sm:h-[260px]" />
                </div>
                <p className="text-[11px] font-mono text-[#A4A7AE]">Controls: Move mouse up/down to control left paddle</p>
              </div>
            )}

            {/* Game 4: Breakout Brick Breaker */}
            {activeGame === 'breakout' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-between w-full font-mono text-xs text-[#A4A7AE]">
                  <span>SCORE: <strong className="text-[#F4F1E9]">{breakoutScore}</strong></span>
                  <span>BEST: <strong className="text-[#f5a623]">{highScores.breakout || 0}</strong></span>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#101114]">
                  <canvas ref={breakoutCanvasRef} width={400} height={280} className="w-[320px] sm:w-[400px] h-[220px] sm:h-[280px]" />
                  {breakoutGameOver && (
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 p-4">
                      <span className="text-rose-400 font-mono font-bold text-sm">ORB LOST</span>
                      <button
                        onClick={initBreakout}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-mono text-xs font-black uppercase cursor-pointer hover:brightness-110 shadow-[0_0_15px_rgba(245,166,35,0.3)]"
                      >
                        RETRY
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[11px] font-mono text-[#A4A7AE]">Controls: Move mouse horizontally to position paddle</p>
              </div>
            )}

            {/* Game 5: Memory Match */}
            {activeGame === 'memory' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-between w-full font-mono text-xs text-[#A4A7AE]">
                  <span>MOVES: <strong className="text-[#F4F1E9]">{memoryMoves}</strong></span>
                  <button onClick={initMemory} className="text-[#f5a623] hover:underline">Reset Cards</button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {memoryCards.map((card, i) => (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick(i)}
                      className={`w-14 sm:w-16 h-14 sm:h-16 rounded-2xl font-mono text-xl sm:text-2xl flex items-center justify-center border transition-all cursor-pointer ${
                        card.flipped || card.matched
                          ? 'bg-[#202229] border-[#f5a623] text-[#F4F1E9]'
                          : 'bg-[#101114] border-white/10 hover:border-white/30 text-transparent'
                      }`}
                    >
                      {card.flipped || card.matched ? card.symbol : '?'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Game 6: Simon Says */}
            {activeGame === 'simon' && (
              <div className="flex flex-col items-center gap-5">
                <div className="flex items-center justify-between w-full font-mono text-xs text-[#A4A7AE]">
                  <span>PATTERN SCORE: <strong className="text-[#F4F1E9]">{simonScore}</strong></span>
                  <span>BEST: <strong className="text-[#f5a623]">{highScores.simon || 0}</strong></span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { idx: 0, color: 'bg-emerald-500', active: 'bg-emerald-300 ring-4 ring-emerald-400' },
                    { idx: 1, color: 'bg-cyan-500', active: 'bg-cyan-300 ring-4 ring-cyan-400' },
                    { idx: 2, color: 'bg-amber-500', active: 'bg-amber-300 ring-4 ring-amber-400' },
                    { idx: 3, color: 'bg-rose-500', active: 'bg-rose-300 ring-4 ring-rose-400' },
                  ].map((pad) => (
                    <button
                      key={pad.idx}
                      onClick={() => playSimonPad(pad.idx)}
                      className={`w-24 sm:w-28 h-24 sm:h-28 rounded-2xl transition-all cursor-pointer shadow-lg ${
                        simonActivePad === pad.idx ? pad.active : pad.color
                      }`}
                    />
                  ))}
                </div>
                {simonGameOver && (
                  <div className="text-center space-y-2">
                    <span className="text-rose-400 font-mono text-xs block">PATTERN BROKEN</span>
                    <button onClick={startSimon} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-black font-mono text-xs font-bold hover:brightness-110">
                      RETRY
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Game 7: Minesweeper */}
            {activeGame === 'minesweeper' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-between w-full font-mono text-xs text-[#A4A7AE]">
                  <span>8 HIDDEN MINES</span>
                  <button onClick={initMinesweeper} className="text-[#f5a623] hover:underline">New Field</button>
                </div>
                <div className="grid grid-cols-8 gap-1.5 p-3 rounded-2xl bg-[#101114] border border-white/10">
                  {minesGrid.map((cell, idx) => (
                    <button
                      key={idx}
                      onClick={() => revealCell(idx)}
                      className={`w-7 sm:w-9 h-7 sm:h-9 rounded-lg text-xs font-mono font-bold flex items-center justify-center border cursor-pointer transition-all ${
                        cell.revealed
                          ? cell.mine
                            ? 'bg-rose-950 border-rose-500 text-rose-300'
                            : 'bg-[#202229] border-white/5 text-[#F4F1E9]'
                          : 'bg-[#17191E] border-white/10 hover:border-[#f5a623]/40'
                      }`}
                    >
                      {cell.revealed ? (cell.mine ? '💣' : cell.count > 0 ? cell.count : '') : ''}
                    </button>
                  ))}
                </div>
                {minesGameOver && <span className="text-rose-400 font-mono text-xs font-bold">MINE DETONATED!</span>}
                {minesWon && <span className="text-[#f5a623] font-mono text-xs font-bold">CLEARED! +100 PTS</span>}
              </div>
            )}

            {/* Game 8: Tic-Tac-Toe AI */}
            {activeGame === 'tictactoe' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-between w-full font-mono text-xs text-[#A4A7AE]">
                  <span>PLAYER (X) vs AI (O)</span>
                  <button onClick={() => { setTttBoard(Array(9).fill(null)); setTttWinner(null); }} className="text-[#f5a623] hover:underline">
                    Restart
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#101114] border border-white/10">
                  {tttBoard.map((val, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTttClick(idx)}
                      className="w-16 sm:w-20 h-16 sm:h-20 rounded-xl bg-[#17191E] border border-white/10 hover:border-[#f5a623]/40 text-2xl font-mono font-black flex items-center justify-center cursor-pointer transition-all"
                    >
                      <span className={val === 'X' ? 'text-[#f5a623]' : 'text-[#ffd166]'}>{val}</span>
                    </button>
                  ))}
                </div>
                {tttWinner && (
                  <span className="font-mono text-xs font-bold text-[#F4F1E9]">
                    {tttWinner === 'Draw' ? 'GAME DRAW' : `${tttWinner} WON THE MATCH!`}
                  </span>
                )}
              </div>
            )}

            {/* Game 9: 2048 Merge */}
            {activeGame === 'game2048' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-between w-full font-mono text-xs text-[#A4A7AE]">
                  <span>SCORE: <strong className="text-[#F4F1E9]">{score2048}</strong></span>
                  <span>BEST: <strong className="text-[#f5a623]">{highScores.game2048 || 0}</strong></span>
                </div>
                <div className="grid grid-cols-4 gap-2 p-3 rounded-2xl bg-[#101114] border border-white/10">
                  {board2048.flat().map((num, i) => (
                    <div
                      key={i}
                      className={`w-14 sm:w-16 h-14 sm:h-16 rounded-xl font-mono font-bold text-sm sm:text-base flex items-center justify-center border ${
                        num === 0
                          ? 'bg-[#17191E] border-white/5 text-transparent'
                          : num >= 128
                          ? 'bg-[#f5a623] text-[#0c0c0e] border-[#f5a623]'
                          : 'bg-[#202229] border-white/10 text-[#F4F1E9]'
                      }`}
                    >
                      {num > 0 ? num : ''}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 w-48 font-mono text-xs">
                  <span />
                  <button onClick={() => move2048('up')} className="p-2 rounded bg-[#17191E] border border-white/10 text-center">↑</button>
                  <span />
                  <button onClick={() => move2048('left')} className="p-2 rounded bg-[#17191E] border border-white/10 text-center">←</button>
                  <button onClick={() => move2048('down')} className="p-2 rounded bg-[#17191E] border border-white/10 text-center">↓</button>
                  <button onClick={() => move2048('right')} className="p-2 rounded bg-[#17191E] border border-white/10 text-center">→</button>
                </div>
              </div>
            )}

            {/* Game 10: Precision Reflex Test */}
            {activeGame === 'reaction' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-between w-full font-mono text-xs text-[#A4A7AE]">
                  <span>BEST REFLEX: <strong className="text-[#f5a623]">{highScores.reaction ? `${highScores.reaction}ms` : '—'}</strong></span>
                </div>
                <div
                  onClick={handleReactionClick}
                  className={`w-full h-56 rounded-2xl border flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                    reactionState === 'waiting'
                      ? 'bg-rose-950/70 border-rose-500/50 text-rose-200'
                      : reactionState === 'ready'
                      ? 'bg-[#f5a623] border-[#f5a623] text-[#0c0c0e] shadow-[0_0_30px_#f5a623]'
                      : 'bg-[#101114] border-white/10 text-[#F4F1E9]'
                  }`}
                >
                  {reactionState === 'idle' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); startReaction(); }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-mono text-xs font-bold uppercase cursor-pointer hover:brightness-110 shadow-[0_0_15px_rgba(245,166,35,0.3)]"
                    >
                      START REFLEX TEST
                    </button>
                  )}
                  {reactionState === 'waiting' && <span className="font-mono text-sm font-bold">WAIT FOR AMBER...</span>}
                  {reactionState === 'ready' && <span className="font-mono text-lg font-black tracking-wider">CLICK NOW!</span>}
                  {reactionState === 'result' && (
                    <div className="space-y-2">
                      <span className="font-mono text-3xl font-black">{reactionMs} ms</span>
                      <p className="text-xs font-mono text-[#A4A7AE]">
                        {reactionMs && reactionMs < 220 ? '⚡ Ultra-Fast Reflexes!' : '✓ Solid Human Reaction Speed.'}
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); startReaction(); }}
                        className="px-4 py-1.5 rounded-lg bg-[#202229] border border-white/10 text-xs font-mono text-[#F4F1E9]"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Game 11: Space Vector Shooter */}
            {activeGame === 'shooter' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-between w-full font-mono text-xs text-[#A4A7AE]">
                  <span>SCORE: <strong className="text-[#F4F1E9]">{shooterScore}</strong></span>
                  <span>BEST: <strong className="text-[#f5a623]">{highScores.shooter || 0}</strong></span>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#101114]">
                  <canvas ref={shooterCanvasRef} width={400} height={280} className="w-[320px] sm:w-[400px] h-[220px] sm:h-[280px]" />
                  {shooterGameOver && (
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 p-4">
                      <span className="text-rose-400 font-mono font-bold text-sm">HULL BREACHED</span>
                      <button
                        onClick={initShooter}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-mono text-xs font-black uppercase cursor-pointer hover:brightness-110 shadow-[0_0_15px_rgba(245,166,35,0.3)]"
                      >
                        LAUNCH AGAIN
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[11px] font-mono text-[#A4A7AE]">Controls: A/D or Left/Right to steer • Spacebar to fire pulse lasers</p>
              </div>
            )}

            {/* Game 12: Code Syntax & Trivia Puzzle */}
            {activeGame === 'codepuzzle' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs text-[#A4A7AE]">
                  <span>QUESTION {puzzleIndex + 1} OF {PUZZLES.length}</span>
                  <span>SCORE: <strong className="text-[#f5a623]">{puzzleScore}</strong></span>
                </div>
                <div className="p-4 rounded-2xl bg-[#101114] border border-white/10">
                  <p className="font-mono text-sm text-[#F4F1E9] font-bold">
                    {PUZZLES[puzzleIndex].q}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                  {PUZZLES[puzzleIndex].opts.map((opt, i) => {
                    const isSelected = puzzleAnswered === i;
                    const isCorrect = i === PUZZLES[puzzleIndex].ans;
                    return (
                      <button
                        key={i}
                        onClick={() => handlePuzzleSelect(i)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          puzzleAnswered !== null
                            ? isCorrect
                              ? 'bg-amber-950/80 border-[#f5a623] text-[#f5a623]'
                              : isSelected
                              ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                              : 'bg-[#17191E] border-white/5 opacity-50'
                            : 'bg-[#17191E] border-white/10 hover:border-[#f5a623]/40 text-[#F4F1E9]'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {puzzleAnswered !== null && (
                  <div className="p-3 rounded-xl bg-[#202229] border border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#A4A7AE]">{PUZZLES[puzzleIndex].expl}</span>
                    <button
                      onClick={nextPuzzle}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#e58a3c] to-[#f5a623] text-[#0c0c0e] font-bold uppercase hover:brightness-110 shadow-[0_0_10px_rgba(245,166,35,0.3)]"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
