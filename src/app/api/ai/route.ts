import OpenAI from "openai";
const DASHSCOPE_API_KEY = "sk-3dda658937b44b5eadc0aabe8fa8db65";
const openai = new OpenAI({
  // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
  apiKey: DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});
export async function POST(request: Request) {
    const { question } = await request.json();  
    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            const stream = await openai.chat.completions.create({
              model: 'qwen-max-latest',
              messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: question },
              ],
              stream: true, // 启用流式输出
            });
  
            // 逐个处理流式 chunk
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content;
              if (content) {
                // 发送数据到客户端 (SSE 格式)
                const text = `data: ${JSON.stringify({ data: content })}\n\n`;
                controller.enqueue(text);
              }
            }
          } catch (err) {
            // 错误也要通过流发送，避免断流
            const error = `data: ${JSON.stringify({ data: 'Error occurred' })}\n\n`;
            controller.enqueue(error);
          } finally {
            // 结束流
            controller.close();
          }
        },
      }),
      {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          // 使用 text/plain 或 text/event-stream
          // 注意：Safari 不支持 text/event-stream，所以用 text/plain 更兼容
        },
      }
    );
  }
