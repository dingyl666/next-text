import { create } from "zustand";


export type UserMessageContext = {
  content:string,
  startLine:number,
  endLine:number,
}
type Props = {
  userMessageContexts: UserMessageContext[];
};

type Action = {
  addUserMessageContext: (context: UserMessageContext) => void;
  removeUserMessageContext: (content: string) => void;
  clearUserMessageContexts: () => void;
};
const useUserMessageContexts = create<Props & Action>()((set, get) => ({
  userMessageContexts: [],
  addUserMessageContext: (context: UserMessageContext) =>
    set((state) => ({
      userMessageContexts: [...state.userMessageContexts, context],
    })),
  removeUserMessageContext: (content: string) =>
    set((state) => ({
      userMessageContexts: state.userMessageContexts.filter(
        (c) => c.content !== content
      ),
    })),
  clearUserMessageContexts: () => set({ userMessageContexts: [] }),
}));

export default useUserMessageContexts;
