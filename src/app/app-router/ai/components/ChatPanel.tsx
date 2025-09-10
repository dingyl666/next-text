// components/ChatPanel.tsx
"use client";

import { useState } from "react";
import RenderMd from "./RenderMd";
import { Button, Flex, Input, Upload } from "antd";
import useUserMessageContexts from "@/store/useUserMessageContexts";
import "./index.css";
export default function ChatPanel() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; id: number }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { userMessageContexts, removeUserMessageContext } =
    useUserMessageContexts();

  const request = async (question: string) => {
    setLoading(true);
    const response = await fetch("/next/api/ai", {
      method: "POST",
      body: JSON.stringify({
        question,
        user_add_contexts: userMessageContexts.map(aa => aa.content),
      }),
    });
    if (!response.body) return;
    setLoading(false);
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n\n"); // 按 SSE 块分割

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonString = line.slice(6); // 去掉 "data: "
          try {
            const parsed = JSON.parse(jsonString);
            result += parsed.data; // 拼接内容

            const id = parsed.id;
            setMessages((preMessage) => {
              const findIndex = preMessage.findIndex((m) => m.id === id);
              if (findIndex === -1) {
                preMessage.push({ role: "assistant", content: result, id: id });
              } else {
                preMessage[findIndex].content = result;
              }
              return [...preMessage];
            });
          } catch (e) {
            console.warn("Failed to parse JSON:", jsonString);
            continue;
          }
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMsg, id: Date.now() },
    ]);
    setInput("");
    setLoading(true);

    await request(userMsg);
    return;
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-xl font-bold mb-4">AI 编程助手</h2>
      <div className="flex-1 overflow-y-auto space-y-4 mb-10">
        {/* [
          { role: "assistant", content: "你好，我是AI编程助手，有什么可以帮你的吗？", id: Date.now() },
          { role: "user", content: "你好，我是用户，有什么可以帮你的吗？", id: Date.now() },
          { role: "assistant", content: "你好，我是AI编程助手，有什么可以帮你的吗？", id: Date.now() },
          { role: "user", content: "你好，我是用户，有什么可以帮你的吗？", id: Date.now() },
        ] */}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-3xl ${
              m.role === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100"
            }`}
          >
            <strong>{m.role === "user" ? "你" : "AI"}:</strong>
            <RenderMd domId={"ai-result-" + i} data={m.content} />
            {/* <p className="whitespace-pre-wrap mt-1">{m.content}</p> */}
          </div>
        ))}
        {loading && <p>AI 正在思考...</p>}
      </div>
      <Upload
        className="no-preview"
        fileList={userMessageContexts.map((item) => ({
          uid: item.content, // 修复：uid 必须为 string 类型
          name: `(${item.startLine}-${item.endLine})`,
          fileName: `(${item.startLine}-${item.endLine})${item.content}`,
          url: item.content,
          status: "done",
        }))}
        onRemove={async (item) => {
          removeUserMessageContext(item.uid);
        }}
      />
      <Flex gap={2} className="mt-4">
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 6 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="例如：写一个快速排序"
          onPressEnter={handleSubmit}
        />
        <Button
          type={"primary"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
          onClick={handleSubmit}
        >
          发送
        </Button>
      </Flex>
    </div>
  );
}
