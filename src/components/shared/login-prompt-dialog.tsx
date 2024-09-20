"use client";

import { route } from "@/constants/route";
import Link from "next/link";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";

interface LoginPromptDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const LoginPromptDialog = ({ isOpen, onOpenChange }: LoginPromptDialogProps) => {
  const onLoginButtonClick = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content className="w-[320px]">
        <Dialog.Title>로그인이 필요한 기능입니다.</Dialog.Title>
        <Dialog.Description>로그인 하시겠습니까?</Dialog.Description>
        <Dialog.Footer className="justify-end gap-2">
          <Button asChild onClick={onLoginButtonClick}>
            <Link href={route.auth.login}>로그인하기</Link>
          </Button>
          <Button variant="outlined">취소</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
