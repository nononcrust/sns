import { ChatItem } from "./chat-item";

export const ChatList = () => {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col gap-4 border border-border px-8 pt-16">
      <ChatItem isMe />
      <ChatItem />
    </div>
  );
};
