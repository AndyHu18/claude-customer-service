# 娛樂中心 Entertainment Hub

一個包含計算器和貪食蛇遊戲的網頁應用程式。

A web application featuring a calculator and snake game.

---

## 🌟 功能特色 Features

### 🧮 計算器 Calculator
- 基本四則運算（加減乘除）
- 小數點運算
- 百分比計算
- 正負號切換
- 清除功能

### 🐍 貪食蛇遊戲 Snake Game
- 經典貪食蛇玩法
- 方向鍵控制
- 計分系統
- 暫停/繼續功能
- 遊戲結束偵測

---

## 📸 螢幕截圖 Screenshots

### 主選單 Main Menu
- 選擇計算器或貪食蛇遊戲

### 計算器 Calculator
- 功能完整的計算器介面

### 貪食蛇遊戲 Snake Game
- Canvas 繪製的遊戲場景

---

## 🚀 快速開始 Quick Start

### Windows 使用者
請參閱：[**WINDOWS使用教學.md**](./WINDOWS使用教學.md)

這份文件包含：
- ✅ 完整的安裝步驟
- ✅ 詳細的使用說明
- ✅ 常見問題解答
- ✅ 專為新手設計

### 其他作業系統

#### 前置需求 Prerequisites
- Node.js (v18 或以上)
- npm 或 yarn

#### 安裝步驟 Installation

1. **克隆專案 Clone the repository**
   ```bash
   git clone https://github.com/AndyHu18/claude-customer-service.git
   cd claude-customer-service
   ```

2. **安裝套件 Install dependencies**
   ```bash
   npm install
   ```

3. **啟動開發伺服器 Start development server**
   ```bash
   npm run dev
   ```

4. **打開瀏覽器 Open browser**
   ```
   http://localhost:5173
   ```

---

## 📁 專案結構 Project Structure

```
claude-customer-service/
├── src/
│   ├── App.tsx           # 主應用程式（選單系統）
│   ├── Calculator.tsx    # 計算器元件
│   ├── SnakeGame.tsx     # 貪食蛇遊戲元件
│   ├── main.tsx          # 應用程式入口
│   └── index.css         # 全域樣式
├── index.html            # HTML 模板
├── package.json          # 專案設定
└── README.md            # 專案說明
```

---

## 🛠️ 技術棧 Tech Stack

- **框架 Framework**: React 18 + TypeScript
- **建置工具 Build Tool**: Vite
- **樣式 Styling**: Tailwind CSS
- **圖示 Icons**: Lucide React
- **後端 Backend**: Express.js (預留)

---

## 📝 指令說明 Available Scripts

| 指令 Command | 說明 Description |
|--------------|------------------|
| `npm run dev` | 啟動開發伺服器 Start development server |
| `npm run build` | 建置生產版本 Build for production |
| `npm run start` | 啟動生產伺服器 Start production server |

---

## 🎮 使用說明 Usage Guide

### 計算器 Calculator

**基本操作 Basic Operations:**
- 點擊數字和運算符進行計算
- `C` = 清除所有
- `CE` = 清除當前輸入
- `%` = 百分比
- `±` = 正負號切換

**範例 Example:**
```
計算 5 + 3:
1. 點擊 [5]
2. 點擊 [+]
3. 點擊 [3]
4. 點擊 [=]
結果: 8
```

### 貪食蛇遊戲 Snake Game

**控制方式 Controls:**
- `↑` `↓` `←` `→` 方向鍵控制移動
- `Space` 空白鍵暫停/繼續

**遊戲規則 Rules:**
- 吃到紅色食物 = +10 分
- 撞牆或咬到自己 = 遊戲結束

---

## ❓ 常見問題 FAQ

**Q: 如何返回主選單？**
A: 點擊左上角的「返回主選單」按鈕

**Q: 方向鍵沒反應？**
A: 確保瀏覽器視窗有焦點（點擊一下遊戲畫面）

**Q: 如何關閉應用程式？**
A: 在終端機按 `Ctrl + C` 或直接關閉瀏覽器

---

## 🔄 更新專案 Update Project

```bash
git pull origin claude/add-small-feature-011CUecnkNtBgzxa2xnzwcTr
npm install
```

---

## 📄 授權 License

此專案僅供學習使用。

This project is for educational purposes only.

---

## 🤝 貢獻 Contributing

歡迎提出問題或建議！

Feel free to submit issues or suggestions!

---

## 📧 聯絡 Contact

如有任何問題，請透過 GitHub Issues 聯絡。

For any questions, please contact via GitHub Issues.

---

**祝你使用愉快！Enjoy! 🎉**
