import { Popover } from "../ui/popover";

interface NotificationPopoverProps {
  trigger: React.ReactNode;
}

export const NotificationPopover = ({ trigger }: NotificationPopoverProps) => {
  return (
    <Popover>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Content>asd</Popover.Content>
    </Popover>
  );
};
