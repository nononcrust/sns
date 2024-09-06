"use client";

import GoogleLogo from "@/assets/icons/google-logo.svg";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { route } from "@/constants/route";
import { GoogleReCaptchaProvider } from "@/lib/recaptcha";
import { authService } from "@/services/auth";
import { recaptchaService } from "@/services/recaptcha";
import { ErrorCode, isApiError } from "@/services/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
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

enum UserType {
  PERSONAL = "PERSONAL",
  BUSINESS = "BUSINESS",
  ETC = "ETC",
}

const USER_TYPE_LABEL: Record<UserType, string> = {
  [UserType.PERSONAL]: "개인",
  [UserType.BUSINESS]: "사업자",
  [UserType.ETC]: "기타",
};

const signupFormSchema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
    nickname: z.string().min(2, { message: "닉네임은 2자 이상이어야 합니다." }),
    password: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
    passwordConfirm: z.string(),
    terms: z.boolean().refine((value) => value === true, { message: "약관에 동의해주세요." }),
    type: z.nativeEnum(UserType),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
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
      type: UserType.PERSONAL,
    },
  });

  const signupWithCredentialsMutation = authService.useSignupWithCredentials();
  const loginWithGoogleMutation = authService.useLoginWithGoogle();
  const verifyRecaptchaMutation = recaptchaService.useVerifyRecaptcha();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const canSubmit = executeRecaptcha && !signupWithCredentialsMutation.isPending;

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
        onError: (error: unknown) => {
          if (isAxiosError(error) && isApiError(error.response?.data)) {
            if (error.response.data.code === ErrorCode.EMAIL_ALREADY_EXISTS) {
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

    verifyRecaptchaMutation.mutate(
      {
        json: { token: recaptchaToken, action: "submit" },
      },
      {
        onSuccess: (data) => {
          console.log("recaptcha success", data);
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
                    error={!!form.formState.errors.password}
                    placeholder="비밀번호 확인"
                  />
                </Form.Control>
                <Form.Description>비밀번호를 한번 더 입력해주세요.</Form.Description>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
          <Form.Field
            name="type"
            control={form.control}
            render={({ field }) => (
              <Form.Item>
                <Form.Label>유형</Form.Label>
                <Form.Control>
                  <RadioGroup value={field.value} onChange={field.onChange}>
                    {Object.values(UserType).map((type) => (
                      <RadioGroup.Item key={type} value={type}>
                        {USER_TYPE_LABEL[type]}
                      </RadioGroup.Item>
                    ))}
                  </RadioGroup>
                </Form.Control>
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
                className="ml-2 font-semibold text-primary hover:underline"
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
