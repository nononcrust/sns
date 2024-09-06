"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { route } from "@/constants/route";
import { Editor } from "@/features/editor/editor";
import { formatDateTime } from "@/lib/date";
import { postService } from "@/services/post";
import { ChevronLeftIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CommentInput } from "./_components/comment-input";
import { CommentListItem } from "./_components/comment-list-item";
import { PostNotFoundFallback } from "./_components/post-not-found-fallback";

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();

  const postId = params.id;

  const { data: post, error } = postService.usePostDetail(postId);
  const { data: comments } = postService.useComments(postId);

  if (error) return <PostNotFoundFallback />;

  if (!post || !comments) return null;

  return (
    <main className="container flex flex-col pb-16">
      <div className="flex min-h-dvh flex-col">
        <div className="px-page mt-8 flex">
          <Button asChild variant="outlined">
            <Link href={route.post.list}>
              <ChevronLeftIcon className="size-4 -translate-x-1" />
              목록으로
            </Link>
          </Button>
        </div>
        <div className="px-page mt-8 flex flex-col">
          <h1 className="text-2xl font-semibold">{post.title}</h1>
          <div className="mt-6 flex items-center gap-2">
            <Avatar>
              <Avatar.Image src={post.author.profileImage ?? ""} />
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">{post.author.nickname}</span>
              <div className="flex items-center gap-2 text-[13px] text-sub">
                <span>{formatDateTime(post.createdAt.toString())}</span>
                <span className="flex items-center gap-1">
                  <EyeIcon className="size-4" />
                  {post.view}
                </span>
              </div>
            </div>
          </div>
          <Editor className="mt-8" value={post.content} mode="view" />
          <h2 className="mt-12 text-xl font-semibold">댓글 {comments.length}</h2>
          <CommentInput className="mt-4" postId={postId} />
          {comments.length > 0 && (
            <ul className="divide-y divide-divider">
              {comments.map((comment) => (
                <CommentListItem
                  key={comment.id}
                  id={comment.id}
                  postId={comment.postId}
                  content={comment.content}
                  author={{
                    id: comment.author.id,
                    email: comment.author.email,
                    nickname: comment.author.nickname,
                    profileImageUrl: comment.author.profileImage,
                  }}
                  createdAt={new Date().toISOString()}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
