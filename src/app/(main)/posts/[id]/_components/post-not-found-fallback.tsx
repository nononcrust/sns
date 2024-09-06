import { Button } from "@/components/ui/button";
import { route } from "@/constants/route";
import Link from "next/link";

export const PostNotFoundFallback = () => {
  return (
    <main className="flex flex-col items-center justify-center">
      <h1 className="text-subtle mt-64 font-medium">존재하지 않거나 삭제된 게시글입니다.</h1>
      <Button className="mt-4" variant="outlined" asChild>
        <Link href={route.post.list}>목록으로 돌아가기</Link>
      </Button>
    </main>
  );
};
