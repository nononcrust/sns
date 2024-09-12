"use client";

import { route } from "@/constants/route";
import { formatRelativeTime } from "@/lib/date";
import { EyeIcon, ImageIcon, MessageSquareMoreIcon } from "lucide-react";
import Link from "next/link";

interface PostListItemProps {
  postId: string;
  title: string;
  author: {
    nickname: string;
  };
  createdAt: string;
  commentCount: number;
  view: number;
  hasImage: boolean;
}

export const PostListItem = ({
  postId,
  title,
  author,
  createdAt,
  commentCount,
  view,
  hasImage,
}: PostListItemProps) => {
  return (
    <li className="flex flex-col">
      <Link className="hover:bg-hover flex px-page py-2" href={route.post.detail({ postId })}>
        <div className="flex flex-1 flex-col">
          <p className="inline-flex items-center text-[15px] font-semibold">
            {title}
            {hasImage && <ImageIcon className="ml-2 size-4 align-middle text-subtle" />}
          </p>
          <div className="flex items-center gap-2">
            <div className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-sub">
              <span>{author.nickname}</span>
              <span>{formatRelativeTime(createdAt)}</span>
              <EyeIcon className="size-4" />
              <span>{view}</span>
            </div>
          </div>
        </div>
        {commentCount > 0 && (
          <div className="flex items-center gap-1.5 text-subtle">
            <MessageSquareMoreIcon className="size-4 translate-y-[1px]" />
            <span className="text-[15px] text-sm font-medium">{commentCount}</span>
          </div>
        )}
      </Link>
    </li>
  );
};
