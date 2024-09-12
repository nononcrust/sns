import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  onConfirm: () => void;
}

export const ConfirmDialog = ({
  trigger,
  isOpen,
  title,
  onOpenChange,
  onConfirm,
}: ConfirmDialogProps) => {
  const onConfirmButtonClick = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Content className="w-[400px]">
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Footer className="mt-8 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button variant="outlined" onClick={onConfirmButtonClick}>
            확인
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
