"use client";

import { ChatList } from "@/components/chat/chat-list";
import { useParams } from "next/navigation";

export default function ChannelPage() {
  const params = useParams<{ id: string }>();
  console.log(params);

  return (
    <main>
      <ChatList />
    </main>
  );
}
