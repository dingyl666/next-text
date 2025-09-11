import OpenAI from "openai";
const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;
const openai = new OpenAI({
  apiKey: DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

const systemContent = `
你是一个专业的开发人员，帮我写一个 vba。
使用 Logger 在关键节点输出日志方便掌握执行过程以及定位错误。注意，在必要的地方添加日志，如非必要就不要加。
Logger 对象有以下几个方法，直接使用不需要额外封装：
Logger.Action(log As String)    ' 输出正在执行的操作
Logger.Info(log As String)      ' 输出业务信息，方便用户掌握进度
Logger.Data(log As String)      ' 输出业务数据，和其它日志的区别是这个方法的输出不包含日期信息
Logger.Result(log As String)    ' 输出结果
Logger.Attention(log As String) ' 输出用户需要注意的内容，可能是用户初始化数据操作出错。比如处理选区内图片时 Selection 不包含需要操作的图片
Logger.Warning(log As String)   ' 输出业务的异常信息，可能是程序执行超出预期，需要用户及时介入确认问题原因
Logger.Error(log As String)     ' 输出业务的错误信息，需要用户介入才能正常执行
Logger.Fatal(log As String)     ' 输出业务的严重的错误信息，会弹出弹窗，一般不使用

这个 vba 的功能如下：

`;

interface Dto {
  question: string;
  user_add_contexts?: string[];
  user_id: number;
}

interface QueueItem {
  role: "user" | "assistant";
  message: string;
}
class LimitedQueue {
  items = [] as QueueItem[];
  limit = 3;

  enqueue(message: QueueItem) {
    if (this.items.length >= this.limit * 2) {
      // 移除最老的一轮对话（user + assistant）
      this.items.shift();
      if (this.items.length > 0 && this.items[0].role === "assistant") {
        this.items.shift(); // 移除对应的 assistant
      }
    }
    this.items.push(message);
  }

  getMessages(): QueueItem[] {
    return [...this.items];
  }
}

const MessageMap = new Map<number, LimitedQueue>();

type OpenAiMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;
export async function POST(request: Request) {
  const {
    question,
    user_add_contexts = [],
    user_id = 0,
  } = (await request.json()) as Dto;
  const userAddContextMessages = user_add_contexts.map((item) => {
    return {
      role: "user",
      content: `请分析以下代码：${item}`,
    };
  }) as OpenAiMessage[];

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          const id = Date.now();
          const contexts = MessageMap.get(user_id)?.items || [];
          const contextMessages = contexts.map((aa) => {
            return {
              role: aa.role,
              content: aa.message,
            };
          }) as OpenAiMessage[];
          const messages: OpenAiMessage[] = [
            { role: "system", content: systemContent },
            ...contextMessages,
            ...userAddContextMessages,
            { role: "user", content: question },
          ];
          console.log(messages, "messages");
          const stream = await openai.chat.completions.create({
            model: "qwen3-coder-plus",
            messages,
            stream: true,
          });

          if (MessageMap.has(user_id)) {
            const map = MessageMap.get(user_id)!;
            map.enqueue({ role: "user", message: question });
          } else {
            const queue = new LimitedQueue();
            queue.enqueue({ role: "user", message: question });
            MessageMap.set(user_id, queue);
          }
          let fullResponse = ""; // 收集完整回复
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content ?? "";
            if (content) {
              fullResponse += content;
              // 发送数据到客户端 (SSE 格式)
              const text = `data: ${JSON.stringify({
                data: content,
                id: id,
              })}\n\n`;
              controller.enqueue(text);
            }
          }
          // ✅ 流结束后，保存模型的回复
          if (MessageMap.has(user_id)) {
            MessageMap.get(user_id)!.enqueue({
              role: "assistant",
              message: fullResponse,
            });
          }
        } catch (err) {
          // 错误也要通过流发送，避免断流
          const error = `data: ${JSON.stringify({
            data: "Error occurred",
          })}\n\n`;
          controller.enqueue(error);
        } finally {
          // 结束流
          controller.close();
        }
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        // 使用 text/plain 或 text/event-stream
        // 注意：Safari 不支持 text/event-stream，所以用 text/plain 更兼容
      },
    }
  );
}
