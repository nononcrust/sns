import { useSession } from "@/features/auth/use-session";
import { useGlobalDialog } from "@/features/dialog/global-dialog";

export const useRequireLogin = () => {
  const { loginPromptDialog } = useGlobalDialog();
  const { session } = useSession();

  const requireLogin = (onLoggedIn: () => void) => {
    if (!session) {
      loginPromptDialog.onOpenChange(true);
    }

    if (session) {
      onLoggedIn();
    }
  };

  return {
    requireLogin,
  };
};
