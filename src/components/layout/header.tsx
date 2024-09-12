"use client";

import { route } from "@/constants/route";
import { useSession } from "@/features/auth/use-session";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth";
import { BellIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationPopover } from "../notification/notification-popover";
import { UserSearchDialog } from "../shared/user-search-dialog";
import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DropdownMenu } from "../ui/dropdown-menu";

export const Header = () => {
  const { session } = useSession();

  return (
    <header className="flex h-[60px] items-center justify-between border-b border-border pl-page pr-3">
      <Logo />
      <HeaderNav />
      <div className="flex items-center justify-end gap-4">
        <ThemeToggle />
        <UserSearchDialog
          trigger={
            <button>
              <SearchIcon className="size-6 stroke-sub" />
            </button>
          }
        />
        {session && (
          <NotificationPopover
            trigger={
              <button>
                <Badge>
                  <BellIcon className="size-6 stroke-sub" />
                </Badge>
              </button>
            }
          />
        )}
        {session === null && (
          <Button variant="outlined" asChild>
            <Link href={route.auth.login}>로그인</Link>
          </Button>
        )}
        {session && <UserProfile />}
      </div>
    </header>
  );
};

const UserProfile = () => {
  const { session } = useSession();

  const logoutMutation = authService.useLogout();

  const onLogoutButtonClick = () => {
    if (logoutMutation.isPending) return;

    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        window.location.reload();
      },
    });
  };

  if (!session) return null;

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger className="rounded-full">
        <Avatar className="size-9">
          <Avatar.Image src={session.user.profileImage} />
          <Avatar.Fallback />
        </Avatar>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item asChild>
          <Link href={route.account.profile}>프로필</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <Link href={route.account.settings}>계정 설정</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={onLogoutButtonClick}>로그아웃</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

const Logo = () => {
  return (
    <Link className="font-bold tracking-tighter" href={route.home}>
      사이트 로고
    </Link>
  );
};

const headerNav = [
  {
    label: "커뮤니티",
    href: route.post.list,
  },
];

const HeaderNav = () => {
  return (
    <nav className="flex gap-4">
      {headerNav.map((item) => {
        return <HeaderNavItem key={item.label} {...item} />;
      })}
    </nav>
  );
};

interface HeaderNavItemProps {
  label: string;
  href: string;
}

const HeaderNavItem = ({ label, href }: HeaderNavItemProps) => {
  const pathname = usePathname();

  const isActive = pathname.startsWith(href);

  return (
    <Link
      className={cn(
        "text-sm font-medium text-sub hover:text-main",
        isActive && "font-semibold text-main",
      )}
      href={href}
    >
      {label}
    </Link>
  );
};
