import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthenticatedSession } from "@/features/auth/use-session";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ProfileEditDialogProps {
  trigger: React.ReactNode;
}

export const ProfileEditDialog = ({ trigger }: ProfileEditDialogProps) => {
  return (
    <Dialog>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Content className="w-[520px]">
        <Content />
      </Dialog.Content>
    </Dialog>
  );
};

const formSchema = z.object({
  nickname: z.string().min(2).max(20),
  bio: z.string(),
  link: z.string().url().optional(),
});

const Content = () => {
  const { session } = useAuthenticatedSession();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: session.user.nickname,
      bio: session.user.bio ?? "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className="flex flex-col" onSubmit={onSubmit}>
      <Form {...form}>
        <Dialog.Header>
          <Dialog.Title>프로필 수정하기</Dialog.Title>
          <Dialog.Description className="sr-only">프로필을 수정해주세요.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="my-6 flex flex-col gap-4">
          <Form.Field
            name="nickname"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>닉네임</Form.Label>
                <Form.Control>
                  <Input placeholder="닉네임을 입력해주세요." {...field} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
          <Form.Field
            name="bio"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>소개</Form.Label>
                <Form.Control>
                  <Textarea
                    className="min-h-24"
                    placeholder="소개 문구를 입력해주세요."
                    {...field}
                  />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
        </Dialog.Body>
        <Dialog.Footer className="justify-end">
          <Button>저장하기</Button>
        </Dialog.Footer>
      </Form>
    </form>
  );
};
