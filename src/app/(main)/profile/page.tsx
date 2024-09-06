"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tab } from "@/components/ui/tab";
import { testId } from "@/constants/test";
import { useTab } from "@/hooks/use-tab";
import { profileService } from "@/services/profile";
import { ImageUploadDialog } from "./_components/image-upload-dialog";

export default function MyProfilePage() {
  const { data: userProfile } = profileService.useProfile();

  const tab = useTab("posts");

  if (!userProfile) return null;

  return (
    <main className="container min-h-dvh border-x border-border pt-12">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-[160px] w-[160px]">
          <Avatar.Image src={userProfile.profileImage ?? ""} />
          <Avatar.Fallback />
        </Avatar>
        <ImageUploadDialog
          trigger={
            <Button variant="outlined" data-testid={testId.profileImageDialogButton}>
              프로필 사진 변경
            </Button>
          }
        />
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