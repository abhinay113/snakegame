import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCcw } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;
const MIN_SPEED = 60;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection({ x: 0, y: 0 });
    setScore(0);
    setGameOver(false);
    setIsPaused(true);
    setSpeed(INITIAL_SPEED);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y !== 1) {
            setDirection({ x: 0, y: -1 });
            setIsPaused(false);
          }
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y !== -1) {
            setDirection({ x: 0, y: 1 });
            setIsPaused(false);
          }
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x !== 1) {
            setDirection({ x: -1, y: 0 });
            setIsPaused(false);
          }
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x !== -1) {
            setDirection({ x: 1, y: 0 });
            setIsPaused(false);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
      };

      // Collision detection
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }

      const newSnake = [newHead, ...snake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(spawnFood(newSnake));
        setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snake, direction, food, gameOver, isPaused, speed, highScore, score, spawnFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (subtle)
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00f3ff' : 'rgba(0, 243, 255, 0.6)';
      ctx.shadowBlur = isHead ? 20 : 5;
      ctx.shadowColor = '#00f3ff';
      
      const padding = 2;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
      ctx.shadowBlur = 0;
    });

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex justify-between w-full max-w-[400px] mb-6 px-2">
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-neon-cyan/40 mb-2">SCORE_0x01</span>
          <span 
            className="text-5xl font-display text-neon-cyan glitch-hard" 
            data-text={score}
          >
            {score}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-neon-pink/40 mb-2">MAX_PAYLOAD</span>
          <span 
            className="text-5xl font-display text-neon-pink glitch-hard" 
            data-text={highScore}
          >
            {highScore}
          </span>
        </div>
      </div>

      <div className="relative">
        {/* Glow background */}
        <div className="absolute -inset-2 bg-neon-cyan opacity-10 blur-xl"></div>
        
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-black border-4 border-neon-cyan screen-tear"
        />

        <AnimatePresence>
          {isPaused && !gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <div className="text-center px-4">
                <h2 className="text-3xl font-display text-neon-cyan mb-4 glitch-hard" data-text="READY_?">READY_?</h2>
                <div className="p-2 border-2 border-neon-cyan/40 inline-block">
                   <p className="text-[10px] text-neon-cyan font-mono uppercase tracking-[0.2em]">INPUT_DEVICE_REQUIRED_[[WASD]]</p>
                </div>
              </div>
            </motion.div>
          )}

          {gameOver && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-neon-pink/10 backdrop-blur-md"
            >
              <div className="text-center bg-black border-4 border-neon-pink p-8 shadow-[0_0_50px_rgba(255,0,255,0.2)]">
                <h2 className="text-4xl font-display text-neon-pink mb-2 glitch-hard" data-text="CRITICAL_FAILURE">CRITICAL_FAILURE</h2>
                <p className="text-neon-pink font-mono text-xs uppercase tracking-widest mb-8 text-shadow-pink">Segment_Smashed: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-8 py-4 bg-neon-pink text-black font-display uppercase text-xs tracking-widest hover:bg-white transition-colors pixel-border"
                >
                  REBOOT_SYSTEM
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-2">
         <div className="px-3 py-1 bg-neon-cyan/10 border-2 border-neon-cyan/30 text-[8px] text-neon-cyan font-mono uppercase tracking-tighter">
            DRIVE_VEC: WASD_ARROWS
         </div>
         <div className="px-3 py-1 bg-neon-pink/10 border-2 border-neon-pink/30 text-[8px] text-neon-pink font-mono uppercase tracking-tighter">
            TARGET: NEON_VOID_NODES
         </div>
      </div>
    </div>
  );
}
