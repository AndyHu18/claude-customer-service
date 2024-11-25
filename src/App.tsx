import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, RefreshCcw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setChat(prev => [...prev, { role: 'user', content: userMessage }]);
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          context: chat.slice(-6) // Send last 6 messages for context
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setChat(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setChat(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，發生錯誤。請稍後再試。' 
      }]);
    } finally {
      setLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const resetChat = () => {
    if (window.confirm('確定要清除所有對話紀錄嗎？')) {
      setChat([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-4">
        <header className="text-center py-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bot className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800">智能客服助手</h1>
          </div>
          <p className="text-gray-600">由 Claude AI 提供專業支援服務</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg min-h-[600px] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="text-sm text-gray-600">
              {chat.length > 0 ? `${chat.length} 則對話` : '開始新對話'}
            </div>
            {chat.length > 0 && (
              <button
                onClick={resetChat}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                清除對話
              </button>
            )}
          </div>

          <div 
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-4"
          >
            {chat.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>您好！我是您的智能客服助手。</p>
                <p>有任何問題都可以詢問我。</p>
              </div>
            )}
            
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="flex items-start max-w-[80%] gap-2">
                  {msg.role === 'assistant' && (
                    <Bot className="w-6 h-6 text-blue-500 mt-1" />
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && (
                    <User className="w-6 h-6 text-blue-500 mt-1" />
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start max-w-[80%] gap-2">
                  <Bot className="w-6 h-6 text-blue-500 mt-1" />
                  <div className="p-3 rounded-lg bg-gray-100">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="輸入您的問題..."
                className="flex-1 px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              按 Enter 發送訊息，Shift + Enter 換行
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;