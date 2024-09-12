"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tab } from "@/components/ui/tab";
import { useSession } from "@/features/auth/use-session";
import { useTab } from "@/hooks/use-tab";
import { userService } from "@/services/user";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const [followed, setFollowed] = useState(false);

  const params = useParams<{ id: string }>();

  const tab = useTab("posts");

  const userId = params.id;

  const { data: user, error } = userService.useUserDetail(userId);

  const { session } = useSession();

  if (error) return <UserNotFoundFallback />;

  if (!user) return null;

  const isMe = session && session.user.id === user.id;

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
            onClick={() => setFollowed((prev) => !prev)}
          >
            {followed ? "언팔로우" : "팔로우"}
          </Button>
        )}
      </div>
      <Tab value={tab.value} onChange={tab.onChange}>
        <Tab.List className="mt-8">
          <Tab.Item value="posts">작성글 14</Tab.Item>
          <Tab.Item value="comments">댓글 287</Tab.Item>
        </Tab.List>
        <Tab.Content value="posts">
          <EmptyState className="mt-32" description="작성한 글이 없어요." />
        </Tab.Content>
      </Tab>
    </main>
  );
}

const UserNotFoundFallback = () => {
  return <main className="flex h-dvh items-center justify-center">없는 유저입니다.</main>;
};
