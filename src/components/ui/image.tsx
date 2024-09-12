import React from "react";

interface ImageProps extends React.ComponentPropsWithoutRef<"img"> {}

export const Image = React.forwardRef<React.ElementRef<"img">, ImageProps>(
  ({ className, ...props }, ref) => {
    return <img className={className} ref={ref} {...props} />;
  },
);
Image.displayName = "Image";
