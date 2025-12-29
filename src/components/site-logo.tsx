import Link from "next/link";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
};

export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b1251b] text-white text-sm font-semibold">
        A
      </span>
      <span className="text-lg font-semibold tracking-tight">Actual.ly</span>
    </Link>
  );
}
