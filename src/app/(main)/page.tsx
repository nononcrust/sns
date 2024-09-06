"use client";

import { IntersectionObserver } from "@/components/shared/intersection-observer";
import { useSession } from "@/features/auth/use-session";
import { postService } from "@/services/post";
import { PostFeedItem } from "./_components/post-feed-item";
import { NewPost } from "./posts/_components/new-post";

export default function HomePage() {
  const {
    data: posts,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = postService.useInfinitePosts();

  const { session } = useSession();

  const onIntersect = () => {
    if (isFetchingNextPage) return;

    fetchNextPage();
  };

  return (
    <main className="container flex min-h-dvh w-full flex-col">
      <div className="flex flex-col divide-y divide-divider border-x border-border">
        <NewPost />
        <ul className="flex flex-col divide-y divide-divider">
          {posts?.map((post) => (
            <PostFeedItem
              key={post.id}
              postId={post.id}
              title={post.title}
              content={post.content}
              author={{
                id: post.author.id,
                nickname: post.author.nickname,
                profileImageUrl: post.author.profileImage,
                email: post.author.email,
              }}
              createdAt={post.createdAt.toString()}
              commentCount={post._count.comments}
              liked={!!session && post.likes.some((like) => like.userId === session.user.id)}
              likeCount={post.likes.length}
            />
          ))}
        </ul>
        {hasNextPage && <IntersectionObserver onIntersect={onIntersect} />}
      </div>
    </main>
  );
}
