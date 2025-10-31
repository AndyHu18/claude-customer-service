import { useState } from 'react';
import { Delete } from 'lucide-react';

type Operator = '+' | '-' | '×' | '÷' | null;

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (nextOperator: Operator) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operator);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstValue: number, secondValue: number, op: Operator): number => {
    switch (op) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operator) {
      const newValue = calculate(previousValue, inputValue, operator);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleClearEntry = () => {
    setDisplay('0');
    setWaitingForOperand(false);
  };

  const handleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const handlePercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const buttons = [
    { label: 'C', onClick: handleClear, className: 'bg-red-500 hover:bg-red-600' },
    { label: 'CE', onClick: handleClearEntry, className: 'bg-orange-500 hover:bg-orange-600' },
    { label: '%', onClick: handlePercent, className: 'bg-gray-600 hover:bg-gray-700' },
    { label: '÷', onClick: () => handleOperator('÷'), className: 'bg-blue-500 hover:bg-blue-600' },
    { label: '7', onClick: () => handleNumber('7'), className: 'bg-gray-700 hover:bg-gray-600' },
    { label: '8', onClick: () => handleNumber('8'), className: 'bg-gray-700 hover:bg-gray-600' },
    { label: '9', onClick: () => handleNumber('9'), className: 'bg-gray-700 hover:bg-gray-600' },
    { label: '×', onClick: () => handleOperator('×'), className: 'bg-blue-500 hover:bg-blue-600' },
    { label: '4', onClick: () => handleNumber('4'), className: 'bg-gray-700 hover:bg-gray-600' },
    { label: '5', onClick: () => handleNumber('5'), className: 'bg-gray-700 hover:bg-gray-600' },
    { label: '6', onClick: () => handleNumber('6'), className: 'bg-gray-700 hover:bg-gray-600' },
    { label: '-', onClick: () => handleOperator('-'), className: 'bg-blue-500 hover:bg-blue-600' },
    { label: '1', onClick: () => handleNumber('1'), className: 'bg-gray-700 hover:bg-gray-600' },
    { label: '2', onClick: () => handleNumber('2'), className: 'bg-gray-700 hover:bg-gray-600' },
    { label: '3', onClick: () => handleNumber('3'), className: 'bg-gray-700 hover:bg-gray-600' },
    { label: '+', onClick: () => handleOperator('+'), className: 'bg-blue-500 hover:bg-blue-600' },
    { label: '±', onClick: handleSign, className: 'bg-gray-700 hover:bg-gray-600' },
    { label: '0', onClick: () => handleNumber('0'), className: 'bg-gray-700 hover:bg-gray-600' },
    { label: '.', onClick: handleDecimal, className: 'bg-gray-700 hover:bg-gray-600' },
    { label: '=', onClick: handleEquals, className: 'bg-green-500 hover:bg-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">計算器</h1>
          <p className="text-gray-400">簡單好用的小算盤</p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-2xl p-6">
          {/* 顯示螢幕 */}
          <div className="bg-gray-900 rounded-lg p-4 mb-6 border-4 border-gray-700">
            <div className="text-right">
              <div className="text-gray-500 text-sm mb-1 h-6">
                {previousValue !== null && operator && (
                  <span>{previousValue} {operator}</span>
                )}
              </div>
              <div className="text-white text-4xl font-bold break-all">
                {display}
              </div>
            </div>
          </div>

          {/* 按鈕網格 */}
          <div className="grid grid-cols-4 gap-3">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`${button.className} text-white text-2xl font-bold py-4 rounded-lg transition-colors shadow-lg active:scale-95 transform`}
              >
                {button.label}
              </button>
            ))}
          </div>

          {/* 說明 */}
          <div className="mt-6 bg-gray-700 rounded-lg p-4">
            <h3 className="text-white font-bold mb-2">功能說明</h3>
            <ul className="text-gray-300 space-y-1 text-sm">
              <li>• C: 清除所有</li>
              <li>• CE: 清除當前輸入</li>
              <li>• %: 百分比</li>
              <li>• ±: 正負號切換</li>
              <li>• 支援加減乘除四則運算</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
