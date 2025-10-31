import { useState, useEffect, useCallback } from 'react';
import { RefreshCcw, Star, Trophy } from 'lucide-react';

type Block = {
  id: string;
  color: string;
  row: number;
  col: number;
};

type Position = {
  row: number;
  col: number;
};

const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899'];
const GRID_SIZE = 8;
const BLOCK_SIZE = 50;

function BlockMatchingGame() {
  const [grid, setGrid] = useState<Block[][]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Position | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [combo, setCombo] = useState(0);

  // 初始化遊戲板
  const initializeGrid = useCallback(() => {
    const newGrid: Block[][] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      newGrid[row] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        let color: string;
        do {
          color = COLORS[Math.floor(Math.random() * COLORS.length)];
        } while (
          // 避免初始化時就有3個相連
          (col >= 2 &&
            newGrid[row][col - 1]?.color === color &&
            newGrid[row][col - 2]?.color === color) ||
          (row >= 2 &&
            newGrid[row - 1]?.[col]?.color === color &&
            newGrid[row - 2]?.[col]?.color === color)
        );
        newGrid[row][col] = {
          id: `${row}-${col}-${Date.now()}-${Math.random()}`,
          color,
          row,
          col,
        };
      }
    }
    return newGrid;
  }, []);

  // 檢查是否有3個或以上相連的方塊
  const findMatches = useCallback((currentGrid: Block[][]): Position[] => {
    const matches: Set<string> = new Set();

    // 檢查水平匹配
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 2; col++) {
        const color = currentGrid[row][col].color;
        let matchLength = 1;
        for (let i = col + 1; i < GRID_SIZE; i++) {
          if (currentGrid[row][i].color === color) {
            matchLength++;
          } else {
            break;
          }
        }
        if (matchLength >= 3) {
          for (let i = 0; i < matchLength; i++) {
            matches.add(`${row}-${col + i}`);
          }
        }
      }
    }

    // 檢查垂直匹配
    for (let col = 0; col < GRID_SIZE; col++) {
      for (let row = 0; row < GRID_SIZE - 2; row++) {
        const color = currentGrid[row][col].color;
        let matchLength = 1;
        for (let i = row + 1; i < GRID_SIZE; i++) {
          if (currentGrid[i][col].color === color) {
            matchLength++;
          } else {
            break;
          }
        }
        if (matchLength >= 3) {
          for (let i = 0; i < matchLength; i++) {
            matches.add(`${row + i}-${col}`);
          }
        }
      }
    }

    return Array.from(matches).map((key) => {
      const [row, col] = key.split('-').map(Number);
      return { row, col };
    });
  }, []);

  // 移除匹配的方塊並讓上方方塊下落
  const removeMatchesAndDrop = useCallback(
    (currentGrid: Block[][]): { newGrid: Block[][]; matchCount: number } => {
      const matches = findMatches(currentGrid);
      if (matches.length === 0) {
        return { newGrid: currentGrid, matchCount: 0 };
      }

      const newGrid = currentGrid.map((row) => [...row]);

      // 移除匹配的方塊
      matches.forEach(({ row, col }) => {
        newGrid[row][col] = {
          ...newGrid[row][col],
          color: '',
        };
      });

      // 讓方塊下落
      for (let col = 0; col < GRID_SIZE; col++) {
        let emptyRow = GRID_SIZE - 1;
        for (let row = GRID_SIZE - 1; row >= 0; row--) {
          if (newGrid[row][col].color !== '') {
            if (row !== emptyRow) {
              newGrid[emptyRow][col] = {
                ...newGrid[row][col],
                row: emptyRow,
              };
              newGrid[row][col] = {
                ...newGrid[row][col],
                color: '',
              };
            }
            emptyRow--;
          }
        }
      }

      // 生成新的方塊填充空位
      for (let col = 0; col < GRID_SIZE; col++) {
        for (let row = 0; row < GRID_SIZE; row++) {
          if (newGrid[row][col].color === '') {
            newGrid[row][col] = {
              id: `${row}-${col}-${Date.now()}-${Math.random()}`,
              color: COLORS[Math.floor(Math.random() * COLORS.length)],
              row,
              col,
            };
          }
        }
      }

      return { newGrid, matchCount: matches.length };
    },
    [findMatches]
  );

  // 處理連鎖消除
  const handleCascadingMatches = useCallback(
    async (currentGrid: Block[][]) => {
      setIsAnimating(true);
      let grid = currentGrid;
      let currentCombo = 0;
      let totalMatches = 0;

      while (true) {
        const { newGrid, matchCount } = removeMatchesAndDrop(grid);
        if (matchCount === 0) break;

        currentCombo++;
        totalMatches += matchCount;
        grid = newGrid;

        // 計算分數（有連鎖加成）
        const points = matchCount * 10 * currentCombo;
        setScore((prev) => prev + points);

        await new Promise((resolve) => setTimeout(resolve, 300));
        setGrid(grid);
      }

      setCombo(currentCombo);
      setTimeout(() => setCombo(0), 1000);
      setIsAnimating(false);
    },
    [removeMatchesAndDrop]
  );

  // 交換兩個方塊
  const swapBlocks = useCallback(
    (pos1: Position, pos2: Position) => {
      if (isAnimating) return;

      const newGrid = grid.map((row) => [...row]);
      const temp = { ...newGrid[pos1.row][pos1.col] };
      newGrid[pos1.row][pos1.col] = {
        ...newGrid[pos2.row][pos2.col],
        row: pos1.row,
        col: pos1.col,
      };
      newGrid[pos2.row][pos2.col] = {
        ...temp,
        row: pos2.row,
        col: pos2.col,
      };

      // 檢查交換後是否有匹配
      const matches = findMatches(newGrid);
      if (matches.length > 0) {
        setGrid(newGrid);
        setMoves((prev) => prev - 1);
        setTimeout(() => {
          handleCascadingMatches(newGrid);
        }, 200);
      } else {
        // 如果沒有匹配，交換回去
        setTimeout(() => {
          setGrid(grid);
        }, 200);
      }
      setSelectedBlock(null);
    },
    [grid, isAnimating, findMatches, handleCascadingMatches]
  );

  // 處理方塊點擊
  const handleBlockClick = useCallback(
    (row: number, col: number) => {
      if (isAnimating || gameOver) return;

      if (selectedBlock === null) {
        setSelectedBlock({ row, col });
      } else {
        const rowDiff = Math.abs(selectedBlock.row - row);
        const colDiff = Math.abs(selectedBlock.col - col);

        // 檢查是否相鄰
        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
          swapBlocks(selectedBlock, { row, col });
        } else {
          setSelectedBlock({ row, col });
        }
      }
    },
    [selectedBlock, isAnimating, gameOver, swapBlocks]
  );

  // 重置遊戲
  const resetGame = useCallback(() => {
    const newGrid = initializeGrid();
    setGrid(newGrid);
    setScore(0);
    setMoves(30);
    setGameOver(false);
    setSelectedBlock(null);
    setCombo(0);
  }, [initializeGrid]);

  // 初始化
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // 檢查遊戲結束
  useEffect(() => {
    if (moves <= 0 && !isAnimating) {
      setGameOver(true);
    }
  }, [moves, isAnimating]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Star className="w-10 h-10 text-yellow-400" />
            消方塊遊戲
            <Star className="w-10 h-10 text-yellow-400" />
          </h1>
          <p className="text-gray-300">點擊相鄰方塊交換，消除三個或以上相同顏色！</p>
        </div>

        <div className="bg-gray-900 bg-opacity-80 rounded-xl shadow-2xl p-6">
          {/* 遊戲狀態欄 */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-6">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 rounded-lg">
                <div className="text-sm text-white opacity-80">分數</div>
                <div className="text-2xl font-bold text-white">{score}</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 rounded-lg">
                <div className="text-sm text-white opacity-80">剩餘步數</div>
                <div className="text-2xl font-bold text-white">{moves}</div>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              重新開始
            </button>
          </div>

          {/* 連鎖提示 */}
          {combo > 1 && (
            <div className="text-center mb-4">
              <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full font-bold text-xl animate-bounce">
                🔥 {combo}x Combo! 🔥
              </div>
            </div>
          )}

          {/* 遊戲板 */}
          <div className="relative inline-block">
            <div
              className="grid gap-1 p-4 bg-gray-800 rounded-lg"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, ${BLOCK_SIZE}px)`,
              }}
            >
              {grid.map((row, rowIndex) =>
                row.map((block, colIndex) => (
                  <button
                    key={block.id}
                    onClick={() => handleBlockClick(rowIndex, colIndex)}
                    disabled={isAnimating}
                    className={`
                      w-[${BLOCK_SIZE}px] h-[${BLOCK_SIZE}px] rounded-lg
                      transition-all duration-200 transform
                      ${
                        selectedBlock?.row === rowIndex && selectedBlock?.col === colIndex
                          ? 'ring-4 ring-white scale-110'
                          : 'hover:scale-105'
                      }
                      ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}
                      shadow-lg hover:shadow-xl
                    `}
                    style={{
                      backgroundColor: block.color,
                      width: `${BLOCK_SIZE}px`,
                      height: `${BLOCK_SIZE}px`,
                    }}
                  />
                ))
              )}
            </div>

            {/* 遊戲結束覆蓋層 */}
            {gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 rounded-lg">
                <div className="text-center">
                  <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                  <p className="text-yellow-400 text-3xl font-bold mb-2">遊戲結束！</p>
                  <p className="text-white text-2xl mb-6">最終分數: {score}</p>
                  <button
                    onClick={resetGame}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-bold text-lg"
                  >
                    再玩一次
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 遊戲說明 */}
          <div className="mt-6 bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              遊戲說明
            </h3>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• 點擊一個方塊，再點擊相鄰的方塊進行交換</li>
              <li>• 當3個或以上相同顏色的方塊連成一線時會消除</li>
              <li>• 消除後會產生連鎖效果，連鎖越多分數越高！</li>
              <li>• 每次交換消耗1步，用完30步遊戲結束</li>
              <li>• 目標是在步數用完前獲得最高分數</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlockMatchingGame;
