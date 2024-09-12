import { Popover } from "../ui/popover";

interface NotificationPopoverProps {
  trigger: React.ReactNode;
}

export const NotificationPopover = ({ trigger }: NotificationPopoverProps) => {
  return (
    <Popover modal>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Content className="w-[400px] p-0" align="center">
        <span className="px-4 py-3 text-[15px] font-semibold">알림</span>
        <div className="flex h-[240px] flex-col items-center justify-center border-t border-border p-3">
          <span className="text-[13px] font-medium text-subtle">알림이 없습니다.</span>
        </div>
      </Popover.Content>
    </Popover>
  );
};
