// lib/ai-tools.ts
import fs from "fs/promises";
import path from "path";
import { ensureDir } from "../../../../lib/utils";

const WORKSPACE = process.env.WORKSPACE_ROOT || "./workspace";

/**
 * 确保路径安全，防止目录遍历攻击
 */
function safeJoin(...segments: string[]): string {
  const fullPath = path.resolve(path.join(WORKSPACE, ...segments));
  if (!fullPath.startsWith(path.resolve(WORKSPACE))) {
    throw new Error("Access denied: outside workspace");
  }
  return fullPath;
}

/**
 * 工具定义（供 AI 调用）
 */
export const toolDefinitions = [
  {
    type: "function" as const,
    function: {
      name: "read_file",
      description: "读取指定路径的文件内容",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: '文件路径，如 "main.py"' },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "write_file",
      description: "将内容写入指定文件，自动创建目录",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "文件路径" },
          content: { type: "string", description: "文件内容" },
        },
        required: ["path", "content"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "list_directory",
      description: "列出目录中的文件和子目录",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "目录路径，默认为根目录" },
        },
      },
    },
  },
] as const;

/**
 * 工具执行器
 */
export const toolFunctions = {
  async read_file({ path }: { path: string }) {
    try {
      const fullPath = safeJoin(path);
      const content = await fs.readFile(fullPath, "utf-8");
      return { content };
    } catch (err: any) {
      return { error: err.message };
    }
  },

  // lib/ai-tools.ts
  async write_file({
    path: filePath,
    content,
  }: {
    path: string;
    content: string;
  }) {
    try {
      const fullPath = safeJoin(filePath);
      await ensureDir(fullPath); // ← 修改：直接传 fullPath，ensureDir 内部处理
      await fs.writeFile(fullPath, content, "utf-8");
      return { success: true, path: filePath };
    } catch (err: any) {
      return { error: err.message };
    }
  },

  async list_directory({ path = "." }: { path?: string }) {
    try {
      const fullPath = safeJoin(path);
      const items = await fs.readdir(fullPath, { withFileTypes: true });
      const files = items
        .filter((item) => item.isFile())
        .map((item) => item.name);
      const dirs = items
        .filter((item) => item.isDirectory())
        .map((item) => item.name + "/");
      return { files, directories: dirs };
    } catch (err: any) {
      return { error: err.message };
    }
  },
};
