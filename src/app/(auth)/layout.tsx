import type { ReactNode } from "react";
import { SiteLogo } from "@/components/site-logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_oklch(0.98_0.02_120),_transparent_55%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-6 px-6 py-12">
        <SiteLogo />
        {children}
      </div>
    </div>
  );
}
