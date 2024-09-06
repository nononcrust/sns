"use client";

import { route } from "@/constants/route";
import { formatRelativeTime } from "@/lib/date";
import { EyeIcon, MessageSquareMoreIcon } from "lucide-react";
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
}

export const PostListItem = ({
  postId,
  title,
  author,
  createdAt,
  commentCount,
  view,
}: PostListItemProps) => {
  return (
    <li className="flex flex-col">
      <Link className="flex p-2 hover:bg-gray-50" href={route.post.detail({ postId })}>
        <div className="flex flex-1 flex-col">
          <p className="text-[15px] font-semibold">{title}</p>
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
          <div className="text-subtle flex items-center gap-1.5">
            <MessageSquareMoreIcon className="size-4 translate-y-[1px]" />
            <span className="text-[15px] text-sm font-medium">{commentCount}</span>
          </div>
        )}
      </Link>
    </li>
  );
};
