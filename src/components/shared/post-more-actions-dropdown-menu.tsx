import { route } from "@/constants/route";
import { useSession } from "@/features/auth/use-session";
import { useDialog } from "@/hooks/use-dialog";
import copy from "copy-to-clipboard";
import { LinkIcon, MessageSquareWarningIcon, PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { DropdownMenu } from "../ui/dropdown-menu";
import { ConfirmDialog } from "./confirm-dialog";
import { ReportDialog } from "./report-dialog";

interface PostMoreActionsDropdownMenuProps {
  trigger: React.ReactNode;
  postId: string;
  authorId: string;
}

export const PostMoreActionsDropdownMenu = ({
  trigger,
  postId,
  authorId,
}: PostMoreActionsDropdownMenuProps) => {
  const { session } = useSession();

  const deleteConfirmDialog = useDialog();
  const reportDialog = useDialog();

  const copyPostLinkToClipboard = () => {
    copy(window.location.origin + route.post.detail({ postId }));
    toast("게시글 링크가 복사되었습니다.");
  };

  const onDeleteConfirm = () => {
    // TODO: 게시글 삭제 API 호출
  };

  const isAuthor = session && session.user.id === authorId;

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-[150px]" align="end" alignOffset={-12} sideOffset={8}>
        {isAuthor && (
          <>
            <DropdownMenu.Item className="flex justify-between" asChild>
              <Link href={route.post.edit({ postId })}>
                게시글 수정하기
                <PencilIcon className="size-4" />
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item className="flex justify-between" onClick={deleteConfirmDialog.open}>
              게시글 삭제하기
              <TrashIcon className="size-4" />
            </DropdownMenu.Item>
          </>
        )}
        <DropdownMenu.Item className="flex justify-between" onClick={copyPostLinkToClipboard}>
          링크 복사하기
          <LinkIcon className="size-4" />
        </DropdownMenu.Item>
        {!isAuthor && (
          <DropdownMenu.Item
            className="flex justify-between text-error"
            onClick={reportDialog.open}
          >
            신고하기
            <MessageSquareWarningIcon className="size-4" />
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
      <ReportDialog
        id={postId}
        isOpen={reportDialog.isOpen}
        onOpenChange={reportDialog.onOpenChange}
        type="post"
      />
      <ConfirmDialog
        title="게시글을 삭제할까요?"
        isOpen={deleteConfirmDialog.isOpen}
        onOpenChange={deleteConfirmDialog.onOpenChange}
        onConfirm={onDeleteConfirm}
      />
    </DropdownMenu>
  );
};
