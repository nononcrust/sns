"use client";

import { PostMoreActionsDropdownMenu } from "@/components/shared/post-more-actions-dropdown-menu";
import { ZoomableImage } from "@/components/shared/zoomable-image";
import { Avatar } from "@/components/ui/avatar";
import { route } from "@/constants/route";
import { Editor } from "@/features/editor/editor";
import { useRequireLogin } from "@/hooks/use-require-login";
import { useToggleLike } from "@/hooks/use-toggle-like";
import { formatRelativeTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import { EllipsisIcon, HeartIcon, MessageSquareIcon } from "lucide-react";
import Link from "next/link";

interface PostFeedItemProps {
  postId: string;
  title: string;
  content: string;
  likeCount: number;
  liked: boolean;
  commentCount: number;
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

export const PostFeedItem = ({
  postId,
  title,
  content,
  author,
  createdAt,
  liked: initialLiked,
  likeCount: initialLikeCount,
  commentCount,
  images,
}: PostFeedItemProps) => {
  const { requireLogin } = useRequireLogin();

  const { isLiked, likeCount, toggleLike } = useToggleLike({
    initialIsLiked: initialLiked,
    initialLikeCount: initialLikeCount,
    postId,
  });

  const onLikeToggleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    requireLogin(toggleLike);
  };

  return (
    <li className="flex flex-col px-page py-6">
      <div className="flex w-full">
        <div className="flex flex-1 items-center gap-2">
          <Avatar className="size-10" asChild>
            <Link className="rounded-full" href={route.profile({ userId: author.id })}>
              <Avatar.Image
                src={author.profileImageUrl}
                alt={author.nickname + "의 프로필 이미지"}
              />
              <Avatar.Fallback />
            </Link>
          </Avatar>
          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 text-[15px] font-semibold">
              {author.nickname}

              <span className="text-[13px] font-normal text-sub">{author.email}</span>
            </span>
            <span className="text-[13px] text-sub">{formatRelativeTime(createdAt)}</span>
          </div>
        </div>
        <div>
          <PostMoreActionsDropdownMenu
            postId={postId}
            authorId={author.id}
            trigger={
              <button className="rounded-md p-1 hover:bg-hover">
                <EllipsisIcon className="size-4 text-sub" />
              </button>
            }
          />
        </div>
      </div>
      <Link href={route.post.detail({ postId })} className="mt-6 text-xl font-bold hover:underline">
        {title}
      </Link>
      <Editor className="mt-4" mode="view" value={content} />
      <div className="mt-4">
        {images.map((image) => (
          <ZoomableImage
            className="rounded-3xl"
            key={image.id}
            src={image.url}
            alt={image.alt ?? "게시글 이미지"}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-6">
        <button
          className="flex items-center gap-2 rounded-md px-2 py-0.5 text-sub hover:bg-hover"
          onClick={onLikeToggleButtonClick}
        >
          <HeartIcon
            className={cn("size-4", isLiked && "animate-appear fill-red-500 stroke-red-500")}
          />
          <span className={cn("text-[13px]", isLiked && "text-red-500")}>{likeCount}</span>
        </button>
        <div className="flex items-center gap-2 text-sub">
          <MessageSquareIcon className="size-4" />
          <span className="text-[13px]">{commentCount}</span>
        </div>
      </div>
    </li>
  );
};
