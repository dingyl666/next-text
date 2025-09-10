// app/page.tsx
import ChatPanel from './components/ChatPanel';
import CodeEditor from './components/Editor';

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/2">
        <ChatPanel />
      </div>
      <div className="w-1/2 p-4">
        <h2 className="text-xl font-semibold mb-2">代码编辑器</h2>
        <CodeEditor />
      </div>
    </div>
  );
}