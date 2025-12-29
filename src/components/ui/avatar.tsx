import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  src?: string | null;
  alt?: string;
};

export function Avatar({ className, src, alt, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-semibold",
        className,
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || "Avatar"} className="h-full w-full object-cover" />
      ) : (
        <span>{alt?.[0] || "A"}</span>
      )}
    </div>
  );
}
