"use client";

import googleLogo from "@/assets/icons/google-logo.svg";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { route } from "@/constants/route";
import { testId } from "@/constants/test";
import { authService } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { HTTPError } from "ky";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
  password: z.string(),
});

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const loginWithGoogleMutation = authService.useLoginWithGoogle();
  const loginWithCredentialsMutation = authService.useLoginWithCredentials();

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    if (loginWithCredentialsMutation.isPending) return;

    loginWithCredentialsMutation.mutate(
      { json: data },
      {
        onSuccess: () => {
          router.push(redirect ?? route.home);
        },
        onError: (error) => {
          if (error instanceof HTTPError && error.response.status === 400) {
            toast.error("이메일 또는 비밀번호가 일치하지 않습니다.");
          }
        },
      },
    );
  });

  const onGoogleButtonClick = () => {
    if (loginWithGoogleMutation.isPending) return;

    loginWithGoogleMutation.mutate(
      {
        json: {
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

  const canSubmit =
    !loginWithCredentialsMutation.isPending && !loginWithCredentialsMutation.isSuccess;

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
                  <Input
                    {...field}
                    error={!!form.formState.errors.email}
                    placeholder="이메일"
                    data-testid={testId.emailInput}
                  />
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
                    data-testid={testId.passwordInput}
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
              variant="primary"
              type="submit"
              disabled={!canSubmit}
              data-testid={testId.loginFormSubmitButton}
            >
              로그인
            </Button>
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full border border-border bg-white"
              onClick={onGoogleButtonClick}
              data-testid={testId.googleLoginButton}
            >
              <img src={googleLogo.src} alt="구글" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-center">
              <p className="text-[13px] font-medium text-sub">
                계정이 없으신가요?
                <Link
                  className="ml-2 font-semibold text-main hover:underline"
                  href={route.auth.signup}
                >
                  회원가입
                </Link>
              </p>
            </div>
            <div className="flex justify-center">
              <p className="text-[13px] font-medium text-sub">
                비밀번호를 잊으셨나요?
                <Link
                  className="ml-2 font-semibold text-main hover:underline"
                  href={route.auth.forgotPassword}
                >
                  비밀번호 재설정
                </Link>
              </p>
            </div>
          </div>
        </form>
      </Form>
    </main>
  );
}
