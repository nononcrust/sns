import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { fileConfig } from "@/configs/file";
import { testId } from "@/constants/test";
import { useDialog } from "@/hooks/use-dialog";
import { useFileInput } from "@/hooks/use-file-input";
import { profileService } from "@/services/profile";
import { UploadIcon } from "lucide-react";
import { useRef } from "react";

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
        className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-content"
        onClick={onDropzoneClick}
      >
        {value === null && <UploadIcon className="text-sub" />}
        {value && (
          <Image src={URL.createObjectURL(value)} alt="" className="h-32 w-32 rounded-full" />
        )}
      </button>
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={onInputChange}
        accept={fileConfig.allowedImageTypes.profile}
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
    <Dialog.Content className="w-[600px]">
      <Dialog.Header>
        <Dialog.Title>프로필 사진 변경</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body className="py-4">
        <Dropzone value={fileInput.value} onChange={fileInput.onChange} />
      </Dialog.Body>
      <Dialog.Footer className="justify-end gap-2">
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
