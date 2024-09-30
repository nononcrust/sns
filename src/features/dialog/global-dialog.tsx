import { LoginPromptDialog } from "@/components/shared/login-prompt-dialog";
import { useDialog } from "@/hooks/use-dialog";
import { createContextFactory } from "@/lib/context";
import { useState } from "react";
import { createStore, useStore } from "zustand";

type GlobalDialogStore = {
  loginPromptDialog: ReturnType<typeof useDialog>;
};

const createGlobalDialogContextStore = (initialState: GlobalDialogStore) => {
  return createStore<GlobalDialogStore>(() => initialState);
};

type GlobalDialogContextValue = ReturnType<typeof createGlobalDialogContextStore>;

const [GlobalDialogContext, useGlobalDialogContext] =
  createContextFactory<GlobalDialogContextValue>("GlobalDialog");

export const GlobalDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const loginPromptDialog = useDialog();

  const initialState: GlobalDialogStore = {
    loginPromptDialog,
  };

  const [store] = useState(() => createGlobalDialogContextStore(initialState));

  return (
    <GlobalDialogContext.Provider value={store}>
      {children}
      <LoginPromptDialog
        isOpen={loginPromptDialog.isOpen}
        onOpenChange={loginPromptDialog.onOpenChange}
      />
    </GlobalDialogContext.Provider>
  );
};

export const useGlobalDialog = <T,>(selector: (store: GlobalDialogStore) => T): T => {
  const globalDialogStoreContext = useGlobalDialogContext();

  return useStore(globalDialogStoreContext, selector);
};
