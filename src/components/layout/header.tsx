"use client";

import { route } from "@/constants/route";
import { useSession } from "@/features/auth/use-session";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { DropdownMenu } from "../ui/dropdown-menu";

export const Header = () => {
  const { session } = useSession();

  return (
    <header className="pl-page flex h-[60px] items-center justify-between border-b pr-3">
      <Logo />
      <HeaderNav />

      <div className="flex w-[80px] justify-end">
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
        <Avatar className="h-9 w-9">
          <Avatar.Image src={session.user.profileImage ?? ""} />
          <Avatar.Fallback />
        </Avatar>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item asChild>
          <Link href={route.account.profile}>마이페이지</Link>
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
