"use client";

import { ZoomableImage } from "@/components/shared/zoomable-image";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { route } from "@/constants/route";
import { useSession } from "@/features/auth/use-session";
import { Editor } from "@/features/editor/editor";
import { formatRelativeTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import copy from "copy-to-clipboard";
import {
  EllipsisIcon,
  HeartIcon,
  LinkIcon,
  MessageSquareIcon,
  MessageSquareWarningIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

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

export const PostFeedItem = (props: PostFeedItemProps) => {
  const {
    postId,
    title,
    content,
    author,
    createdAt,
    liked: initialLiked,
    likeCount: initialLikeCount,
    commentCount,
    images,
  } = props;

  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const onLikeButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
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
          <MoreActionsDropdownMenu
            trigger={
              <button className="hover:bg-hover rounded-md p-1">
                <EllipsisIcon className="size-4 text-sub" />
              </button>
            }
            {...props}
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
      <div className="mt-4 flex justify-end gap-8">
        <button className="flex items-center gap-2 text-sub" onClick={onLikeButtonClick}>
          <HeartIcon className={cn("size-4", liked && "fill-red-500 stroke-red-500")} />
          <span className={cn("text-[13px]", liked && "text-red-500")}>{likeCount}</span>
        </button>
        <div className="flex items-center gap-2 text-sub">
          <MessageSquareIcon className="size-4" />
          <span className="text-[13px]">{commentCount}</span>
        </div>
      </div>
    </li>
  );
};

interface MoreActionsDropdownMenuProps extends PostFeedItemProps {
  trigger: React.ReactNode;
}

const MoreActionsDropdownMenu = ({ trigger, postId, author }: MoreActionsDropdownMenuProps) => {
  const { session } = useSession();

  const copyPostLinkToClipboard = () => {
    copy(window.location.origin + route.post.detail({ postId }));
    toast("게시글 링크가 복사되었습니다.");
  };

  const isAuthor = session && session.user.id === author.id;

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-[150px]" align="end" alignOffset={-12} sideOffset={8}>
        <DropdownMenu.Item className="flex justify-between" onClick={copyPostLinkToClipboard}>
          링크 복사하기
          <LinkIcon className="size-4" />
        </DropdownMenu.Item>
        {!isAuthor && (
          <DropdownMenu.Item className="flex justify-between text-error">
            신고하기
            <MessageSquareWarningIcon className="size-4" />
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
