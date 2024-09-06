"use client";

import { useCallback, useState } from "react";
import { GoogleReCaptchaProvider as GoogleReCaptchaProviderV3 } from "react-google-recaptcha-v3";

const config = {
  reCaptchaKey: "6Ld2ci8qAAAAAK0VeT2GWKJ_qcNPJikZBcqfE0-E",
  language: "ko",
} as const;

export const GoogleReCaptchaProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleReCaptchaProviderV3 reCaptchaKey={config.reCaptchaKey} language={config.language}>
      {children}
    </GoogleReCaptchaProviderV3>
  );
};

export const useRecaptcha = () => {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [refreshRecaptchaKey, setRefreshRecaptchaKey] = useState(false);

  const onVerify = useCallback((token: string) => {
    setRecaptchaToken(token);
  }, []);

  const refreshRecaptcha = () => {
    setRefreshRecaptchaKey((prev) => !prev);
    setRecaptchaToken(null);
  };

  return { recaptchaToken, onVerify, refreshRecaptcha, refreshRecaptchaKey };
};
