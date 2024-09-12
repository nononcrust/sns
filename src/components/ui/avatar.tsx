"use client";

import defaultProfileImage from "@/assets/images/default-profile-image.svg";
import { cn } from "@/lib/utils";
import * as AvatarPrimitives from "@radix-ui/react-avatar";
import React from "react";

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitives.Root>
>(({ className, children, ...props }, ref) => (
  <AvatarPrimitives.Root
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  >
    {children}
  </AvatarPrimitives.Root>
));
AvatarRoot.displayName = AvatarPrimitives.Root.displayName;

interface AvatarImageProps
  extends Omit<React.ComponentPropsWithoutRef<typeof AvatarPrimitives.Image>, "src"> {
  src?: string | null;
}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitives.Image>,
  AvatarImageProps
>(({ className, src, ...props }, ref) => {
  return (
    <AvatarPrimitives.Image
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
      src={src ?? defaultProfileImage.src}
      {...props}
    />
  );
});
AvatarImage.displayName = AvatarPrimitives.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitives.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitives.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitives.Fallback
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full", className)}
    {...props}
  ></AvatarPrimitives.Fallback>
));
AvatarFallback.displayName = AvatarPrimitives.Fallback.displayName;

export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
});
