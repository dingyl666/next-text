// components/Editor.tsx
"use client";

import useUserMessageContexts, {
  UserMessageContext,
} from "@/store/useUserMessageContexts";
import { Button, message, Popover, Tooltip } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { EditorDidMount, monaco } from "react-monaco-editor";
import useCodeContent from "@/store/useCodeContent";

// 动态导入，并关闭 SSR
const MonacoEditor = dynamic(() => import("react-monaco-editor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>, // 可选加载状态
});

const editorDidMount: EditorDidMount = (editor, monaco) => {
  editor.focus();

  // 注册 VBA 关键字高亮
  monaco.languages.register({ id: "vb" });
  monaco.languages.setMonarchTokensProvider("vb", {
    defaultToken: "",
    ignoreCase: true,
    tokenizer: {
      root: [
        // 关键字
        [
          /\b(Sub|Function|End Sub|End Function|Dim|Set|If|Then|Else|ElseIf|End If|For|Next|Do|Loop|While|Wend|Select|Case|End Select|With|End With|On Error|Resume|Exit|Call|Private|Public|Optional|ByVal|ByRef|As|New|Nothing|True|False|Not|And|Or|Xor|To|Step|Each|In|Type|Enum|Property|Let|Get|ReDim|Preserve|Class|End Class)\b/i,
          "keyword",
        ],

        // 内置函数
        [
          /\b(MsgBox|InputBox|Debug\.Print|Range|Cells|Worksheets|Workbooks|ActiveWorkbook|ActiveSheet|Selection|Application|ThisWorkbook|Sheets|CreateObject|IsEmpty|IsNull|IsNumeric|IsDate|CStr|CInt|CLng|CDbl|CDate|CBool|CByte|CCur|CVDate|Left|Right|Mid|Len|InStr|Replace|Split|Join|Trim|LCase|UCase|Format)\b/i,
          "predefined",
        ],

        // 注释
        [/'.*$/, "comment"],
        [/REM.*$/, "comment"],

        // 字符串
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [
          /"/,
          {
            token: "string.quote",
            bracket: "@open",
            next: "@string",
          },
        ],

        // 数字
        [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
        [/&H[0-9a-fA-F]+/, "number.hex"],
        [/\d+/, "number"],

        // 标识符
        [/@[a-zA-Z_]\w*/, "annotation"],
        [/[a-zA-Z_\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]*/, "identifier"],
      ],

      string: [
        [/[^\\"]+/, "string"],
        [
          /"/,
          {
            token: "string.quote",
            bracket: "@close",
            next: "@pop",
          },
        ],
      ],
    },
  });
};

export default function CodeEditor() {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState<UserMessageContext>({
    content: "",
    startLine: 0,
    endLine: 0,
  });
  const { addUserMessageContext } = useUserMessageContexts();
  const { setUserCode, userCode } = useCodeContent();

  return (
    <div className="h-full border border-gray-300 rounded">
      {/* 受控的 Popover */}
      {popoverVisible && (
        <Popover
          open={true}
          content={
            <div style={{ maxWidth: 300 }}>
              <p className="overflow-y-auto max-h-[260px]">
                {selectedText.content}
              </p>
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  addUserMessageContext({
                    content: selectedText.content,
                    startLine: selectedText.startLine,
                    endLine: selectedText.endLine,
                  });
                  setPopoverVisible(false);
                }}
              >
                添加到上下文
              </Button>
            </div>
          }
          styles={{ root: { position: "fixed", ...popoverPosition } }}
          arrow={false}
        >
          <span
            style={{
              position: "absolute",
              ...popoverPosition,
              width: 0,
              height: 0,
            }}
          />
        </Popover>
      )}
      <MonacoEditor
        language="vb"
        theme="vs"
        value={userCode}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          selectOnLineNumbers: true,
          wordWrap: "on",
          folding: true,
          renderLineHighlight: "all",
          suggestOnTriggerCharacters: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
        onChange={(val) => {
          setUserCode(val);
        }}
        editorDidMount={(editor, monaco) => {
          editorDidMount(editor, monaco);
          setUserCode(editor.getValue());
          // 获取编辑器 DOM 容器并绑定 mouseup 事件
          const editorDom = editor.getDomNode();
          if (editorDom) {
            editorDom.addEventListener("mouseup", () => {
              const selection = editor.getSelection();

              // 检查是否有实际选中内容
              if (selection && !selection.isEmpty()) {
                const model = editor.getModel();
                const startLine = selection.startLineNumber; // 起始行号（行号从 1 开始）
                const endLine = selection.endLineNumber; // 结束行号

                if (model) {
                  const selectedText = model.getValueInRange(selection);
                  setSelectedText({
                    content: selectedText,
                    startLine: startLine,
                    endLine: endLine,
                  });
                  // 计算选区位置，用于定位 popover
                  const startCoord = editor.getScrolledVisiblePosition(
                    selection.getStartPosition()
                  );
                  const editorDom = editor.getDomNode();

                  if (startCoord && editorDom) {
                    const editorRect = editorDom.getBoundingClientRect();
                    setPopoverPosition({
                      top: startCoord.top + editorRect.top - 40, // 在选区上方 40px
                      left: startCoord.left + editorRect.left,
                    });
                  }
                  setPopoverVisible(true);
                }
              } else {
                setPopoverVisible(false); // 无选中时隐藏
              }
            });
          }
        }}
      />
    </div>
  );
}
