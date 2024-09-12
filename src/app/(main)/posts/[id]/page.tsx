"use client";

import { PostImage } from "@/components/shared/post-image";
import { PostMoreActionsDropdownMenu } from "@/components/shared/post-more-actions-dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { route } from "@/constants/route";
import { useSession } from "@/features/auth/use-session";
import { Editor } from "@/features/editor/editor";
import { formatDateTime } from "@/lib/date";
import { postService } from "@/services/post";
import copy from "copy-to-clipboard";
import { ChevronLeftIcon, EllipsisIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { CommentInput } from "./_components/comment-input";
import { CommentListItem } from "./_components/comment-list-item";
import { PostNotFoundFallback } from "./_components/post-not-found-fallback";

export default function PostDetailPage() {
  const { session } = useSession();

  const params = useParams<{ id: string }>();

  const postId = params.id;

  const { data: post, error } = postService.usePostDetail(postId);
  const { data: comments } = postService.useComments(postId);

  const copyPostLinkToClipboard = () => {
    copy(window.location.origin + route.post.detail({ postId }));
    toast("게시글 링크가 복사되었습니다.");
  };

  if (error) return <PostNotFoundFallback />;

  if (!post || !comments) return null;

  const isAuthor = session && session.user.id === post.author.id;

  return (
    <main className="container flex flex-col pb-16">
      <div className="flex min-h-dvh flex-col">
        <div className="mt-8 flex px-page">
          <Button asChild variant="outlined">
            <Link href={route.post.list}>
              <ChevronLeftIcon className="size-4 -translate-x-1" />
              목록으로
            </Link>
          </Button>
        </div>
        <div className="mt-8 flex flex-col px-page">
          <h1 className="text-2xl font-semibold">{post.title}</h1>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar asChild>
                <Link href={route.profile({ userId: post.author.id })}>
                  <Avatar.Image
                    src={post.author.profileImage}
                    alt={post.author.nickname + "의 프로필 이미지"}
                  />
                  <Avatar.Fallback />
                </Link>
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
            <PostMoreActionsDropdownMenu
              postId={postId}
              authorId={post.author.id}
              trigger={
                <button className="hover:bg-hover rounded-md p-1">
                  <EllipsisIcon className="size-4 text-sub" />
                </button>
              }
            />
          </div>
          <Editor className="mt-8" value={post.content} mode="view" />
          <div className="mt-8 flex flex-col gap-4">
            {post.images.map((image) => (
              <PostImage key={image.id} src={image.url} alt={image.alt} />
            ))}
          </div>
          <h2 className="mt-12 text-xl font-semibold">댓글 {comments.length}</h2>
          {session && <CommentInput className="mt-4" postId={postId} />}
          {comments.length > 0 && (
            <ul className="divide-y divide-border">
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
                  images={comment.images}
                  createdAt={comment.createdAt}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
