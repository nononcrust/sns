"use client";

import { IntersectionObserver } from "@/components/shared/intersection-observer";
import { postService } from "@/services/post";
import { PostFeedItem } from "../../components/shared/post-feed-item";
import { NewPost } from "./posts/_components/new-post";

export default function HomePage() {
  const {
    data: posts,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = postService.useInfinitePosts();

  const onIntersect = () => {
    if (isFetchingNextPage) return;

    fetchNextPage();
  };

  return (
    <main className="container flex min-h-dvh w-full flex-col">
      <div className="flex flex-col divide-y divide-border border-x border-border">
        <NewPost />
        <ul className="flex flex-col divide-y divide-border">
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
              images={post.images.map((image) => ({
                id: image.id,
                url: image.url,
                alt: image.alt,
              }))}
              createdAt={post.createdAt.toString()}
              commentCount={post._count.comments}
              liked={post.isLiked}
              likeCount={post._count.likes}
            />
          ))}
        </ul>
        {hasNextPage && <IntersectionObserver onIntersect={onIntersect} />}
      </div>
    </main>
  );
}
