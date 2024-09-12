import { fileConfig } from "@/configs/file";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import { useRef } from "react";

interface ImageInputProps {
  className?: string;
  onChange: (file: File | null) => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export const ImageInput = ({ className, onChange, buttonRef }: ImageInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      onChange(file);
    }

    event.target.value = "";
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <button onClick={onButtonClick} className="w-fit rounded-md" ref={buttonRef}>
        <ImageIcon className="stroke-subtle" />
      </button>
      <input
        type="file"
        className="hidden"
        accept={fileConfig.allowedImageTypes.profile}
        ref={inputRef}
        onChange={onInputChange}
      />
    </div>
  );
};
