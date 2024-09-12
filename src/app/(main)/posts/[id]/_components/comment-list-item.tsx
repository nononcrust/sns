import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Image } from "@/components/ui/image";
import { route } from "@/constants/route";
import { useSession } from "@/features/auth/use-session";
import { Editor } from "@/features/editor/editor";
import { useDialog } from "@/hooks/use-dialog";
import { formatRelativeTime } from "@/lib/date";
import { postService } from "@/services/post";
import { EllipsisIcon, MessageSquareWarningIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

interface CommentListItemProps {
  id: string;
  postId: string;
  content: string;
  images: {
    id: string;
    url: string;
    alt: string | null;
  }[];
  author: {
    id: string;
    nickname: string;
    profileImageUrl: string | null;
    email: string;
  };
  createdAt: string;
}

export const CommentListItem = (props: CommentListItemProps) => {
  const { content, author, images, createdAt } = props;

  return (
    <li className="flex gap-2 py-6">
      <Avatar asChild>
        <Link href={route.profile({ userId: author.id })}>
          <Avatar.Image src={author.profileImageUrl} alt={author.nickname + "의 프로필 이미지"} />
          <Avatar.Fallback />
        </Link>
      </Avatar>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2 text-[15px]">
          <span className="font-semibold">{author.nickname}</span>
          <span className="text-[13px] font-medium text-subtle">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
        <Editor mode="view" value={content} />
        {images.map((image) => (
          <Image
            className="mt-2 w-1/2 rounded-2xl"
            key={image.id}
            src={image.url}
            alt={image.alt ?? "댓글 이미지"}
          />
        ))}
      </div>
      <div>
        <MoreActionsDropdownMenu
          trigger={
            <button className="hover:bg-hover rounded-md p-1">
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
          <DropdownMenu.Item className="flex justify-between" onClick={deleteConfirmDialog.open}>
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
        title="댓글을 삭제할까요?"
        isOpen={deleteConfirmDialog.isOpen}
        onOpenChange={deleteConfirmDialog.onOpenChange}
        onConfirm={onDeleteConfirm}
      />
    </DropdownMenu>
  );
};
