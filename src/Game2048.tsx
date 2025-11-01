import { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';

type Grid = number[][];

const Game2048 = () => {
  const [grid, setGrid] = useState<Grid>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('2048-best-score');
    return saved ? parseInt(saved) : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [message, setMessage] = useState('使用方向鍵移動方塊！');

  // 初始化空網格
  const createEmptyGrid = (): Grid => {
    return Array(4).fill(null).map(() => Array(4).fill(0));
  };

  // 獲取空格位置
  const getEmptyCells = (grid: Grid): [number, number][] => {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }
    return emptyCells;
  };

  // 添加新方塊
  const addNewTile = (grid: Grid): Grid => {
    const emptyCells = getEmptyCells(grid);
    if (emptyCells.length === 0) return grid;

    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = grid.map(row => [...row]);
    newGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  };

  // 初始化遊戲
  const initGame = useCallback(() => {
    let newGrid = createEmptyGrid();
    newGrid = addNewTile(newGrid);
    newGrid = addNewTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setMessage('使用方向鍵移動方塊！');
  }, []);

  // 檢查是否可以移動
  const canMove = (grid: Grid): boolean => {
    // 檢查是否有空格
    if (getEmptyCells(grid).length > 0) return true;

    // 檢查是否可以合併
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = grid[i][j];
        if (j < 3 && current === grid[i][j + 1]) return true;
        if (i < 3 && current === grid[i + 1][j]) return true;
      }
    }
    return false;
  };

  // 移動和合併邏輯
  const moveLeft = (grid: Grid): { grid: Grid; scoreGained: number; moved: boolean } => {
    let scoreGained = 0;
    let moved = false;
    const newGrid = grid.map(row => {
      // 移除零並向左壓縮
      const filtered = row.filter(cell => cell !== 0);
      const merged: number[] = [];

      for (let i = 0; i < filtered.length; i++) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          const mergedValue = filtered[i] * 2;
          merged.push(mergedValue);
          scoreGained += mergedValue;
          i++; // 跳過下一個已合併的
        } else {
          merged.push(filtered[i]);
        }
      }

      // 填充零到右邊
      while (merged.length < 4) {
        merged.push(0);
      }

      // 檢查是否移動
      if (!moved && JSON.stringify(merged) !== JSON.stringify(row)) {
        moved = true;
      }

      return merged;
    });

    return { grid: newGrid, scoreGained, moved };
  };

  // 旋轉網格（用於實現其他方向的移動）
  const rotateGrid = (grid: Grid): Grid => {
    const newGrid = createEmptyGrid();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newGrid[j][3 - i] = grid[i][j];
      }
    }
    return newGrid;
  };

  const rotateGridCounterClockwise = (grid: Grid): Grid => {
    const newGrid = createEmptyGrid();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newGrid[3 - j][i] = grid[i][j];
      }
    }
    return newGrid;
  };

  // 處理移動
  const move = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;

    let currentGrid = [...grid.map(row => [...row])];
    let rotations = 0;

    // 旋轉到左移
    if (direction === 'right') {
      rotations = 2;
    } else if (direction === 'up') {
      rotations = 3;
    } else if (direction === 'down') {
      rotations = 1;
    }

    for (let i = 0; i < rotations; i++) {
      currentGrid = rotateGrid(currentGrid);
    }

    const { grid: movedGrid, scoreGained, moved } = moveLeft(currentGrid);

    // 旋轉回來
    let finalGrid = movedGrid;
    for (let i = 0; i < rotations; i++) {
      finalGrid = rotateGridCounterClockwise(finalGrid);
    }

    if (moved) {
      const newGrid = addNewTile(finalGrid);
      setGrid(newGrid);

      const newScore = score + scoreGained;
      setScore(newScore);

      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('2048-best-score', newScore.toString());
      }

      // 檢查是否達到 2048
      if (!won && finalGrid.some(row => row.some(cell => cell === 2048))) {
        setWon(true);
        setMessage('🎉 恭喜！你達到了 2048！');
      }

      // 檢查遊戲是否結束
      if (!canMove(newGrid)) {
        setGameOver(true);
        setMessage('遊戲結束！沒有可移動的空間了。');
      }
    }
  };

  // 鍵盤事件處理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();

        if (e.key === 'ArrowLeft') move('left');
        else if (e.key === 'ArrowRight') move('right');
        else if (e.key === 'ArrowUp') move('up');
        else if (e.key === 'ArrowDown') move('down');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameOver, score, won, bestScore]);

  // 初始化遊戲
  useEffect(() => {
    initGame();
  }, []);

  // 獲取方塊顏色
  const getTileColor = (value: number): string => {
    const colors: { [key: number]: string } = {
      0: 'bg-gray-700',
      2: 'bg-blue-500',
      4: 'bg-blue-600',
      8: 'bg-orange-500',
      16: 'bg-orange-600',
      32: 'bg-red-500',
      64: 'bg-red-600',
      128: 'bg-yellow-500',
      256: 'bg-yellow-600',
      512: 'bg-green-500',
      1024: 'bg-green-600',
      2048: 'bg-purple-500',
      4096: 'bg-purple-600',
      8192: 'bg-pink-500'
    };
    return colors[value] || 'bg-pink-600';
  };

  // 獲取文字大小
  const getTextSize = (value: number): string => {
    if (value >= 1000) return 'text-2xl';
    if (value >= 100) return 'text-3xl';
    return 'text-4xl';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        {/* 標題和分數 */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-2">2048</h1>
          <p className="text-gray-300 mb-6">合併相同數字，達到 2048！</p>

          <div className="flex justify-center gap-4 mb-4">
            <div className="bg-gray-800 rounded-lg px-6 py-3">
              <div className="text-gray-400 text-sm">分數</div>
              <div className="text-white text-2xl font-bold">{score}</div>
            </div>
            <div className="bg-gray-800 rounded-lg px-6 py-3 flex items-center gap-2">
              <Trophy className="text-yellow-500" size={20} />
              <div>
                <div className="text-gray-400 text-sm">最高</div>
                <div className="text-white text-2xl font-bold">{bestScore}</div>
              </div>
            </div>
          </div>

          <button
            onClick={initGame}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-all hover:scale-105"
          >
            <RotateCcw size={20} />
            新遊戲
          </button>
        </div>

        {/* 遊戲狀態訊息 */}
        <div className={`text-center mb-4 py-2 rounded-lg ${
          gameOver ? 'bg-red-600' : won ? 'bg-green-600' : 'bg-blue-600'
        }`}>
          <p className="text-white font-semibold">{message}</p>
        </div>

        {/* 遊戲網格 */}
        <div className="bg-gray-800 rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-4 gap-4">
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`${getTileColor(cell)} rounded-lg aspect-square flex items-center justify-center font-bold ${getTextSize(cell)} text-white transition-all duration-200 transform ${
                    cell !== 0 ? 'scale-100' : 'scale-95'
                  }`}
                >
                  {cell !== 0 && cell}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 控制說明 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-white font-bold mb-4">遊戲說明</h3>
          <div className="text-gray-300 space-y-2">
            <p>🎮 使用方向鍵移動所有方塊</p>
            <p>➕ 當兩個相同數字的方塊碰觸時會合併</p>
            <p>🎯 目標：創建一個 2048 的方塊！</p>
            <p>💡 提示：保持大數字在角落，計劃好你的移動</p>
          </div>

          {/* 方向鍵圖示 */}
          <div className="mt-6 flex justify-center">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-start-2">
                <div className="bg-gray-700 rounded p-3 text-white text-center">↑</div>
              </div>
              <div className="bg-gray-700 rounded p-3 text-white text-center">←</div>
              <div className="bg-gray-700 rounded p-3 text-white text-center">↓</div>
              <div className="bg-gray-700 rounded p-3 text-white text-center">→</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game2048;
