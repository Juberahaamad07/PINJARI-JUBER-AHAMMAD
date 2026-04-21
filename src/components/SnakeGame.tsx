import { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  isPaused: boolean;
}

export default function SnakeGame({ onScoreChange, isPaused }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (nextDirection) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      setDirection(nextDirection);

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some((cell) => cell.x === newHead.x && cell.y === newHead.y)
      ) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        spawnFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [nextDirection, food, gameOver, isPaused, onScoreChange]);

  const spawnFood = (currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((c) => c.x === newFood.x && c.y === newFood.y));
    setFood(newFood);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setNextDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setNextDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setNextDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setNextDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
        ctx.stroke();
    }

    // Draw snake
    ctx.shadowBlur = 10;
    snake.forEach((cell, i) => {
      ctx.fillStyle = i === 0 ? '#00ffff' : '#ff00ff';
      ctx.shadowColor = i === 0 ? '#00ffff' : '#ff00ff';
      ctx.fillRect(cell.x * CELL_SIZE + 1, cell.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });

    // Draw food
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.arc(
        food.x * CELL_SIZE + CELL_SIZE / 2,
        food.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 3,
        0,
        Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [snake, food]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    spawnFood(INITIAL_SNAKE);
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="border-4 border-cyan absolute -inset-1 opacity-50 blur-sm pointer-events-none"></div>
      <div className="border-2 border-cyan p-1 bg-black/80 relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="block cursor-none"
        />
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
            {gameOver ? (
              <>
                <h2 className="text-4xl text-magenta font-bold glitch-text mb-4" data-text="GAME_OVER">GAME_OVER</h2>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 border-2 border-cyan text-cyan hover:bg-cyan hover:text-black transition-colors font-mono uppercase tracking-widest"
                >
                  REBOOT_SYSTEM
                </button>
              </>
            ) : (
                <h2 className="text-4xl text-cyan font-bold glitch-text" data-text="SYSTEM_PAUSED">SYSTEM_PAUSED</h2>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
