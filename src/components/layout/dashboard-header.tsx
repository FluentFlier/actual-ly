import type { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardHeaderProps = {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
};

export function DashboardHeader({
  title,
  subtitle,
  actions,
  className,
}: DashboardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-border/60 bg-background/70 px-6 py-6 backdrop-blur lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div>
        {title ? (
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        ) : null}
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden items-center lg:flex">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search"
            className="h-10 w-56 rounded-full border border-border bg-card pl-9 pr-4 text-sm"
          />
        </div>
        <ThemeToggle />
        {actions}
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
