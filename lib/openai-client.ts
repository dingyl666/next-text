// lib/openai-client.ts
import OpenAI from 'openai';
const DASHSCOPE_API_KEY = "sk-3dda658937b44b5eadc0aabe8fa8db65";
export const openai = new OpenAI({
  apiKey: DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  defaultHeaders: {
    'X-DashScope-Api-Key': DASHSCOPE_API_KEY!
  }
});