import { useState } from 'react';
import { Calculator as CalculatorIcon, Gamepad2, Home } from 'lucide-react';
import Calculator from './Calculator';
import SnakeGame from './SnakeGame';

type AppMode = 'menu' | 'calculator' | 'snake';

function App() {
  const [mode, setMode] = useState<AppMode>('menu');

  if (mode === 'calculator') {
    return (
      <div>
        <button
          onClick={() => setMode('menu')}
          className="fixed top-4 left-4 flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors z-50"
        >
          <Home className="w-4 h-4" />
          返回主選單
        </button>
        <Calculator />
      </div>
    );
  }

  if (mode === 'snake') {
    return (
      <div>
        <button
          onClick={() => setMode('menu')}
          className="fixed top-4 left-4 flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors z-50"
        >
          <Home className="w-4 h-4" />
          返回主選單
        </button>
        <SnakeGame />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">娛樂中心</h1>
          <p className="text-gray-300 text-lg">選擇你想要使用的應用</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 計算器卡片 */}
          <button
            onClick={() => setMode('calculator')}
            className="group bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-8 hover:scale-105 transition-all duration-300 transform hover:shadow-blue-500/50"
          >
            <div className="flex flex-col items-center text-white">
              <div className="bg-white/10 p-6 rounded-full mb-6 group-hover:bg-white/20 transition-colors">
                <CalculatorIcon className="w-16 h-16" />
              </div>
              <h2 className="text-3xl font-bold mb-3">計算器</h2>
              <p className="text-blue-200 text-center">
                簡單好用的小算盤
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">加減乘除</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">百分比</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">正負號</span>
              </div>
            </div>
          </button>

          {/* 貪食蛇遊戲卡片 */}
          <button
            onClick={() => setMode('snake')}
            className="group bg-gradient-to-br from-green-600 to-green-800 rounded-2xl shadow-2xl p-8 hover:scale-105 transition-all duration-300 transform hover:shadow-green-500/50"
          >
            <div className="flex flex-col items-center text-white">
              <div className="bg-white/10 p-6 rounded-full mb-6 group-hover:bg-white/20 transition-colors">
                <Gamepad2 className="w-16 h-16" />
              </div>
              <h2 className="text-3xl font-bold mb-3">貪食蛇遊戲</h2>
              <p className="text-green-200 text-center">
                經典的貪食蛇小遊戲
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">方向鍵控制</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">計分系統</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">暫停功能</span>
              </div>
            </div>
          </button>
        </div>

        {/* 底部資訊 */}
        <div className="mt-12 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-white font-bold mb-3">使用說明</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="text-gray-300 text-sm">
                <p className="font-semibold text-blue-400 mb-2">計算器</p>
                <ul className="space-y-1">
                  <li>• 點擊數字和運算符進行計算</li>
                  <li>• C 清除所有，CE 清除當前輸入</li>
                  <li>• 支援小數點和負數運算</li>
                </ul>
              </div>
              <div className="text-gray-300 text-sm">
                <p className="font-semibold text-green-400 mb-2">貪食蛇遊戲</p>
                <ul className="space-y-1">
                  <li>• 使用方向鍵控制蛇的移動方向</li>
                  <li>• 吃到食物增加分數和長度</li>
                  <li>• 空白鍵暫停/繼續遊戲</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
