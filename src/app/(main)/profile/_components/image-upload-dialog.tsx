import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { testId } from "@/constants/test";
import { useDialog } from "@/hooks/use-dialog";
import { useFileInput } from "@/hooks/use-file-input";
import { profileService } from "@/services/profile";
import { UploadIcon } from "lucide-react";
import { useRef } from "react";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

interface ImageUploadDialogProps {
  trigger: React.ReactNode;
}

export const ImageUploadDialog = ({ trigger }: ImageUploadDialogProps) => {
  const dialog = useDialog();

  return (
    <Dialog open={dialog.isOpen} onOpenChange={dialog.onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      {dialog.isOpen && <DialogContent dialog={dialog} />}
    </Dialog>
  );
};

interface DropzoneProps {
  value: File | null;
  onChange: (file: File) => void;
}

const Dropzone = ({ value, onChange }: DropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onDropzoneClick = () => {
    inputRef.current?.click();
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gray-100"
        onClick={onDropzoneClick}
      >
        {value === null && <UploadIcon className="text-sub" />}
        {value && (
          <img src={URL.createObjectURL(value)} alt="" className="h-32 w-32 rounded-full" />
        )}
      </button>
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={onInputChange}
        accept={allowedImageTypes.join(",")}
        data-testid={testId.profileImageInput}
      />
    </div>
  );
};

interface DialogContentProps {
  dialog: ReturnType<typeof useDialog>;
}

const DialogContent = ({ dialog }: DialogContentProps) => {
  const fileInput = useFileInput();

  const updateProfileImageMutation = profileService.useUpdateProfileImage();

  const onConfirm = () => {
    if (updateProfileImageMutation.isPending || !fileInput.value) return;

    updateProfileImageMutation.mutate(
      { form: { profileImage: fileInput.value } },
      {
        onSuccess: () => {
          dialog.close();
          window.location.reload();
        },
      },
    );
  };

  const submitButtonDisabled = updateProfileImageMutation.isPending || !fileInput.value;

  return (
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>프로필 사진 변경</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Dropzone value={fileInput.value} onChange={fileInput.onChange} />
      </Dialog.Body>
      <Dialog.Footer>
        <Button variant="ghost" onClick={dialog.close}>
          취소
        </Button>
        <Button
          variant="outlined"
          onClick={onConfirm}
          disabled={submitButtonDisabled}
          data-testid={testId.profileImageSubmitButton}
        >
          변경하기
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  );
};
