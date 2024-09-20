"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { IntersectionObserver } from "@/components/shared/intersection-observer";
import { PostFeedItem } from "@/components/shared/post-feed-item";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tab } from "@/components/ui/tab";
import { useSession } from "@/features/auth/use-session";
import { useRequireLogin } from "@/hooks/use-require-login";
import { useTab } from "@/hooks/use-tab";
import { userService } from "@/services/user";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const [followed, setFollowed] = useState(false);

  const { requireLogin } = useRequireLogin();

  const params = useParams<{ id: string }>();

  const tab = useTab("posts");

  const userId = params.id;

  const { data: user, error } = userService.useUserDetail(userId);

  const { session } = useSession();

  if (error) return <UserNotFoundFallback />;

  if (!user) return null;

  const isMe = session && session.user.id === user.id;

  const toggleFollow = () => {
    setFollowed((prev) => !prev);
  };

  const onFollowButtonClick = () => {
    requireLogin(toggleFollow);
  };

  return (
    <main className="container min-h-dvh border-x border-border pt-12">
      <div className="flex items-center justify-between gap-4 px-page">
        <Avatar className="size-24">
          <Avatar.Image src={user.profileImage} alt="프로필 이미지" />
          <Avatar.Fallback />
        </Avatar>
        <div className="flex flex-1 flex-col">
          <h1 className="text-2xl font-semibold">{user.nickname}</h1>
          <h2 className="text-sub">{user.email}</h2>
        </div>
        {!isMe && (
          <Button
            variant={followed ? "outlined" : "primary"}
            className="rounded-full px-3"
            onClick={onFollowButtonClick}
          >
            {followed ? "언팔로우" : "팔로우"}
          </Button>
        )}
      </div>
      {user.bio && <Bio content={user.bio} />}
      <Tab value={tab.value} onChange={tab.onChange}>
        <Tab.List className="mt-8">
          <Tab.Item value="posts">작성글</Tab.Item>
          <Tab.Item value="comments">댓글</Tab.Item>
        </Tab.List>
        <Tab.Content value="posts">
          <UserPostFeed userId={userId} />
        </Tab.Content>
      </Tab>
    </main>
  );
}

const UserNotFoundFallback = () => {
  return <main className="flex h-dvh items-center justify-center">없는 유저입니다.</main>;
};

interface UserPostFeedProps {
  userId: string;
}

const UserPostFeed = ({ userId }: UserPostFeedProps) => {
  const {
    data: posts,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = userService.useInfiniteUserPosts(userId);

  const onIntersect = () => {
    if (isFetchingNextPage) return;

    fetchNextPage();
  };

  if (!posts) return null;

  if (posts.length === 0) {
    return <EmptyState className="mt-32" description="작성한 글이 없어요." />;
  }

  return (
    <div>
      <ul className="flex flex-col divide-y divide-border">
        {posts.map((post) => (
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
  );
};

interface BioProps {
  content: string;
}

const Bio = ({ content }: BioProps) => {
  return (
    <div className="px-page py-6">
      <p className="mt-2 text-[15px] text-sub">{content}</p>
    </div>
  );
};
