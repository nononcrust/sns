import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { DropdownMenu } from "@/components/ui/dropdown-menu";

export const ThemeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <button>
          <SunIcon className="flex size-6 stroke-sub dark:hidden" />
          <MoonIcon className="hidden size-6 stroke-sub dark:flex" />
          <span className="sr-only">테마 변경</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item onClick={() => setTheme("light")}>라이트 모드</DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => setTheme("dark")}>다크 모드</DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => setTheme("system")}>시스템 설정</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
