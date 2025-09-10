// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { openai } from '../../../../lib/openai-client';
import { toolDefinitions, toolFunctions } from '../ai/tools';
import { Message } from '../../../../types';
// 内存会话存储（生产环境可用 Redis）
const sessions = new Map<string, Message[]>();

export async function POST(req: NextRequest) {
  const { sessionId = 'default', message } = await req.json();

  // 初始化会话
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  const session = sessions.get(sessionId)!;
  session.push({ id: Date.now().toString(), role: 'user', content: message });

  try {
    const response = await openai.chat.completions.create({
      model: 'qwen3-coder-plus',
      messages: session as any,
      tools: toolDefinitions,
      tool_choice: 'auto'
    });

    const assistantMessage = response.choices[0].message;
    const content: string[] = [];

    // 处理工具调用
    if (assistantMessage.tool_calls) {
      for (const call of assistantMessage.tool_calls) {
        const func = (toolFunctions as any)[call.function.name];
        if (func) {
          try {
            const args = JSON.parse(call.function.arguments);
            const result = await func(args);
            content.push(
              `[工具执行] ${call.function.name}(${JSON.stringify(args)}) → ${JSON.stringify(result)}`
            );
          } catch (err: any) {
            content.push(`[执行失败] ${err.message}`);
          }
        }
      }
    } else {
      content.push(assistantMessage.content || '无响应');
    }

    // 保存 AI 回复
    session.push({
      id: Date.now().toString(),
      role: 'assistant',
      content: content.join('\n')
    });

    return NextResponse.json({ content: content.join('\n') });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}