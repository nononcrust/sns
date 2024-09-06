import { useSession } from "@/features/auth/use-session";
import { useDialog } from "@/hooks/use-dialog";
import { Slot } from "@radix-ui/react-slot";
import { LoginPromptDialog } from "./login-prompt-dialog";

export const ProtectedAction = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  const loginPromptDialog = useDialog();

  const onClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (!session) {
      event.preventDefault();
      loginPromptDialog.open();
    }
  };

  return (
    <>
      <Slot onClick={onClick}>{children}</Slot>
      <LoginPromptDialog
        isOpen={loginPromptDialog.isOpen}
        onOpenChange={loginPromptDialog.onOpenChange}
      />
    </>
  );
};
