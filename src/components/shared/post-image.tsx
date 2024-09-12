import { cn } from "@/lib/utils";
import { useState } from "react";
import { Image } from "../ui/image";

const DEFAULT_ALT_TEXT = "게시글 이미지";

interface PostImageProps {
  className?: string;
  src: string;
  alt: string | null;
}

export const PostImage = ({ className, src, alt }: PostImageProps) => {
  const [loaded, setLoaded] = useState(false);

  const altText = alt ?? DEFAULT_ALT_TEXT;

  return (
    <div className={cn("overflow-hidden rounded-3xl", className)}>
      {!loaded && <div role="presentation" className="h-full w-full bg-content" />}
      <Image
        className={cn("h-full w-full", !loaded && "opacity-0")}
        src={src}
        alt={altText}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};
