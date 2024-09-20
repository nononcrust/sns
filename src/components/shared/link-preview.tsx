import { cn } from "@/lib/utils";
import Link from "next/link";

const og = {
  title: "dummy title",
  imageUrl: "https://dummyimage.com/400x400/000/fff",
};

interface LinkPreviewProps {
  className?: string;
  url: string;
}

export const LinkPreview = ({ className, url }: LinkPreviewProps) => {
  return (
    <Link
      className={cn("w-full overflow-hidden rounded-2xl border border-border", className)}
      href={url}
      target="_blank"
    >
      <img className="aspect-video h-full w-full object-cover" src={og.imageUrl} alt="" />
      <div className="flex flex-col gap-1 bg-background p-4">
        <p className="text-sm text-subtle">{url}</p>
        <p className="text-sm font-medium">{og.title}</p>
      </div>
    </Link>
  );
};
