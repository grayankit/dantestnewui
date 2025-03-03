"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/app/lib/redux/store";
// import { userCustomStore } from '../user/anilistUserLoginOptions'
import { userCustomStore } from "./lib/user/anilistUserLoginOptions";

import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    storeRef.current = userCustomStore;
  }
  return (
    <NextUIProvider>
      <Provider store={storeRef.current}>{children}</Provider>)
    </NextUIProvider>
  );
}
