"use client";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSession } from "@/features/auth/use-session";
import { profileService } from "@/services/profile";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function SettingsPage() {
  const { session } = useSession();

  const { data: profile } = profileService.useProfile();

  const { theme, setTheme } = useTheme();

  if (!session || !profile || !profile.settings) return null;

  return (
    <main className="container min-h-dvh border-x border-border px-page pt-12">
      <PageTitle>계정 설정</PageTitle>
      <SettingGroup title="계정">
        <SettingItem title="닉네임" description={session.user.nickname}>
          <Button variant="outlined">변경하기</Button>
        </SettingItem>
        <SettingItem title="이메일 주소" description={session.user.email}>
          <Button variant="outlined">변경하기</Button>
        </SettingItem>
      </SettingGroup>
      <SettingGroup title="일반">
        <SettingItem title="테마">
          <Select value={theme} onChange={(event) => setTheme(event.target.value)}>
            <Select.Item value="light">밝은 테마</Select.Item>
            <Select.Item value="dark">어두운 테마</Select.Item>
            <Select.Item value="system">시스템 설정</Select.Item>
          </Select>
        </SettingItem>
      </SettingGroup>
      <SettingGroup title="알림">
        <NotificationSettings
          followNotification={profile.settings.followNotification}
          commentNotification={profile.settings.commentNotification}
          likeNotification={profile.settings.likeNotification}
        />
      </SettingGroup>
      <SettingGroup title="기타">
        <SettingItem title="회원 탈퇴">
          <Button variant="errorOutlined">삭제하기</Button>
        </SettingItem>
      </SettingGroup>
    </main>
  );
}

const PageTitle = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="text-2xl font-semibold">{children}</h1>;
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="pb-4 text-xl font-semibold">{children}</h2>;
};

interface SettingGroupProps {
  title: string;
  children: React.ReactNode;
}

const SettingGroup = ({ title, children }: SettingGroupProps) => {
  return (
    <div className="py-6">
      <SectionTitle>{title}</SectionTitle>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
};

interface SettingItemProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SettingItem = ({ title, description, children }: SettingItemProps) => {
  return (
    <div className="flex h-12 items-center justify-between">
      <div className="flex flex-col gap-1">
        <h3 className="font-medium">{title}</h3>
        {description && <p className="text-sm text-sub">{description}</p>}
      </div>
      {children}
    </div>
  );
};

interface NotificationSettingsProps {
  followNotification: boolean;
  commentNotification: boolean;
  likeNotification: boolean;
}

const NotificationSettings = ({
  followNotification: initialFollowNotification,
  commentNotification: initialCommentNotification,
  likeNotification: initialLikeNotification,
}: NotificationSettingsProps) => {
  const [followNotification, setFollowNotification] = useState(initialFollowNotification);
  const [commentNotification, setCommentNotification] = useState(initialCommentNotification);
  const [likeNotification, setLikeNotification] = useState(initialLikeNotification);

  const onFollowNotificationChange = async (checked: boolean) => {
    setFollowNotification(checked);
  };

  const onCommentNotificationChange = async (checked: boolean) => {
    setCommentNotification(checked);
  };

  const onLikeNotificationChange = async (checked: boolean) => {
    setLikeNotification(checked);
  };

  return (
    <>
      <SettingItem title="새로운 팔로워" description="새로운 팔로워가 생겼을 때 알림을 받습니다.">
        <Switch checked={followNotification} onChange={onFollowNotificationChange} />
      </SettingItem>
      <SettingItem title="새로운 댓글" description="새로운 댓글이 달렸을 때 알림을 받습니다.">
        <Switch checked={commentNotification} onChange={onCommentNotificationChange} />
      </SettingItem>
      <SettingItem title="새로운 좋아요" description="게시글에 좋아요가 눌렸을 때 알림을 받습니다.">
        <Switch checked={likeNotification} onChange={onLikeNotificationChange} />
      </SettingItem>
    </>
  );
};
