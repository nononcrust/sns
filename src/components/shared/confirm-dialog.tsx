import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";

interface ConfirmDialogProps {
  trigger: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
}

export const ConfirmDialog = ({ trigger, isOpen, onOpenChange, onConfirm }: ConfirmDialogProps) => {
  const onConfirmButtonClick = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>댓글을 삭제할까요?</Dialog.Title>
        <Dialog.Footer className="mt-8">
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
