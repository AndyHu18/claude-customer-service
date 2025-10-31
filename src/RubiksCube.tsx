import { useState } from 'react';
import { Shuffle, RotateCcw } from 'lucide-react';

// 定義顏色
const COLORS = {
  white: 'bg-white',
  yellow: 'bg-yellow-400',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
};

type Color = keyof typeof COLORS;

// 初始化魔術方塊狀態（6個面，每面9個方塊）
const createInitialCube = () => ({
  front: Array(9).fill('white') as Color[],
  back: Array(9).fill('yellow') as Color[],
  left: Array(9).fill('orange') as Color[],
  right: Array(9).fill('red') as Color[],
  top: Array(9).fill('blue') as Color[],
  bottom: Array(9).fill('green') as Color[],
});

type CubeState = ReturnType<typeof createInitialCube>;

function RubiksCube() {
  const [cube, setCube] = useState<CubeState>(createInitialCube());
  const [moves, setMoves] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 旋轉上層（順時針）
  const rotateTop = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCube((prev) => {
      const newCube = { ...prev };

      // 旋轉頂面本身
      newCube.top = rotateFaceClockwise(prev.top);

      // 旋轉周圍的頂層
      const temp = [prev.front[0], prev.front[1], prev.front[2]];
      newCube.front = [...prev.left.slice(0, 3), ...prev.front.slice(3)];
      newCube.left = [...prev.back.slice(0, 3), ...prev.left.slice(3)];
      newCube.back = [...prev.right.slice(0, 3), ...prev.back.slice(3)];
      newCube.right = [...temp, ...prev.right.slice(3)];

      return newCube;
    });
    setMoves((m) => m + 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // 旋轉中層（順時針）
  const rotateMiddle = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCube((prev) => {
      const newCube = { ...prev };

      const temp = [prev.front[3], prev.front[4], prev.front[5]];
      newCube.front = [
        ...prev.front.slice(0, 3),
        ...prev.left.slice(3, 6),
        ...prev.front.slice(6),
      ];
      newCube.left = [
        ...prev.left.slice(0, 3),
        ...prev.back.slice(3, 6),
        ...prev.left.slice(6),
      ];
      newCube.back = [
        ...prev.back.slice(0, 3),
        ...prev.right.slice(3, 6),
        ...prev.back.slice(6),
      ];
      newCube.right = [
        ...prev.right.slice(0, 3),
        ...temp,
        ...prev.right.slice(6),
      ];

      return newCube;
    });
    setMoves((m) => m + 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // 旋轉底層（順時針）
  const rotateBottom = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCube((prev) => {
      const newCube = { ...prev };

      // 旋轉底面本身
      newCube.bottom = rotateFaceClockwise(prev.bottom);

      // 旋轉周圍的底層
      const temp = [prev.front[6], prev.front[7], prev.front[8]];
      newCube.front = [...prev.front.slice(0, 6), ...prev.right.slice(6)];
      newCube.right = [...prev.right.slice(0, 6), ...prev.back.slice(6)];
      newCube.back = [...prev.back.slice(0, 6), ...prev.left.slice(6)];
      newCube.left = [...prev.left.slice(0, 6), ...temp];

      return newCube;
    });
    setMoves((m) => m + 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // 旋轉左列（順時針看左面）
  const rotateLeft = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCube((prev) => {
      const newCube = { ...prev };

      // 旋轉左面本身
      newCube.left = rotateFaceClockwise(prev.left);

      // 旋轉相關的列
      const temp = [prev.front[0], prev.front[3], prev.front[6]];
      newCube.front = [
        prev.bottom[0],
        prev.front[1],
        prev.front[2],
        prev.bottom[3],
        prev.front[4],
        prev.front[5],
        prev.bottom[6],
        prev.front[7],
        prev.front[8],
      ];
      newCube.bottom = [
        prev.back[8],
        prev.bottom[1],
        prev.bottom[2],
        prev.back[5],
        prev.bottom[4],
        prev.bottom[5],
        prev.back[2],
        prev.bottom[7],
        prev.bottom[8],
      ];
      newCube.back = [
        prev.back[0],
        prev.back[1],
        prev.top[6],
        prev.back[3],
        prev.back[4],
        prev.top[3],
        prev.back[6],
        prev.back[7],
        prev.top[0],
      ];
      newCube.top = [
        temp[0],
        prev.top[1],
        prev.top[2],
        temp[1],
        prev.top[4],
        prev.top[5],
        temp[2],
        prev.top[7],
        prev.top[8],
      ];

      return newCube;
    });
    setMoves((m) => m + 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // 旋轉右列（順時針看右面）
  const rotateRight = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCube((prev) => {
      const newCube = { ...prev };

      // 旋轉右面本身
      newCube.right = rotateFaceClockwise(prev.right);

      // 旋轉相關的列
      const temp = [prev.front[2], prev.front[5], prev.front[8]];
      newCube.front = [
        prev.front[0],
        prev.front[1],
        prev.top[2],
        prev.front[3],
        prev.front[4],
        prev.top[5],
        prev.front[6],
        prev.front[7],
        prev.top[8],
      ];
      newCube.top = [
        prev.top[0],
        prev.top[1],
        prev.back[6],
        prev.top[3],
        prev.top[4],
        prev.back[3],
        prev.top[6],
        prev.top[7],
        prev.back[0],
      ];
      newCube.back = [
        prev.bottom[8],
        prev.back[1],
        prev.back[2],
        prev.bottom[5],
        prev.back[4],
        prev.back[5],
        prev.bottom[2],
        prev.back[7],
        prev.back[8],
      ];
      newCube.bottom = [
        prev.bottom[0],
        prev.bottom[1],
        temp[0],
        prev.bottom[3],
        prev.bottom[4],
        temp[1],
        prev.bottom[6],
        prev.bottom[7],
        temp[2],
      ];

      return newCube;
    });
    setMoves((m) => m + 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // 輔助函數：順時針旋轉一個面
  const rotateFaceClockwise = (face: Color[]): Color[] => {
    return [face[6], face[3], face[0], face[7], face[4], face[1], face[8], face[5], face[2]];
  };

  // 打亂魔術方塊
  const shuffle = () => {
    if (isAnimating) return;
    const rotations = [rotateTop, rotateMiddle, rotateBottom, rotateLeft, rotateRight];
    let shuffleCount = 0;

    const doShuffle = () => {
      if (shuffleCount < 20) {
        const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
        randomRotation();
        shuffleCount++;
        setTimeout(doShuffle, 100);
      }
    };

    doShuffle();
  };

  // 重置
  const reset = () => {
    if (isAnimating) return;
    setCube(createInitialCube());
    setMoves(0);
  };

  // 渲染一個面
  const renderFace = (face: Color[], title: string) => (
    <div className="flex flex-col items-center">
      <div className="text-white text-sm font-semibold mb-2">{title}</div>
      <div className="grid grid-cols-3 gap-1 bg-gray-800 p-2 rounded-lg">
        {face.map((color, index) => (
          <div
            key={index}
            className={`w-8 h-8 md:w-10 md:h-10 ${COLORS[color]} border-2 border-gray-900 rounded transition-all duration-300`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 p-4 flex flex-col items-center justify-center">
      <div className="max-w-6xl w-full">
        {/* 標題和計數器 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            魔術方塊
          </h1>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 inline-block border border-white/20">
            <span className="text-white text-xl">
              步數: <span className="font-bold text-yellow-300">{moves}</span>
            </span>
          </div>
        </div>

        {/* 魔術方塊展示 */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 左側面 */}
            <div className="flex justify-center md:justify-end items-center">
              {renderFace(cube.left, '左面')}
            </div>

            {/* 中間列（上、前、下） */}
            <div className="flex flex-col items-center gap-6">
              {renderFace(cube.top, '上面')}
              {renderFace(cube.front, '前面')}
              {renderFace(cube.bottom, '下面')}
            </div>

            {/* 右側面和後面 */}
            <div className="flex flex-col md:flex-col items-center gap-6">
              {renderFace(cube.right, '右面')}
              {renderFace(cube.back, '後面')}
            </div>
          </div>

          {/* 控制按鈕 */}
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-white font-semibold text-lg mb-2">旋轉控制</h3>
            </div>

            {/* 水平旋轉 */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <button
                onClick={rotateTop}
                disabled={isAnimating}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100"
              >
                旋轉上層
              </button>
              <button
                onClick={rotateMiddle}
                disabled={isAnimating}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100"
              >
                旋轉中層
              </button>
              <button
                onClick={rotateBottom}
                disabled={isAnimating}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100"
              >
                旋轉底層
              </button>
            </div>

            {/* 垂直旋轉 */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <button
                onClick={rotateLeft}
                disabled={isAnimating}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100"
              >
                旋轉左列
              </button>
              <button
                onClick={rotateRight}
                disabled={isAnimating}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100"
              >
                旋轉右列
              </button>
            </div>
          </div>
        </div>

        {/* 功能按鈕 */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={shuffle}
            disabled={isAnimating}
            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
          >
            <Shuffle className="w-5 h-5" />
            打亂方塊
          </button>
          <button
            onClick={reset}
            disabled={isAnimating}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            重置
          </button>
        </div>

        {/* 說明 */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-bold text-lg mb-3">遊戲說明</h3>
          <ul className="text-gray-300 space-y-2">
            <li>• 點擊按鈕旋轉魔術方塊的不同層和列</li>
            <li>• 目標是讓每一面都恢復成單一顏色</li>
            <li>• 使用「打亂方塊」來隨機打亂魔術方塊</li>
            <li>• 步數計數器會記錄你的旋轉次數</li>
            <li>• 點擊「重置」可以恢復到初始狀態</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RubiksCube;
