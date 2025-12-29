import type { ReactNode } from "react";
import { SiteLogo } from "@/components/site-logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5efe6] text-[#1f1a17]">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-6 px-6 py-12">
        <SiteLogo />
        {children}
      </div>
    </div>
  );
}
