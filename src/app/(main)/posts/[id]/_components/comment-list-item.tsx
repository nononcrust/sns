import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useSession } from "@/features/auth/use-session";
import { Editor } from "@/features/editor/editor";
import { useDialog } from "@/hooks/use-dialog";
import { formatRelativeTime } from "@/lib/date";
import { postService } from "@/services/post";
import { EllipsisIcon, MessageSquareWarningIcon, TrashIcon } from "lucide-react";

interface CommentListItemProps {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    nickname: string;
    profileImageUrl: string | null;
    email: string;
  };
  createdAt: string;
}

export const CommentListItem = (props: CommentListItemProps) => {
  const { content, author, createdAt } = props;

  return (
    <li className="flex gap-2 py-6">
      <Avatar>
        <Avatar.Image
          src={author.profileImageUrl ?? ""}
          alt={author.nickname + "의 프로필 이미지"}
        />
        <Avatar.Fallback />
      </Avatar>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2 text-[15px]">
          <span className="font-semibold">{author.nickname}</span>
          <span className="text-subtle text-[13px] font-medium">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
        <Editor mode="view" value={content} />
      </div>
      <div>
        <MoreActionsDropdownMenu
          trigger={
            <button className="rounded-md p-1 hover:bg-content">
              <EllipsisIcon className="size-4 text-sub" />
            </button>
          }
          {...props}
        />
      </div>
    </li>
  );
};

interface MoreActionsDropdownMenuProps extends CommentListItemProps {
  trigger: React.ReactNode;
}

const MoreActionsDropdownMenu = ({ trigger, author, id, postId }: MoreActionsDropdownMenuProps) => {
  const { session } = useSession();

  const isAuthor = session && author.id === session.user.id;

  const deleteConfirmDialog = useDialog();

  const deleteCommentMutation = postService.useDeleteComment();

  const onDeleteCommentButtonClick = () => {
    deleteConfirmDialog.open();
  };

  const onDeleteConfirm = () => {
    if (deleteCommentMutation.isPending) return;

    deleteCommentMutation.mutate({
      param: { id: postId, commentId: id },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-[150px]" align="end" alignOffset={-12}>
        {isAuthor && (
          <DropdownMenu.Item className="flex justify-between" onClick={onDeleteCommentButtonClick}>
            댓글 삭제하기
            <TrashIcon className="size-4" />
          </DropdownMenu.Item>
        )}
        {!isAuthor && (
          <DropdownMenu.Item className="flex justify-between text-error">
            신고하기
            <MessageSquareWarningIcon className="size-4" />
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
      <ConfirmDialog
        trigger={null}
        isOpen={deleteConfirmDialog.isOpen}
        onOpenChange={deleteConfirmDialog.onOpenChange}
        onConfirm={onDeleteConfirm}
      />
    </DropdownMenu>
  );
};
