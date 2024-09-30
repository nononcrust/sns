"use client";

import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { route } from "@/constants/route";
import { postService } from "@/services/post";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PostListItem } from "./_components/post-list-item";

export default function PostListPage() {
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";

  const router = useRouter();

  const pathname = usePathname();

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", String(page));

    router.push(`${pathname}?${params.toString()}`);
  };

  const { data: postData } = postService.usePosts({
    page: page,
  });

  return (
    <main className="container flex min-h-dvh w-full flex-col pb-12">
      <div className="mt-12 flex justify-end px-page">
        <Button asChild variant="outlined">
          <Link href={route.post.create}>게시글 작성</Link>
        </Button>
      </div>
      <ul className="mt-4 flex flex-col divide-y divide-border">
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
            hasImage={post.images.length > 0}
          />
        ))}
      </ul>
      {postData && (
        <div className="mt-8 flex justify-center">
          <Pagination page={Number(page)} total={postData.total} onChange={onPageChange} />
        </div>
      )}
    </main>
  );
}
