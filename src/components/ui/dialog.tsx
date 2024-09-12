"use client";

import { cn } from "@/lib/utils";
import * as DialogPrimitives from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import React from "react";
import { IconButton } from "./icon-button";

const DialogRoot = DialogPrimitives.Root;

const DialogTrigger = DialogPrimitives.Trigger;

const DialogPortal = DialogPrimitives.DialogPortal;

interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitives.Overlay> {
  hideOverlay: boolean;
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Overlay>,
  DialogOverlayProps
>(({ className, hideOverlay, ...props }, ref) => (
  <DialogPrimitives.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/40",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      hideOverlay && "bg-transparent",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = "Dialog.Overlay";

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitives.Content> {
  hideCloseButton?: boolean;
  hideOverlay?: boolean;
  side?: "top" | "center";
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      hideCloseButton = false,
      hideOverlay = false,
      side = "center",
      ...props
    },
    ref,
  ) => (
    <DialogPortal>
      <DialogOverlay hideOverlay={hideOverlay} />
      <DialogPrimitives.Content
        ref={ref}
        className={cn(
          "bg-dialog fixed left-[50%] top-[50%] z-50 grid max-h-[calc(100dvh-32px)] w-full max-w-[calc(100vw-32px)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-[24px] border border-border p-6 shadow-lg",
          "focus:outline-none",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          side === "top" && "top-[32px] translate-y-0",
          className,
        )}
        {...props}
      >
        {children}
        {!hideCloseButton && (
          <DialogPrimitives.Close asChild>
            <IconButton className="absolute right-4 top-4" variant="ghost" aria-label="닫기">
              <XIcon className="h-5 w-5" />
            </IconButton>
          </DialogPrimitives.Close>
        )}
      </DialogPrimitives.Content>
    </DialogPortal>
  ),
);
DialogContent.displayName = "Dialog.Content";

const DialogHeader = ({ className, ...props }: React.ComponentPropsWithoutRef<"div">) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);

const DialogFooter = ({ className, ...props }: React.ComponentPropsWithoutRef<"div">) => (
  <div className={cn("flex", className)} {...props} />
);

const DialogClose = DialogPrimitives.Close;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitives.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = "Dialog.Title";

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitives.Description
    ref={ref}
    className={cn("text-sm text-sub", className)}
    {...props}
  />
));
DialogDescription.displayName = "Dialog.Description";

const DialogBody = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div className={cn("flex flex-col", className)} ref={ref} {...props} />
  ),
);
DialogBody.displayName = "Dialog.Body";

export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
});
