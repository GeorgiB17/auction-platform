import { createContext, useContext } from "react";
import { useNow } from "../hooks/useNow.ts";

const NowContext = createContext<number>(0);

export function NowProvider({ children }: { children: React.ReactNode }) {
  const now = useNow();

  return (
    <NowContext.Provider value={now}>
      {children}
    </NowContext.Provider>
  );
}

export function useNowContext() {
  return useContext(NowContext);
}