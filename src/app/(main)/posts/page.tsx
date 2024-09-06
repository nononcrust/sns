"use client";

import { ProtectedAction } from "@/components/shared/protected-action";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { route } from "@/constants/route";
import { useSession } from "@/features/auth/use-session";
import { postService } from "@/services/post";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PostListItem } from "./_components/post-list-item";

export default function PostListPage() {
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";

  const { data: postData } = postService.usePosts({
    page: page,
  });

  const { session } = useSession();

  return (
    <main className="container flex min-h-dvh w-full flex-col pb-12">
      <div className="mt-12 flex justify-end">
        <ProtectedAction>
          <Button asChild variant="outlined">
            <Link href={route.post.create}>게시글 작성</Link>
          </Button>
        </ProtectedAction>
      </div>
      <ul className="mt-4 flex flex-col divide-y divide-divider">
        {postData?.posts.map((post) => (
          <PostListItem
            key={post.id}
            postId={post.id}
            title={post.title}
            author={{
              nickname: post.author.nickname,
            }}
            createdAt={post.createdAt.toString()}
            commentCount={post._count.comments}
            view={post.view}
          />
        ))}
      </ul>
      {postData && (
        <div className="mt-8 flex justify-center">
          <Pagination page={Number(page)} total={postData.total} onChange={() => {}} />
        </div>
      )}
    </main>
  );
}
