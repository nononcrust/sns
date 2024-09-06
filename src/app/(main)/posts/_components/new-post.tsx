import { Avatar } from "@/components/ui/avatar";
import { route } from "@/constants/route";
import { useSession } from "@/features/auth/use-session";
import Link from "next/link";

export const NewPost = () => {
  const { session } = useSession();

  return (
    <Link
      className="flex h-[60px] items-center gap-3 px-8 font-medium text-sub"
      href={route.post.create}
    >
      <Avatar className="size-8">
        <Avatar.Image src={session?.user.profileImage ?? ""} />
        <Avatar.Fallback />
      </Avatar>
      새 글 작성하기...
    </Link>
  );
};
