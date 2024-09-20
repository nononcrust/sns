import { LoginPromptDialog } from "@/components/shared/login-prompt-dialog";
import { useDialog } from "@/hooks/use-dialog";
import { createContextFactory } from "@/lib/context";

type GlobalDialogContextValue = {
  loginPromptDialog: ReturnType<typeof useDialog>;
};

const [GlobalDialogContext, useGlobalDialogContext] =
  createContextFactory<GlobalDialogContextValue>("GlobalDialog");

export const GlobalDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const loginPromptDialog = useDialog();

  return (
    <GlobalDialogContext.Provider
      value={{
        loginPromptDialog,
      }}
    >
      {children}
      <LoginPromptDialog
        isOpen={loginPromptDialog.isOpen}
        onOpenChange={loginPromptDialog.onOpenChange}
      />
    </GlobalDialogContext.Provider>
  );
};

export const useGlobalDialog = () => {
  return useGlobalDialogContext();
};
