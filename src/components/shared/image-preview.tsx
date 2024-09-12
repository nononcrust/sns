import { useInput } from "@/hooks/use-input";
import { usePopover } from "@/hooks/use-popover";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "../ui/button";
import { Image } from "../ui/image";
import { Popover } from "../ui/popover";

const ALT_INPUT_MAX_LENGTH = 1000;

interface ImagePreviewProps {
  className?: string;
  value: File | null;
  onRemove: () => void;
  alt?: {
    value: string;
    onChange: (value: string) => void;
  };
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export const ImagePreview = ({ className, value, onRemove, alt, buttonRef }: ImagePreviewProps) => {
  const removeButtonRef = useRef<HTMLButtonElement>(null);

  const onRemoveButtonClick = () => {
    onRemove();
    buttonRef.current?.focus();
  };

  useEffect(() => {
    removeButtonRef.current?.focus();
  }, [value]);

  if (value === null) return null;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border", className)}>
      <Image src={URL.createObjectURL(value)} alt={alt?.value} />
      <button
        className="absolute left-4 top-4 flex size-6 items-center justify-center rounded-full bg-black"
        onClick={onRemoveButtonClick}
        ref={removeButtonRef}
      >
        <XIcon className="size-4 text-white" />
      </button>
      {alt && (
        <AltInputPopover
          trigger={
            <button className="absolute right-4 top-4 flex h-6 items-center justify-center rounded-full bg-black px-2 text-xs font-medium text-white">
              ALT
            </button>
          }
          alt={alt}
        />
      )}
    </div>
  );
};

interface AltInputPopoverProps {
  trigger: React.ReactNode;
  alt: {
    value: string;
    onChange: (value: string) => void;
  };
}

const AltInputPopover = ({ trigger, alt }: AltInputPopoverProps) => {
  const popover = usePopover();
  return (
    <Popover isOpen={popover.isOpen} onOpenChange={popover.onOpenChange}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <AltInputPopoverContent key={JSON.stringify(popover.isOpen)} alt={alt} popover={popover} />
    </Popover>
  );
};

interface AltInputPopoverContentProps {
  alt: {
    value: string;
    onChange: (value: string) => void;
  };
  popover: ReturnType<typeof usePopover>;
}

const AltInputPopoverContent = ({ alt, popover }: AltInputPopoverContentProps) => {
  const altInput = useInput(alt.value);

  const onSaveAltButtonClick = () => {
    alt?.onChange(altInput.value);
    popover.close();
  };

  const onAltInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    altInput.onChange(event);
  };

  const altInputLength = altInput.value.length;

  return (
    <Popover.Content className="w-[280px]" align="end">
      <TextareaAutosize
        value={altInput.value}
        onChange={onAltInputChange}
        className="min-h-[120px] resize-none text-sm outline-none"
        placeholder="이미지에 대한 설명을 입력해주세요."
        maxLength={ALT_INPUT_MAX_LENGTH}
        maxRows={16}
      />
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-subtle">
          {altInputLength}/{ALT_INPUT_MAX_LENGTH}
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={popover.close}>
            취소
          </Button>
          <Button variant="outlined" onClick={onSaveAltButtonClick}>
            저장
          </Button>
        </div>
      </div>
    </Popover.Content>
  );
};
