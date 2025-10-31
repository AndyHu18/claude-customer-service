import { useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
const INITIAL_DIRECTION: Direction = 'RIGHT';
const GAME_SPEED = 150;

function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
    );
    return newFood;
  }, []);

  const checkCollision = useCallback((head: Position, snakeBody: Position[]): boolean => {
    // 撞到牆壁
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // 撞到自己
    return snakeBody.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const currentDirection = directionRef.current;
      let newHead: Position;

      switch (currentDirection) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // 檢查碰撞
      if (checkCollision(newHead, prevSnake)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // 檢查是否吃到食物
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => prev + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameOver, gameStarted, isPaused, food, checkCollision, generateFood]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) return;

      if (!gameStarted) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          setGameStarted(true);
        }
      }

      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        return;
      }

      const currentDirection = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
          if (currentDirection !== 'DOWN') {
            directionRef.current = 'UP';
          }
          break;
        case 'ArrowDown':
          if (currentDirection !== 'UP') {
            directionRef.current = 'DOWN';
          }
          break;
        case 'ArrowLeft':
          if (currentDirection !== 'RIGHT') {
            directionRef.current = 'LEFT';
          }
          break;
        case 'ArrowRight':
          if (currentDirection !== 'LEFT') {
            directionRef.current = 'RIGHT';
          }
          break;
      }
    },
    [gameOver, gameStarted]
  );

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
    setIsPaused(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空畫布
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 繪製網格
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // 繪製食物
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // 繪製蛇
    snake.forEach((segment, index) => {
      if (index === 0) {
        // 蛇頭
        ctx.fillStyle = '#22c55e';
      } else {
        // 蛇身
        ctx.fillStyle = '#4ade80';
      }
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });

    // 如果遊戲結束，顯示半透明覆蓋層
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [snake, food, gameOver]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">貪食蛇遊戲</h1>
          <p className="text-gray-400">使用方向鍵控制蛇的移動</p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold text-white">
              分數: <span className="text-green-400">{score}</span>
            </div>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              重新開始
            </button>
          </div>

          <div className="relative inline-block">
            <canvas
              ref={canvasRef}
              width={GRID_SIZE * CELL_SIZE}
              height={GRID_SIZE * CELL_SIZE}
              className="border-4 border-gray-700 rounded-lg"
            />

            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
                <div className="text-center">
                  <p className="text-white text-2xl font-bold mb-4">準備開始！</p>
                  <p className="text-gray-300">按任意方向鍵開始遊戲</p>
                </div>
              </div>
            )}

            {isPaused && !gameOver && gameStarted && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
                <div className="text-center">
                  <p className="text-white text-2xl font-bold mb-4">遊戲暫停</p>
                  <p className="text-gray-300">按空白鍵繼續</p>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
                <div className="text-center">
                  <p className="text-red-500 text-3xl font-bold mb-2">遊戲結束！</p>
                  <p className="text-white text-xl mb-4">最終分數: {score}</p>
                  <button
                    onClick={resetGame}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold"
                  >
                    再玩一次
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-bold mb-2">遊戲說明</h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• 使用 ↑ ↓ ← → 方向鍵控制蛇的移動</li>
                <li>• 吃到紅色食物可以增加分數和蛇的長度</li>
                <li>• 不要撞到牆壁或自己的身體</li>
                <li>• 按空白鍵可以暫停/繼續遊戲</li>
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-start-2 flex justify-center">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <ArrowUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="col-span-3 grid grid-cols-3 gap-2">
                <div className="bg-gray-700 p-3 rounded-lg flex justify-center">
                  <ArrowLeft className="w-6 h-6 text-white" />
                </div>
                <div className="bg-gray-700 p-3 rounded-lg flex justify-center">
                  <ArrowDown className="w-6 h-6 text-white" />
                </div>
                <div className="bg-gray-700 p-3 rounded-lg flex justify-center">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SnakeGame;
