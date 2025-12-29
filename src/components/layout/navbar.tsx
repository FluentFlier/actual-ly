import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SiteLogo } from "@/components/site-logo";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  const { userId } = await auth();

  return (
    <header className="w-full border-b border-[#e7ddcf] bg-[#f5efe6]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <SiteLogo />
        <nav className="flex items-center gap-3">
          {userId ? (
            <Button asChild size="sm" className="bg-[#b1251b] text-white hover:bg-[#8f1d14]">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-[#1f1a17] hover:bg-[#efe5d8]">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="bg-[#b1251b] text-white hover:bg-[#8f1d14]">
                <Link href="/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
