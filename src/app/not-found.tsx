import { Button } from "@/components/ui/button";
import { route } from "@/constants/route";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-sm text-sub">존재하지 않는 페이지입니다.</p>
      <Button className="mt-4" asChild>
        <Link href={route.home}>홈으로 돌아가기</Link>
      </Button>
    </main>
  );
}
