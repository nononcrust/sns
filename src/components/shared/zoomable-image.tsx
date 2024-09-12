import { cn } from "@/lib/utils";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { Image } from "../ui/image";

interface ZoomableImageProps {
  className?: string;
  src: string;
  alt: string;
}

export const ZoomableImage = ({ className, src, alt }: ZoomableImageProps) => {
  return (
    <DialogPrimitives.Root>
      <DialogPrimitives.Trigger asChild>
        <button
          className={cn(
            "cursor-zoom-in overflow-hidden transition-transform duration-300",
            className,
          )}
          aria-label={alt}
        >
          <Image src={src} alt={alt} />
        </button>
      </DialogPrimitives.Trigger>
      <DialogPrimitives.Portal>
        <DialogPrimitives.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-white transition-opacity",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        />
        <DialogPrimitives.Close>
          <DialogPrimitives.Content
            className={cn(
              "flex items-center justify-center",
              "fixed inset-0 z-50 mx-auto max-w-2xl",
              "focus:outline-none",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            )}
          >
            <Image className="h-full w-full object-contain" src={src} alt={alt} />
          </DialogPrimitives.Content>
        </DialogPrimitives.Close>
      </DialogPrimitives.Portal>
    </DialogPrimitives.Root>
  );
};
