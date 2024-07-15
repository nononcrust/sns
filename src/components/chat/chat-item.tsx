import { cn } from "@/lib/utils";

interface ChatItemProps {
  isMe?: boolean;
}

export const ChatItem = ({ isMe = false }: ChatItemProps) => {
  return (
    <div className={cn("flex gap-2", isMe && "flex-row-reverse justify-start")}>
      <ChatBubble isMe={isMe}>안녕하세요 반가워요</ChatBubble>
      <span className="mt-2.5 text-[12px]">오늘 오후 6:32</span>
    </div>
  );
};

interface ChatBubbleProps {
  isMe?: boolean;
  children: React.ReactNode;
}

const ChatBubble = ({ isMe = false, children }: ChatBubbleProps) => {
  return (
    <div
      className={cn(
        "flex h-8 items-center justify-center rounded-full border px-4 text-[13px] font-semibold",
        isMe && "bg-black text-white",
      )}
    >
      {children}
    </div>
  );
};
