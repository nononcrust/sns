"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ForgotPasswordForm = z.object({
  email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
});

export default function ForgotPasswordPage() {
  const resetPasswordMutation = authService.useResetPassword();

  const form = useForm({
    resolver: zodResolver(ForgotPasswordForm),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    if (resetPasswordMutation.isPending) return;

    resetPasswordMutation.mutate(
      { json: data },
      {
        onSuccess: () => {
          console.log("이메일을 보냈습니다.");
        },
      },
    );
  });

  return (
    <main className="mx-auto flex h-dvh max-w-[280px] flex-col items-center justify-center">
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
        <Form {...form}>
          <Form.Field
            name="email"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>이메일</Form.Label>
                <Form.Control>
                  <Input {...field} error={!!form.formState.errors.email} placeholder="이메일" />
                </Form.Control>
                <Form.Description>이메일을 입력해주세요.</Form.Description>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
          <div className="mt-4 flex w-full gap-2">
            <Button className="w-full" type="submit">
              비밀번호 재설정 이메일 보내기
            </Button>
          </div>
        </Form>
      </form>
    </main>
  );
}
