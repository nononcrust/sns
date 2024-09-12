import { route } from "@/constants/route";
import useDebounce from "@/hooks/use-debounce";
import { useInput } from "@/hooks/use-input";
import { userService } from "@/services/user";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Command } from "../primitives/command";
import { Avatar } from "../ui/avatar";
import { Dialog } from "../ui/dialog";

interface UserSearchDialogProps {
  trigger: React.ReactNode;
}

export const UserSearchDialog = ({ trigger }: UserSearchDialogProps) => {
  return (
    <Dialog>
      <Dialog.Title className="sr-only">유저 검색</Dialog.Title>
      <Dialog.Description className="sr-only">유저 이름으로 검색하세요</Dialog.Description>
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
      {debouncedSearchValue.length > 0 && searchInput.value.length > 0 && (
        <SearchResult value={debouncedSearchValue} />
      )}
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
  const { data: users } = userService.useUsers({
    search: value,
  });

  if (!users) {
    return null;
  }

  if (users.length === 0) {
    return (
      <div className="mb-8 py-10 text-center text-sm text-subtle">검색된 유저가 없습니다.</div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto pt-2">
      <GroupTitle>검색된 유저</GroupTitle>
      <Command.List className="flex flex-col gap-2 p-2 pr-1 pt-0">
        {users.map((user) => (
          <UserListItem
            key={user.id}
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
  user: {
    id: string;
    nickname: string;
    email: string;
    profileImageUrl: string | null;
  };
}

const UserListItem = ({ user }: UserListItem) => {
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
          <span className="font-medium">{user.nickname}</span>
          <span className="text-[13px] text-sub">{user.email}</span>
        </div>
      </Command.Item>
    </Dialog.Close>
  );
};

// const useUsers = ({ search }: { search: string }) => {
//   const [users, setUsers] = useState<Awaited<ReturnType<typeof fetchUsers>>>();

//   const fetchUsers = useCallback(async () => {
//     const response = await api.users.$get({
//       query: {
//         search,
//       },
//     });
//     const data = await response.json();

//     setUsers(data);

//     return data;
//   }, [search]);

//   const reset = () => {
//     setUsers(undefined);
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   return {
//     data: users,
//     reset,
//   };
// };

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