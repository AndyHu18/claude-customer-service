import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const messageSchema = z.object({
  message: z.string().min(1),
  context: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional()
});

const systemPrompt = `你是一位專業的客服代表。請遵循以下準則：
- 保持專業、友善且有同理心
- 提供具體且實用的解決方案
- 如果不確定答案，誠實告知並提供可能的參考方向
- 使用正體中文回答
- 回答要簡潔但完整
- 適時使用條列式回答增加清晰度
- 對於技術問題，提供步驟式指引
- 確保回答符合公司政策和法規要求`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, context = [] } = messageSchema.parse(req.body);

    const messages: Anthropic.MessageParam[] = [
      ...context.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: message }
    ];

    const completion = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages,
    });

    res.json({ 
      response: completion.content[0].text,
      usage: completion.usage
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: '發生錯誤，請稍後再試' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});