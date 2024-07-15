"use client";

import GoogleLogo from "@/assets/icons/google-logo.svg";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { route } from "@/constants/route";
import { authService } from "@/services/auth";
import { ERROR_CODE, isApiError } from "@/services/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
  password: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
});

export default function SignupPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupWithCredentialsMutation = authService.useSignupWithCredentials();
  const signupWithGoogleMutation = authService.useSignupWithGoogle();

  const onSubmit = form.handleSubmit((data) => {
    if (signupWithCredentialsMutation.isPending) return;

    signupWithCredentialsMutation.mutate(
      { body: data },
      {
        onSuccess: () => {
          console.log("가입 성공");
        },
        onError: (error: unknown) => {
          if (isAxiosError(error) && isApiError(error.response?.data)) {
            if (error.response.data.code === ERROR_CODE.EMAIL_ALREADY_EXISTS) {
              toast.error("이미 존재하는 이메일입니다.");
            }
          }
        },
      },
    );
  });

  const onGoogleButtonClick = () => {
    if (signupWithGoogleMutation.isPending) return;

    signupWithGoogleMutation.mutate(
      {
        body: {
          redirect: redirect,
        },
      },
      {
        onSuccess: (data) => {
          router.push(data.url);
        },
      },
    );
  };

  return (
    <main className="mx-auto flex h-dvh max-w-[280px] flex-col items-center justify-center">
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
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
          <Form.Field
            name="password"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>비밀번호</Form.Label>
                <Form.Control>
                  <Input
                    {...field}
                    type="password"
                    error={!!form.formState.errors.password}
                    placeholder="비밀번호"
                  />
                </Form.Control>
                <Form.Description>비밀번호를 입력해주세요.</Form.Description>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
          <div className="mt-4 flex w-full gap-2">
            <Button
              className="w-full"
              type="submit"
              disabled={signupWithCredentialsMutation.isPending}
            >
              가입하기
            </Button>
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full border transition-colors hover:bg-gray-50"
              onClick={onGoogleButtonClick}
            >
              <GoogleLogo />
            </button>
          </div>
          <div className="flex justify-center">
            <p className="text-[13px] font-medium text-sub">
              이미 계정이 있으신가요?
              <Link
                className="ml-2 font-semibold text-blue-400 hover:underline"
                href={route.auth.login}
              >
                로그인
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </main>
  );
}
