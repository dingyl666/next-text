"use client";

import { Button, Input } from "antd";
import { useState } from "react";
import Vditor from "vditor";

export default function AI() {
  const [question, setQuestion] = useState("");

  const request = async () => {
    const response = await fetch("/next/api/ai", {
      method: "POST",
      body: JSON.stringify({
        question,
      }),
    });
    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n\n"); // 按 SSE 块分割

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonString = line.slice(6); // 去掉 "data: "
          try {
            const parsed = JSON.parse(jsonString);
            result += parsed.data; // 拼接内容
            Vditor.preview(
              document.getElementById("ai-result") as HTMLDivElement,
              result,
              {
                mode: "light",
                anchor: 1,
                markdown: {
                  autoSpace: true,
                },
              }
            );
          } catch (e) {
            console.warn("Failed to parse JSON:", jsonString);
            continue;
          }
        }
      }
    }
  };
  return (
    <div className="flex flex-col items-center p-20 h-screen  mx-auto">
      <div className="max-w-3xl w-full bg-gray-100 p-4 mb-50 flex-1">
        <div id="ai-result" />
      </div>

      <div className="max-w-3xl w-full bg-gray-100 p-4 flex gap-2">
        <Input
          allowClear
          placeholder="请输入问题"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button type="primary" onClick={() => {
            request();
            setQuestion("");
        }}>
          发送
        </Button>
      </div>
    </div>
  );
}
