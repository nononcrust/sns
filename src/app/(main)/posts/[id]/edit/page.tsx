"use client";

import { postService } from "@/services/post";
import { useParams } from "next/navigation";
import { PostForm } from "../../_components/post-form";

export default function PostEditPage() {
  const params = useParams<{ id: string }>();
  const postId = params.id;

  const { data: post } = postService.usePostDetail(postId);

  if (!post) return null;

  return (
    <PostForm
      mode="edit"
      defaultValues={{
        title: post.title,
        content: post.content,
      }}
    />
  );
}
