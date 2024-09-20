"use client";

import googleLogo from "@/assets/icons/google-logo.svg";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { route } from "@/constants/route";
import { GoogleReCaptchaProvider } from "@/lib/recaptcha";
import { authService } from "@/services/auth";
import { recaptchaService } from "@/services/recaptcha";
import { ErrorCode } from "@/services/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { HTTPError } from "ky";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export default function SignupPage() {
  return (
    <GoogleReCaptchaProvider>
      <SignupForm />
    </GoogleReCaptchaProvider>
  );
}

const signupFormSchema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
    nickname: z.string().min(2, { message: "닉네임은 2자 이상이어야 합니다." }),
    password: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
    passwordConfirm: z.string(),
    terms: z.boolean().refine((value) => value === true, { message: "약관에 동의해주세요." }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

const SignupForm = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      nickname: "",
      email: "",
      password: "",
      passwordConfirm: "",
      terms: false,
    },
  });

  const signupWithCredentialsMutation = authService.useSignupWithCredentials();
  const loginWithGoogleMutation = authService.useLoginWithGoogle();
  const verifyRecaptchaMutation = recaptchaService.useVerifyRecaptcha();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const canSubmit =
    executeRecaptcha &&
    !signupWithCredentialsMutation.isPending &&
    !verifyRecaptchaMutation.isPending;

  const onSubmit = form.handleSubmit(async (data) => {
    if (!canSubmit) return;

    const recaptchaToken = await executeRecaptcha();

    await verifyRecaptchaMutation.mutateAsync({
      json: { token: recaptchaToken, action: "submit" },
    });

    signupWithCredentialsMutation.mutate(
      { json: data },
      {
        onSuccess: () => {
          router.replace(redirect ?? route.auth.login);
        },
        onError: async (error: unknown) => {
          if (error instanceof HTTPError) {
            const code = await error.response.text();
            if (code === ErrorCode.EMAIL_ALREADY_EXISTS) {
              toast.error("이미 존재하는 이메일입니다.");
            }
          }
        },
      },
    );
  });

  const onGoogleButtonClick = () => {
    if (loginWithGoogleMutation.isPending) return;

    loginWithGoogleMutation.mutate(
      { json: { redirect: redirect } },
      {
        onSuccess: (data) => {
          router.push(data.url);
        },
      },
    );
  };

  const testRecaptcha = async () => {
    if (!executeRecaptcha) return;

    const recaptchaToken = await executeRecaptcha();

    verifyRecaptchaMutation.mutate({
      json: { token: recaptchaToken, action: "submit" },
    });
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-[280px] flex-col items-center justify-center py-16">
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
            name="nickname"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>닉네임</Form.Label>
                <Form.Control>
                  <Input {...field} error={!!form.formState.errors.email} placeholder="닉네임" />
                </Form.Control>
                <Form.Description>닉네임을 입력해주세요.</Form.Description>
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
          <Form.Field
            name="passwordConfirm"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>비밀번호 확인</Form.Label>
                <Form.Control>
                  <Input
                    {...field}
                    type="password"
                    error={!!form.formState.errors.passwordConfirm}
                    placeholder="비밀번호 확인"
                  />
                </Form.Control>
                <Form.Description>비밀번호를 한번 더 입력해주세요.</Form.Description>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
          <Form.Field
            name="terms"
            control={form.control}
            render={({ field }) => (
              <Form.Item className="mt-4">
                <Form.Label>약관 동의</Form.Label>
                <Form.Control>
                  <Checkbox {...field} error={!!form.formState.errors.terms}>
                    서비스 이용약관에 동의합니다.
                  </Checkbox>
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
          <div className="mt-4 flex w-full gap-2">
            <Button variant="primary" className="w-full" type="submit" disabled={!canSubmit}>
              가입하기
            </Button>
            <Button className="w-full" onClick={testRecaptcha} variant="outlined">
              리캡챠
            </Button>
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full border border-border bg-white transition-colors"
              onClick={onGoogleButtonClick}
            >
              <img src={googleLogo.src} alt="구글 로고" />
            </button>
          </div>
          <div className="flex justify-center">
            <p className="text-[13px] font-medium text-sub">
              이미 계정이 있으신가요?
              <Link
                className="ml-2 font-semibold text-main hover:underline"
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
};
