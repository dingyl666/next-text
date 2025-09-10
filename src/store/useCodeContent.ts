import { create } from "zustand";

type Props = {
  aiCode: string;
  userCode:string;
};

type Action = {
  setAiCode: (code: string) => void;
  setUserCode: (code: string) => void;
};
const useCodeContent = create<Props & Action>()((set, get) => ({
  aiCode: "",
  userCode: "",
  setAiCode: (value) => set((state) => ({
    aiCode: value,
    userCode: state.userCode + '\n' + value , 
  })),
  setUserCode: (value) => set({ userCode: value }),
}));

export default useCodeContent;
