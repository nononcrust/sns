import { route } from "@/constants/route";
import useDebounce from "@/hooks/use-debounce";
import { useInput } from "@/hooks/use-input";
import { userService } from "@/services/user";
import { ArrowDownIcon, ArrowUpIcon, CornerDownLeftIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Command } from "../primitives/command";
import { Avatar } from "../ui/avatar";
import { Dialog } from "../ui/dialog";
import { Shortcut } from "../ui/shortcut";

interface UserSearchDialogProps {
  trigger: React.ReactNode;
}

export const UserSearchDialog = ({ trigger }: UserSearchDialogProps) => {
  return (
    <Dialog>
      <Dialog.Title className="sr-only">유저 검색</Dialog.Title>
      <Dialog.Description className="sr-only">닉네임으로 검색하세요</Dialog.Description>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Content
        side="top"
        hideOverlay
        hideCloseButton
        className="w-[600px] gap-0 rounded-lg p-0"
      >
        <Content />
      </Dialog.Content>
    </Dialog>
  );
};

const Content = () => {
  const searchInput = useInput();
  const debouncedSearchValue = useDebounce(searchInput.value, 300);

  return (
    <Command>
      <SearchInput value={searchInput.value} onChange={searchInput.onChange} />
      <div className="h-[400px]">
        {debouncedSearchValue.length > 0 && searchInput.value.length > 0 && (
          <SearchResult value={debouncedSearchValue} />
        )}
      </div>
      <Dialog.Footer className="flex justify-end gap-4 px-page py-2">
        <Shortcut label="위로 이동하기">
          <ArrowUpIcon />
        </Shortcut>
        <Shortcut label="아래로 이동하기">
          <ArrowDownIcon />
        </Shortcut>
        <Shortcut label="프로필 보기">
          <CornerDownLeftIcon />
        </Shortcut>
        <Shortcut label="닫기">
          <span>ESC</span>
        </Shortcut>
      </Dialog.Footer>
    </Command>
  );
};

interface SearchInputProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <div className="relative p-4">
      <SearchIcon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-subtle" />
      <Command.Input
        className="w-full bg-transparent pl-7 text-[15px] focus:outline-none"
        value={value}
        onChange={onChange}
        placeholder="닉네임으로 검색..."
      />
    </div>
  );
};

interface SearchResultProps {
  value: string;
}

const SearchResult = ({ value }: SearchResultProps) => {
  const { data: users, isPending } = userService.useUsers({
    search: value,
  });

  if (isPending) {
    return <Skeleton />;
  }

  if (!users) {
    return null;
  }

  if (users.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-subtle">
        검색된 유저가 없습니다.
      </div>
    );
  }

  return (
    <div className="scrollbar-hide h-[400px] overflow-y-auto pt-2">
      <GroupTitle>검색된 유저</GroupTitle>
      <Command.List className="flex flex-col gap-2 p-2 pr-1 pt-0">
        {users.map((user) => (
          <UserListItem
            key={user.id}
            search={value}
            user={{
              id: user.id,
              nickname: user.nickname,
              email: user.email,
              profileImageUrl: user.profileImage,
            }}
          />
        ))}
      </Command.List>
    </div>
  );
};

interface UserListItem {
  search: string;
  user: {
    id: string;
    nickname: string;
    email: string;
    profileImageUrl: string | null;
  };
}

const UserListItem = ({ search, user }: UserListItem) => {
  const router = useRouter();

  const onClick = () => {
    router.push(route.profile({ userId: user.id }));
  };

  return (
    <Dialog.Close asChild>
      <Command.Item
        className="data-[selected=true]:bg-hover flex items-center gap-2 rounded-lg p-2"
        onClick={onClick}
      >
        <Avatar>
          <Avatar.Image src={user.profileImageUrl} alt={user.nickname} />
          <Avatar.Fallback />
        </Avatar>
        <div className="flex flex-col items-start">
          <HighlightedText text={user.nickname} highlight={search} />
          <span className="text-[13px] text-sub">{user.email}</span>
        </div>
      </Command.Item>
    </Dialog.Close>
  );
};

interface GroupTitleProps {
  children: React.ReactNode;
}

export const GroupTitle = ({ children }: GroupTitleProps) => {
  return (
    <div className="flex items-center px-page pb-1 text-[13px] font-medium text-subtle">
      {children}
    </div>
  );
};

interface HighlightedTextProps {
  text: string;
  highlight: string;
}

const HighlightedText = ({ text, highlight }: HighlightedTextProps) => {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));

  return (
    <span>
      {parts.map((part, index) => (
        <span
          key={index}
          className={
            part.toLowerCase() === highlight.toLowerCase() ? "font-semibold text-blue-500" : ""
          }
        >
          {part}
        </span>
      ))}
    </span>
  );
};

const Skeleton = () => {
  return null;
};
