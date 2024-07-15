"use client";

import { Button } from "@/components/ui/button";
import { route } from "@/constants/route";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-dvh items-center justify-center">
      <Button asChild>
        <Link href={route.channel({ channelId: "1" })}>채팅</Link>
      </Button>
    </main>
  );
}
